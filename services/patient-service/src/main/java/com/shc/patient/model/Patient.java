package com.shc.patient.model;

import java.time.LocalDateTime;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;

import com.shc.patient.enums.GenderType;

@Entity
@Table
public class Patient {
    @Id
    @Column(columnDefinition = "UUID")
    private UUID id;
    private String nic;
    private String name;

    @Enumerated(EnumType.STRING)
    private GenderType gender;
    private String email;
    private String phone;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public Patient() {
    }

    public Patient(UUID id, String nic, String name, GenderType gender, String email, String phone, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.nic = nic;
        this.name = name;
        this.gender = gender;
        this.email = email;
        this.phone = phone;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public GenderType getGender() {
        return gender;
    }

    public void setGender(GenderType gender) {
        this.gender = gender;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    @PrePersist
public void onCreate() {
    if (this.id == null) {
        this.id = UUID.randomUUID(); // 👈 generate UUID here
    }
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
}

    //   // 🔹 Automatically called when inserting
    // @PrePersist
    // public void onCreate() {
    //     createdAt = LocalDateTime.now();
    //     updatedAt = LocalDateTime.now();
    // }

    // 🔹 Automatically called when updating
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
