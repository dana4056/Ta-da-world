// LoginUserComponent.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { enterRoom } from '../../stores/user';
import useApi from '../../hooks/useApi';
import Semantics from '../../util/Semantics';
import styles from '../../assets/css/LoginUserComponent.module.css';

const {CustomInput, CustomButton} = Semantics;

interface LoginUserProps {
	onHostClick: () => void;
}

const LoginUserComponent: React.FC<LoginUserProps> = ({ onHostClick }) => {
	const dispatch = useDispatch();
	const [roomCode, setRoomCode] = useState<string>('');
	const [isError, setIsError] = useState<boolean>(false);
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
			} else {
				console.log(roomState);
			}
		}
	}, [roomState.data]);


	return (
		<>
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<CustomInput
					type='text'
					placeholder='참여코드를 입력하세요!'
					value={roomCode}
					onChange={(e) =>{
						setIsError(false);
						 setRoomCode(e.target.value);
					}}
					valid={!isError}
				/>
				<CustomButton
					onClick={moveName}
					valid={!isError}
					className={!isError === false ? `${styles.shake}` : 'from-blue to-blue2'}
				>
					{isError ? '잘못된 입장 코드입니다.':'입장' }
				</CustomButton>
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
};

export default LoginUserComponent;
