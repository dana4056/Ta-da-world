import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const baseURL = 'https://ta-da.world/api';

// 웹소켓
// const stompConnet = () => {
// 	try {
// 		const stomp = Stomp.over(function () {
// 			return new SockJS(`${baseURL}/ws/room`);
// 		});
// 		stomp.connect({}, (message) => {
// 			console.log('STOMP connected');
// 			const data = {
// 				messageType: 'ENTER',
// 				userId:
// 			}
// 		})
// 	}
// }

interface User {
	id: number;
	name: string;
	profileImage: string;
}

const userProfile = require('../assets/images/dummy_userprofile.png');

function UserWaitPage(): JSX.Element {
	const userState = useSelector((state: RootState) => state.user);

	console.log(userState);
	const user: User = {
		id: 1,
		name: '친구많은한원석',
		profileImage: userProfile,
	};

	const members: User[] = [
		{ id: 2, name: '친구없는한원석', profileImage: userProfile },
		{ id: 3, name: '기침하는한원석', profileImage: userProfile },
		{ id: 4, name: '재채기쟁이한원석', profileImage: userProfile },
		{ id: 5, name: '친구없는한원석', profileImage: userProfile },
		{ id: 6, name: '기침하는한원석', profileImage: userProfile },
		{ id: 7, name: '재채기쟁이한원석', profileImage: userProfile },
	];

	return (
		<div className='w-full h-full bg-white2'>
			{/* 상단 프로필 단 */}
			<div className='flex items-center justify-center shadow-lg h-52 bg-main rounded-b-3xl'>
				<div className='flex items-center justify-center rounded-full w-52 h-52 bg-main2/50'>
					<div className='w-40 h-40 rounded-full bg-main3/50'>
						<img className='' src={user.profileImage} alt='pic' />
						<div className='flex items-center justify-center w-40 h-12 text-lg font-semibold text-white rounded-full shadow-lg bg-gradient-to-r from-blue to-blue2'>
							<p>{user.name}</p>
						</div>
					</div>
				</div>
			</div>
			<div className='p-8'>
				<div className='flex items-center'>
					<p className='mr-3 font-semibold text-gray4'>현재 참가자</p>
					<p className='px-2 py-1 font-semibold text-center text-white border-white rounded-lg bg-gradient-to-r from-orange to-orange2'>
						13
					</p>
				</div>
				<div className='px-2 mt-4 space-y-2 overflow-auto h-80'>
					{members.map((member) => (
						<div
							className='flex items-center h-16 pl-3 font-bold bg-white shadow-lg text- rounded-2xl text-main w-ful'
							key={member.id}
						>
							<img
								className='w-10 h-10 mr-3'
								src={member.profileImage}
								alt=''
							/>
							<p>{member.name}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}

export default UserWaitPage;
