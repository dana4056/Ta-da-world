import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

const logo = require('../assets/images/logo.png');

function OauthKakao(): JSX.Element {
	const navigate = useNavigate();
	const { data, error, handleLogin } = useLogin();
	const AUTH_CODE: string | null = new URL(window.location.href).searchParams.get('code');
	const ACCESS_DENIED: string | null = new URL(window.location.href).searchParams.get('error');

	useEffect(() => {
		console.log('Authorization Code: ', AUTH_CODE);
		// 동의 취소할 경우 홈 화면으로 리다이렉트
		if (ACCESS_DENIED) {
			navigate('/');
		} else {
			// 토큰 받기
			fetch('https://kauth.kakao.com/oauth/token', {
				method: 'POST',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded'
				},
				body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_API_KEY_KAKAO}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}kakao&code=${AUTH_CODE}`,
			})
				.then(res => res.json())
				.then(data => {
					// 토큰 정보 보기
					console.log('ACCESS_TOKEN: ', data);
					fetch('https://kapi.kakao.com/v1/user/access_token_info', {
						method: 'GET',
						headers: {
							'Authorization': `Bearer ${data.access_token}`
						}
					})
						.then(res => res.json())
						.then(data => {
							console.log('USER_DATA: ', data);
							handleLogin(data.id, 'kakao');
						})
						.catch((error) => {
							console.log(error);
						});
				});
		}
	}, []);

	useEffect(() => {
		if (data) {
			navigate('/hosthome');
		}
		if (error) {
			console.error(error);
			navigate('/');
		}
	});

	return (
		<div className='flex flex-col justify-center min-h-screen pt-1 pb-8'>
			<div className='flex justify-center w-full'>
				<img className='w-32 mx-auto' src={logo}/>
			</div>
			<p className='flex justify-center font-bold text-white mt-7'>Loading...</p>
		</div>
	);
}

export default OauthKakao;
