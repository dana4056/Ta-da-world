import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import DeleteHost from '../components/hosthome/DeleteHost';
import RoomState from '../components/hosthome/RoomState';

function HostHomePage(): JSX.Element {
	const roomState = useSelector((state: RootState) => state.host.roomState);
<<<<<<< HEAD
	
=======
	console.log('Home' + roomState);

>>>>>>> aa3f0f01e872a33c843a6fbe174bd210fa7c985e
	return (
		<div className='h-full'>
			<div className='h-5/6 flex flex-col justify-center items-center'>
				<RoomState roomState={roomState} />
			</div>
			<DeleteHost />
		</div>
	);
}

export default HostHomePage;
