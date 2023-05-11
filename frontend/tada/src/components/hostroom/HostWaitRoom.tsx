import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { change } from '../../stores/host';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Swal from 'sweetalert2';

import BoxHeader from '../common/HeaderBox';
import Title from '../common/Title';
import { Button } from '../../util/Semantics';
import {UserListItem} from '../../util/Interface';
import useApi from '../../hooks/useApi';

const baseURL = 'https://ta-da.world/api';

function HostWaitRoom() : JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const title = useSelector((state: RootState) => state.game.name);
	const code = useSelector((state: RootState) => state.host.code);
	const roomId = useSelector((state: RootState) => state.game.roomId);
	const [userList, setUserList] = useState<UserListItem[]>([]);
	const [notice, setNotice] = useState<string>('');
	const roomStatusApi = useApi(); //방 상태 조회
	const startApi = useApi(); //방 상태 변경
	const userListAPi = useApi(); //게임 참가 유저
	// const [message, setMessage] = useState<string>('');
	
	// 게임 참가 유저 리스트
	useEffect(() => {
		stompConnect();
		userListAPi.fetchNotBodyApiWithToken('GET', '/users');
	}, []);

	useEffect(() => {
		if(userListAPi.data?.success){
			setUserList(userListAPi.data.data);
		}
	}, [userListAPi.data]);

	useEffect(() => {
		console.log(startApi.data);
		if(startApi.data?.success){
			console.log('여길왜옴?');
			roomStatusApi.fetchNotBodyApiWithToken('GET', '/rooms/host/status');
		} else if(startApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시작 실패!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [startApi.data]);

	useEffect(() => {
		if(roomStatusApi.data?.success && roomStatusApi.data.data.status === 3){
			dispatch(change(3));
		} else if(roomStatusApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시작 실패!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [roomStatusApi.data]);

	const startGame = () : void => {
		Swal.fire({
			text: '게임을 시작 하시겠습니까?',
			width: 300,
			showCancelButton: true,
			iconColor: '#2BDCDB ',
			confirmButtonColor: '#2BDCDB ',
			confirmButtonText: '시작',
			cancelButtonText: '취소'
		}).then(function(e){
			if(e.isConfirmed === true) {
				//방 변경
				startApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 3});
			}
		});
	};

	const stompConnect = () => {
		try {
			const stomp = Stomp.over(() => {
				return new SockJS(`${baseURL}/ws/room`);
			});
			stomp.connect({}, () => {
				console.log('STOMP connected');
				stomp.subscribe(
					`/sub/${roomId}`,
					(Ms) => {
						const msObj = JSON.parse(Ms.body);
						console.log('Ms ', Ms);
						// enter, notice, end, start, find
						if (msObj.messageType === 'ENTER') {
							setUserList([{
								id: msObj.userId,
								imgNo:msObj.imgNo,
								nick:msObj.nickname
							}].concat(userList));
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
					},
					{}
				);
			});
		} catch (error) {
			console.log('socket error : ', error);
		}
	};

	  //일반 채팅 보낼때
	  const SendMessage = () => {
		// stomp.debug = null;
		const data = {
		  messageType: 'NOTICE',
		  message: notice
		};
		// if (stompRef.current?.connected) {
		//   console.log(stompRef.current.connected);
		//   stompRef.current.send('/pub/send', {}, JSON.stringify(data));
		// } else {
		//   console.log(stompRef.current.connected);
		//   console.log('STOMP connection is not open');
		// }
	  };

	return (
		<div className="flex flex-col items-center">
			<Title title={title} subTitle={'게임 입장 코드: '+ code}></Title>
			<div className='w-full flex flex-col items-center bg-white2 px-2 pt-4 pb-16 mt-2 rounded-t-2xl space-y-2 overflow-y-scroll'>
				<BoxHeader total={0} num={userList.length} title='참가자 수'/>
				{userList.length ?
					userList.map((user, index) => (
						<div
							className='w-5/6 flex items-center h-16 px-2 font-bold bg-white shadow-lg rounded-2xl text-main'
							key={index}
						>
							<img
								className='w-10 h-10 mr-3'
								src={require(`../../assets/images/avatar${user.imgNo}.jpg`)}
							/>
							<p>{user.nick}</p>
						</div>
					))
					: <div>참가자를 기다려봐요!</div>
				}
			</div>
			<Button className='w-4/5 max-w-xs fixed bottom-3 shadow-lg' onClick={startGame}>게임시작</Button>
			<div className='fixed w-full bottom-0 h-2/3 -z-10 bg-white2'/>
		</div>
	);
}
  
export default HostWaitRoom;
