import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import SockJS from 'sockjs-client';
import { Stomp, Frame } from '@stomp/stompjs';
import useApi from '../hooks/useApi';

const baseURL = 'https://ta-da.world/api';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	profileImage: string;
}

// string to number hash
function hashStringToNumber(str: string) {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) + hash + char; /* hash * 33 + char */
	}
	return hash.toString();
}

function UserWaitPage(): JSX.Element {
	const userState = useSelector((state: RootState) => state.user);

	console.log(userState);
	const userId = `${userState.roomId}_${hashStringToNumber(
		userState.nickname
	)}`;
	// console.log(userState);
	const user: User = {
		id: userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		profileImage: String(userState.character),
	};

	// 웹소켓
	const stompConnet = (): void => {
		try {
			const stomp = Stomp.over(() => {
				return new SockJS(`${baseURL}/ws/room`);
			});
			stomp.connect({}, () => {
				console.log('STOMP connected');
				const data = {
					messageType: 'ENTER',
					userId: `${user.id}`,
					roomId: `${user.roomId}`,
					nickname: `${user.nickname}`,
				};
				stomp.send(`${baseURL}/pub/send`, {}, JSON.stringify(data));
				stomp.subscribe(
					`${baseURL}/sub/${userState.roomCode}`,
					(Ms) => {
						const msObj = JSON.parse(Ms.body);
						if (msObj.messageType === 'ENTER') {
							console.log('someone entered');
						} else if (msObj.messageType === 'NOTICE') {
							console.log('someone noticed');
							alert(msObj.message);
						}
						console.log(msObj);
					},
					{}
				);
			});
		} catch (error) {
			console.log(error);
		}
	};

	// 게임 참가 유저 리스트
	const userList = useApi();

	useEffect(() => {
		stompConnet();
		async (): Promise<void> => {
			await userList.fetchGetApi(`/rooms/users?room=${user.roomId}`);
		};
		console.log(userList.data);
	}, []);

	return (
		<div className='w-full h-full bg-white2'>
			{/* 상단 프로필 단 */}
			<div className='flex items-center justify-center pt-12 shadow-lg h-52 bg-main rounded-b-3xl'>
				<div className='flex items-center justify-center rounded-full w-52 h-52 bg-main2/50'>
					<div className='p-5'>
						<video
							autoPlay
							loop
							muted
							className='border-4 border-white rounded-full'
							src={require(`../assets/images/avatar${user.profileImage}.mp4`)}
						></video>
						<div className='flex items-center justify-center w-auto h-12 mt-5 text-lg font-semibold text-white border-2 rounded-full shadow-lg bg-gradient-to-r from-blue to-blue2'>
							<p>{user.nickname}</p>
						</div>
					</div>
				</div>
			</div>
			<div className='px-2 mt-4 space-y-2 overflow-auto h-80'>
				{/* {members.map((member) => (
						<div
							className='flex items-center h-16 pl-3 font-bold bg-white shadow-lg text- rounded-2xl text-main w-ful'
							key={member.id}
							/>
							<p>{member.name}</p>
						</div>
					))} */}
			</div>
		</div>
	);
}

export default UserWaitPage;
