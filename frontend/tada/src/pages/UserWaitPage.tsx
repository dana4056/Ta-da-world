import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import SockJS from 'sockjs-client';
import { Stomp, Frame } from '@stomp/stompjs';

const baseURL = 'https://ta-da.world/api';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	profileImage: string;
}

const userProfile = require('../assets/images/dummy_userprofile.png');

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
	const stompConnet = () => {
		try {
			const stomp = Stomp.over(function () {
				return new SockJS(`${baseURL}/ws/room`);
			});
			stomp.connect({}, (message: Frame) => {
				console.log('STOMP connected');
				const data = {
					messageType: 'ENTER',
					userId: `${user.id}`,
					roomId: `${user.roomId}`,
					nickname: `${user.nickname}`,
				};
				stomp.send('/pub/send', {}, JSON.stringify(data));
				stomp.subscribe(
					`/sub/${userState.roomCode}`,
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
	useEffect(() => {
		stompConnet();
	}, []);

	// const members: User[] = [
	// 	{ id: 2, name: '친구없는한원석', profileImage: userProfile },
	// 	{ id: 3, name: '기침하는한원석', profileImage: userProfile },
	// 	{ id: 4, name: '재채기쟁이한원석', profileImage: userProfile },
	// 	{ id: 5, name: '친구없는한원석', profileImage: userProfile },
	// 	{ id: 6, name: '기침하는한원석', profileImage: userProfile },
	// 	{ id: 7, name: '재채기쟁이한원석', profileImage: userProfile },
	// ];

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
