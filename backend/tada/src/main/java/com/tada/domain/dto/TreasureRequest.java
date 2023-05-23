package com.tada.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TreasureRequest {
	private Long roomId;
	private String lat;
	private String lng;
	private String hint;
	private String reward;

}

