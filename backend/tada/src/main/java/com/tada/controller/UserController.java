package com.tada.controller;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

import io.swagger.v3.oas.annotations.Operation;
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
		} else if ("FIND".equals(data.get("messageType").toString())) {
			logger.debug(data.get("userId").toString() + "find " + data.get("treasureId").toString());
			try {
				Long treasureId = (Long) data.get("treasureId");
				//보물을 찾았을 때 -> 보물 상태 변경, 메시지로 전체 공지
				treasureService.changeTreasureStatus(treasureId);
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data); // 모든사람들에게 뿌림
			} catch (Exception e) {
				logger.error("보물 찾기 처리 중 에러 : {}", e);
			}
		} else if ("NOTICE".equals(data.get("messageType").toString())) { // 공지사항
			logger.debug("NOTICE!!" + data.get("context").toString());
			try {
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data); // 모든사람들에게 뿌림
			} catch (Exception e) {
				logger.error("공지사항 전달 중 에러 발생 !! : {}", e);
			}
		} else if ("END".equals(data.get("messageType").toString())) { // 게임 종료
			logger.debug("GAME END!");
			try {
				simpMessagingTemplate.convertAndSend("/sub/" + data.get("roomId"), data); // 모든사람들에게 뿌림
			} catch (Exception e) {
				logger.error("게임 종료 처리중 에러 발생! : {}", e);
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
		Map<String, Object> resultMap = new HashMap<>();

		try{
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
