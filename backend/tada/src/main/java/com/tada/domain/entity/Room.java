package com.tada.domain.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Room {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;					// 고유번호
	@ManyToOne
	@JoinColumn(name="id")
	private Host host;					// 호스트
	private String name;				// 방 제목
	private String description;			// 방 설명
	private Long playtime;				// 플레이타임 (제한시간)
	private String code;				// 접속코드
	private int status;				// 현재 상태 (0,1,2,3,4 중 하나)
	private LocalDateTime createdTime;	// 생성시간
	private LocalDateTime modTime;		// 수정시간
}
