import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { change } from '../../stores/host';
import tw from 'tailwind-styled-components';
import {GraButton} from '../../util/Semantics';
import useApi from '../../hooks/useApi';
import Swal from 'sweetalert2';

interface hostRoomProps {
	status: number;
}

interface color {
	color: string;
}

export const GraText = tw.div<color>`
	text-xl font-black text-white
	mb-4
	${({ color }) => `
		${color}
	`}
`;

function RoomStatus({ status }: hostRoomProps)  : JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const commentlist: Array<string> = ['게임 방을 만들어봐요!', '현재 방 생성중', '게임을 시작해봐요!', '게임이 진행되고 있어요', '게임이 끝났어요'];
	const btnCommentlist: Array<string> = ['방 만들기', '방 수정', '대기방 가기', '진행 현황 보기', '결과창 보기'];
	const color : Array<string> = ['text-blue', 'text-main',  'text-orange2', 'text-red', 'text-green'];
	const colorTo : Array<string> = ['to-blue2', 'to-main', 'to-orange2', 'to-red', 'to-blue'];
	const colorFrom : Array<string> = ['from-blue', 'from-main3',  'from-orange', 'from-orange2', 'from-green'];
	const createRoom = useApi();

	const navRoom = () : void  => {
		if(status === 0){
			createRoom.fetchApiWithToken('POST', '/rooms/host', '');
		} else{
			navigate('/hostroom');
		}
	};

	useEffect(() => {
		if(createRoom.data){
			console.log(createRoom.data);
			// dispatch(change(1));
			// navigate('/hostroom');
		} else if(createRoom.error){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '방 생성에 실패했습니다.', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [createRoom.data]);


	return (
		<div className='flex flex-col items-center justify-center border-b-8 shadow-lg w-72 h-36 shadow-main bg-white/80 rounded-3xl border-b-main3'>
			<GraText color={color[status]}>{commentlist[status]}</GraText>
			<GraButton from={colorFrom[status]} to={colorTo[status]} onClick={navRoom}>{btnCommentlist[status]}</GraButton>
		</div>
	);
}

export default RoomStatus;
