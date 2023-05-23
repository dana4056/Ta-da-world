package com.tada.domain.dto;

import com.tada.domain.entity.Treasure;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class TreasureResponse {
	private Long id;           	// 보물 고유번호
	private String imgPath;        	// 보물 사진
	private String lat;        	// 위도
	private String lng;       	// 경도
	private String hint;       	// 힌트
	private String rewardImgPath; 	// 보상 사진
	private String reward;     	// 보상 설명
	private Boolean status;		// 보물 상태
	private String finderNick;	// 찾은 사람 닉네임

	public TreasureResponse(Treasure treasure){
		this.id = treasure.getId();
		this.imgPath = treasure.getImgPath();
		this.lat = treasure.getLat();
		this.lng = treasure.getLng();
		this.hint = treasure.getHint();
		this.rewardImgPath = treasure.getRewardImgPath();
		this.reward = treasure.getReward();
		this.status = treasure.getStatus();
		if(treasure.getFinder() != null){
			this.finderNick = treasure.getFinder().getNick();
		}


	}

}
