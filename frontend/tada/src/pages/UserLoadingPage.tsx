import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';

import UserLoading from '../components/userpregame/UserLoading';

interface GameInfo {
	label: string;
	value: string;
}

const logo = require('../assets/images/logo.png');

const Counts = require('../assets/images/timer.gif');

function UserLoadingPage(): JSX.Element {
	const userState = useSelector((state: RootState) => state.user);
	const [roomInfo, setRoomInfo] = useState<any>([]);

	const getRoomInfo = useApi();

	const navigate = useNavigate();

	useEffect(() => {
		getRoomInfo.fetchGetApi(`/rooms?roomId=${userState.roomId}`);
		const timer = setTimeout(() => {
			// navigate to another page
			navigate('/userplay');
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	useEffect(() => {
		if (getRoomInfo.data?.success) {
			setRoomInfo(getRoomInfo.data.data);
		}
	}, [getRoomInfo.data]);

	return (
		<div className='flex flex-col items-center justify-center h-full space-y-3'>
			<img src={logo} alt='logo' />
			<div className='flex space-x-3'>
				{roomInfo ? (
					<>
						<UserLoading label='참가자' value={roomInfo.playerCnt} />
						<UserLoading label='보물 수' value={roomInfo.treasureCnt} />
						<UserLoading label='시간(분)' value={roomInfo.playTime} />
					</>
				) : (
					''
				)}
			</div>
			<div className='w-56'>
				<img src={Counts} alt='counts' />
			</div>
		</div>
	);
}

export default UserLoadingPage;
