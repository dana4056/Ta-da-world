package com.tada.controller;

import io.swagger.annotations.Api;
import io.swagger.v3.oas.annotations.Operation;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.tada.service.RoomService;

import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/rooms")
public class RoomController {

	private final RoomService roomService;

	@PostMapping("/host")
	@Operation(summary = "방 생성", description = "호스트가 처음 방 생성 버튼 클릭했을 때 방 생성")
	public ResponseEntity<?> createRoom(Authentication authentication) {
		roomService.createRoom(authentication);
		return new ResponseEntity<>(HttpStatus.OK);
	}





}
