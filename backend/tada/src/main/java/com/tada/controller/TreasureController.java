package com.tada.controller;

import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.tada.domain.dto.ImgPathDto;
import com.tada.domain.dto.RankResponse;
import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.service.TreasureService;
import com.tada.util.JwtTokenProvider;
import com.tada.util.S3Service;

import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/treasures")
public class TreasureController {

	private final TreasureService treasureService;
	private final JwtTokenProvider jwtTokenProvider;
	private final S3Service s3Service;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@PostMapping
	@Operation(summary = "보물 등록", description = "호스트가 보물 하나씩 등록")
	public ResponseEntity<?> postTreasure(HttpServletRequest request,
		@RequestParam("treasureFile") MultipartFile treasureFile,
		@RequestParam("rewardFile") MultipartFile rewardFile,
		@ModelAttribute TreasureRequest treasureRequest){

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				ImgPathDto treasureImgDto = s3Service.uploadFiles(treasureFile, "treasure");
				ImgPathDto rewardImgDto = s3Service.uploadFiles(rewardFile, "reward");

				logger.info("보물 이미지 경로 [프론트:{}], [백:{}]", treasureImgDto.getImgPath(), treasureImgDto.getImgBasePath());
				logger.info("보상 이미지 경로 [프론트:{}], [백:{}]", rewardImgDto.getImgPath(), rewardImgDto.getImgBasePath());

				treasureService.postTreasure(treasureImgDto, rewardImgDto, treasureRequest);
				return new ResponseEntity<>(HttpStatus.OK);
			} catch (Exception e) {
				logger.error("보물 등록 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("보물 등록 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
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
				return new ResponseEntity<>(status);
			} catch (Exception e) {
				logger.error("보물 삭제 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("보물 삭제 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}

	@GetMapping
	@Operation(summary = "보물 리스트 불러오기", description = "호스트가 등록한 보물 리스트 조회")
	public ResponseEntity<?> getTreasureList(HttpServletRequest request, @RequestParam("room") Long roomId){
		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				List<TreasureResponse> list = treasureService.getTreasureList(roomId);
				return new ResponseEntity<List<TreasureResponse>>(list, status);
			} catch (Exception e) {
				logger.error("보물 리스트 조회 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("보물 리스트 조회 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}

	@GetMapping("/user")
	@Operation(summary = "게임 결과 보기 - 내가 찾은 보물", description = "참가자 입장에서 보이는 게임 결과 데이터")
	public ResponseEntity<?> getResultPageInUser(@RequestParam("room") Long roomId, @RequestParam("user") Long userId){
		HttpStatus status = HttpStatus.OK;
		try{
			List<TreasureResponse> list = treasureService.getResultInUser(roomId, userId);
			return new ResponseEntity<List<TreasureResponse>>(list, status);
		} catch (Exception e){
			logger.error("게임 결과 보기 - 내가 찾은 보물 조회 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<>(status);
	}
	@GetMapping("/rank")
	@Operation(summary = "게임 결과 보기 - 랭킹", description = "게임 결과 페이지에서 볼 수 있는 랭킹")
	public ResponseEntity<?> getResultPageInHost(@RequestParam("room") Long roomId){

		HttpStatus status = HttpStatus.OK;

		try {
			List<RankResponse> response = treasureService.getResultInHost(roomId);
			return new ResponseEntity<List<RankResponse>>(response, status);
		} catch (Exception e) {
			logger.error("게임 결과 보기 - 랭킹 조회 실패: {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
		}
		return new ResponseEntity<>(status);
	}

	private ResponseEntity<String> tokenExceptionHandling() {
		logger.error("토큰 에러");
		HttpStatus status = HttpStatus.FORBIDDEN;
		return new ResponseEntity<>(status);
	}
}

