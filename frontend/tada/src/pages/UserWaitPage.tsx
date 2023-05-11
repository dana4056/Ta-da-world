import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import UserProfile from '../components/user/UserProfile';
import UserList from '../components/user/UserList';
import useApi from '../hooks/useApi';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
// import useStomp from '../hooks/useStomp';

// string to number hash
function hashStringToNumber(str: string) {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) + hash + char; /* hash * 33 + char */
	}
	return hash.toString();
}
interface User {
	id: string;
	roomId: number;
	nickname: string;
	profileImage: string;
}
interface UserListItem {
	id: string;
	nick: string;
	imgNo: number;
}

const baseURL = 'https://ta-da.world/api';

function UserWaitPage(): JSX.Element {
	// 유저 정보
	const userState = useSelector((state: RootState) => state.user);

	const userId = `${userState.roomId}_${hashStringToNumber(
		userState.nickname
	)}`;

	const user: User = {
		id: userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		profileImage: String(userState.character),
	};

	// 웹소켓
	const stompConnect = () => {
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
					imgNo: `${user.profileImage}`,
				};
				console.log('socket : send data : ', data);
				stomp.send('/pub/send', {}, JSON.stringify(data));
				stomp.subscribe(
					`/sub/${user.roomId}`,
					(Ms) => {
						const msObj = JSON.parse(Ms.body);
						// enter, notice, end, start, find
						if (msObj.messageType === 'ENTER') {
							fetchUserList();
							console.log('someone entered');
						} else if (msObj.messageType === 'NOTICE') {
							console.log('someone noticed');
							alert(msObj.message);
						} else if (msObj.messageType === 'END') {
							console.log('game ended');
						} else if (msObj.messageType === 'START') {
							console.log('game started');
						} else if (msObj.messageType === 'FIND') {
							console.log('find treasure');
						}
						console.log('msObj : ', msObj);
					},
					{}
				);
			});
		} catch (error) {
			console.log('socket error : ', error);
		}
	};

	// 게임 참가 유저 리스트
	const userList = useApi();
	const { data, error, fetchGetApi } = userList;
	const [userListData, setUserListData] = useState<UserListItem[] | null>(null);

	const fetchUserList = async () => {
		await fetchGetApi(`/users?room=${user.roomId}`);
		setUserListData(userList.data.data);
		console.log('userlist data: ', userListData);
		// console.log('userlist data: ', userList.data);
		// if (userList.data && userList.data.data) {
		// 	console.log('userList : ', userList.data.data);
		// 	setUserListData(userList.data.data);
		// } else {
		// 	console.log('userList is null');
		// }
	};

	// useEffect(() => {
	// 	stompConnect();
	// }, [userListData]);

	// useEffect(() => {
	// 	stompConnect();
	// }, [userList.data]);

	useEffect(() => {
		fetchUserList();
		// fetchGetApi(`/users?room=${user.roomId}`);
	}, []);

	return (
		<div className='w-full h-full bg-white2'>
			<UserProfile user={user} />
			<UserList users={userListData} />
			{/* <UserList users={data} /> */}
		</div>
	);
}

export default UserWaitPage;
