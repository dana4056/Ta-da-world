import { useState, useEffect } from 'react';
import { GraButton } from '../utils/Semantics';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../stores';
import { enterCharacter } from '../stores/user';

function UserCharacterPage(): JSX.Element {

	const userState = useSelector((state: RootState) => state.user);

	console.log(userState);
	
	const [selectedAvatar, setSelectedAvatar] = useState(1);

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleAvatarClick = (avatarNumber: number) => {
		setSelectedAvatar(avatarNumber);
	};

	const handleNextClick = ():void => {
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
					className={`cursor-pointer w-20 h-20 rounded-full border-2  mx-2 ${
						isSelected ? 'border-main ring-main ring-2' : 'border-white'
					}`}
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
		<div className='flex flex-col items-center w-full h-full bg-#DDD4CB'>
			<p className='px-5 py-2 my-10 mt-16 text-xl font-bold bg-white border-b-4 shadow border-main2 shadow-main rounded-2xl text-main'>
				캐릭터를 골라주세요!
			</p>
			<div className='flex items-center justify-center'>
				<img
					src={require(`../assets/images/avatar${selectedAvatar}.gif`)}
				></img>
			</div>
			<div className='bg-white'>
				<div className='fixed left-0 flex py-5 overflow-x-scroll bottom-40'>
					{renderAvatars()}
				</div>
			</div>
			<GraButton
				onClick={handleNextClick}
				className='fixed w-full h-20 text-2xl rounded-none bottom-7'
				from='from-blue'
				to='to-blue2'
			>
				다음
			</GraButton>
		</div>
	);
}

export default UserCharacterPage;
