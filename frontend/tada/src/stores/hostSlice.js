import { createSlice } from '@reduxjs/toolkit';

// type sttate = {
// 	hostIdx: number;
// 	roomState: number;
// };

// const initialState : HostState = {
// 	hostIdx: 0,
// 	roomState: 0
// 	// isLoggedIn: false,
// 	// accessToken: null,
// };

const initialState = {
	hostIdx: 0,
	roomState: 0
};

const userSlice = createSlice({
	name: 'hostState',
	initialState,
	reducers: {
		// login(state, action) {
		//   state.isLoggedIn = true
		//   state.accessToken = action.payload
		//   console.log(`store에 토큰 저장 성공!`)
		// },
		// logout(state, action) {
		//   state.isLoggedIn = false
		//   state.accessToken = null
		//   console.log(`로그아웃 성공`)
		// },
		// getHostState(state, action) {
		// 	console.log('호스트 정보 불러오기완료!');
		// },
	},
});

// export const {getHostState} = userSlice.actions;
export default userSlice.reducer;
