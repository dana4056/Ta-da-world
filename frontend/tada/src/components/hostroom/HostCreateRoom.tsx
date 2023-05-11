import { useEffect, useState } from 'react';
import { RootState } from '../../stores';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { changecode } from '../../stores/host';

import { Circle } from '../../util/Semantics';
import { TreasureInfo } from '../../util/Interface';
import useApi from '../../hooks/useApi';
import tw from 'tailwind-styled-components';

import Info from './hostcreateroom/Info';
import List from './hostcreateroom/List';
import Register from './hostcreateroom/Register';


interface StyledDivProps {
	active: string;
}

function HostCreateRoom() : JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const [section, setSection] = useState<string>('info');
	const [title, setTitle] = useState<string>('');
	const [time, setTime] = useState<string>('');
	const [treasures, setTreasures] = useState<TreasureInfo[]>([]);
	const changeIngo = useSelector((state: RootState) => state.watch.info);
	const changeTreasure = useSelector((state: RootState) => state.watch.treasure);
	const roomInfoApi = useApi();
	const TreasureApi = useApi();
	const startApi = useApi(); //방 상태 변경
	const roomstatusApi = useApi(); //방상태 조회
	
	//게임 시작
	useEffect(()=>{
		if(startApi.data?.success){
			console.log('방 상태 변경완료?');
			roomstatusApi.fetchNotBodyApiWithToken('GET', '/rooms/host/status');
		} else if(startApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시작 실패! 다시 시도해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [startApi.data]);

	useEffect(()=>{
		if(roomstatusApi.data?.success){
			console.log('방 상태 조회 2', roomstatusApi.data.data);
			const code = roomstatusApi.data.data.code;
			const status = 2;
			const accessToken = '';
			dispatch(changecode({accessToken, status, code}));
		} else if(roomstatusApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시작 실패! 다시 시도해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [roomstatusApi.data]);


	//개임 정보
	useEffect(()=>{
		roomInfoApi.fetchNotBodyApiWithToken('GET', '/rooms');
	}, [changeIngo]);

	useEffect(()=>{
		if(roomInfoApi.data?.success){
			setTitle(roomInfoApi.data.data.name);
			setTime(roomInfoApi.data.data.playTime);
		}
	}, [roomInfoApi.data]);

	//보물 정보
	useEffect(()=>{
		TreasureApi.fetchNotBodyApiWithToken('GET', '/treasures');
	}, [changeTreasure]);

	useEffect(()=>{
		if(TreasureApi.data?.success){
			setTreasures(TreasureApi.data.data);
		}
	}, [TreasureApi.data]);


	const handleClick = (e:string) : void => {
		setSection(e);
	};

	const startWait = () : void => {
		if(!title){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 이름을 설정해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else if(!time){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시간을 설정해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else if(!treasures.length){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보물을 하나 이상 등록해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else{
			Swal.fire({
				text: '게임 대기방을 여시겠습니까?',
				width: 300,
				showCancelButton: true,
				iconColor: '#2BDCDB ',
				confirmButtonColor: '#2BDCDB ',
				confirmButtonText: '시작',
				cancelButtonText: '취소'
			}).then(function(e){
				if(e.isConfirmed === true) {
					//방 변경
					startApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 2});
				}
			});
		}	
	};

	  
	return (
		<div className="h-full flex flex-col rounded-t-lg bg-white">
			<div className="flex mb-8">
				<SectionOpt active = {section === 'info' ? '1':''} onClick={()=>handleClick('info')}>
					기본정보
				</SectionOpt>
				<SectionOpt active = {section === 'list' ? '1':''} onClick={()=>handleClick('list')}>
					보물목록
				</SectionOpt>
				<SectionOpt active = {section === 'register' ? '1':''} onClick={()=>handleClick('register')}>
					보물등록
				</SectionOpt>
			</div>
			{section==='info' && <Info title={title} time={time}/>}
			{section==='list' && <List treasures={treasures}/>}
			{section==='register' && <Register/>}
			{section !== 'register' && <div className='w-full flex justify-end'> <Circle className='fixed bottom-3 shadow-lg' onClick={startWait}> go! </Circle></div>}
		</div>
	);
}


const SectionOpt = tw.div<StyledDivProps>`
	w-1/3 h-12
	flex justify-center items-center
	${({ active }) => `
		${active ? 'font-bold' : 'font-medium'}
		${active ? 'text-main' : 'text-slate-300'}
		${active ? 'text-base' : 'text-sm'}
		${active ? 'border-b-4 border-b-main' : ' '}
  	`}
`;

export default HostCreateRoom;
