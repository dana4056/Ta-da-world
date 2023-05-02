package com.tada.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.tada.domain.dto.UserRequest;
import com.tada.domain.dto.UserResponse;
import com.tada.domain.entity.Room;
import com.tada.domain.entity.User;
import com.tada.repository.RoomRepository;
import com.tada.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserServiceImpl implements UserService{

	private final UserRepository userRepository;
	private final RoomRepository roomRepository;


	@Override	// 참가자 방 참여
	public Map<String, Long> saveUser(String code, UserRequest userRequest) throws Exception{
		Room room = roomRepository.findByCode(code).orElseThrow(() -> new NoSuchElementException("존재하지 않는 방"));

		try{
			User user = User.builder()
				.deviceId(userRequest.getDeviceId())
				.nick(userRequest.getNick())
				.imgNo(userRequest.getImgNo())
				.room(room)
				.build();

			userRepository.save(user);

			Map<String, Long> response = new HashMap<>();
			response.put("userId", user.getId());
			response.put("roomId", room.getId());

			return response;

		}catch (Exception e){
			throw e;
		}
	}

	@Override	// 참가지 리스트 조회
	public List<UserResponse> readUserList(Long roomId) throws Exception{
		try{
			if(!roomRepository.existsById(roomId)){
				throw new NoSuchElementException("존재하지 않는 방");
			}

			List<User> userList = userRepository.findAllByRoom_Id(roomId);
			List<UserResponse> userDtoList = new ArrayList<>();

			for(User user: userList){
				userDtoList.add(new UserResponse(user));
			}
			return userDtoList;
		}catch (Exception e){
			throw e;
		}
	}
}
