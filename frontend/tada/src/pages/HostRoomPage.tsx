import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import HostCreateRoom from '../components/hostroom/HostCreateRoom';
import HostWaitRoom from '../components/hostroom/HostWaitRoom';
import HostGameRoom from '../components/hostroom/HostGameRoom';
import HostEndRoom from '../components/hostroom/HostEndRoom';

function HostRoomPage() : JSX.Element {
	const roomState = useSelector((state: RootState) => state.host.roomState);

	return (
		<>
			{roomState===1 && <HostCreateRoom/>}
			{roomState===2 && <HostWaitRoom/>}
			{roomState===3 && <HostGameRoom/>}
			{roomState===4 && <HostEndRoom/>}
		</>
	);
}
  
export default HostRoomPage;
