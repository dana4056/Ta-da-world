import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../stores';
import UserProfile from '../components/user/UserProfile';
import UserList from '../components/user/UserList';
import useApi from '../hooks/useApi';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

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
	const navigate = useNavigate();
	// 유저 정보
	const userState = useSelector((state: RootState) => state.user);

	const [userList, setUserList] = useState<UserListItem[]>([]);

	const userListApi = useApi();

	const user: User = {
		id: userState.userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		profileImage: String(userState.character),
	};

	useEffect(() => {
		stompConnect();
		userListApi.fetchGetApi(`/users?roomId=${user.roomId}`);
	}, []);

	useEffect(() => {
		if (userListApi.data?.success) {
			setUserList(userListApi.data.data);
		}
	}, [userListApi.data]);

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
							console.log('someone entered');
							setUserList((prevUserList) => [
								{
									id: msObj.userId,
									imgNo: msObj.imgNo,
									nick: msObj.nickname,
								},
								...prevUserList,
							]);
						} else if (msObj.messageType === 'NOTICE') {
							console.log('someone noticed');
							alert(msObj.message);
						} else if (msObj.messageType === 'END') {
							console.log('game ended');
						} else if (msObj.messageType === 'START') {
							console.log('game started');
							navigate('/userloading');
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

	return (
		<div className='w-full h-full bg-white2'>
			<UserProfile user={user} />
			{userList.length ? (
				<UserList users={userList} />
			) : (
				'아직 다른 참가자가 없습니다!'
			)}
		</div>
	);
}

export default UserWaitPage;
