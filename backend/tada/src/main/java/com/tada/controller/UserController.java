package com.tada.controller;

import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

	@PostMapping
	@Operation(summary = "참가자 방 입장", description = "참가자가 참가코드를 통해 특정 게임방에 참가<br><br>"
		+"<b>[RequestParam]</b><br>"
		+"code: 방 참가 코드<br>"
		+"<b>[RequestBody]</b><br>"
		+"deviceId: 참가자 디바이스 고유번호?<br>imgNo: 유저가 선택한 캐릭터 번호<br>nick: 참가자 닉네임")
	public ResponseEntity<?> enterRoom(@RequestParam("code") String code, @RequestBody UserRequest userRequest){
		HttpStatus status = HttpStatus.OK;

		try{
			Map<String, Long> response = userService.saveUser(code, userRequest);
			return new ResponseEntity<Map<String, Long>>(response, status);
		}catch (Exception e){
			logger.error("참가자 방 입장 실패 : {}", e.getMessage());
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
