package com.tada.domain.dto;

import java.time.LocalDateTime;

import com.tada.domain.entity.Room;

import lombok.AllArgsConstructor;
import lombok.Builder;
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

	public RoomResponse(Room room){
		this.id = room.getId();
		this.name = room.getName();
		this.playTime = room.getPlayTime();
		this.startTime = room.getStartTime();
	}
}