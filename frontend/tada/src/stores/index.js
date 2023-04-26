import { configureStore } from '@reduxjs/toolkit';
import hostSlice from './hostSlice';

const store = configureStore({
	reducer: {
		hostState: hostSlice,
	},
});

export default store;