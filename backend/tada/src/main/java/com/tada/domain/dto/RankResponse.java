package com.tada.domain.dto;

import com.tada.domain.entity.User;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class RankResponse {
	private String nick;
	private int imgNo;
	private Long findCnt;
}