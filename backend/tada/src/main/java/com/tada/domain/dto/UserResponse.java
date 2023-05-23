package com.tada.domain.dto;

import com.tada.domain.entity.Room;
import com.tada.domain.entity.User;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class UserResponse {

	private String id;
	private String nick;
	private int imgNo;

	public UserResponse(User user){
		this.id = user.getId();
		this.nick = user.getNick();
		this.imgNo = user.getImgNo();
	}
}