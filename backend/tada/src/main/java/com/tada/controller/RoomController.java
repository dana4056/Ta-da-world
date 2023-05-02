package com.tada.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.v3.oas.annotations.Operation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.service.RoomService;
import com.tada.util.JwtTokenProvider;

import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@Api(tags = "Room Controller")
@RequestMapping("/rooms")
public class RoomController {

	private final RoomService roomService;
	private final JwtTokenProvider jwtTokenProvider;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@GetMapping("/{roomId}")
	@Operation(summary = "방 기본 정보 조회", description = "호스트가 생성한 방의 기본정보 조회<br><br>"
	+"<b>[PathVariable]</b><br>"
	+"roomId: 방 고유번호")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 기본 정보 조회 성공"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> readRoom(@PathVariable Long roomId){
		RoomResponse response = null;
		HttpStatus status = HttpStatus.OK;

		try{
			response = roomService.readRoom(roomId);
		}catch (Exception e){
			logger.error("방 기본 정보 조회 오류 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
		return new ResponseEntity<RoomResponse>(response, status);
	}

	@PostMapping("/host")
	@Operation(summary = "방 생성", description = "호스트가 처음 방 생성 버튼 클릭했을 때 방 생성")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 생성 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> createRoom(HttpServletRequest request) {
		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			String hostId = jwtTokenProvider.getHostID(accessToken);
			try {
				Map<String, Long> response = roomService.createRoom(hostId);
				return new ResponseEntity<>(response, status);
			} catch (Exception e) {
				logger.error("방생성 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방생성 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}

	@PutMapping("/host/{roomId}")
	@Operation(summary = "방 정보 수정", description = "호스트가 생성한 방의 기본정보를 입력해 저장/수정<br><br>"
	+"<b>[PathVariable]</b><br>"
	+"roomId: 방 고유번호")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 정보 수정 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> modifyRoom(HttpServletRequest request, @PathVariable Long roomId, @RequestBody RoomRequest roomRequest) {

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				roomService.modifyRoom(roomId, roomRequest);
			} catch (Exception e) {
				logger.error("방 정보 수정 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 정보 수정 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}


	@PatchMapping("/host/{roomId}")
	@Operation(summary = "방 상태 변경", description = "호스트가 생성한 방에 대한 상태를 변경<br><br>"
		+ "<b>[변경 가능한 상태 목록]</b><br>"
		+ "- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음)<br>"
		+ "- 4: 게임 종료 (게임이 종료되고 게임 결과창이 보이는 상태)<br><br>"
		+ "상태코드 0과 2로는 변경X / 2로 변경하는 API 별도 존재!!")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 상태 변경 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> modifyRoomStatus(HttpServletRequest request, @PathVariable Long roomId, @RequestBody Map<String, Integer> statusRequest){
		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				roomService.modifyRoomStatus(roomId, statusRequest);
			} catch (Exception e) {
				logger.error("방 상태 변경 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 상태 변경 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);

	}

	@PostMapping("/host/{roomId}")
	@Operation(summary = "방 상태 변경(대기실로 이동)", description = "기본정보를 입력한 상태(1)의 방을 대기중(2)으로 변경<br><br>"
		+ "<b>[변경 가능한 상태 목록]</b><br>"
		+ "- 2: 대기방 (게임을 시작하기 전 상태)<br><br>"
		+ "*대기방으로 이동할 때는 접속코드 반환해야해서 분리")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 상태 대기중으로 변경 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> moveToWaitingRoom(HttpServletRequest request, @PathVariable Long roomId){

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			try {
				Map<String, String> response = roomService.moveToWaitingRoom(roomId);
				if(response != null){
					return new ResponseEntity<Map<String, String>>(response, status);
				}else{
					status = HttpStatus.UNAUTHORIZED;
					return new ResponseEntity<>(status);
				}
			} catch (Exception e) {
				logger.error("대기실 이동 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("대기실 이동 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}

	@GetMapping("/host/status")
	@Operation(summary = "방 상태 조회", description = "호스트가 생성한 종료되지 않은 방의 상태 코드를 조회<br><br>"
		+ "<b>[조회할 수 있는 상태 목록]</b><br>"
		+ "- 0: 방없음 (방이 없는 상태로, 새로운 방 생성 가능)<br>- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 2: 대기방 (게임을 시작하기 전 상태)<br>- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음)<br>"
		+ "- 4: 게임 종료 (게임이 종료되고 게임 결과창이 보이는 상태)")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 상태 조회 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> readRoomStatus(HttpServletRequest request){

		HttpStatus status = HttpStatus.OK;
		String header = request.getHeader("Authorization");
		String accessToken = jwtTokenProvider.getTokenByHeader(header);

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			String hostId = jwtTokenProvider.getHostID(accessToken);
			try {
				Map<String, Integer> response = roomService.readRoomStatus(hostId);
				return new ResponseEntity<Map<String, Integer>>(response, status);
			} catch (Exception e) {
				logger.error("방 상태 조회 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 상태 조회 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
		}
		return new ResponseEntity<>(status);
	}


	private ResponseEntity<String> tokenExceptionHandling() {
		logger.error("토큰 에러");
		HttpStatus status = HttpStatus.FORBIDDEN;
		return new ResponseEntity<>(status);
	}
}
