package com.shc.notification.repository;

import com.shc.notification.model.NotificationSetting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface NotificationSettingRepository extends JpaRepository<NotificationSetting, UUID> {
    Optional<NotificationSetting> findByUserId(String userId);
}
