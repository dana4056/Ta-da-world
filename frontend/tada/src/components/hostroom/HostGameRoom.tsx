import { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../stores';
import { changecode } from '../../stores/host';
import { changeTreasure } from '../../stores/watch';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import Swal from 'sweetalert2';
import { GoMegaphone } from 'react-icons/go';
import tw from 'tailwind-styled-components';
import { WhiteBox, Button } from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';
import TreasureMap from '../common/TreasureMap';
import Timer from './hostgameroom/Timer';
import Title from '../common/Title';
import useApi from '../../hooks/useApi';
import NoticeModal from './common/NoticeModal';

const baseURL = 'https://ta-da.world/api';

function HostGameRoom(): JSX.Element {
	const dispatch = useDispatch();
	const title = useSelector((state: RootState) => state.game.name);
	const time = useSelector((state: RootState) => state.game.playTime);
	const startTime = useSelector((state: RootState) => state.game.startTime);
	const roomId = useSelector((state: RootState) => state.game.roomId);
	const find = useSelector((state: RootState) => state.watch.treasure);
	const stompRef = useRef<any>(null);
	const [ms, setMs] = useState<any>();
	const [treasures, setTreasures] = useState<TreasureInfo[]>([]);
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const TreasureApi = useApi(); //보물 조회
	const endApi = useApi(); //방상ㅌ애 변경

	// 게임 참가 유저 리스트
	useEffect(() => {
		if (!stompRef.current) {
			stompConnect();
		}
	}, []);
		
	//보물 정보 (find messg 오면 갱신)
	useEffect(()=>{
		TreasureApi.fetchNotBodyApiWithToken('GET', '/treasures');
	}, [find]);

	//보물 정보 설정
	useEffect(()=>{
		if(TreasureApi.data?.success){
			setTreasures(TreasureApi.data.data);
		}
	}, [TreasureApi.data]);

	//게임 강제 종료
	useEffect(()=>{
		if(endApi.data?.success){
			const code = '';
			const status = 4;
			const accessToken = '';
			dispatch(changecode({accessToken, status, code}));
		}
	}, [endApi.data]);

	//웹 소켓 분기 처리
	useEffect(() => {
		if(ms){
			if (ms.messageType === 'NOTICE') {
				console.log('someone noticed');
			} else if (ms.messageType === 'END') {
				console.log('game ended');
				stompDisconnect();
			} else if (ms.messageType === 'FIND') {
				console.log('find treasure');
				dispatch(changeTreasure(1));
			}
		}
	}, [ms]);

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
						setMs(msObj);
						console.log('msObj ',msObj);
					}, {}
				);
			});
			stompRef.current = stomp;
		} catch (error) {
			console.log('socket error: ', error);
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
			console.log('socket closed error: ', error);
		}
	};
	
	//공지 보낼때
	const sendMessage = (notice:string) => {
		const data = {
			messageType: 'NOTICE',
			roomId: `${roomId}`,
			context: notice
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

	const endGame = (): void => {
		endApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 4});
	};

	return (
		<>
			<NoticeModal open={modalOpen} close={closeModal}/>
			<div className="flex flex-col items-center">
				<Title title={title} subTitle='게임 진행중'/>
				<div className='flex items-center justify-end w-full h-0'>
					<GoMegaphone color='white' className='relative w-10 h-10 px-2 py-2 mx-2 rounded-full shadow-lg top-4 bottom-3 bg-red' onClick={openModal}/>
				</div>
				<div className='flex flex-col items-center w-full px-2 py-3 mt-2 bg-white2 rounded-t-2xl'>
					<PlayTimeBox>
						<p className='mx-3 font-black text-gray5'> 현재 남은 시간</p>
						<div className='text-xl font-black text-red'><Timer start={startTime} time={time}/></div>
					</PlayTimeBox>
					{treasures.length && <TreasureMap isHost={true}  title='보물 찾기 현황' treasures={treasures}/>}
					<Button className='w-4/5 max-w-xs shadow-lg' onClick={endGame}>게임종료</Button>
				</div>
			</div>
		</>
	);
}

const PlayTimeBox = tw(WhiteBox)`
	flex flex-row justify-center items-center
	w-3/4 h-12
`;

export default HostGameRoom;
