import { useState } from 'react';
import { Label, Input, Button } from '../../../hooks/Semantics';
import Swal from 'sweetalert2';

interface RoomInfoProps {
	timeProps: string;
	titleProps: string;
}

function Info({titleProps, timeProps} : RoomInfoProps) : JSX.Element {
	const [time, setTime] = useState<string>(timeProps);
	const [title, setTitle] = useState<string>(titleProps);

	const handleTime = (e: React.ChangeEvent<HTMLInputElement>) : void  => {
		setTime(e.target.value);
	};

	const handleTitle = (e: React.ChangeEvent<HTMLInputElement>) : void  => {
		setTitle(e.target.value);
	};

	const checkAva = () : void  => {
		//유효성 검사
		if (title === '') {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 이름을 지어주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else if(time === '') {
			//time 숫자아님 막기
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '게임 시간을 설정해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else {
			saveInfo();
		} 
	};

	
	const saveInfo = () : void  => {
		console.log('저장 api 요청');
	};

	return (
		<div className='px-4'>
			<>
				<Label htmlFor="title"> 게임 이름 </Label>
				<Input value={title} type="text" name="title" id="title" placeholder="게임 방 이름" onChange={handleTitle}/>
			</>
			<>
				<Label htmlFor="time"> 게임 시간(분) </Label>
				<Input value={time} type="text" name="time" id="time" placeholder="게임 시간" onChange={handleTime}/>
			</>
			<div className='flex justify-center items-center mt-12'>
				<Button onClick={checkAva}> 저장 </Button>
			</div>
		</div>
	);
}
  
export default Info;
