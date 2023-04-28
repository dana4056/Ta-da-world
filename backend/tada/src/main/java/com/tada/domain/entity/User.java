package com.tada.domain.entity;

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
public class User extends BaseTimeEntity{

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private	Long id;			// 참가자 고유번호
	@ManyToOne
	@JoinColumn(name = "id")
	private Room room;			// 게임방
	private String deviceId;	// 디바이스 번호
	private String nick;		// 닉네임
	private int imgNo;			// 캐릭터 이미지 번호

}
