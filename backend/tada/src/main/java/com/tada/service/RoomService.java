package com.tada.service;

import java.util.Map;

import org.springframework.security.core.Authentication;

import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.domain.entity.Room;

public interface RoomService {

	RoomResponse createRoom(String hostId);

	void modifyRoom(Long roomId, RoomRequest roomRequest);

	RoomResponse readRoom(Long roomId);

	int readRoomStatus(String hostId);

	void modifyRoomStatus(Long roomId,  Map<String, Integer> statusRequest);

	String moveToWaitingRoom(Long roomId);
}
