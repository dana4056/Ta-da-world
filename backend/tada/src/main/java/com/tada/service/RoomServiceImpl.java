package com.tada.service;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tada.domain.RoomStatus;
import com.tada.domain.dto.RoomRequest;
import com.tada.domain.dto.RoomResponse;
import com.tada.domain.entity.Host;
import com.tada.domain.entity.Room;
import com.tada.repository.HostRepository;
import com.tada.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
	private final RoomRepository roomRepository;
	private final HostRepository hostRepository;

	@Override	// 방 기본정보 조회
	public RoomResponse readRoom(Long roomId) {
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new NoSuchElementException("해당 방 없음"));
		return new RoomResponse(room);
	}

	@Override	// 방 생성
	public Map<String, Long> createRoom(String hostId) throws Exception{

		Host host = hostRepository.findById(hostId).orElseThrow(() -> new NoSuchElementException("존재하지 않는 호스트"));
		try{
			if(!roomRepository.existsByHost_IdAndStatusLessThan(hostId, RoomStatus.CLOSED.getCode())){
				long now =  System.nanoTime();
				String code = longToBase64(now);
				Room room = Room.builder().host(host).code(code).status(RoomStatus.CREATED.getCode()).build();
				roomRepository.save(room);

				Room savedRoom = roomRepository.findByCode(code)
					.orElseThrow(() -> new NoSuchElementException("생성한 방 찾을 수 없음"));
				Map<String, Long> response = new HashMap<>();
				response.put("id", savedRoom.getId());
				return response;
			}else {
				return null;
			}
		} catch (Exception e){
			throw e;
		}
	}

	@Override	// 방 정보 수정
	public void modifyRoom(Long roomId, RoomRequest roomRequest) throws Exception {
		try{
			Room room = roomRepository.findById(roomId).orElseThrow(() -> new NoSuchElementException("존재하지 않는 방"));
			room.updateContent(roomRequest);
			roomRepository.save(room);
		}catch(Exception e){
			throw e;
		}
	}
	@Override	// 방 상태 변경
	public void modifyRoomStatus(Long roomId, Map<String, Integer> statusRequest) throws Exception{
		try{
			Room room = roomRepository.findById(roomId).orElseThrow(() -> new NoSuchElementException("해당 방 없음"));
			int status = statusRequest.get("status");

			if(status == RoomStatus.PLAYING.getCode()){
				room.updateStartTime();
			}
			room.updateStatus(statusRequest.get("status"));
			roomRepository.save(room);
		} catch (Exception e){
			throw e;
		}
	}
	@Override	// 방 상태 변경 (대기중으로 변경)
	public Map<String, String> moveToWaitingRoom(Long roomId) throws Exception{
		Room room = roomRepository.findById(roomId).orElseThrow(() -> new NoSuchElementException("해당 방 없음"));

		try{
			// 방이 대기중으로 이동할 수 있는 상태(1)일 때
			if(room.getStatus() == RoomStatus.CREATED.getCode()){
				room.updateStatus(RoomStatus.WAITING.getCode());
				roomRepository.save(room);

				Map<String, String> response = new HashMap<>();
				response.put("code", room.getCode());
				return response;
			}
			return null;
		}catch (Exception e){
			throw e;
		}
	}

	@Override	// 방 상태 조회
	public Map<String, Integer> readRoomStatus(String hostId) throws Exception{
		try{
			Room room = roomRepository.findByHost_IdAndStatusLessThan(hostId,
				RoomStatus.CLOSED.getCode());
			Map<String, Integer> response = new HashMap<>();
			if(room == null){
				response.put("status", RoomStatus.NOT_EXIST.getCode());
				return response;
			}else{
				response.put("status", room.getStatus());
				return response;
			}
		}catch (Exception e){
			throw e;
		}
	}



	// 참가코드(고유번호) 만들기
	public static String longToBase64(long v) {
		final char[] digits = {
			'0', '1', '2', '3', '4', '5', '6', '7', '8', '9','a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j',
			'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't','u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D',
			'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N','O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
			'Y', 'Z', '#', '$'
		};
		int shift = 6;
		char[] buf = new char[64];
		int charPos = 64;
		int radix = 1 << shift;
		long mask = radix - 1;
		long number = v;
		do {
			buf[--charPos] = digits[(int) (number & mask)];
			number >>>= shift;
		} while (number != 0);
		return new String(buf, charPos, (64 - charPos));
	}
}
