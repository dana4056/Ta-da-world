import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { change } from '../../stores/host';
import { changeTreasure } from '../../stores/watch';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Swal from 'sweetalert2';
import { GoMegaphone } from 'react-icons/go';
import { UserListItem } from '../../utils/Interfaces';
import { Button } from '../../utils/Semantics';
import BoxHeader from '../common/HeaderBox';
import Title from '../common/Title';
import NoticeModal from './common/NoticeModal';
import useApi from '../../hooks/useApi';

const baseURL = 'https://ta-da.world/api';

function HostWaitRoom(): JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const title = useSelector((state: RootState) => state.game.name);
	const code = useSelector((state: RootState) => state.host.code);
	const roomId = useSelector((state: RootState) => state.game.roomId);
	const stompRef = useRef<any>(null);
	const [userList, setUserList] = useState<UserListItem[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const startApi = useApi(); //방 상태 변경
	const userListAPi = useApi(); //게임 참가 유저
	
	// 게임 참가 유저 리스트
	useEffect(() => {
		userListAPi.fetchNotBodyApiWithToken('GET', '/users');
		if (!stompRef.current) {
			stompConnect();
		}
		// return () => {
		// 	if (stompRef.current?.connected) {
		// 	  stompDisconnect();
		// 	}
		// };
	}, []);

	useEffect(() => {
		if(userListAPi.data?.success){
			setUserList(userListAPi.data.data);
		}
	}, [userListAPi.data]);

	//게임 시작 성공
	useEffect(() => {
		console.log(startApi.data);
		if(startApi.data?.success){
			dispatch(change(3));
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

	const startGame = (): void => {
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
				//게임 시작
				startApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 3});
			}
		});
	};

	//웹소켓 연결
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
						if (msObj.messageType === 'ENTER') {
							setUserList([{
								id: msObj.userId,
								imgNo:msObj.imgNo,
								nick:msObj.nickname
							}].concat(userList));
						} else if (msObj.messageType === 'NOTICE') {
							console.log('someone noticed');
						} else if (msObj.messageType === 'END') {
							console.log('game ended');
							stompDisconnect();
						} else if (msObj.messageType === 'START') {
							console.log('game started');
						} else if (msObj.messageType === 'FIND') {
							console.log('find treasure');
							dispatch(changeTreasure(1));
						}
					}, {}
				);
			});
			stompRef.current = stomp;
		} catch (error) {
			console.log('socket error : ', error);
		}
	};

	//웹소켓 연결 끊기
	const stompDisconnect = ():void => {
		try {
			console.log('나간다');
			stompRef.current.disconnect(() => {
				console.log('STOMP connection closed');
			},
			{
				subscriptionId: `/sub/${roomId}`,
			}
			);
		} catch (error) {
			console.log('socket closed error : ', error);
		}
	};

	//공지 보낼때
	const sendMessage = (notice:string) => {
		const data = {
			messageType: 'NOTICE',
			message: notice
		};

		if (stompRef.current?.connected) {
			console.log('메세지를 보내겠다 ', stompRef.current.connected);
			stompRef.current.send('/pub/send', {}, JSON.stringify(data));
		} else {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '공지 실패! 다시 시도해주세요.', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	};

	//모달창 열기
	const openModal = (): void => {
		setModalOpen(true);
	};

	//모달창 닫기
	const closeModal = (notice:string): void => {
		if(notice){
			sendMessage(notice);
		}
		setModalOpen(false);
	};

	return (
		<>
			<NoticeModal open={modalOpen} close={closeModal}/>
			<div className="flex flex-col items-center">
				<Title title={title} subTitle={'게임 입장 코드: '+ code}></Title>
				<div className='w-full flex flex-col items-center bg-white2 px-2 pt-4 pb-16 mt-2 rounded-t-2xl space-y-2 overflow-y-scroll'>	
					<div className='w-full h-12 flex items-center'> 
						<BoxHeader total={0} num={userList.length} title='참가자 수'/>
						<GoMegaphone color='white' className='w-10 h-10 shadow-lg rounded-full bg-red px-2 py-2' onClick={openModal}/>
					</div>
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
		</>
	);
}
  
export default HostWaitRoom;
