import { useState, useEffect } from 'react';
import { GraButton } from '../utils/Semantics';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { enterCharacter } from '../stores/user';

function UserCharacterPage(): JSX.Element {

	const avatarPath1 = require('../assets/images/avatar1.gif');
	const avatarPath2 = require('../assets/images/avatar2.gif');
	const avatarPath3 = require('../assets/images/avatar3.gif');
	const avatarPath4 = require('../assets/images/avatar4.gif');
	const avatarPath5 = require('../assets/images/avatar5.gif');
	const avatarPath6 = require('../assets/images/avatar6.gif');
	const avatarPath7 = require('../assets/images/avatar7.gif');
	const avatarPath8 = require('../assets/images/avatar8.gif');
	const avatarPath9 = require('../assets/images/avatar9.gif');

	const userState = useSelector((state: RootState) => state.user);

	console.log(userState);

	const [selectedAvatar, setSelectedAvatar] = useState(1);
	const [selectedAvatarPath, setSelectedAvatarPath] = useState(require('../assets/images/avatar1.gif'));

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleAvatarClick = (avatarNumber: number) => {
		setSelectedAvatar(avatarNumber);

		switch (avatarNumber) {
		case 1:
			setSelectedAvatarPath(avatarPath1);
			break;
		case 2:
			setSelectedAvatarPath(avatarPath2);
			break;
		case 3:
			setSelectedAvatarPath(avatarPath3);
			break;
		case 4:
			setSelectedAvatarPath(avatarPath4);
			break;
		case 5:
			setSelectedAvatarPath(avatarPath5);
			break;
		case 6:
			setSelectedAvatarPath(avatarPath6);
			break;
		case 7:
			setSelectedAvatarPath(avatarPath7);
			break;
		case 8:
			setSelectedAvatarPath(avatarPath8);
			break;
		case 9:
			setSelectedAvatarPath(avatarPath9);
			break;
		default:
			setSelectedAvatarPath(avatarPath1);
			break;
		}
	};

	const handleNextClick = (): void => {
		dispatch(enterCharacter(selectedAvatar));
		navigate('/userwait');
	};

	const renderAvatars = () => {
		const avatars = [];
		for (let i = 1; i <= 9; i++) {
			const isSelected = i === selectedAvatar;
			avatars.push(
				<img
					key={i}
					src={require(`../assets/images/avatar/avatar${i}.png`)}
					alt={`Avatar ${i}`}
					onClick={() => handleAvatarClick(i)}
					className={`cursor-pointer w-20 h-20 rounded-full border-2  mx-2 ${isSelected ? 'border-main ring-main ring-2' : 'border-white'}`}
				/>
			);
		}
		return avatars;
	};

	useEffect(() => {
		if (!userState.roomCode) {
			navigate('/');
		} else if (!userState.nickname) {
			navigate('/username');
		}
	}, []);

	return (
		<div className='flex flex-col items-center w-full h-full bg-white2'>
			<div className='flex items-center justify-center bg-main w-full rounded-b-3xl shadow-lg mb-12 h-32'>

				<p className='relative px-5 py-2 my-10 text-xl font-bold bg-white border-b-4 shadow border-main2 shadow-main rounded-2xl text-main'>
					캐릭터를 골라주세요!
				</p>
			</div>
			<div className='flex items-center justify-center'>
				<img
					className='rounded-full rou'
					src={selectedAvatarPath}
				></img>
			</div>
			<div className=''>
				<div className='fixed left-0 flex py-5 overflow-x-scroll bottom-20'>
					{renderAvatars()}
				</div>
			</div>
			<GraButton
				onClick={handleNextClick}
				className='fixed w-full h-20 text-2xl rounded-none bottom-0'
				from='from-blue'
				to='to-blue2'
			>
				다음
			</GraButton>
		</div>
	);
}

export default UserCharacterPage;
