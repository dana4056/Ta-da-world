const ENTER_ROOM = 'user/ENTER_ROOM' as const;
const ENTER_NICKNAME = 'user/ENTER_NICKNAME' as const;
const ENTER_CHARACTER = 'user/ENTER_CHARACTER ' as const;
const ENTER_GAMING = 'game/ENTER_GAMING' as const;
const FIND_TREASURE = 'user/FIND_TREASURE' as const;
const UPDATE_TREASURE = 'game/UPDATE_TREASURE' as const;

export const enterRoom = (roomCode: string, roomId: number) => ({
	type: ENTER_ROOM,
	payload: { roomCode, roomId },
});

export const enterNickname = (nickname: string, userId: string) => ({
	type: ENTER_NICKNAME,
	payload: { nickname, userId },
});

export const enterCharacter = (character: number) => ({
	type: ENTER_CHARACTER,
	payload: character,
});

export const enterGaming = (
	gamePlayTime: number,
	gameStartTime: string,
	treasureNumber: number
) => ({
	type: ENTER_GAMING,
	payload: { gamePlayTime, gameStartTime, treasureNumber },
});

export const findTreasure = () => ({
	type: FIND_TREASURE
});

export const updateTreasure = (treasures: TreasureInfo[]) => ({
	type: UPDATE_TREASURE,
	payload: treasures
});

type UserAction =
	| ReturnType<typeof enterRoom>
	| ReturnType<typeof enterNickname>
	| ReturnType<typeof enterCharacter>
	| ReturnType<typeof enterGaming>
	| ReturnType<typeof findTreasure>
	| ReturnType<typeof updateTreasure>

type UserState = {
	nickname: string;
	character: number;
	roomCode: string;
	userId: string;
	roomId: number;
	gamePlayTime: number;
	gameStartTime: string;
	treasureNumber: number;
	foundTreasure: number;
	treasures: TreasureInfo[] | null
};

type TreasureInfo = {
	id: number;
	imgPath: string;
	lat: string;
	lng: string;
	hint: string;
	rewardImgPath: string;
	reward: string;
	status: boolean;
	finderNick: string | null;
}

const initialState: UserState = {
	nickname: '',
	character: 0,
	roomCode: '',
	userId: '',
	roomId: 0,
	gamePlayTime: 0,
	gameStartTime: '',
	treasureNumber: 0,
	foundTreasure: 0,
	treasures: null
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
			nickname: action.payload.nickname,
			userId: action.payload.userId,
		};
	case ENTER_CHARACTER:
		return {
			...state,
			character: action.payload,
		};
	case ENTER_GAMING:
		return {
			...state,
			gamePlayTime: action.payload.gamePlayTime,
			gameStartTime: action.payload.gameStartTime,
			treasureNumber: action.payload.treasureNumber,
		};
	case FIND_TREASURE:
		return {
			...state,
			foundTreasure: state.foundTreasure + 1
		};
	case UPDATE_TREASURE:
		return {
			...state,
			treasures: action.payload
		};
	default:
		return state;
	}
}

export default user;
