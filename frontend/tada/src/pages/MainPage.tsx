import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const logo = require('../assets/images/logo.png');

function MainPage(): JSX.Element {
	const navigate = useNavigate();

	const [activeComponent, setActiveComponent] = useState<'User' | 'Host'>(
		'User'
	);

	const handleClick = (): void => {
		setActiveComponent((defaultComponent) =>
			defaultComponent === 'User' ? 'Host' : 'User'
		);
	};

	const moveName = (): void => {
		navigate('/username');
	};

	const LoginUser = (): JSX.Element => (
		<>
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<input
					className='h-10 px-4 mb-5 border shadow-lg placeholder:text-sm placeholder:text-gray2 text-gray5 w-60 rounded-xl border-gray2'
					type='text'
					placeholder='참여코드를 입력하세요!'
				/>
				<button
					onClick={moveName}
					className='h-10 font-semibold text-white shadow-lg rounded-xl w-60 bg-gradient-to-r from-blue to-blue2'
				>
					입장
				</button>
			</div>
			<button
				type='button'
				onClick={handleClick}
				className='text-sm text-white border-b'
			>
				<p>{'>'} 호스트는 이쪽으로 입장해주세요</p>
			</button>
		</>
	);

	const LoginHost = (): JSX.Element => (
		<div className='flex flex-col items-center justify-center'>
			<div className='mb-3 bg-yellow-500 shadow-lg w-72 h-36 rounded-3xl'>
				카카오로 로그인
			</div>
			<button
				type='button'
				onClick={handleClick}
				className='text-sm text-white border-b'
			>
				<p>{'>'} 참가자는 이쪽으로 입장해주세요</p>
			</button>
		</div>
	);

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='mb-5' src={logo} alt='logo' />
			{activeComponent === 'User' ? <LoginUser /> : <LoginHost />}
		</div>
	);
}

export default MainPage;
