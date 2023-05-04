package com.tada.controller;

import java.util.List;
import java.util.Map;

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

import com.tada.domain.dto.UserRequest;
import com.tada.domain.dto.UserResponse;
import com.tada.service.UserService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/users")
public class UserController {

	private final UserService userService;
	public static final Logger logger = LoggerFactory.getLogger(HostController.class);

	private final SimpMessagingTemplate simpMessagingTemplate;



	@MessageMapping("/send")
	public void sendMsg(@Payload Map<String,Object> data) {

		if ("ENTER".equals(data.get("messageType").toString())) {
			logger.debug(data.get("userId").toString() + " enter");
			try {
				userService.enterUser(data);
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data);
			} catch (Exception e) {
				logger.error("유저 방 입장중 에러 : {}", e);
			}
		} else if ("FIND".equals(data.get("messageType").toString())) {
			logger.debug(data.get("userId").toString() + "find ");
			try {
				//보물을 찾았을 때 -> 보물 상태 변경, 메시지로 전체 공지

			} catch (Exception e) {
				logger.error("보물 찾기 처리 중 에러 : {}", e);
			}
		}

	}



	@GetMapping("/check")
	@Operation(summary = "닉네임 중복 확인", description = "해당 방에 닉네임 중복된 사람이 있는지 확인.")
	public ResponseEntity<?> checkUserNickname(@RequestParam String code, @RequestParam String nickname){
		HttpStatus status = HttpStatus.OK;

		try{
			boolean isDuplicate = userService.checkNickname(code,nickname);
			return new ResponseEntity<>(isDuplicate, status);
		}catch (Exception e) {
			logger.error("참가자 리스트 조회 실패 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}

	@GetMapping
	@Operation(summary = "참가자 리스트 조회", description = "특정 게임방 안에 있는 참가자 리스트를 반환"
		+"<b>[RequestParam]</b><br>"
		+"room: 방 고유번호")
	public ResponseEntity<?> readUserList(@RequestParam("room") Long roomId){
		HttpStatus status = HttpStatus.OK;

		try{
			List<UserResponse> list = userService.readUserList(roomId);
			return new ResponseEntity<List<UserResponse>>(list, status);
		}catch (Exception e) {
			logger.error("참가자 리스트 조회 실패 : {}", e.getMessage());
			status = HttpStatus.INTERNAL_SERVER_ERROR;
			return new ResponseEntity<>(status);
		}
	}
}
