package com.tada.service;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import com.tada.domain.RoomStatus;
import com.tada.domain.entity.Host;
import com.tada.domain.entity.Room;
import com.tada.repository.RoomRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class RoomServiceImpl implements RoomService{
	private final RoomRepository roomRepository;

	@Override
	public void createRoom(Authentication authentication) {
		Host host = (Host)authentication.getPrincipal();

		// 이미 방 생성했는지 확인
		if(!roomRepository.existsByHost_IdAAndStatusLessThan(host.getId(), RoomStatus.CLOSED.getCode())){
			long now =  System.nanoTime();
			String code = longToBase64(now);

			Room room = Room.builder().host(host).code(code).status(RoomStatus.CREATED.getCode()).build();
			roomRepository.save(room);
		}else{	// 이미 닫히지 않은 생성된 방 존재
			// 예외처리
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
