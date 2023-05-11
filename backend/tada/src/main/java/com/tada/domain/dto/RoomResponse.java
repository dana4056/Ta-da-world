package com.tada.domain.dto;

import java.time.LocalDateTime;

import com.tada.domain.entity.Room;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class RoomResponse {

	private Long id;
	private String name;
	private Long playTime;
	private LocalDateTime startTime;
	private Long playerCnt;
	private Long treasureCnt;

	public RoomResponse(Room room){
		this.id = room.getId();
		this.name = room.getName();
		this.playTime = room.getPlayTime();
		this.startTime = room.getStartTime();
	}

	public void updatePlayerCnt(Long cnt){
		this.playerCnt = cnt;
	}
	public void updateTreasureCnt(Long cnt){
		this.treasureCnt = cnt;
	}
}