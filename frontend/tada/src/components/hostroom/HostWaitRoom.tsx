import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores';
import Swal from 'sweetalert2';
import { change } from '../../stores/host';
import * as StompJs from '@stomp/stompjs'; //WebSocket과 유사한 객체를 제공하는 브라우저 라이브러리
import { Stomp } from '@stomp/stompjs'; //HTTP에서 모델링 되는 Frame 기반 프로토콜
import { Button } from '../../util/Semantics';
import BoxHeader from '../common/HeaderBox';
import Title from '../common/Title';
import useApi from '../../hooks/useApi';

interface User {
	id: number;
	name: string;
	profileImage: string;
}

const userProfile = require('../../assets/images/dummy_userprofile.png');

function HostWaitRoom() : JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const code = useSelector((state: RootState) => state.host.code);
	const client = useRef<any>({});
	const roomStatusApi = useApi(); //방 상태 조회
	const startApi = useApi(); //방 상태 변경
	// const [chatList, setChatList] = useState<>([]);
	const [message, setMessage] = useState<string>('');
	const members: User[] = [
		{ id: 2, name: '친구없는한원석', profileImage: userProfile },
		{ id: 3, name: '기침하는한원석', profileImage: userProfile },
		{ id: 4, name: '재채기쟁이한원석', profileImage: userProfile },
		{ id: 5, name: '친구없는한원석', profileImage: userProfile }
	];

	useEffect(() => {
		// connect();
		// return () => disconnect();
	}, []);

	useEffect(() => {
		if(startApi.data?.success){
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

	const connect = () : void => {	
		// 	stomp.subscribe(`https://ta-da.world/api/sub/${code}`,
		client.current = new StompJs.Client({
			brokerURL: 'https://ta-da.world/api/ws/room', // 연결할 url(이후에 localhost는 배포 도메인으로 바꿔주세요)
			debug: function (str) {
		  		console.log(str);
			},

			// 에러 발생 시 재연결 시도 딜레이
			reconnectDelay: 5000,
			heartbeatIncoming: 4000,
			heartbeatOutgoing: 4000,
  
			// 연결 시
			onConnect: () => {
		  		console.log('success');
		  		// subscribe(); // 메세지(채팅)을 받을 주소를 구독합니다.
			},
  
			// 에러 발생 시 로그 출력
			onStompError: (frame) => {
		  		console.log(frame);
			},
		});
  
	  // client 객체 활성화
	  client.current.activate();
	};


	 // subscribe: 메세지 받을 주소 구독
	//  const subscribe = () => {

	// 	// 구독한 주소로 메세지 받을 시 이벤트 발생
	// 	// (/sub: 웹소켓 공통 구독 주소), (/chat: 기능별(1:1, 3:3, 친구 추가후) 구독 주소), (/chatRoomSeq: 하위 구독 주소(채팅방))    
	// 	client.current.subscribe('https://ta-da.world/api/sub/${code}', (body) => {
	
	// 	  // 받아온 제이슨 파싱
	// 	  const json_body = JSON.parse(body.body); 

	// 	  console.log('메세지 받았당'); // 확인용 출력 (이처럼 메세지 수령 시 특정 이벤트를 발생 시킬 수 있습니다.)
	// 	  console.log(body.body);
	
	// 	  // 받아온 채팅 채팅 리스트에 넣기 (이부분은 임시로 한 거고 이후 프론트에서 필요에 따라 받아온 메서지를 렌더링 하면 됩니다.)
	// 	  setChatList((_chat_list) => [
	// 			..._chat_list,
	// 			json_body.senderSeq,
	// 			json_body.message,
	// 			json_body.createdAt,
	// 	  ]);
	// 	});
	//   };
	
	  // publish: 메세지 보내기
	// const publish = (message : string) => {
	// 	// 연결이 안되어있을 경우
	// 	if (!client.current.connected) {
	// 	  alert('연결이 안 되어있어');
	// 	  return;
	// 	}
	
	// 	// 입력된 메세지가 없는 경우
	// 	if (!message) {
	// 	  alert('메세지 입력 해');
	// 	  return;
	// 	}
	
	// 	// 메세지를 보내기
	// 	client.current.publish({
	// 	  // destination: 보낼 주소
	// 	  // (/pub: 웹소켓 공통 발신용 주소), (/send: 기능별 개별 발신용 주소)
	// 	  destination: '/pub/send',
	
	// 	  // body: 보낼 메세지
	// 	  body: JSON.stringify({
	// 			message: message,
	// 			// chatRoomSeq: chatRoomSeq,
	// 			// senderSeq: senderSeq,
	// 			// receiverSeq: receiverSeq,
	// 	  }),
	// 	});
	// 	// 보내고 메세지 초기화
	// 	setMessage('');
	// };
	  // disconnect: 웹소켓 연결 끊기
	const disconnect = () => {
		console.log('연결이 끊어졌습니다');
		client.current.deactivate();
	};
	
	
	//   // handleChage: 채팅 입력 시 state에 값 설정
	// const handleChange = (event) => {
	// 	setMessage(event.target.value);
	// };
	
	
	//   // handleSubmit: 보내기 버튼 눌렀을 때 보내기(publish 실행)
	// const handleSubmit = (event, message) => {
	// 	event.preventDefault();
	// 	publish(message);
	// };

	return (
		<div className="flex flex-col items-center">
			<Title title='이유경의 보물 찾기' subTitle={'게임 입장 코드: '+ code}></Title>
			<div className='w-full flex flex-col items-center bg-white2 px-2 pt-4 pb-16 mt-2 rounded-t-2xl space-y-2 overflow-y-scroll'>
				<BoxHeader total={0} num={members.length} title='참가자 수'/>
				{members.map((member) => (
					<div
						className='w-5/6 flex items-center h-16 px-2 font-bold bg-white shadow-lg rounded-2xl text-main'
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
			<Button className='w-4/5 max-w-xs fixed bottom-3 shadow-lg' onClick={startGame}>게임시작</Button>
			<div className='fixed w-full bottom-0 h-96 -z-10 bg-white2'/>
		</div>
	);
}
  
export default HostWaitRoom;
