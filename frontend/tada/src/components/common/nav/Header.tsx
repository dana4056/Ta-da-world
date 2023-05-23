import { useNavigate } from 'react-router-dom';
import useLogout from '../../../hooks/useLogout';

const logo = require('../../../assets/images/topLogo.png');

function Header(): JSX.Element {
	const navigate = useNavigate();
	const logoutApi = useLogout();

	const hostLogout = () => {
		logoutApi.handleLogout();
	};

	return (
		<div className='w-full pt-1 pb-8 pr-3 flex justify-between items-center'>
			<img className='w-32' src={logo} onClick={()=>navigate('/hosthome')}/>
			<div className='text-white text-xs font-bold bg-orange rounded-full px-2 py-1' onClick={hostLogout}>로그아웃</div>
		</div>
	);
}
  
export default Header;
