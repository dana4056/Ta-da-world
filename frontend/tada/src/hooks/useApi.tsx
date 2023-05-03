import { useState } from 'react';
import { useCookies } from 'react-cookie';
// import { useNavigate } from 'react-router-dom';
import useRefresh from './useRefresh';

const useApi = () => {
	// const navigate = useNavigate()
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [cookie] = useCookies(['accessToken']);
	const { refreshToken } = useRefresh();

	const baseURL = 'https://ta-da.world/api';

	// method는 HTTP Request Method, url은 baseURL 뒤의 URL, requestBody는 api 요청 시 필요한 데이터(객체)
	// [1] accessToken이 필요없는 요청
	async function fetchApi(method: string, url: string, requestBody: any) {
		try {
			const response = await fetch(baseURL+url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					// Origin: '*'
				},
				body: JSON.stringify(requestBody)
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = response.json();
			console.log(json);
			setData(json);
		} catch (error: any) {
			console.log(error);
			setError(error);
			// navigate('/error')
		} finally {
			setLoading(false);
		}
	}

	// [2] accessToken이 필요한 요청인 경우
	// 헤더에 토큰 추가, 토큰 만료 시 리프레쉬
	async function fetchApiWithToken(method: string, url: string, requestBody: any) {
		try {
			const response = await fetch(baseURL+url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${cookie.accessToken}`,
					// Origin: '*'
				},
				body: JSON.stringify(requestBody)
			});
			if (response.ok) {
				const json = response.json();
				console.log(json);
				setData(json);
			} else {
				if (response.status === 401) {
					await refreshToken();
					const newResponse = await fetch(baseURL+url, {
						method: method,
						headers: {
							'Content-Type': 'application/json',
							'Authorization': `Bearer ${cookie.accessToken}`,
							// Origin: '*'
						},
						body: JSON.stringify(requestBody)
					});
					if (newResponse.ok) {
						const json = newResponse.json();
						console.log(json);
						setData(json);
					} else {
						throw new Error(`REFRESH ERROR: ${newResponse.status}`);
					}
				} else {
					throw new Error(`HTTP ERROR: ${response.status}`);
				}
			}
		} catch (error: any) {
			console.log(error);
			setError(error);
			// navigate('/error')
		} finally {
			setLoading(false);
		}
	}

	return { data, loading, error, fetchApi, fetchApiWithToken };
};

export default useApi;
