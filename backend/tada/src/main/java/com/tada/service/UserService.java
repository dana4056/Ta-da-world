package com.tada.service;

import java.util.List;
import java.util.Map;

import com.tada.domain.dto.UserRequest;
import com.tada.domain.dto.UserResponse;

public interface UserService {

	// 참가자 방 참여
	void enterUser(Map<String, Object> data) throws Exception;


	List<UserResponse> readUserList(Long roomId) throws Exception;

	boolean checkNickname(String code, String nickname) throws Exception;
}
