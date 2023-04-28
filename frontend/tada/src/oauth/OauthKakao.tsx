import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import useLogin from '../hooks/useLogin';

function OauthKakao(): JSX.Element {
	const navigate = useNavigate();
	// const { error, handleKakaoLogin } = useLogin();
	const authorizeCode: string | null = new URL(window.location.href).searchParams.get('code');
	const accessDenied: string | null = new URL(window.location.href).searchParams.get('error');
	console.log('authorize code: ', authorizeCode);
	console.log('access denied: ', accessDenied);

	useEffect(() => {
		if (accessDenied) {
			navigate('/');
		} else {
			fetch('https://kauth.kakao.com/oauth/token', {
				method: 'POST',
				headers: {
					'Content-type': 'application/x-www-form-urlencoded'
				},
				body: `grant_type=authorization_code&client_id=${process.env.REACT_APP_API_KEY_KAKAO}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&code=${authorizeCode}`,
			})
				.then(res => res.json())
				.then(data => {
					if(data.access_token) {
						console.log(data.access_token);
					}
				});
		}

	}, []);

	// useEffect(() => {
	// 	if (error) {
	// 		console.error(error);
	// 	}
	// }, [error]);

	return (
		<div>
      카카오 로그인 중입니다...
		</div>
	);
}

export default OauthKakao;
