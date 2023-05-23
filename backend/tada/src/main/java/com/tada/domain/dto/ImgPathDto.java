package com.tada.domain.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ImgPathDto {
	String imgPath;		// 프론트 전달용
	String imgBasePath; // 백 로직용
}
