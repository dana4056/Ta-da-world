import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import LoginUserComponent from '../components/user/LoginUserComponent';

const logo = require('../assets/images/logo.png');
const kakao_login = require('../assets/images/kakao_login.png');

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

	const API_KEY_KAKAO = process.env.REACT_APP_API_KEY_KAKAO;
	// const API_KEY_KAKAO = '2abf0e7d3c124964d0048b430a5ce52c';
	const REDIRECT_URI_SITE = process.env.REACT_APP_REDIRECT_URI;
	// const REDIRECT_URI_SITE = 'http://localhost:3000/users/oauth2-';
	const OAUTH_KAKAO = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY_KAKAO}&redirect_uri=${
		REDIRECT_URI_SITE + 'kakao'
	}&response_type=code`;

	useEffect(() => {
		if (ishost) {
			navigate('/hosthome');
		}
	});

	const LoginHost = (): JSX.Element => (
		<div className='flex flex-col items-center justify-center'>
			<a href={OAUTH_KAKAO}>
				<img src={kakao_login} alt='' className='w-72' />
			</a>
			<button
				type='button'
				onClick={handleClick}
				className='text-sm text-white border-b'
			>
				<p className='mt-10'>{'>'} 참가자는 이쪽으로 입장해주세요</p>
			</button>
		</div>
	);

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='mb-5' src={logo} alt='logo' />
			{activeComponent === 'User' ? (
				<LoginUserComponent onHostClick={handleClick} />
			) : (
				<LoginHost />
			)}
		</div>
	);
}

export default MainPage;
