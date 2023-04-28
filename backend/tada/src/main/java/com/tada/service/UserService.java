package com.tada.service;

import java.util.List;
import java.util.Map;

import com.tada.domain.dto.UserRequest;
import com.tada.domain.dto.UserResponse;

public interface UserService {
	Map<String, Long> saveUser(String code, UserRequest userRequest);

	List<UserResponse> readUserList(Long roomId);
}
