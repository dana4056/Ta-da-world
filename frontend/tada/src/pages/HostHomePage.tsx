import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import DeleteHost from '../components/hosthome/DeleteHost';
import RoomState from '../components/hosthome/RoomState';

function HostHomePage(): JSX.Element {
	const roomState = useSelector((state: RootState) => state.host.roomState);

	return (
		<>
			<RoomState roomState={roomState} />
			<DeleteHost />
		</>
	);
}

export default HostHomePage;
