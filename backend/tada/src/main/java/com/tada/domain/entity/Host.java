package com.tada.domain.entity;

import java.time.LocalDateTime;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import org.springframework.data.annotation.CreatedDate;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "host")
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class Host extends BaseTimeEntity{
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private String id;					// 고유번호
	private String refreshToken;


	public void updateId(String id) { this.id = id; }

	public void updateRefreshToken(String refreshToken){
		this.refreshToken = refreshToken;
	}


}
