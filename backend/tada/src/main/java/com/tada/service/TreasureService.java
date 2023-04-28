package com.tada.service;

import java.util.List;

import org.springframework.security.core.Authentication;

import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;

public interface TreasureService {

	void postTreasure(TreasureRequest treasureRequest);

	void deleteTreasure(Long id);

	List<TreasureResponse> getTreasureList(Long roomId);

	List<TreasureResponse> getResultInUser(Long roomId, Long userId);
}
