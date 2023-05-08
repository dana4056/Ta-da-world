package com.tada.controller;

import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.tada.domain.dto.ResultDto;
import com.tada.domain.entity.Room;
import com.tada.service.HostService;
import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.service.RoomService;
import com.tada.util.JwtTokenProvider;

import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@Api(tags = "Room Controller")
@RequestMapping("/rooms")
public class RoomController {
	private static final String SUCCESS = "Success";
	private static final String FAIL = "Fail";
	private static final String UNAUTHORIZED = "Token expired";
	private static final String TOKEN_ERROR = "wrong token received";
	private static final boolean TRUE = true;
	private static final boolean FALSE = false;


	private final RoomService roomService;
	private final HostService hostService;
	private final JwtTokenProvider jwtTokenProvider;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	@GetMapping("")
	@Operation(summary = "방 기본 정보 조회", description = "호스트가 생성한 방의 기본정보 조회<br><br>"
	+"<b>[RequestParam]</b><br>"
	+"roomId: 방 고유번호 또는 AccessToken")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 기본 정보 조회 성공"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> readRoom(@RequestParam(required = false) Long roomId, HttpServletRequest request){
		RoomResponse response = null;
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		try{
			if (roomId==null) { // 룸 id 없으면 호스트가 보낸거니까 헤더에서 갖고와야함
				String header = request.getHeader("Authorization");
				String accessToken = jwtTokenProvider.getTokenByHeader(header);
				String hostId = jwtTokenProvider.getHostID(accessToken);
				Room room = hostService.getRoomByHostId(hostId);
				roomId = room.getId();
			}
			response = roomService.readRoom(roomId);
			resultMap.put("data", response);
			resultMap.put("success", TRUE);
			resultMap.put("message", SUCCESS);

			return new ResponseEntity<>(resultMap, status);
		}catch (Exception e){
			logger.error("방 기본 정보 조회 오류 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
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

				if(response == null){
					logger.error("방생성 실패: 이미 열려있는 방 있음");
					status = HttpStatus.CONFLICT;
					return new ResponseEntity<>(new ResultDto("already exist room.", FALSE), status);
				}
				return new ResponseEntity<>(response, status);
			} catch (Exception e) {
				logger.error("방생성 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방생성 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
		}
	}

	@PutMapping("/host")
	@Operation(summary = "방 정보 수정", description = "호스트가 생성한 방의 기본정보를 입력해 저장/수정<br><br>"
	+"<b>[PathVariable]</b><br>"
	+"roomId: 방 고유번호")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 정보 수정 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> modifyRoom(HttpServletRequest request, @RequestBody RoomRequest roomRequest) {

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
				roomService.modifyRoom(roomId, roomRequest);
				return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), status);
			} catch (Exception e) {
				logger.error("방 정보 수정 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 정보 수정 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED, FALSE), status);
		}
	}


	@PatchMapping("/host")
	@Operation(summary = "방 상태 변경", description = "호스트가 생성한 방에 대한 상태를 변경<br><br>"
		+ "<b>[변경 가능한 상태 목록]</b><br>"
		+ "- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음)<br>"
		+ "- 4: 게임 종료 (게임이 종료되고 게임 결과창이 보이는 상태)<br><br>")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 상태 변경 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> modifyRoomStatus(HttpServletRequest request, @RequestBody Map<String, Integer> statusRequest){
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
				roomService.modifyRoomStatus(roomId, statusRequest);
				return new ResponseEntity<>(new ResultDto(SUCCESS,TRUE), status);
			} catch (Exception e) {
				logger.error("방 상태 변경 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 상태 변경 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
		}
	}



	@GetMapping("/host/status")
	@Operation(summary = "방 상태 조회", description = "호스트가 생성한 종료되지 않은 방의 상태 코드를 조회<br><br>"
		+ "<b>[조회할 수 있는 상태 목록]</b><br>"
		+ "- 0: 방없음 (방이 없는 상태로, 새로운 방 생성 가능)<br>- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 2: 대기방 (게임을 시작하기 전 상태)<br>- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음) 방 입장 코드도 같이 보냄<br>"
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
		Map<String, Object> resultMap = new HashMap<>();

		if(accessToken == null){ // 토큰이 제대로 담겨오지 않은 경우
			return tokenExceptionHandling();
		}

		if (jwtTokenProvider.validateToken(accessToken)) {
			String hostId = jwtTokenProvider.getHostID(accessToken);
			try {
				Map<String, Object> response = roomService.readRoomStatus(hostId);
				resultMap.put("data",response);
				resultMap.put("message",SUCCESS);
				resultMap.put("success",TRUE);

				return new ResponseEntity<>(resultMap, status);
			} catch (Exception e) {
				logger.error("방 상태 조회 실패: {}", e.getMessage());
				status = HttpStatus.INTERNAL_SERVER_ERROR;
				return new ResponseEntity<>(status);
			}
		}else{  // 토큰이 만료된 경우
			logger.info("방 상태 조회 실패: 액세스 토큰 만료");
			status = HttpStatus.UNAUTHORIZED;
			return new ResponseEntity<>(new ResultDto(UNAUTHORIZED,FALSE), status);
		}
	}

	@GetMapping("/check")
	@Operation(summary = "방 입장코드 유효성 검사", description = "방 입장번호 유효성 검사")
	@ApiResponses(value = {
			@ApiResponse(responseCode = "200", description = "방 유효함"),
			@ApiResponse(responseCode = "401", description = "방 유효하지 않음"),
			@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> checkCode(@RequestParam String code){
		Map<String, Object> resultMap = new HashMap<>();
		HttpStatus status = HttpStatus.OK;
		RoomResponse roomResponse = new RoomResponse();
		try {
			Long roomId = roomService.checkCode(code);
			if (roomId == null) {
				return new ResponseEntity<>(new ResultDto("not exist", FALSE), status);
			} else {
				roomResponse.setId(roomId);
				resultMap.put("data", roomResponse);
				resultMap.put("message", SUCCESS);
				resultMap.put("success", TRUE);
				return new ResponseEntity<>(resultMap,status);
			}
		} catch (Exception e) {
			logger.error("방 상태 조회 실패: {}", e.getMessage());
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
