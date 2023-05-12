import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../stores/host';
import { reset } from '../stores/game';
import useRefresh from './useRefresh';
import { RootState } from '../stores';
import { useSelector } from 'react-redux';

const baseURL = 'https://ta-da.world/api';

const useLogout = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const refresh  = useRefresh();
	const accessToken = useSelector((state: RootState) => state.host.accessToken);
	const [error, setError] = useState<string | null>(null);
	const [, , removeCookie] = useCookies(['refreshToken']);

	const logoutResponse = async() => {
		const response = await fetch(`${baseURL}/hosts/logout`, {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${accessToken}`,
				'Content-Type': 'application/json'
			}
		});
		return response;
	};

	const handleLogout = async () => {
		try {
			const response = await logoutResponse();
			if (response.status === 401) {
				await refresh.refreshToken();
				const newResponse = await logoutResponse();
				if (!newResponse.ok) {
					throw new Error(`REFRESH ERROR: ${newResponse.status}`);
				}
			}	
		} catch (error: any) {
			console.log('로그아웃 error', error);
			setError(error);
		} finally {
			removeCookie('refreshToken', {path: '/'});
			dispatch(logout());
			dispatch(reset());
			navigate('/');
		}
	};

	return { error, handleLogout };
};

export default useLogout;
