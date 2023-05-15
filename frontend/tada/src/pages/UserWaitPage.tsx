import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../stores';
import UserProfile from '../components/userpregame/UserProfile';
import UserList from '../components/userpregame/UserList';
import useApi from '../hooks/useApi';
import useCurrentLocation from '../hooks/useCurrentLocation';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Swal from 'sweetalert2';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	// profileImage: string;
	profileImage: number;
}

interface UserListItem {
	id: string;
	nick: string;
	imgNo: number;
}

const baseURL = 'https://ta-da.world/api';

function UserWaitPage(): JSX.Element {
	const stompRef = useRef<any>(null);
	const navigate = useNavigate();
	const location = useCurrentLocation();
	const [ms, setMs] = useState<any>();
	const [cnt, setCnt] = useState<number>(0);
	const [userList, setUserList] = useState<UserListItem[]>([]);
	const userState = useSelector((state: RootState) => state.user);
	const userListApi = useApi();

	const user: User = {
		id: userState.userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		// profileImage: String(userState.character),
		profileImage: userState.character,
	};

	useEffect(() => {
		userListApi.fetchGetApi(`/users?roomId=${user.roomId}`);
		if (!stompRef.current) {
			stompConnect();
		}
	}, [cnt]);

	useEffect(() => {
		if (userListApi.data?.success) {
			setUserList(userListApi.data.data);
		}
	}, [userListApi.data]);

	useEffect(() => {
		if (ms) {
			// enter, notice, end, start, find
			if (ms.messageType === 'ENTER') {
				console.log('someone entered');
				setCnt(cnt + 1);
			} else if (ms.messageType === 'NOTICE') {
				console.log('someone noticed');
				Swal.fire({
					text: ms.context,
					confirmButtonColor: '#2BDCDB',
					confirmButtonText: '확인',
				});
			} else if (ms.messageType === 'END') {
				console.log('game ended');
			} else if (ms.messageType === 'START') {
				console.log('game started');
				stompDisconnect();
				navigate('/userloading');
			} else if (ms.messageType === 'FIND') {
				console.log('find treasure');
			}
		}
	}, [ms]);

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
				console.log('socket: send data: ', data);
				stomp.send('/pub/send', {}, JSON.stringify(data));
				stomp.subscribe(
					`/sub/${user.roomId}`,
					(Ms) => {
						const msObj = JSON.parse(Ms.body);
						setMs(msObj);
						console.log('msObj : ', msObj);
					},
					{}
				);
			});
			stompRef.current = stomp;
		} catch (error) {
			console.log('socket error: ', error);
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
			console.log('socket closed error: ', error);
		}
	};

	useEffect(() => {
		if (!userState.roomCode) {
			navigate('/');
		} else if (!userState.nickname) {
			navigate('/username');
		} else if (!userState.character) {
			navigate('/usercharacter');
		}
	}, []);

	useEffect(() => {
		console.log('GET LOCATION ACCESS');
		location.getCurrentLocation();
	}, []);

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
