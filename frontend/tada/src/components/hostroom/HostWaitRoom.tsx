import { useDispatch } from 'react-redux';
import { change } from '../../stores/host';
import { HeaderBox, Button } from '../../util/Semantics';
import BoxHeader from '../common/BoxHeader';

interface User {
	id: number;
	name: string;
	profileImage: string;
}
const userProfile = require('../../assets/images/dummy_userprofile.png');


function HostWaitRoom() : JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const members: User[] = [
		{ id: 2, name: '친구없는한원석', profileImage: userProfile },
		{ id: 3, name: '기침하는한원석', profileImage: userProfile },
		{ id: 4, name: '재채기쟁이한원석', profileImage: userProfile },
		{ id: 5, name: '친구없는한원석', profileImage: userProfile },
		{ id: 6, name: '기침하는한원석', profileImage: userProfile },
		// { id: 7, name: '재채기쟁이한원석', profileImage: userProfile },
		// { id: 8, name: '재채기쟁이한원석', profileImage: userProfile },
		// { id: 9, name: '재채기쟁이한원석', profileImage: userProfile },
		// { id: 10, name: '재채기쟁이한원석', profileImage: userProfile }
	];
	
	const startGame = () : void => {
		console.log('띠용');
		dispatch(change(3));
	};
	
	return (
		<div className="flex flex-col items-center">
			<HeaderBox> 이유경의 보물 찾기 </HeaderBox>
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
			<div className='fixed bottom-0 w-full h-96 -z-10 bg-white2'/>
		</div>
	);
}
  
export default HostWaitRoom;
