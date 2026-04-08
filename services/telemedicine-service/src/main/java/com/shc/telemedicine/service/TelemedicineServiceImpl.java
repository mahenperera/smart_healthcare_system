
package com.shc.telemedicine.service;

import com.shc.telemedicine.dto.JoinRequest;
import com.shc.telemedicine.dto.JoinResponse;
import com.shc.telemedicine.dto.SessionResponse;
import com.shc.telemedicine.entity.TelemedicineSession;
import com.shc.telemedicine.enums.SessionStatus;
import com.shc.telemedicine.enums.UserRole;
import com.shc.telemedicine.repository.TelemedicineSessionRepository;
import io.agora.media.RtcTokenBuilder2;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

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
        if (appointmentId == null || appointmentId.isBlank()) {
            throw new IllegalArgumentException("Appointment ID is required.");
        }

        return repo.findByAppointmentId(appointmentId.trim())
                .map(this::toResponse)
                .orElseGet(() -> createNewFromAppointment(appointmentId.trim()));
    }

    private SessionResponse createNewFromAppointment(String appointmentId) {
        Map<String, Object> appt = appointmentClient.getAppointment(appointmentId);

        validateAppointmentForTelemedicine(appt, appointmentId);

        String doctorId = getRequiredString(appt, "doctorId");
        String patientId = getRequiredString(appt, "patientId");

        TelemedicineSession s = new TelemedicineSession();
        s.setAppointmentId(appointmentId);
        s.setDoctorId(doctorId);
        s.setPatientId(patientId);
        s.setStatus(SessionStatus.CREATED);

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
        try {
            UUID id = UUID.fromString(sessionId);
            return repo.findById(id)
                    .orElseThrow(() -> new IllegalArgumentException("Session not found: " + sessionId));
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("Invalid session ID: " + sessionId);
        }
    }

    @Override
    public JoinResponse join(String sessionId, JoinRequest req) {
        if (req == null) {
            throw new IllegalArgumentException("Join request is required.");
        }

        TelemedicineSession s = getSessionEntity(sessionId);

        Map<String, Object> appt = appointmentClient.getAppointment(s.getAppointmentId());
        validateAppointmentForTelemedicine(appt, s.getAppointmentId());
        validateJoinAccess(s, req);

        RtcTokenBuilder2 builder = new RtcTokenBuilder2();
        RtcTokenBuilder2.Role agoraRole = RtcTokenBuilder2.Role.ROLE_PUBLISHER;

        String account = req.getUserId().trim();

        String token = builder.buildTokenWithUserAccount(
                agoraAppId,
                agoraCert,
                s.getChannelName(),
                account,
                agoraRole,
                tokenTtlSeconds,
                tokenTtlSeconds
        );

        if (s.getStatus() != SessionStatus.ACTIVE) {
            s.setStatus(SessionStatus.ACTIVE);
            repo.save(s);
        }

        JoinResponse res = new JoinResponse();
        res.setAppId(agoraAppId);
        res.setChannelName(s.getChannelName());
        res.setToken(token);
        res.setUidOrAccount(account);
        res.setExpiresInSeconds(tokenTtlSeconds);
        return res;
    }

    private void validateAppointmentForTelemedicine(Map<String, Object> appt, String appointmentId) {
        if (appt == null) {
            throw new IllegalArgumentException("Appointment not found: " + appointmentId);
        }

        String type = getOptionalString(appt, "appointmentType");
        if (!"ONLINE".equalsIgnoreCase(type)) {
            throw new IllegalArgumentException("Telemedicine is only available for ONLINE appointments.");
        }

        String status = getOptionalString(appt, "status");
        if ("CANCELLED".equalsIgnoreCase(status)) {
            throw new IllegalStateException("Cannot start telemedicine for a cancelled appointment.");
        }
    }

    private void validateJoinAccess(TelemedicineSession session, JoinRequest req) {
        if (req.getRole() == null) {
            throw new IllegalArgumentException("Role is required.");
        }

        String requestUserId = req.getUserId() == null ? "" : req.getUserId().trim();
        if (requestUserId.isBlank()) {
            throw new IllegalArgumentException("User ID is required.");
        }

        if (req.getRole() == UserRole.DOCTOR) {
            if (!requestUserId.equalsIgnoreCase(session.getDoctorId())) {
                throw new IllegalArgumentException("Only the assigned doctor can join this telemedicine session.");
            }
            return;
        }

        if (req.getRole() == UserRole.PATIENT) {
            if (!requestUserId.equalsIgnoreCase(session.getPatientId())) {
                throw new IllegalArgumentException("Only the assigned patient can join this telemedicine session.");
            }
            return;
        }

        throw new IllegalArgumentException("Unsupported role.");
    }

    private String getRequiredString(Map<String, Object> map, String key) {
        String value = getOptionalString(map, key);
        if (value.isBlank() || "null".equalsIgnoreCase(value)) {
            throw new IllegalArgumentException("Missing appointment field: " + key);
        }
        return value;
    }

    private String getOptionalString(Map<String, Object> map, String key) {
        Object value = map.get(key);
        return value == null ? "" : String.valueOf(value).trim();
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