import { useState } from 'react';
import { useCookies } from 'react-cookie';

interface HostData {
  accessToken: string,
  refreshToken: string,
  status: number,
  rommId: number
}

const useRefresh = () => {
	// const navigate = useNavigate()
	const [data, setData] = useState<HostData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const [cookie, setCookie, ] = useCookies(['accessToken']);
	console.log('existing token: ', cookie.accessToken);
	
	const refreshToken = async () => {
		try {
			const baseURL = 'https://ta-da.world/api';
			const response = await fetch(`${baseURL}/hosts/token/refresh`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${cookie.accessToken}`
				}
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = await response.json() as HostData;
			console.log('HOST DATA: ', json);
			setData(json);
			const { accessToken } = json;
			setCookie('accessToken', accessToken);
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
