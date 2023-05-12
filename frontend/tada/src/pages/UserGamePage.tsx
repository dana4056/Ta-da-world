import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import GameMap from '../components/usergame/GameMap';
import { useNavigate } from 'react-router-dom';
import GameHeader from '../components/usergame/GameHeader';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
// import TestMap from '../components/user/TestMap';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	profileImage: string;
}

const baseURL = 'https://ta-da.world/api';

function UserGamePage(): JSX.Element {
	const navigate = useNavigate();

	const stompRef = useRef<any>(null);

	const [foundTreasure, setFoundTreasure] = useState<number>(0);

	const userState = useSelector((state: RootState) => state.user);

	const user: User = {
		id: userState.userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		profileImage: String(userState.character),
	};

	useEffect(() => {
		if (!stompRef.current) {
			stompConnect();
		}
	}, []);

	// 웹소켓
	const stompConnect = () => {
		try {
			const stomp = Stomp.over(() => {
				return new SockJS(`${baseURL}/ws/room`);
			});
			stomp.connect({}, () => {
				console.log('STOMP connected');
				// const data = {
				// 	messageType: 'ENTER',
				// 	userId: `${user.id}`,
				// 	roomId: `${user.roomId}`,
				// 	nickname: `${user.nickname}`,
				// 	imgNo: `${user.profileImage}`,
				// };
				// console.log('socket : send data : ', data);
				// stomp.send('/pub/send', {}, JSON.stringify(data));
				stomp.subscribe(
					`/sub/${user.roomId}`,
					(Ms) => {
						const msObj = JSON.parse(Ms.body);
						// enter, notice, end, start, find
						if (msObj.messageType === 'ENTER') {
							console.log('someone entered');
						} else if (msObj.messageType === 'NOTICE') {
							console.log('someone noticed');
							alert(msObj.context);
						} else if (msObj.messageType === 'END') {
							console.log('game ended');
							stompDisconnect();
							navigate('/userend');
							// 결과 페이지로 이동
						} else if (msObj.messageType === 'START') {
							console.log('game started');
						} else if (msObj.messageType === 'FIND') {
							console.log('find treasure');
							setFoundTreasure(foundTreasure + 1);
							// 보물 리스트 갱신
						}
						console.log('msObj : ', msObj);
					},
					{}
				);
			});
			stompRef.current = stomp;
		} catch (error) {
			console.log('socket error : ', error);
		}
	};

	//웹소켓 연결 끊기
	const stompDisconnect = (): void => {
		try {
			console.log('나간다');
			stompRef.current.disconnect(
				() => {
					console.log('STOMP connection closed');
				},
				{
					subscriptionId: `/sub/${user.roomId}`,
				}
			);
		} catch (error) {
			console.log('socket closed error : ', error);
		}
	};

	return (
		<>
			<GameHeader foundTreasure={foundTreasure} />
			<GameMap />
			{/* <TestMap /> */}
		</>
	);
}

export default UserGamePage;
