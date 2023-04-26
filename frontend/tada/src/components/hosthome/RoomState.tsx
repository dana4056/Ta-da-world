import tw from 'tailwind-styled-components';
import { useNavigate } from 'react-router-dom';

const RoomButton = tw.div`
	w-60
	h-12
	flex 
	justify-center 
	items-center 
	bg-purple3 
	rounded-lg 
	text-xl 
	font-semibold
`;

interface hostRoomProps {
	roomState: number;
}

function RoomState({ roomState }: hostRoomProps)  : JSX.Element {
	const navigate = useNavigate();
	const commentlist: Array<string> = ['방 생성 전입니다.', '방 생성중!', '게임시작 대기중!', '게임 현황 확인', '게임 결과 확인'];
	const btnCommentlist: Array<string> = ['방 생성', '방 수정', '대기방', '게임중', '게임결과'];
	
	const navRoom = () : void  => {
		if(roomState === 0){
			//roomState 바꿔줘야함
			//방 생성 api 호출
			console.log('더미');
		}
		navigate('/hostroom');
	};

	return (
		<div className='h-5/6 flex flex-col justify-center items-center text-white'>
			<div className='pb-4 text-3xl'>{commentlist[roomState]}</div>
			<RoomButton onClick={navRoom}>{btnCommentlist[roomState]}</RoomButton>
		</div>
	);
}

export default RoomState;
