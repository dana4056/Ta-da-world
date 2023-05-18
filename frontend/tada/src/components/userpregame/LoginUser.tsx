// LoginUserComponent.tsx
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { enterRoom } from '../../stores/user';
import useApi from '../../hooks/useApi';
import styles from '../../assets/css/LoginUserComponent.module.css';

interface LoginUserProps {
	onHostClick: () => void;
}

function LoginUser({ onHostClick }: LoginUserProps): JSX.Element {
	const dispatch = useDispatch();
	const location : any = useLocation();
	const searchParams = new URLSearchParams(location.search);
	const code = searchParams.get('code');
	const [roomCode, setRoomCode] =  useState(code || '');
	const [isError, setIsError] = useState<boolean>(false);
	const [roomExisted, setRoomExisted] = useState<boolean>(false);
	const roomState = useApi();

	const navigate = useNavigate();

	const moveName = async (): Promise<void> => {
		await roomState.fetchGetApi(`/rooms/check?code=${roomCode}`);
	};
	

	useEffect(() => {
		if (roomState.data) {
			if (roomState.data.message === 'Success') {
				// ekotQrpTA
				dispatch(enterRoom(roomCode, roomState.data.data.id));
				navigate('/username');
			} else if (roomState.data.message === 'not exist') {
				setIsError(true);
				console.log('not exist');
			} else if (roomState.data.message === 'started') {
				setRoomExisted(true);
				console.log('already started');
			} else {
				console.log(roomState);
			}
		}
	}, [roomState.data]);

	return (
		<>
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<input
					type='text'
					placeholder='참여코드를 입력하세요!'
					value={roomCode}
					onChange={(e) => {
						setIsError(false);
						setRoomCode(e.target.value);
					}}
					className={`h-10 px-4 mb-5 border shadow-lg placeholder:text-sm placeholder:text-gray2 text-gray5 w-60 rounded-xl ${
						isError || roomExisted ? 'border-2 border-red' : 'border-gray2'
					}`}
				/>
				<button
					onClick={moveName}
					className={`h-10 text-white shadow-lg rounded-xl w-60 ${
						isError || roomExisted
							? `${styles.shake} bg-red text-sm`
							: 'from-blue to-blue2 bg-gradient-to-r font-semibold'
					}`}
				>
					{isError
						? '잘못된 입장 코드입니다.'
						: roomExisted
							? '이미 시작한 방입니다'
							: '입장'}
				</button>
			</div>
			<button
				type='button'
				onClick={onHostClick}
				className='text-sm text-white border-b'
			>
				<p>{'>'} 호스트는 이쪽으로 입장해주세요</p>
			</button>
		</>
	);
}

export default LoginUser;
