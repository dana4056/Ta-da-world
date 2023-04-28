import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';

interface LoginData {
  accessToken: string
  refreshToken: string
  nickname: string
}

interface ResponseData {
  data: LoginData
}

const useLogin = () => {
	// const navigate = useNavigate();
	const [data, setData] = useState<ResponseData | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
  
	const handleKakaoLogin = async (code: string) => {
		try {
			const baseURL = 'http://localhost:8000';
			const response = await fetch(`${baseURL}/hosts`, {
				method: 'POST',
				headers: {
					'Authorization': `Bearer ${code}`,
					'Content-Type': 'application/json'
				}
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = await response.json() as ResponseData;
			console.log('RESPONSE DATA: ', json);
			setData(json);
		} catch (error) {
			if (error instanceof Error) {
				setError(error.message);
			} else {
				setError('An unknown error occurred');
			}
		} finally {
			setLoading(false);
		}
	};

	return { data, loading, error, handleKakaoLogin };
};

export default useLogin;
