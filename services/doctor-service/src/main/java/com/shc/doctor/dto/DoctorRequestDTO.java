package com.shc.doctor.dto;
 
import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
 
@JsonIgnoreProperties(ignoreUnknown = true)
public class DoctorRequestDTO {
 
    private String userId;
 
    @JsonAlias("name")
    private String fullName;
 
    private String specialization;
    private String hospital;
    private String slmcNumber;
    private Integer experienceYears;
    private String qualifications;
    private String bio;
    private Double consultationFee;
    private String profileImageUrl;
 
    public String getUserId() {
        return userId;
    }
 
    public void setUserId(String userId) {
        this.userId = userId;
    }
 
    public String getFullName() {
        return fullName;
    }
 
    public void setFullName(String fullName) {
        this.fullName = fullName;
    }
 
    public String getSpecialization() {
        return specialization;
    }
 
    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
 
    public String getHospital() {
        return hospital;
    }
 
    public void setHospital(String hospital) {
        this.hospital = hospital;
    }
 
    public String getSlmcNumber() {
        return slmcNumber;
    }
 
    public void setSlmcNumber(String slmcNumber) {
        this.slmcNumber = slmcNumber;
    }
 
    public Integer getExperienceYears() {
        return experienceYears;
    }
 
    public void setExperienceYears(Integer experienceYears) {
        this.experienceYears = experienceYears;
    }
 
    public String getQualifications() {
        return qualifications;
    }
 
    public void setQualifications(String qualifications) {
        this.qualifications = qualifications;
    }
 
    public String getBio() {
        return bio;
    }
 
    public void setBio(String bio) {
        this.bio = bio;
    }
 
    public Double getConsultationFee() {
        return consultationFee;
    }
 
    public void setConsultationFee(Double consultationFee) {
        this.consultationFee = consultationFee;
    }
 
    public String getProfileImageUrl() {
        return profileImageUrl;
    }
 
    public void setProfileImageUrl(String profileImageUrl) {
        this.profileImageUrl = profileImageUrl;
    }
}