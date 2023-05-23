import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { changecode } from '../../../stores/host';
import Swal from 'sweetalert2';
import useApi from '../../../hooks/useApi';
import { useInterval } from '../../../hooks/useInterval';

interface TimeProps {
	start: string;
	time: string;
}

function Timer({start, time}:TimeProps): JSX.Element {
	const dispatch = useDispatch();
	const endApi = useApi(); //방 상태 변경
	const date: Date = new Date();
	const startD: Date =  new Date(start);
	const startDate: Date = new Date(startD.getTime() - startD.getTimezoneOffset()*60000);
	const gap: number = date.getTime() - startDate.getTime(); //gap시작 시간으로 부터 경과한 시간
	const [count, setCount] = useState<number>(60);

	useEffect(()=>{
		if(time){
			setCount(Math.ceil(Number(time)*60-gap/1000));
		}
	}, [start, time]);

	useEffect(()=>{
		if(endApi.data?.success){
			//소켓 열기
			const code = '';
			const status = 4;
			const accessToken = '';
			dispatch(changecode({accessToken, status, code}));
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

	useInterval(() => {
		if(count-1 <= 0){ //게임 멈추기
			endApi.fetchApiWithToken('PATCH', '/rooms/host', {status: 4});
		}
		setCount((count) => count - 1);
	}, 1000);
	
	return (
		<div>{Math.floor(count/60)}:{Math.ceil(count%60)}</div>);
}


export default Timer;
