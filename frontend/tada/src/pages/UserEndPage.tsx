import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import { WhiteBox } from '../utils/Semantics';
import { useNavigate } from 'react-router-dom';
import useApi from '../hooks/useApi';

import UserProfile from '../components/userpregame/UserProfile';
import UserTreasureList from '../components/userendgame/UserTreasureList';
import TreasureMap from '../components/common/TreasureMap';

interface TreasureInfo {
	id: number;
	imgPath: string;
	lat: string;
	lng: string;
	hint: string;
	rewardImgPath: string;
	reward: string;
	status: boolean;
	finderNick: string | null;
}

interface User {
	id: string;
	roomId: number;
	nickname: string;
	// profileImage: string;
	profileImage: number;
}

function UserEndPage(): JSX.Element {
	// 유저 정보
	const navigate = useNavigate();
	const userState = useSelector((state: RootState) => state.user);
	const treasureListApi = useApi();
	const [treasures, setTreasures] = useState<TreasureInfo[]>([]);

	const user: User = {
		id: userState.userId,
		roomId: userState.roomId,
		nickname: userState.nickname,
		// profileImage: String(userState.character),
		profileImage: userState.character,
	};

	useEffect(() => {
		treasureListApi.fetchGetApi(
			// `/treasures/user?room=${userState.roomId}&user=13_230985`
			`/treasures/user?room=${userState.roomId}&user=${userState.userId}`
		);
	}, []);

	useEffect(() => {
		if (treasureListApi.data?.success) {
			setTreasures(treasureListApi.data.data);
		}
	}, [treasureListApi.data]);

	useEffect(() => {
		if (!userState.roomCode) {
			navigate('/');
		} else if (!userState.nickname) {
			navigate('/username');
		} else if (!userState.character) {
			navigate('/usercharacter');
		}
	}, []);

	return (
		<div className='flex flex-col w-full space-y-10 bg-white2'>
			<UserProfile user={user} />
			<div className='flex flex-col items-center justify-center'>
				<WhiteBox className=' shadow-lg'>
					<UserTreasureList treasureList={treasures} />
				</WhiteBox>
				{treasures.length !== 0 && (
					<TreasureMap isHost={false} title='보물지도' treasures={treasures} />
				)}
			</div>
		</div>
	);
}

export default UserEndPage;
