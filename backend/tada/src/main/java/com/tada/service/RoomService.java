package com.tada.service;

import java.util.Map;

import org.springframework.security.core.Authentication;

import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.domain.entity.Room;

public interface RoomService {
	RoomResponse readRoom(Long roomId);
	Map<String, Long> createRoom(String hostId) throws Exception;
	void modifyRoom(Long roomId, RoomRequest roomRequest) throws Exception;
	void modifyRoomStatus(Long roomId,  Map<String, Integer> statusRequest) throws Exception;
	Map<String, String> moveToWaitingRoom(Long roomId) throws Exception;
	Map<String, Object> readRoomStatus(String hostId) throws Exception;

	Room checkCode(String code) throws Exception;
}
