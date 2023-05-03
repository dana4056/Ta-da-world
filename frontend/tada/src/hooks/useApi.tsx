// import { useState } from 'react';
// import { useCookies } from 'react-cookie';

// const useApi = () => {
// 	const [data, setData] = useState<any>(null);
// 	const [loading, setLoading] = useState<boolean>(true);
// 	const [error, setError] = useState<string | null>(null);
// 	const [cookie] = useCookies(['accessToken']);

// 	const baseURL = 'https://ta-da.world/api';

// 	// [1] method는 HTTP Request Method, url은 baseURL 뒤의 URL, requestBody는 api 요청 시 필요한 데이터(객체)
// 	async function fetchApi(method: string, url: string, requestBody: any) {
// 		try {
// 			const response = await fetch(baseURL+url, {
// 				method: method,
// 				headers: {
// 					'Content-Type': 'application/json',
// 					'Authorization': `Bearer ${cookie.accessToken}`,
// 					// Origin: '*'
// 				},
// 				body: JSON.stringify(requestBody)
// 			})
// 		}
// 	}
// };


const useApi = () => {
	return 2;
};

export default useApi;