import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../stores'; 
import { change } from '../../stores/host';
import tw from 'tailwind-styled-components';
import { WhiteBox, Button } from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';
import Swal from 'sweetalert2';
import TreasureMap from '../common/TreasureMap';
import BoxHeader from '../common/HeaderBox';
import Title from '../common/Title';
import useApi from '../../hooks/useApi';

interface Hunter {
	nick: string;
	imgNo: number;
	findCnt: number;
}

const PlayTimeBox = tw(WhiteBox)`
	flex flex-row justify-center items-center
	w-3/4 h-12
`;

function HostEndRoom(): JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const title = useSelector((state: RootState) => state.game.name);
	const time = useSelector((state: RootState) => state.game.playTime);
	const [treasures, setTreasures] = useState<TreasureInfo[]>([]);
	const [hunters, setHunters] = useState<Hunter[]>([]);
	const hunterApi = useApi(); //사냥 순위 정보 조회
	const TreasureApi = useApi(); //보물 조회
	const endApi = useApi(); //방상ㅌ애 변경
	const roomstatusApi = useApi(); //방상태 조회

	//시작할때
	useEffect(()=>{
		TreasureApi.fetchNotBodyApiWithToken('GET', '/treasures');
		// hunterApi.
	}, []);

	//보물 데이터 받기
	useEffect(()=>{
		if(TreasureApi.data?.success){
			setTreasures(TreasureApi.data.data);
		}
	}, [TreasureApi.data]);

	//사냥꾼 데이터 받기
	useEffect(()=>{
		if(hunterApi.data?.success){
			setHunters(hunterApi.data.data);
		}
	}, [hunterApi.data]);

	//게임 끝
	useEffect(() => {
		if(endApi.data?.success){
			roomstatusApi.fetchNotBodyApiWithToken('GET', '/rooms/host/status');
		} else if(endApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 종료 실패! 다시 시도해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [endApi.data]);

	useEffect(() => {
		if(roomstatusApi.data?.success){
			console.log('방 상태 조회 ', roomstatusApi.data.data);
			if(roomstatusApi.data.data.status === 0 ){
				console.log('방 상태가 0');
				dispatch(change(0));
				navigate('/hosthome');
			}
		} else if(roomstatusApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 종료 실패! 다시 시도해주세요!',  
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [roomstatusApi.data]);

	const endGame = (): void => {
		endApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 5});
	};

	return (
		<div className="flex flex-col items-center">
			<Title title={title} subTitle='게임 결과'/>
			<div className='flex flex-col items-center w-full px-2 py-3 mt-2 bg-white2 rounded-t-2xl'>
				<PlayTimeBox>
					<p className='mx-3 font-black text-gray5'>총 플레이 시간</p>
					<p className='font-black text-main'>{time}</p>
					<p className='mx-3 font-black text-gray5'>분</p>
				</PlayTimeBox>
				{treasures.length && <TreasureMap isHost={true} title ='보물 찾기 결과' treasures={treasures}/>}
				<WhiteBox className='h-72'>
					<BoxHeader title='보물 사냥꾼 순위' total={0} num={hunters.length}/>
					<div className='flex flex-col items-center w-full h-full space-x-2 overflow-x-scroll'>
						{hunters.length ?
							<>
								{hunters.map((hunter, index) => (
									<div
										className='flex items-center justify-between w-11/12 h-16 px-3 my-2 font-bold bg-white shadow-md rounded-2xl text-main'
										key={index}
									>
										<div className='flex items-center'>
											<img
												className='w-10 h-10 mr-3'
												src={require(`../../assets/images/avatar/avatar${hunter.imgNo}.png`)}
												alt=''
											/>
											<p>{hunter.nick}</p>
										</div>
										<div>
											{hunter.findCnt}개
										</div>
									</div>
								))}
							</>
							:
							<div className='h-4/5 flex items-center text-black'> 보물을 아무도 찾지 못했어요! </div>
						}
					</div>
				</WhiteBox>
				<Button className='w-4/5 my-3' onClick={endGame}>종료</Button>
			</div>
		</div>
	);
}

export default HostEndRoom;
