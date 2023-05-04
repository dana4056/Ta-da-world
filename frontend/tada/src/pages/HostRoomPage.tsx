import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import HostCreateRoom from '../components/hostroom/HostCreateRoom';
import HostWaitRoom from '../components/hostroom/HostWaitRoom';
import HostGameRoom from '../components/hostroom/HostGameRoom';
import HostEndRoom from '../components/hostroom/HostEndRoom';

function HostRoomPage() : JSX.Element {
	const status = useSelector((state: RootState) => state.host.status);

	return (
		<>
			{status===1 && <HostCreateRoom/>}
			{status===2 && <HostWaitRoom/>}
			{status===3 && <HostGameRoom/>}
			{status===4 && <HostEndRoom/>}
		</>
	);
}
  
export default HostRoomPage;
