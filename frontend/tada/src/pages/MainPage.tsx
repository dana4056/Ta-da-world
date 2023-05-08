import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { enterRoom } from '../stores/user';
import useApi from '../hooks/useApi';

const logo = require('../assets/images/logo.png');
const kakao_login = require('../assets/images/kakao_login.png');

function MainPage(): JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const ishost = useSelector((state: RootState) => state.host.refreshToken);
	const [roomCode, setRoomCode] = useState<string>('');

	const roomState = useApi();

	const [activeComponent, setActiveComponent] = useState<'User' | 'Host'>(
		'User'
	);

	const handleClick = (): void => {
		setActiveComponent((defaultComponent) =>
			defaultComponent === 'User' ? 'Host' : 'User'
		);
	};

	const API_KEY_KAKAO = process.env.REACT_APP_API_KEY_KAKAO;
	// const API_KEY_KAKAO = '2abf0e7d3c124964d0048b430a5ce52c';
	const REDIRECT_URI_SITE = process.env.REACT_APP_REDIRECT_URI;
	// const REDIRECT_URI_SITE = 'http://localhost:3000/users/oauth2-';
	const OAUTH_KAKAO = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY_KAKAO}&redirect_uri=${
		REDIRECT_URI_SITE + 'kakao'
	}&response_type=code`;

	useEffect(() => {
		if (ishost) {
			navigate('/hosthome');
		}
	});

	const moveName = async (): Promise<void> => {
		// roomCode 유효성 검사
		await roomState.fetchGetApi(`/rooms/check?code=${roomCode}`);
	};
	useEffect(() => {
		if (roomState.data) {
			if (roomState.data.message === 'Success') {
				// console.log(roomState.data);
				dispatch(enterRoom(roomCode));
				navigate('/username');
			} else if (roomState.data.message === 'not exist') {
				console.log('fuck you');
				// not exist일 때 처리
			} else {
				console.log(roomState);
			}
		}
	}, [roomState.data]);

	const LoginUser = (): JSX.Element => (
		<>
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<input
					className='h-10 px-4 mb-5 border shadow-lg placeholder:text-sm placeholder:text-gray2 text-gray5 w-60 rounded-xl border-gray2'
					type='text'
					placeholder='참여코드를 입력하세요!'
					value={roomCode}
					onChange={(e) => setRoomCode(e.target.value)}
				/>
				<button
					onClick={moveName}
					className='h-10 font-semibold text-white shadow-lg rounded-xl w-60 bg-gradient-to-r from-blue to-blue2'
				>
					입장
				</button>
			</div>
			<button
				type='button'
				onClick={handleClick}
				className='text-sm text-white border-b'
			>
				<p>{'>'} 호스트는 이쪽으로 입장해주세요</p>
			</button>
		</>
	);

	const LoginHost = (): JSX.Element => (
		<div className='flex flex-col items-center justify-center'>
			<a href={OAUTH_KAKAO}>
				<img src={kakao_login} alt='' className='w-72' />
			</a>
			<button
				type='button'
				onClick={handleClick}
				className='text-sm text-white border-b'
			>
				<p className='mt-10'>{'>'} 참가자는 이쪽으로 입장해주세요</p>
			</button>
		</div>
	);

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='mb-5' src={logo} alt='logo' />
			{activeComponent === 'User' ? <LoginUser /> : <LoginHost />}
		</div>
	);
}

export default MainPage;
