import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { enterNickname } from '../stores/user';
import styles from '../assets/css/UserNamePage.module.css';


const logo = require('../assets/images/logo.png');

function UserNamePage(): JSX.Element {
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [name, setName] = useState<string>('');

	const handleNameChange = (
		event: React.ChangeEvent<HTMLInputElement>
	): void => {
		setName(event.target.value);
	};

	const moveCharacter = (): void => {
		dispatch(enterNickname(name));
		navigate('/usercharacter');
	};

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='mb-5' src={logo} alt='logo' />
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<input
					className={`h-10 px-4 mb-5 border shadow-lg placeholder:text-sm placeholder:text-gray2 text-gray5 w-60 rounded-xl ${
						name === '한원석' ? 'border-2 border-red' : 'border-gray2'
					}`}
					type='text'
					placeholder='닉네임을 입력해주세요!'
					value={name}
					onChange={handleNameChange}
				/>
				<button
					onClick={moveCharacter}
					className={`h-10 text-white shadow-lg rounded-xl w-60  ${
						name === '한원석'
							? `bg-red text-sm ${styles.shake}`
							: 'bg-gradient-to-r from-orange to-orange2 font-semibold'
					}`}
				>
					{name === '한원석' ? '이미 사용중인 닉네임입니다' : '확인'}
				</button>
			</div>
		</div>
	);
}

export default UserNamePage;
