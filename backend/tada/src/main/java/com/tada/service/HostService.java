package com.tada.service;

public interface HostService {
    boolean joinUser(String id) throws Exception;

    void saveRefreshToken(String hostId, String refreshToken);
}
