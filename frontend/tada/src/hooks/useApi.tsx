import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../stores/host';
import { useCookies } from 'react-cookie';
import useRefresh from './useRefresh';

const useApi = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const refresh = useRefresh();
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);
	const [cookie, , removeCookie] = useCookies(['accessToken']);

	const baseURL = 'https://ta-da.world/api';

	//[1] accessToken이 필요없는 요청 not GET
	async function fetchApi(method: string, url: string, requestBody: any) {
		try {
			const response = await fetch(baseURL + url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					// Origin: '*'
				},
				body: JSON.stringify(requestBody),
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = await response.json();
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

	//[1] accessToken이 필요없는 요청 GET
	async function fetchGetApi(url: string) {
		try {
			const response = await fetch(baseURL + url, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					// Origin: '*'
				},
			});
			if (!response.ok) throw new Error(`HTTP ERROR: ${response.status}`);
			const json = await response.json();
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

	//[2] accessToken이 필요한 요청인 경우 not Get
	async function fetchApiWithToken(
		method: string,
		url: string,
		requestBody: any
	) {
		console.log(
			'api요청 method ',
			method,
			'리퀘스트 바디(json) : ',
			JSON.stringify(requestBody)
		);
		try {
			const response = await fetch(baseURL + url, {
				method: method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${cookie.accessToken}`,
				},
				body: JSON.stringify(requestBody),
			});

			const json = await response.json();
			console.log('받은 데이터 ', json);
			setData(json);
		} catch (error: any) {
			console.log('api 요청 실패', error);
			if (error.status === 401) {
				console.log('토큰 리프레시');
				await refresh.refreshToken();
				try {
					const newResponse = await fetch(baseURL + url, {
						method: method,
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${cookie.accessToken}`,
						},
						body: JSON.stringify(requestBody),
					});
					const json = await newResponse.json();
					console.log('받은 데이터 ', json);
					setData(json);
				} catch (error: any) {
					//강제 로그아웃
					console.log('토큰 리프레시 실패 로그아웃');
					removeCookie('accessToken', { path: '/' });
					dispatch(logout());
					navigate('/');
				}
			} else {
				setError(error);
				throw new Error(`HTTP ERROR: ${error.status}`);
			}
		} finally {
			setLoading(false);
		}
	}
	
	//[2] accessToken이 필요한 muti 요청인 경우 not Get
	async function fetchApiWithTokenMuti(method: string, url: string,  requestBody :any) {
		console.log('api요청 method ',  method, '리퀘스트 바디(json) : ', requestBody);
		try {
			const response = await fetch(baseURL+url, {
				method: method,
				headers: {
					'Authorization': `Bearer ${cookie.accessToken}`
				},
				body : requestBody
			});
	
			const json = await response.json();
			console.log('받은 데이터 ', json);
			setData(json);
	
		} catch (error: any) {
			console.log('api 요청 실패', error);
			if (error.status === 401) {
				console.log('토큰 리프레시');
				await refresh.refreshToken();
				try {
					const newResponse = await fetch(baseURL+url, {
						method: method,
						headers: {
							'Authorization': `Bearer ${cookie.accessToken}`,
						},
						body: requestBody
					});
					const json = await newResponse.json();
					console.log('받은 데이터 ', json);
					setData(json);
				} catch (error: any) {
					//강제 로그아웃
					console.log('토큰 리프레시 실패 로그아웃');
					removeCookie('accessToken', {path: '/'});
					dispatch(logout());
					navigate('/');
				}
			} else{
				setError(error);
				throw new Error(`HTTP ERROR: ${error.status}`);
			}
		} finally {
			setLoading(false);
		}
	}

	//[2] accessToken이 필요한 요청인 경우 Get
	async function fetchNotBodyApiWithToken(method: string, url: string) {
		console.log('api요청 method ', method);
		try {
			const response = await fetch(baseURL+url, {
				method: method,
				headers: {
					'Authorization': `Bearer ${cookie.accessToken}`
				}
			});

			const json = await response.json();
			console.log('받은 데이터 ', json);
			setData(json);
		} catch (error: any) {
			console.log('api 요청 실패', error);
			if (error.status === 401) {
				console.log('토큰 리프레시');
				await refresh.refreshToken();
				try {
					const newResponse = await fetch(baseURL+url, {
						method: method,
						headers: {
							'Content-Type': 'application/json',
							Authorization: `Bearer ${cookie.accessToken}`,
						},
					});
					const json = await newResponse.json();
					console.log('받은 데이터 ', json);
					setData(json);
				} catch (error: any) {
					//강제 로그아웃
					console.log('토큰 리프레시 실패 로그아웃');
					removeCookie('accessToken', { path: '/' });
					dispatch(logout());
					navigate('/');
				}
			} else {
				setError(error);
				throw new Error(`HTTP ERROR: ${error.status}`);
			}
		} finally {
			setLoading(false);
		}
	}
	
	return { data, loading, error, fetchApi, fetchGetApi, fetchApiWithToken, fetchNotBodyApiWithToken, fetchApiWithTokenMuti };
};

export default useApi;