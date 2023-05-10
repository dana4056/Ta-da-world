package com.tada.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
	public void enterUser(Map<String, Object> data) throws Exception{

		try{
			Room room = roomRepository.findById(Long.parseLong(data.get("roomId").toString())).orElseThrow(() -> new NoSuchElementException("존재하지 않는 방"));
			User user = User.builder().id(data.get("userId").toString())
				.nick(data.get("nickname").toString())
				.imgNo(Integer.parseInt(data.get("imgNo").toString()))
				.room(room)
				.build();
			userRepository.save(user);


		} catch ( Exception e){
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

	public boolean checkNickname(String code, String nickname) throws Exception {
		Room room = roomRepository.findByCode(code).orElseThrow(() -> new NoSuchElementException("존재하지 않는 방"));
		try {
			User user = userRepository.findByRoomIdAndNick(room.getId(), nickname);
			if (user == null){
				return false;
			}
			return true;
		} catch (Exception e){
			throw e;
		}
	}
}
