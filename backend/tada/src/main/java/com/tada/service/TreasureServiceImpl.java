package com.tada.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tada.domain.RoomStatus;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.domain.entity.Host;
import com.tada.domain.entity.Room;
import com.tada.domain.entity.Treasure;
import com.tada.repository.RoomRepository;
import com.tada.repository.TreasureRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TreasureServiceImpl implements TreasureService{
	private final TreasureRepository treasureRepository;
	private final RoomRepository roomRepository;

	@Override
	public void postTreasure(TreasureRequest request) {
		Room room = roomRepository.findById(request.getRoom_id())
			.orElseThrow(() -> new NoSuchElementException("존재하지 않는 게임방"));

		Treasure treasure = Treasure.builder()
			.room(room)
			.img(request.getImg())
			.lat(request.getLat())
			.lng(request.getLng())
			.hint(request.getHint())
			.rewardImg(request.getRewardImg())
			.reward(request.getReward())
			.build();

		treasureRepository.save(treasure);
	}

	@Override
	public void deleteTreasure(Long id) {
		Treasure treasure = treasureRepository.findById(id)
			.orElseThrow(() -> new NoSuchElementException("존재하지않는 보물임"));

		treasureRepository.delete(treasure);
	}

	@Override
	public List<TreasureResponse> getTreasureList(Long roomId) {
		List<Treasure> list = treasureRepository.findAllByRoom_Id(roomId);
		List<TreasureResponse> dtoList = new ArrayList<>();

		for(Treasure treasure: list){
			dtoList.add(new TreasureResponse(treasure));
		}
		return dtoList;
	}

	@Override
	public List<TreasureResponse> getResultInUser(Long roomId, Long userId) {
		List<Treasure> list = treasureRepository.findAllByRoom_IdAndFinder_Id(roomId, userId);
		List<TreasureResponse> dtoList = new ArrayList<>();

		for(Treasure treasure: list){
			dtoList.add(new TreasureResponse(treasure));
		}
		return dtoList;
	}
}
