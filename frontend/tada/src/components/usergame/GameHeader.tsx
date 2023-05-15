import { useSelector } from 'react-redux';
import { RootState } from '../../stores';
import UserTimer from './UserTimer';

interface GameHeaderProps {
	foundTreasure: number;
}

function GameHeader({ foundTreasure }: GameHeaderProps): JSX.Element {
	const gameInfo = useSelector((state: RootState) => state.user);

	const treausre = require('../../assets/images/closetreasure_color.png');
	const time = useSelector((state: RootState) => state.game.playTime);
	const startTime = useSelector((state: RootState) => state.game.startTime);

	//   gameInfo
	//   character : 3
	// gamePlayTime : 15
	// gameStartTime : "2023-05-01T08:14:27"
	// nickname : "ass"
	// roomCode : "ekotQrpTA"
	// roomId : 1
	// treasureNumber : 2
	// userId : "1_193486540"

	// console.log('!!!!!!!!!!!!!!!!!!', gameInfo);

	return (
		<div className='flex items-center justify-around py-4 border-b-2 bg-main border-b-white'>
			<div className='flex items-center justify-center h-12 text-2xl font-black bg-white border-4 rounded-full text-main w-36'>
				<UserTimer start={startTime} time={time}></UserTimer>
			</div>
			<div className='flex items-center space-x-2 text-2xl font-black text-white text-gray3'>
				<img className='w-12 h-12' src={treausre} alt='' />
				<p>x {gameInfo.treasureNumber - foundTreasure}</p>
			</div>
		</div>
	);
}

export default GameHeader;
