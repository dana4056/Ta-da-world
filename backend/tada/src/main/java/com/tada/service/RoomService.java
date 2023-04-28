package com.tada.service;

import org.springframework.security.core.Authentication;

public interface RoomService {

	void createRoom(Authentication authentication);
}
