import React, { useState } from 'react';

import DeleteHost from '../components/hosthome/DeleteHost';
import RoomState from '../components/hosthome/RoomState';


function HostHomePage() : JSX.Element {
	const [roomState, setRoomState] = useState<number>(1);

	return (
		<>
      		<RoomState roomState = {roomState} />
			<DeleteHost/>
		</>
	);
}
  
export default HostHomePage;
