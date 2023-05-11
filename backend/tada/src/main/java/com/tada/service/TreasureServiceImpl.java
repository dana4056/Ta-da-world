package com.tada.service;

import com.tada.util.S3Service;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import com.tada.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tada.controller.HostController;
import com.tada.domain.dto.ImgPathDto;
import com.tada.domain.dto.RankResponse;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.domain.entity.Room;
import com.tada.domain.entity.Treasure;
import com.tada.domain.entity.User;
import com.tada.repository.RoomRepository;
import com.tada.repository.TreasureRepository;

import lombok.RequiredArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Service
@Transactional
@RequiredArgsConstructor
public class TreasureServiceImpl implements TreasureService{
	private final TreasureRepository treasureRepository;
	private final RoomRepository roomRepository;
	private final UserRepository userRepository;

	@Autowired
	private ApiService<Map<String, Boolean>> apiService;
	private final S3Service s3Service;
	private final SimpMessagingTemplate simpMessagingTemplate;
	@Value("${environments.python.url}") private String pythonUrl;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@Override
	public void postTreasure(ImgPathDto treasureImgDto, ImgPathDto rewardImgDto, TreasureRequest request) throws Exception{
		Room room = roomRepository.findById(request.getRoomId())
			.orElseThrow(() -> new NoSuchElementException("존재하지 않는 게임방"));

		try{
			String rewardImgPath = "";
			String rewardImgBasePath = "";
			if (rewardImgDto!=null) {
				rewardImgPath = rewardImgDto.getImgPath();
				rewardImgBasePath = rewardImgDto.getImgBasePath();
			}
			Treasure treasure = Treasure.builder()
				.room(room)
				.imgPath(treasureImgDto.getImgPath())
				.imgBasePath(treasureImgDto.getImgBasePath())
				.lat(request.getLat())
				.lng(request.getLng())
				.hint(request.getHint())
				.rewardImgPath(rewardImgPath)
				.rewardImgBasePath(rewardImgBasePath)
				.reward(request.getReward())
				.status(false)
				.build();

			treasureRepository.save(treasure);
		}catch (Exception e){
			throw e;
		}
	}

	@Override
	public boolean postAnswer(Long treasureId, String userId, MultipartFile answerFile) throws Exception {
		User user = userRepository.findById(userId)
				.orElseThrow(() -> new NoSuchElementException("존재하지 않는 유저"));
		Room room = user.getRoom();
		Treasure treasure = treasureRepository.findById(treasureId)
				.orElseThrow(() -> new NoSuchElementException("존재하지않는 보물"));

		// update answer image
		ImgPathDto answerImgDto = s3Service.uploadFiles(answerFile, "rooms/" + room.getId() + "/answers");
		logger.info("정답 이미지 경로 [프론트:{}], [백:{}]", answerImgDto.getImgPath(),
				answerImgDto.getImgBasePath());

		try{
			// fastapi networking
			Map<String, String> map = new HashMap<>();
			map.put("answerUrl", answerImgDto.getImgBasePath());
			map.put("treasureUrl", treasure.getImgBasePath());
			ResponseEntity<Map<String, Boolean>> response = apiService.post(pythonUrl + "/treasures/answers", new HttpHeaders(), map);
			// result: true or false
			if (response.getBody().get("result")) {
				// SUCCESS - [treasure] table - update finder_id, status
				treasure.updateFinderId(user);
				treasure.updateStatus();
				treasureRepository.save(treasure);

				// socket message - FIND
				Map<String, Object> data = new HashMap<>();
				data.put("messageType", "FIND");
				data.put("roomId", room.getId());
				data.put("userId", userId);
				data.put("treasureId", treasureId);
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data);
				return true;
			} else return false;

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
	public void changeTreasureStatus(Long id, String finderId) throws Exception {
		Treasure treasure = treasureRepository.findById(id)
				.orElseThrow(() -> new NoSuchElementException("존재하지않는 보물임"));
		User user = userRepository.findById(finderId).orElseThrow(() -> new NoSuchElementException("존재하지않는 사용자임"));
		try{
			treasure.updateFinderId(user);
			treasure.updateStatus();
			treasureRepository.save(treasure);
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
