import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores';
import { change } from '../../stores/host';
import SockJS from 'sockjs-client'; //WebSocket과 유사한 객체를 제공하는 브라우저 라이브러리
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
	const members: User[] = [
		{ id: 2, name: '친구없는한원석', profileImage: userProfile },
		{ id: 3, name: '기침하는한원석', profileImage: userProfile },
		{ id: 4, name: '재채기쟁이한원석', profileImage: userProfile },
		{ id: 5, name: '친구없는한원석', profileImage: userProfile }
	];

	useEffect(()=>{
		connectHaner();
	}, []);

	const connectHaner = ():void => {
		const stomp = Stomp.over(() => {
		  const sock = new SockJS('https://ta-da.world/api/ws/room');
		  return sock;
		});
		stomp.connect({}, () => {
			stomp.subscribe(`https://ta-da.world/api/sub/${code}`,
			  (message) => {
					console.log(message);
					// setMessage(JSON.parse(message.body));
	  //  type: string;  // TALK(메세지) or ENTER(입장할 때)
	  //  roomId: string;  // 방의 주소
	  //  sender: string;  // 보낸 사람
	  //  message: string;  // 메세지
	  //}
			  },
			  {
				// 여기에도 유효성 검증을 위한 header 넣어 줄 수 있음
			  }
			);
		});
	};
	
	const roomStatusApi = useApi(); //방 상태 조회
	const startApi = useApi(); //방 상태 변경
	// useEffect(()=>{

	// }, []);

	const startGame = () : void => {
		//소켓 구독하기
		// startApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 1});
		// roomStatusApi.fetchNotBodyApiWithToken('GET', '/rooms/host/status');
		// dispatch(change(1));
	};
	
	return (
		<div className="flex flex-col items-center">
			<Title title='이유경의 보물 찾기' subTitle='대기방'></Title>
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
