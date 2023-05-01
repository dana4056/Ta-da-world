package com.tada.domain.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import com.tada.domain.dto.RoomRequest;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@Table(name = "room")
@AllArgsConstructor
@NoArgsConstructor
public class Room extends BaseTimeEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;					// 고유번호
	@ManyToOne
	@JoinColumn(name="host_id")
	private Host host;					// 호스트
	private String name;				// 방 제목
	private Long playTime;				// 플레이타임 (제한시간)
	private LocalDateTime startTime;	// 게임시작 시간
	private String code;				// 접속코드
	private int status;					// 현재 상태 (0,1,2,3,4 중 하나)


	public void updateContent(RoomRequest roomRequest) {
		this.name = roomRequest.getName();
		this.playTime = roomRequest.getPlayTime();
	}

	public void updateStatus(int status) {
		this.status = status;
	}

	public void updateStartTime() {
		this.startTime = LocalDateTime.now();
	}
}
