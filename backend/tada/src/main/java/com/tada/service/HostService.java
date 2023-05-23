package com.tada.service;

import com.tada.domain.entity.Room;

public interface HostService {
    boolean joinUser(String id) throws Exception;

    Room getRoomByHostId(String hostId) throws Exception;

    void saveRefreshToken(String hostId, String refreshToken);
    void logoutHost(String hostId) throws Exception;

    String getRefreshtoken(String hostId) throws Exception;

    void deleteHost(String hostId) throws Exception;
}
