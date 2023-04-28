package com.tada.service;

import java.util.Map;

import org.springframework.security.core.Authentication;

import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.domain.entity.Room;

public interface RoomService {

	RoomResponse createRoom(Authentication authentication);

	void modifyRoom(Long id, RoomRequest roomRequest);

	RoomResponse readRoom(Long id);

	int readRoomStatus(Long id);

	void modifyRoomStatus(Long id, Map<String, Integer> statusRequest);

	String moveToWaitingRoom(Long id);
}
