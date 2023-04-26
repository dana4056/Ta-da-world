package com.tada.domain;
/*
	0	방없음 - 방이 아예 없는 상태 (새로 방 생성 가능한 상태)
	1	방 생성 및 수정 - 방을 생성하고 정보를 수정하고 있는 상태로 대기방 가기전
	2	대기방 - 게임을 시작하기 전 상태
	3	게임중 - 게임을 하고 있는 상태로 게임 현황을 볼 수 있음
	4	게임 종료 - 게임이 종료되고 게임 결과창이 보이는 상태
	5	방 닫힘 - 게임 결과 확인 후 방이 비활성화되는 상태
*/

public enum RoomStatus {
	NOT_EXIST(0),
	CREATED(1),
	WAITING(2),
	PLAYING(3),
	RESULT(4),
	CLOSED(5);
	private final int code;
	RoomStatus(int code) {
		this.code = code;
	}
	public int getCode() {
		return code;
	}
}
