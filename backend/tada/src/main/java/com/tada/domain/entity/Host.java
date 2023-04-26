package com.tada.domain.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class Host {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;					// 고유번호
	private String uid;					// 유저 식별값
	private String name;				// 이름
	private String provider;			// 소셜 종류 ("kakao", "google")
	private LocalDateTime createdTime;	// 생성시간
}
