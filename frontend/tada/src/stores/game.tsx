const SET = 'game/SET' as const;
const RESET = 'game/RESET' as const;

export const set = (gametData: GameState) => ({
	type: SET,
	payload: gametData,
});

export const reset = () => ({
	type: RESET,
});

type GameAction =
	| ReturnType<typeof set>
	| ReturnType<typeof reset>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type GameState = {
	name: string;
	playTime:string;
	startTime:string;
	roomId:string;
};

// 초기상태를 선언합니다.
const initialState: GameState = {
	name: '',
	playTime: '',
	startTime:'',
	roomId:''
};

function game(state: GameState = initialState, action: GameAction): GameState {
	switch (action.type) {
	case SET:
		return { name: action.payload.name, playTime: action.payload.playTime, startTime:action.payload.startTime, roomId:action.payload.roomId};
	case RESET:
		return { name: '', playTime: '' , startTime: '', roomId:''};
	default:
		return state;
	}
}

export default game;
