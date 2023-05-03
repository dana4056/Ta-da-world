package com.tada.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tada.controller.HostController;
import com.tada.domain.RoomStatus;
import com.tada.domain.dto.ImgPathDto;
import com.tada.domain.dto.RankResponse;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.domain.entity.Host;
import com.tada.domain.entity.Room;
import com.tada.domain.entity.Treasure;
import com.tada.domain.entity.User;
import com.tada.repository.RoomRepository;
import com.tada.repository.TreasureRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class TreasureServiceImpl implements TreasureService{
	private final TreasureRepository treasureRepository;
	private final RoomRepository roomRepository;

	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@Override
	public void postTreasure(ImgPathDto treasureImgDto, ImgPathDto rewardImgDto, TreasureRequest request) throws Exception{
		Room room = roomRepository.findById(request.getRoomId())
			.orElseThrow(() -> new NoSuchElementException("존재하지 않는 게임방"));

		try{
			Treasure treasure = Treasure.builder()
				.room(room)
				.imgPath(treasureImgDto.getImgPath())
				.imgBasePath(treasureImgDto.getImgBasePath())
				.lat(request.getLat())
				.lng(request.getLng())
				.hint(request.getHint())
				.rewardImgPath(rewardImgDto.getImgPath())
				.rewardImgBasePath(rewardImgDto.getImgBasePath())
				.reward(request.getReward())
				.status(false)
				.build();

			treasureRepository.save(treasure);
		}catch (Exception e){
			throw e;
		}
	}

	@Override
	public void deleteTreasure(Long id) throws Exception{
		Treasure treasure = treasureRepository.findById(id)
			.orElseThrow(() -> new NoSuchElementException("존재하지않는 보물임"));
		try{
			treasureRepository.delete(treasure);
		}catch (Exception e){
			throw e;
		}
	}

	@Override
	public List<TreasureResponse> getTreasureList(Long roomId) throws Exception{

		try{
			List<Treasure> list = treasureRepository.findAllByRoom_Id(roomId);
			List<TreasureResponse> dtoList = new ArrayList<>();

			for(Treasure treasure: list){
				dtoList.add(new TreasureResponse(treasure));
			}
			return dtoList;
		}catch (Exception e){
			throw e;
		}
	}

	@Override
	public List<TreasureResponse> getResultInUser(Long roomId, Long userId) throws Exception{
		try{
			List<Treasure> list = treasureRepository.findAllByRoom_IdAndFinder_Id(roomId, userId);
			List<TreasureResponse> dtoList = new ArrayList<>();

			for(Treasure treasure: list){
				dtoList.add(new TreasureResponse(treasure));
			}
			return dtoList;
		}catch (Exception e){
			throw e;
		}
	}

	@Override
	public List<RankResponse> getResultInHost(Long roomId) throws Exception{

		try{
			if(!roomRepository.existsById(roomId)){
				throw new NoSuchElementException("존재하지 않는 방");
			}
			List<Object[]> list = treasureRepository.countByFinderAndRoomId(roomId);
			List<RankResponse> response = new ArrayList<>();
			for(Object[] o : list){
				User user = (User) o[0];
				Long cnt = (Long) o[1];
				response.add(new RankResponse(user.getNick(), user.getImgNo(), cnt));
			}
			return response;
		}catch (Exception e){
			throw e;
		}
	}
}
