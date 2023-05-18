import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import LoginUser from '../components/userpregame/LoginUser';
import LoginHost from '../components/userpregame/LoginHost';
  



const logo = require('../assets/images/logo.png');

function MainPage(): JSX.Element {
	const navigate = useNavigate();
	const ishost = useSelector((state: RootState) => state.host.accessToken);

	const [activeComponent, setActiveComponent] = useState<'User' | 'Host'>(
		'User'
	);


	const handleClick = (): void => {
		setActiveComponent((defaultComponent) =>
			defaultComponent === 'User' ? 'Host' : 'User'
		); 
	};


	useEffect(() => {

		if (ishost) {
			navigate('/hosthome');
		}
	});

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='w-4/5 mb-5' src={logo} alt='logo' />
			{activeComponent === 'User' ? (
				<LoginUser onHostClick={handleClick} />
			) : (
				<LoginHost onUserClick={handleClick} />
			)}
		</div>
	);
}

export default MainPage;
