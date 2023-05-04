import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import DeleteHost from '../components/hosthome/DeleteHost';
import RoomStatus from '../components/hosthome/RoomStatus';

function HostHomePage(): JSX.Element {
	const status = useSelector((state: RootState) => state.host.status);
	
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
