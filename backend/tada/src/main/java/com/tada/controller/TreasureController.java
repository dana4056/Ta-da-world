package com.tada.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.tada.domain.dto.ResultDto;
import com.tada.domain.entity.Room;
import com.tada.service.HostService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.tada.domain.dto.ImgPathDto;
import com.tada.domain.dto.RankResponse;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.service.TreasureService;
import com.tada.util.JwtTokenProvider;
import com.tada.util.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/treasures")
public class TreasureController {

	private static final String SUCCESS = "Success";
	private static final String FAIL = "Fail";
	private static final String UNAUTHORIZED = "Token expired";
	private static final String TOKEN_ERROR = "wrong token received";
	private static final boolean TRUE = true;
	private static final boolean FALSE = false;

	private final TreasureService treasureService;
	private final JwtTokenProvider jwtTokenProvider;
	private final HostService hostService;
	private final S3Service s3Service;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@PostMapping
	@Operation(summary = "보물 등록", description = "호스트가 보물 하나씩 등록")
	public ResponseEntity<?> postTreasure(HttpServletRequest request,
		@RequestPart("treasureFile") MultipartFile treasureFile,
	    @RequestPart("rewardFile") MultipartFile rewardFile,
		@RequestPart(required = false) TreasureRequest treasureRequest){

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				String hostId = jwtTokenProvider.getHostID(accessToken);
				Room room = hostService.getRoomByHostId(hostId);
				Long roomId = room.getId();
				treasureRequest.setRoomId(roomId);
				ImgPathDto treasureImgDto = s3Service.uploadFiles(treasureFile, "rooms/" + treasureRequest.getRoomId() + "/treasures");
				ImgPathDto rewardImgDto = s3Service.uploadFiles(rewardFile, "rooms/" + treasureRequest.getRoomId() + "/rewards");

				logger.info("보물 이미지 경로 [프론트:{}], [백:{}]", treasureImgDto.getImgPath(), treasureImgDto.getImgBasePath());
				logger.info("보상 이미지 경로 [프론트:{}], [백:{}]", rewardImgDto.getImgPath(), rewardImgDto.getImgBasePath());

				treasureService.postTreasure(treasureImgDto, rewardImgDto, treasureRequest);
				return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), HttpStatus.OK);
			} catch (Exception e) {
				logger.error("보물 등록 실패: {}", e);
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("보물 등록 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
		}
	}

	@PostMapping("/{id}")
	@Operation(summary = "보물 답안 제출", description = "예상 보물 사진 촬영하여 업로드")
	public ResponseEntity<?> postAnswer(@PathVariable Long id, @ModelAttribute("roomId") String roomId, @RequestParam("answerFile") MultipartFile answerFile) {
		HttpStatus status = HttpStatus.OK;
		try {
			ImgPathDto answerImgDto = s3Service.uploadFiles(answerFile, "rooms/" + roomId + "/answers");
			logger.info("정답 이미지 경로 [프론트:{}], [백:{}]", answerImgDto.getImgPath(), answerImgDto.getImgBasePath());
			status = treasureService.postAnswer(id, answerImgDto);
		} catch (Exception e) {
			logger.error("정답 업로드 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<>(status);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "보물 삭제", description = "호스트가 특정 보물 삭제")
	public ResponseEntity<?> deleteTreasure(HttpServletRequest request, @PathVariable Long id){

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				treasureService.deleteTreasure(id);
				return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), status);
			} catch (Exception e) {
				logger.error("보물 삭제 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("보물 삭제 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
		}
	}

	@GetMapping
	@Operation(summary = "보물 리스트 불러오기", description = "호스트가 등록한 보물 리스트 조회")
	public ResponseEntity<?> getTreasureList(HttpServletRequest request, @RequestParam(required = false) Long roomId){
		HttpStatus status = HttpStatus.OK;
		Map<String, Object> resultMap = new HashMap<>();
		try {
			if ( roomId == null ) { // 룸 id 없으면 호스트가 보낸거니까 헤더에서 갖고와야함
				String header = request.getHeader("Authorization");
				String accessToken = jwtTokenProvider.getTokenByHeader(header);
				String hostId = jwtTokenProvider.getHostID(accessToken);
				Room room = hostService.getRoomByHostId(hostId);
				roomId = room.getId();
			}
			List<TreasureResponse> list = treasureService.getTreasureList(roomId);
			resultMap.put("data",list);
			resultMap.put("message",SUCCESS);
			resultMap.put("success",TRUE);

			return new ResponseEntity<>(resultMap, status);
		} catch (Exception e) {
			logger.error("보물 리스트 조회 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}

	@GetMapping("/user")
	@Operation(summary = "게임 결과 보기 - 내가 찾은 보물", description = "참가자 입장에서 보이는 게임 결과 데이터")
	public ResponseEntity<?> getResultPageInUser(@RequestParam("room") Long roomId, @RequestParam("user") Long userId){
		HttpStatus status = HttpStatus.OK;
		Map<String, Object> resultMap = new HashMap<>();
		try{
			List<TreasureResponse> list = treasureService.getResultInUser(roomId, userId);
			resultMap.put("data",list);
			resultMap.put("message",SUCCESS);
			resultMap.put("success",TRUE);
			return new ResponseEntity<>(resultMap, status);
		} catch (Exception e){
			logger.error("게임 결과 보기 - 내가 찾은 보물 조회 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}
	@GetMapping("/rank")
	@Operation(summary = "게임 결과 보기 - 랭킹", description = "게임 결과 페이지에서 볼 수 있는 랭킹")
	public ResponseEntity<?> getResultPageInHost(@RequestParam("room") Long roomId){

		HttpStatus status = HttpStatus.OK;
		Map<String, Object> resultMap = new HashMap<>();
		try {
			List<RankResponse> response = treasureService.getResultInHost(roomId);
			resultMap.put("data",response);
			resultMap.put("message",SUCCESS);
			resultMap.put("success",TRUE);
			return new ResponseEntity<>(resultMap, status);
		} catch (Exception e) {
			logger.error("게임 결과 보기 - 랭킹 조회 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}

	private ResponseEntity<?> tokenExceptionHandling() {
		logger.error("토큰 에러");
		HttpStatus status = HttpStatus.FORBIDDEN;
		return new ResponseEntity<>(new ResultDto(TOKEN_ERROR,FALSE), status);
	}
}

