import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changecode } from '../../stores/host';
import tw from 'tailwind-styled-components';
import { WhiteBox } from '../../util/Semantics';
import { TreasureInfo } from '../../util/Interface';
import TreasureMap from '../common/TreasureMap';
import Timer from './hostgameroom/Timer';
import Title from '../common/Title';
import useApi from '../../hooks/useApi';

const PlayTimeBox = tw(WhiteBox)`
	flex flex-row justify-center items-center
	w-3/4 h-12
`;

function HostGameRoom() : JSX.Element {
	const dispatch = useDispatch();
	const [treasures, setTreasures] = useState<TreasureInfo[]>([]);
	const [title, setTitle] = useState<string>('');
	const [time, setTime] = useState<string>('');
	const [startTime, setStartTime] = useState<string>('');
	const roomInfoApi = useApi(); //기본 방 정보 조회
	const TreasureApi = useApi(); //보물 조회
	const endApi = useApi(); //방상ㅌ애 변경

	//보물 정보
	useEffect(()=>{
		TreasureApi.fetchNotBodyApiWithToken('GET', '/treasures');
	}, []);

	useEffect(()=>{
		if(TreasureApi.data?.success){
			setTreasures(TreasureApi.data.data);
		}
	}, [TreasureApi.data]);


	//게임물 정보
	useEffect(()=>{
		roomInfoApi.fetchNotBodyApiWithToken('GET', '/rooms');
	}, []);
	
	useEffect(()=>{
		if(roomInfoApi.data?.success){
			setTitle(roomInfoApi.data.data.name);
			setTime(roomInfoApi.data.data.playTime);
			setStartTime(roomInfoApi.data.data.startTime);
		}
	}, [roomInfoApi.data]);

	
	//게임 시작
	useEffect(()=>{
		if(endApi.data?.success){
			console.log('방 상태 변경완료?');
			const code = '';
			const status = 4;
			const refreshToken = '';
			dispatch(changecode({refreshToken, status, code}));
		} else if(endApi.data){
			// Swal.fire({
			// 	icon: 'warning',               
			// 	width: 300,
			// 	iconColor: '#2BDCDB',
			// 	text: '게임 시작 실패! 다시 시도해주세요!', 
			// 	confirmButtonColor: '#2BDCDB',
			// 	confirmButtonText: '확인',
			// });
		}
	}, [endApi.data]);

	const endGame = () : void => {
		//원래 0되는 순간 
		endApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 4});
	};

	return (
		<div className="flex flex-col items-center">
			<Title title={title} subTitle='게임 진행중'/>
			<div className='flex flex-col items-center w-full px-2 py-3 mt-2 bg-white2 rounded-t-2xl'>
				<PlayTimeBox>
					<p className='mx-3 font-black text-gray5'> 현재 남은 시간</p>
					<div className='text-xl font-black text-red'><Timer start={startTime} time={time}/></div>
				</PlayTimeBox>
				{treasures.length && <TreasureMap isHost={true}  title='보물 찾기 현황' treasures={treasures}/>}
				<div onClick={endGame}>야 끝내</div>
			</div>
			<div className='fixed bottom-0 w-full h-96 -z-10 bg-white2'/>
		</div>
	);
}
  
export default HostGameRoom;
