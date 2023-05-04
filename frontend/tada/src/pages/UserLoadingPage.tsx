import React, { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

import LoadingComponent from '../components/user/LoadingComponent';

interface GameInfo {
	label: string;
	value: string;
}

const logo = require('../assets/images/logo.png');

const Counts = require('../assets/images/timer.gif');

function UserLoadingPage(): JSX.Element {
	const gameInfos: GameInfo[] = [
		{ label: '참가자', value: '30' },
		{ label: '보통', value: '30' },
		{ label: '시간(분)', value: '30' },
	];

	// const navigate = useNavigate();

	useEffect(() => {
		const timer = setTimeout(() => {
			// navigate to another page
			// navigate('/username');
		}, 10000);

		return () => clearTimeout(timer);
	}, []);

	return (
		<div className='flex flex-col items-center justify-center h-full space-y-3'>
			<img src={logo} alt='logo' />
			<div className='flex space-x-3'>
				{gameInfos.map((info, index) => (
					<LoadingComponent key={index} label={info.label} value={info.value} />
				))}
			</div>
			<div className='w-56'>
				<img src={Counts} alt='counts' />
			</div>
		</div>
	);
}

export default UserLoadingPage;
