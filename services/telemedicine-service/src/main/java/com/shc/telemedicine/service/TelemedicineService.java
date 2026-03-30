package com.shc.telemedicine.service;

import com.shc.telemedicine.dto.JoinRequest;
import com.shc.telemedicine.dto.JoinResponse;
import com.shc.telemedicine.dto.SessionResponse;
import com.shc.telemedicine.entity.TelemedicineSession;

public interface TelemedicineService {
    SessionResponse createOrGetSession(String appointmentId);
    SessionResponse getSession(String sessionId);
    JoinResponse join(String sessionId, JoinRequest req);
    TelemedicineSession getSessionEntity(String sessionId);
}