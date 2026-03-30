package com.shc.telemedicine.service;

import com.shc.telemedicine.dto.JoinRequest;
import com.shc.telemedicine.dto.JoinResponse;
import com.shc.telemedicine.dto.SessionResponse;
import com.shc.telemedicine.entity.TelemedicineSession;
import com.shc.telemedicine.repository.TelemedicineSessionRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import io.agora.media.RtcTokenBuilder2;

import java.util.Map;
import java.util.UUID;

@Service
public class TelemedicineServiceImpl implements TelemedicineService {

    private final TelemedicineSessionRepository repo;
    private final AppointmentClient appointmentClient;

    private final String agoraAppId;
    private final String agoraCert;
    private final int tokenTtlSeconds;

    public TelemedicineServiceImpl(
            TelemedicineSessionRepository repo,
            AppointmentClient appointmentClient,
            @Value("${agora.appId}") String agoraAppId,
            @Value("${agora.certificate}") String agoraCert,
            @Value("${agora.tokenTtlSeconds}") int tokenTtlSeconds
    ) {
        this.repo = repo;
        this.appointmentClient = appointmentClient;
        this.agoraAppId = agoraAppId;
        this.agoraCert = agoraCert;
        this.tokenTtlSeconds = tokenTtlSeconds;
    }

    @Override
    public SessionResponse createOrGetSession(String appointmentId) {
        return repo.findByAppointmentId(appointmentId)
                .map(this::toResponse)
                .orElseGet(() -> createNewFromAppointment(appointmentId));
    }

    private SessionResponse createNewFromAppointment(String appointmentId) {
        Map<String, Object> appt = appointmentClient.getAppointment(appointmentId);
        if (appt == null) throw new IllegalArgumentException("Appointment not found: " + appointmentId);

        Object type = appt.get("appointmentType");
        if (type == null || !"ONLINE".equalsIgnoreCase(String.valueOf(type))) {
            throw new IllegalArgumentException("Telemedicine is only for ONLINE appointments.");
        }

        String doctorId = String.valueOf(appt.get("doctorId"));
        String patientId = String.valueOf(appt.get("patientId"));

        TelemedicineSession s = new TelemedicineSession();
        s.setAppointmentId(appointmentId);
        s.setDoctorId(doctorId);
        s.setPatientId(patientId);

        // stable channel name per appointment
        String channel = "shc_" + appointmentId.replace("-", "");
        s.setChannelName(channel);

        repo.save(s);
        return toResponse(s);
    }

    @Override
    public SessionResponse getSession(String sessionId) {
        return toResponse(getSessionEntity(sessionId));
    }

    @Override
    public TelemedicineSession getSessionEntity(String sessionId) {
        UUID id = UUID.fromString(sessionId);
        return repo.findById(id).orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
    }

    @Override
    public JoinResponse join(String sessionId, JoinRequest req) {
        TelemedicineSession s = getSessionEntity(sessionId);

        // Token role: both can publish in a 1:1 call

        RtcTokenBuilder2 builder = new RtcTokenBuilder2();
        RtcTokenBuilder2.Role role = RtcTokenBuilder2.Role.ROLE_PUBLISHER;

        String token = builder.buildTokenWithUserAccount(
        agoraAppId,
        agoraCert,
        s.getChannelName(),
        req.getUserId(),      // account
        role,
        tokenTtlSeconds,      // tokenExpire (seconds from now)
        tokenTtlSeconds       // privilegeExpire (seconds from now)
        );

        JoinResponse res = new JoinResponse();
        res.setAppId(agoraAppId);
        res.setChannelName(s.getChannelName());
        res.setToken(token);
        res.setUidOrAccount(req.getUserId());
        res.setExpiresInSeconds(tokenTtlSeconds);
        return res;
    }

    private SessionResponse toResponse(TelemedicineSession s) {
        SessionResponse r = new SessionResponse();
        r.setId(s.getId());
        r.setAppointmentId(s.getAppointmentId());
        r.setChannelName(s.getChannelName());
        r.setDoctorId(s.getDoctorId());
        r.setPatientId(s.getPatientId());
        r.setStatus(s.getStatus());
        return r;
    }
}