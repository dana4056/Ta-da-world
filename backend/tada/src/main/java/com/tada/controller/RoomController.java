package com.tada.controller;

import java.util.HashMap;
import java.util.Map;

import io.swagger.v3.oas.annotations.Operation;

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

	@PutMapping("/host/{id}")
	@Operation(summary = "방 정보 수정", description = "호스트가 생성한 방의 기본정보를 입력해 저장/수정")
	public ResponseEntity<?> modifyRoom(@PathVariable Long id, @RequestBody RoomRequest roomRequest) {
		roomService.modifyRoom(id, roomRequest);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping("/{id}")
	@Operation(summary = "방 기본 정보 조회", description = "호스트가 생성한 방의 기본정보 조회")
	public ResponseEntity<?> readRoom(@PathVariable Long id){
		return new ResponseEntity<RoomResponse>(roomService.readRoom(id), HttpStatus.OK);
	}

	@GetMapping("/host/status")
	@Operation(summary = "방 상태 조회", description = "호스트가 생성한 종료되지 않은 방의 상태 코드를 조회<br><br>"
		+ "[조회할 수 있는 상태 목록]<br>"
		+ "- 0: 방없음 (방이 없는 상태로, 새로운 방 생성 가능)<br>- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 2: 대기방 (게임을 시작하기 전 상태)<br>- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음)<br>"
		+ "- 4: 게임 종료 (게임이 종료되고 게임 결과창이 보이는 상태)")
	public ResponseEntity<?> readRoomStatus(@RequestParam("host") Long id){
		int status = roomService.readRoomStatus(id);
		Map<String, Integer> response = new HashMap<>();
		response.put("status", status);

		return new ResponseEntity<Map<String, Integer>>(response, HttpStatus.OK);
	}

	@PatchMapping("/host/{id}")
	@Operation(summary = "방 상태 변경", description = "호스트가 생성한 방에 대한 상태를 변경<br><br>"
		+ "[변경 가능한 상태 목록]<br>"
		+ "- 1: 방 생성 및 수정 (방을 생성하고 정보를 수정하고 있는 상태로, 대기방 가기전)<br>"
		+ "- 3: 게임중 (게임을 하고 있는 상태로, 게임 현황을 볼 수 있음)<br>"
		+ "- 4: 게임 종료 (게임이 종료되고 게임 결과창이 보이는 상태)<br><br>"
		+ "상태코드 0과 2로는 변경X / 2로 변경하는 API 별도 존재!!")
	public ResponseEntity<?> modifyRoomStatus(@PathVariable Long id, @RequestBody Map<String, Integer> statusRequest){
		roomService.modifyRoomStatus(id, statusRequest);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@PostMapping("/host/{id}")
	@Operation(summary = "방 상태 변경(대기실로 이동)", description = "기본정보를 입력한 상태(1)의 방을 대기중(2)으로 변경<br><br>"
		+ "[변경 가능한 상태 목록]<br>"
		+ "- 2: 대기방 (게임을 시작하기 전 상태)<br><br>"
		+ "*대기방으로 이동할 때는 접속코드 반환해야해서 분리")
	public ResponseEntity<?> moveToWaitingRoom(@PathVariable Long id){
		String code = roomService.moveToWaitingRoom(id);
		Map<String, String> response = new HashMap<>();
		response.put("code", code);

		return new ResponseEntity<Map<String, String>>(response, HttpStatus.OK);
	}
}
