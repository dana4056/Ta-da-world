package com.tada.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.tada.domain.entity.Room;
import com.tada.service.HostService;
import com.tada.service.TreasureService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tada.domain.dto.ResultDto;
import com.tada.domain.dto.UserRequest;
import com.tada.domain.dto.UserResponse;
import com.tada.service.UserService;
import com.tada.util.JwtTokenProvider;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

	private static final String SUCCESS = "Success";
	private static final String FAIL = "Fail";
	private static final String UNAUTHORIZED = "Token expired";
	private static final String TOKEN_ERROR = "wrong token received";
	private static final boolean TRUE = true;
	private static final boolean FALSE = false;
	private final UserService userService;
	private final TreasureService treasureService;
	private final HostService hostService;
	private final JwtTokenProvider jwtTokenProvider;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	private final SimpMessagingTemplate simpMessagingTemplate;


	@MessageMapping("/send")
	public void sendMsg(@Payload Map<String,Object> data) {

		if ("ENTER".equals(data.get("messageType").toString())) { // 방 입장했다는 요청 들어왔을 때
			logger.debug(data.get("userId").toString() + " enter");
			try {
				userService.enterUser(data); // 해당 유저가 방에 입장하는 로직
				// 레디스 사용할거면 여기서 레디스 삭제하는 로직 넣어야함
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data); // 모든사람들에게 뿌림
			} catch (Exception e) {
				logger.error("유저 방 입장중 에러 : {}", e);
			}
		}  else if ("NOTICE".equals(data.get("messageType").toString())) { // 공지사항
			logger.debug("NOTICE!!" + data.get("context").toString());
			try {
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data); // 모든사람들에게 뿌림
			} catch (Exception e) {
				logger.error("공지사항 전달 중 에러 발생 !! : {}", e);
			}
		}

	}



	@GetMapping("/check")
	@Operation(summary = "닉네임 중복 확인", description = "해당 방에 닉네임 중복된 사람이 있는지 확인.")
	public ResponseEntity<?> checkUserNickname(@RequestParam String code, @RequestParam String nickname){
		HttpStatus status = HttpStatus.OK;
		try{
			boolean isDuplicate = userService.checkNickname(code,nickname);
			if(isDuplicate) {
				return new ResponseEntity<>(new ResultDto("duplicate",FALSE), status);
			} else {
				return new ResponseEntity<>(new ResultDto("unduplicate",TRUE), status);
			}


		}catch (Exception e) {
			logger.error("닉네임 중복 확인 실패 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}

	@GetMapping
	@Operation(summary = "참가자 리스트 조회", description = "특정 게임방 안에 있는 참가자 리스트를 반환"
		+"<b>[RequestParam]</b><br>"
		+"roomId: 방 고유번호 또는 AccessToken")
	@ApiResponses(value = {
		@ApiResponse(responseCode = "200", description = "방 기본 정보 조회 성공"),
		@ApiResponse(responseCode = "401", description = "액세스 토큰 만료"),
		@ApiResponse(responseCode = "403", description = "토큰 에러 (토큰 없음)"),
		@ApiResponse(responseCode = "500", description = "서버에러")
	})
	public ResponseEntity<?> readUserList(@RequestParam(required = false) Long roomId,  HttpServletRequest request){
		HttpStatus status = HttpStatus.OK;
		Map<String, Object> resultMap = new HashMap<>();

		try{
			if(roomId == null){	// 호스트 입장 (roomId 없고 토큰에서 꺼내옴)
				String header = request.getHeader("Authorization");
				String accessToken = jwtTokenProvider.getTokenByHeader(header);
				String hostId = jwtTokenProvider.getHostID(accessToken);
				Room room = hostService.getRoomByHostId(hostId);
				roomId = room.getId();
			}
			List<UserResponse> list = userService.readUserList(roomId);
			resultMap.put("data",list);
			resultMap.put("message",SUCCESS);
			resultMap.put("success",TRUE);

			return new ResponseEntity<>(resultMap, status);
		}catch (Exception e) {
			logger.error("참가자 리스트 조회 실패 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}
}
