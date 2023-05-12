import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';

function GameHeader(): JSX.Element {
	const gameInfo = useSelector((state: RootState) => state.user);

	const treausre = require('../../assets/images/closetreasure_color.png');

	const { gamePlayTime, gameStartTime } = gameInfo;
	const gameEndTime =
		new Date(gameStartTime).getTime() + gamePlayTime * 60 * 1000;

	const nowTime = new Date('2023-05-01T08:15:00').getTime();
	// const [timeLeft, setTimeLeft] = useState<number>(gameEndTime - Date.now());
	const [timeLeft, setTimeLeft] = useState<number>(gameEndTime - nowTime);

	console.log(Date.now());

	useEffect(() => {
		const timer = setInterval(() => {
			const currentTime = Date.now();
			const diff = gameEndTime - currentTime;

			if (diff < 0) {
				clearInterval(timer);
			} else {
				setTimeLeft(diff);
			}
		}, 1000);
		return () => clearInterval(timer);
	}, [gameEndTime]);

	const minutes = Math.floor(timeLeft / 1000 / 60);
	const seconds = Math.floor((timeLeft / 1000) % 60);

	const timeLeftString = `${minutes.toString().padStart(2, '0')}:${seconds
		.toString()
		.padStart(2, '0')}`;

	//   gameInfo
	//   character : 3
	// gamePlayTime : 15
	// gameStartTime : "2023-05-01T08:14:27"
	// nickname : "ass"
	// roomCode : "ekotQrpTA"
	// roomId : 1
	// treasureNumber : 2
	// userId : "1_193486540"

	console.log('!!!!!!!!!!!!!!!!!!', gameInfo);

	return (
		<div className='flex items-center justify-around py-4 border-b-2 bg-main border-b-white'>
			<div className='flex items-center justify-center h-12 text-2xl font-black bg-white border-4 rounded-full text-main w-36'>
				{timeLeftString}
			</div>
			<div className='flex items-center space-x-2 text-2xl font-black text-white text-gray3'>
				<img className='w-12 h-12' src={treausre} alt='' />
				<p>x 13</p>
			</div>
		</div>
	);
}

export default GameHeader;
