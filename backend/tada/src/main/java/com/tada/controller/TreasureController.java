package com.tada.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.tada.domain.dto.TreasureRequest;
import com.tada.domain.dto.TreasureResponse;
import com.tada.service.TreasureService;

import io.swagger.v3.oas.annotations.Operation;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@CrossOrigin
@RestController
@RequiredArgsConstructor
@RequestMapping("/treasures")
public class TreasureController {

	private final TreasureService treasureService;

	@PostMapping
	@Operation(summary = "보물 등록", description = "호스트가 보물 하나씩 등록")
	public ResponseEntity<?> postTreasure(@RequestBody TreasureRequest treasureRequest){

		treasureService.postTreasure(treasureRequest);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@DeleteMapping("/{id}")
	@Operation(summary = "보물 삭제", description = "호스트가 특정 보물 삭제")
	public ResponseEntity<?> deleteTreasure(@PathVariable Long id){

		treasureService.deleteTreasure(id);
		return new ResponseEntity<>(HttpStatus.OK);
	}

	@GetMapping
	@Operation(summary = "보물 리스트 불러오기", description = "호스트가 등록한 보물 리스트 조회")
	public ResponseEntity<?> getTreasureList(@RequestParam("room") Long roomId){
		List<TreasureResponse> list = treasureService.getTreasureList(roomId);
		return new ResponseEntity<List<TreasureResponse>>(list, HttpStatus.OK);
	}
	// @GetMapping("/host")
	// @Operation(summary = "게임 결과 보기(호스트)", description = "호스트 입장에서 보이는 게임 결과 데이터")
	// public ResponseEntity<?> getResultPageInHost(@RequestParam("room") Long roomId){
	// 	List<TreasureResponse> list = treasureService.getResultInHost(roomId);
	// 	return new ResponseEntity<List<TreasureResponse>>(list, HttpStatus.OK);
	// }

	@GetMapping("/user")
	@Operation(summary = "게임 결과 보기(참가자)", description = "참가자 입장에서 보이는 게임 결과 데이터")
	public ResponseEntity<?> getResultPageInUser(@RequestParam("room") Long roomId, @RequestParam("user") Long userId){
		List<TreasureResponse> list = treasureService.getResultInUser(roomId, userId);
		return new ResponseEntity<List<TreasureResponse>>(list, HttpStatus.OK);
	}


}

