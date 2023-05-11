import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { enterNickname } from '../stores/user';
import styles from '../assets/css/UserNamePage.module.css';
import { RootState } from '../stores';
import useApi from '../hooks/useApi';
import Semantics from '../util/Semantics';

const { CustomInput, CustomButton } = Semantics;

const logo = require('../assets/images/logo.png');

// string to number hash
function hashStringToNumber(str: string) {
	let hash = 5381;
	for (let i = 0; i < str.length; i++) {
		const char = str.charCodeAt(i);
		hash = (hash << 5) + hash + char; /* hash * 33 + char */
	}
	return hash.toString();
}

function UserNamePage(): JSX.Element {
	const roomCodeFromRedux = useSelector(
		(state: RootState) => state.user.roomCode
	);

	// 유저 정보
	const userState = useSelector((state: RootState) => state.user);

	console.log('Room Code', roomCodeFromRedux);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const checkDuplication = useApi();

	const [name, setName] = useState<string>('');

	const handleNameChange = async (
		event: React.ChangeEvent<HTMLInputElement>
	): Promise<void> => {
		setName(event.target.value.replace(/\s/g, ''));
		await checkDuplication.fetchGetApi(
			`/users/check?code=${roomCodeFromRedux}&nickname=${event.target.value}`
		);
		console.log(checkDuplication.data?.success);
	};

	const isNameValid =
		checkDuplication.data && !checkDuplication.data.success ? false : null;

	const moveCharacter = (): void => {
		if (checkDuplication.data && checkDuplication.data.success) {
			const userId = `${userState.roomId}_${hashStringToNumber(name)}`;
			dispatch(enterNickname(name, userId));

			navigate('/usercharacter');
		}
	};

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='mb-5' src={logo} alt='logo' />
			<div className='flex flex-col items-center justify-center mb-3 border-b-8 shadow-lg shadow-main bg-white/80 w-72 h-36 rounded-3xl border-b-main3'>
				<CustomInput
					type='text'
					placeholder='닉네임을 입력해주세요!'
					value={name}
					onChange={handleNameChange}
					valid={isNameValid}
					maxLength={10}
				/>
				<CustomButton
					onClick={moveCharacter}
					valid={isNameValid}
					className={isNameValid === false ? styles.shake : ''}
				>
					{isNameValid === false ? '이미 사용중인 닉네임입니다' : '확인'}
				</CustomButton>
			</div>
		</div>
	);
}

export default UserNamePage;
