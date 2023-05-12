interface LoginHostProps {
  onUserClick: () => void;
}

const kakao_login = require('../../assets/images/kakao_login.png');
const API_KEY_KAKAO = process.env.REACT_APP_API_KEY_KAKAO;
// const API_KEY_KAKAO = '2abf0e7d3c124964d0048b430a5ce52c';
const REDIRECT_URI_SITE = process.env.REACT_APP_REDIRECT_URI_SITE;
// const REDIRECT_URI_SITE = 'http://localhost:3000/users/oauth2-';
const OAUTH_KAKAO = `https://kauth.kakao.com/oauth/authorize?client_id=${API_KEY_KAKAO}&redirect_uri=${
	REDIRECT_URI_SITE + 'kakao'
}&response_type=code`;

function LoginHost({ onUserClick }: LoginHostProps): JSX.Element {
	return (
		<div className='flex flex-col items-center justify-center'>
			<a className='flex items-center justify-center' href={OAUTH_KAKAO}>
				<img src={kakao_login} alt='' className='w-2/3' />
			</a>
			<button
				type='button'
				onClick={onUserClick}
				className='text-sm text-white border-b'
			>
				<p className='mt-10'>{'>'} 참가자는 이쪽으로 입장해주세요</p>
			</button>
		</div>
	);
}

export default LoginHost;
