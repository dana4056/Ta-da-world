import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage for web
import host from './host';
import user from './user';
import watch from './watch';

const rootReducer = combineReducers({
	host,
	user,
	watch
});

const persistConfig = {
	key: 'root',
	storage,
	whiteList: ['host'], // Whitelist only the 'host' state
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 루트 리듀서를 내보내주세요.
export default persistedReducer;

// 루트 리듀서의 반환값를 유추해줍니다
// 추후 이 타입을 컨테이너 컴포넌트에서 불러와서 사용해야 하므로 내보내줍니다.
export type RootState = ReturnType<typeof rootReducer>;
