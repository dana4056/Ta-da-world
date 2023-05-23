import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import DeleteHost from '../components/hosthome/DeleteHost';
import RoomStatus from '../components/hosthome/RoomStatus';
import useLogout from '../hooks/useLogout';
import useApi from '../hooks/useApi';
import { useDispatch } from 'react-redux';
import { set } from '../stores/game';

function HostHomePage(): JSX.Element {
	const dispatch = useDispatch();
	const status = useSelector((state: RootState) => state.host.status);
	const accessToken = useSelector((state: RootState) => state.host.accessToken);
	const logout = useLogout();
	const roomInfoApi = useApi();

	useEffect(()=>{
		if(!accessToken){
			logout.handleLogout();
		}else{
			roomInfoApi.fetchNotBodyApiWithToken('GET', '/rooms');
		}
	}, [status]);

	useEffect(()=>{
		if(roomInfoApi.data?.success){
			const name = roomInfoApi.data.data.name;
			const playTime =roomInfoApi.data.data.playTime;
			const startTime = roomInfoApi.data.data.startTime;
			const roomId = roomInfoApi.data.data.id;
			dispatch(set({name, playTime, startTime, roomId}));
		}
	}, [roomInfoApi.data]);

	return (
		<div className='h-full'>
			<div className='flex flex-col items-center justify-center h-5/6'>
				<RoomStatus status={status} />
			</div>
			<DeleteHost />
		</div>
	);
}

export default HostHomePage;
