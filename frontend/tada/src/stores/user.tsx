const ENTER_ROOM = 'user/ENTER_ROOM' as const;
const ENTER_NICKNAME = 'user/ENTER_NICKNAME' as const;
const ENTER_CHARACTER = 'user/ENTER_CHARACTER ' as const;

export const enterRoom = (roomCode: string, roomId: number) => ({
	type: ENTER_ROOM,
	payload: {roomCode, roomId},
});
export const enterNickname = (nickname: string) => ({
	type: ENTER_NICKNAME,
	payload: nickname,
});
export const enterCharacter = (character: number) => ({
	type: ENTER_CHARACTER,
	payload: character,
});

type UserAction =
	| ReturnType<typeof enterRoom>
	| ReturnType<typeof enterNickname>
	| ReturnType<typeof enterCharacter>;

type UserState = {
	nickname: string;
	character: number;
	roomCode: string;
	roomId: number;
};

const initialState: UserState = {
	nickname: '',
	character: 0,
	roomCode: '',
	roomId: 0,
};

function user(state: UserState = initialState, action: UserAction): UserState {
	switch (action.type) {
	case ENTER_ROOM:
		return {
			...state,
			roomCode: action.payload.roomCode,
			roomId: action.payload.roomId,
		};
	case ENTER_NICKNAME:
		return {
			...state,
			nickname: action.payload,
		};
	case ENTER_CHARACTER:
		return {
			...state,
			character: action.payload,
		};
	default:
		return state;
	}
}

export default user;
