import { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { changeInfo } from '../../../stores/watch';
import { Label, Input, Button } from '../../../util/Semantics';
import useApi from '../../../hooks/useApi';
import Swal from 'sweetalert2';

interface RoomInfoProps {
	title: string;
	time: string;
}

function Info({title, time} : RoomInfoProps) : JSX.Element {
	const dispatch = useDispatch();
	const [inputTitle, setInputTitle] = useState<string>('');
	const [inputTime, setInputTime] = useState<string>('');
	const swalColor  = '#2BDCDB';
	const check : any = /^[0-9]+$/; 
	const saveApi = useApi();

	useEffect(() =>{
		setInputTitle(title);
		setInputTime(time);
	}, [title, time]);

	useEffect(() =>{
		if(saveApi.data?.success){
			dispatch(changeInfo(1));
		}else if(saveApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: swalColor,
				text: '게임 정보 수정 실패!', 
				confirmButtonColor: swalColor,
				confirmButtonText: '확인',
			});
		}
	}, [saveApi.data]);

	const handleTime = (e: React.ChangeEvent<HTMLInputElement>) : void  => {
		setInputTime(e.target.value);
	};

	const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) : void  => {
		setInputTitle(e.target.value);
	};

	const checkAva = () : void  => {
		//유효성 검사 //게임 제목 18자까지
		if (inputTitle === '') {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: swalColor,
				text: '게임 이름을 설정해주세요!', 
				confirmButtonColor: swalColor,
				confirmButtonText: '확인',
			});
		} else if(inputTime === '') {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: swalColor,
				text: '게임 시간을 설정해주세요!', 
				confirmButtonColor: swalColor,
				confirmButtonText: '확인',
			});
		} else if(!check.test(inputTime)) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: swalColor,
				text: '유효하지 않은 게임 시간입니다.', 
				confirmButtonColor: swalColor,
				confirmButtonText: '확인',
			});
		} else {
			saveInfo();
		} 
	};

	//유효성 검사 끝나고 바뀐 데이터 저장 api 호출
	const saveInfo = () : void  => {
		saveApi.fetchApiWithToken('PUT', '/rooms/host', {
			name:inputTitle,
			playTime:inputTime
		});
	};

	return (
		<div className='px-4'>
			<>
				<Label htmlFor="title"> 게임 이름 </Label>
				<Input value={inputTitle||''} type="text" name="title" id="title" placeholder="게임 방 이름" onChange={handleTitle}/>
			</>
			<>
				<Label htmlFor="time"> 게임 시간(분) </Label>
				<Input value={inputTime||''} type="text" name="time" id="time" placeholder="게임 시간" onChange={handleTime}/>
			</>
			<div className='flex justify-center items-center mt-12'>
				<Button onClick={checkAva}> 저장 </Button>
			</div>
		</div>
	);
}
  
export default Info;
