package com.shc.telemedicine.dto;

public class JoinResponse {
    private String appId;
    private String channelName;
    private String token;
    private String uidOrAccount; // we use userId as account
    private long expiresInSeconds;

    public String getAppId() { return appId; }
    public void setAppId(String appId) { this.appId = appId; }

    public String getChannelName() { return channelName; }
    public void setChannelName(String channelName) { this.channelName = channelName; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getUidOrAccount() { return uidOrAccount; }
    public void setUidOrAccount(String uidOrAccount) { this.uidOrAccount = uidOrAccount; }

    public long getExpiresInSeconds() { return expiresInSeconds; }
    public void setExpiresInSeconds(long expiresInSeconds) { this.expiresInSeconds = expiresInSeconds; }
}