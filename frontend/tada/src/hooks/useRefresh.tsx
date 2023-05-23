import { useState } from 'react';
import { useCookies } from 'react-cookie';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router';
import { RootState } from '../stores';
import { refresh } from '../stores/host';

interface HostData {
  accessToken: string,
  refreshToken: string,
  status: number,
  rommId: number
}

const useRefresh = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const accessToken = useSelector((state: RootState) => state.host.accessToken);
	const [data, setData] = useState<HostData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [cookie, , ] = useCookies(['refreshToken']);
	const baseURL = 'https://ta-da.world/api';
	const state = JSON.parse(localStorage.getItem('persist:root') || '{}');
	
	const refreshToken = async () => {
		if (!state) {
			navigate('/');
		}

		console.log('existing token: ', accessToken);

		try {
			const response = await fetch(`${baseURL}/hosts/token/refresh`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${cookie.refreshToken}`
				}
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = await response.json() as HostData;
			console.log('HOST DATA: ', json);
			setData(json);
			const { accessToken } = json;
			dispatch(refresh(accessToken));
		} catch(error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown error occurred');
			}
		}
	};

	return { data, error, refreshToken };

};

export default useRefresh;
