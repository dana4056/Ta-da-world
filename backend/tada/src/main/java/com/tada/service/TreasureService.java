package com.tada.service;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;

import com.tada.domain.dto.ImgPathDto;
import com.tada.domain.dto.RankResponse;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;

public interface TreasureService {

	void postTreasure(ImgPathDto treasureImgDto, ImgPathDto rewardImgDto, TreasureRequest treasureRequest) throws Exception;
	HttpStatus postAnswer(Long id, ImgPathDto answerImgDto) throws Exception;
	void deleteTreasure(Long id) throws Exception;
	void changeTreasureStatus(Long id, String finderId) throws Exception;
	List<TreasureResponse> getTreasureList(Long roomId) throws Exception;
	List<TreasureResponse> getResultInUser(Long roomId, Long userId) throws Exception;
	List<RankResponse> getResultInHost(Long roomId) throws Exception;

}
