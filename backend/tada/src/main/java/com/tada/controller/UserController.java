package com.tada.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
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

	@PostMapping
	@Operation(summary = "참가자 방 입장", description = "참가자가 참가코드를 통해 특정 게임방에 참가")
	public ResponseEntity<?> enterRoom(@RequestParam("code") String code, @RequestBody UserRequest userRequest){

		Map<String, Long> response = userService.saveUser(code, userRequest);
		return new ResponseEntity<Map<String, Long>>(response, HttpStatus.OK);
	}

	@PostMapping
	@Operation(summary = "참가자 리스트 조회", description = "특정 게임방 안에 있는 참가자 리스트를 반환")
	public ResponseEntity<?> readUserList(@RequestParam("room") Long roomId){
		List<UserResponse> list = userService.readUserList(roomId);
		return new ResponseEntity<List<UserResponse>>(list, HttpStatus.OK);
	}
}
