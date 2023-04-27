const CHANGE = 'host/CHANGE' as const;

// 액션 생성함수를 선언합니다
export const change = ( inState: number) => ({
	type: CHANGE,
	payload: inState
});

type HostAction =
  | ReturnType<typeof change>;

// 이 리덕스 모듈에서 관리 할 상태의 타입을 선언합니다
type HostState = {
  roomState: number;
};

// 초기상태를 선언합니다.
const initialState: HostState = {
	roomState: 1
};

// 리듀서를 작성합니다.
function host(
	state: HostState = initialState,
	action: HostAction
): HostState {
	switch (action.type) {
	case CHANGE:
		return { roomState: action.payload };
	default:
		return state;
	}
}

export default host;