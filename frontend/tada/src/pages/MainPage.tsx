import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import LoginUser from '../components/userpregame/LoginUser';
import LoginHost from '../components/userpregame/LoginHost';
  

// 클립보드 테스트용입니돠..
// import { CopyToClipboard } from 'react-copy-to-clipboard';
// import Swal from 'sweetalert2';
// const copy = require('../assets/images/copy.png');
// const sharing = require('../assets/images/send.png');

const logo = require('../assets/images/logo.png');

function MainPage(): JSX.Element {
	const navigate = useNavigate();
	const ishost = useSelector((state: RootState) => state.host.accessToken);

	const [activeComponent, setActiveComponent] = useState<'User' | 'Host'>(
		'User'
	);


	const handleClick = (): void => {
		setActiveComponent((defaultComponent) =>
			defaultComponent === 'User' ? 'Host' : 'User'
		); 
	};

	// const createKakaoButton = () => {
	// 	const kakao = new window.kakao;
	// 	kakao.init(process.env.REACT_APP_API_KEY_KAKAO);
	// 	// kakao.init(process.env.REACT_APP_API_KEY_KAKAO);
	// 	console.log('hihihi1');

	// 	if (kakao) {
	// 		console.log('hihihi2');
	// 		if (!kakao.isInitialized()) {
	// 			kakao.init(process.env.REACT_APP_API_KEY_KAKAO);
	// 		}
	// 		console.log('hihihi3');
	// 		kakao.Share.createDefaultButton({
	// 			container: '#kakaotalk-sharing-btn',
	// 			objectType: 'feed',
	// 			content: {
	// 				title: '오늘의 디저트',
	// 				description: '아메리카노, 빵, 케익',
	// 				imageUrl:
	// 					'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
	// 				link: {
	// 					mobileWebUrl: 'https://developers.kakao.com',
	// 					webUrl: 'https://developers.kakao.com',
	// 				},
	// 			},
	// 			buttons: [
	// 				{
	// 					title: '웹으로 이동',
	// 					link: {
	// 						mobileWebUrl: 'https://developers.kakao.com',
	// 						webUrl: 'https://developers.kakao.com',
	// 					},
	// 				},
	// 			],
	// 		});
	// 		console.log('hihihi4');
	// 	}
	// };

	useEffect(() => {
		// const kakao = window.kakao;
		// kakao.init(process.env.REACT_APP_API_KEY_KAKAO);
		// createKakaoButton();

		if (ishost) {
			navigate('/hosthome');
		}
	});

	// // 카카오 공유 테스트 부분
	// const kakaoSharing = (): void => {

	// 	const createKakaoButton = () => {
	// 		const kakao = window.kakao;

	// 		if (kakao) {

	// 			if (!kakao.isInitialized()) {
	// 				kakao.init(process.env.REACT_APP_API_KEY_KAKAO);
	// 			}

	// 			kakao.Share.createDefaultButton({
	// 				container: '#kakaotalk-sharing-btn',
	// 				objectType: 'feed',
	// 				content: {
	// 					title: '오늘의 디저트',
	// 					description: '아메리카노, 빵, 케익',
	// 					imageUrl:
	// 						'https://mud-kage.kakao.com/dn/NTmhS/btqfEUdFAUf/FjKzkZsnoeE4o19klTOVI1/openlink_640x640s.jpg',
	// 					link: {
	// 						mobileWebUrl: 'https://developers.kakao.com',
	// 						webUrl: 'https://developers.kakao.com',
	// 					},
	// 				},
	// 				buttons: [
	// 					{
	// 						title: '웹으로 이동',
	// 						link: {
	// 							mobileWebUrl: 'https://developers.kakao.com',
	// 							webUrl: 'https://developers.kakao.com',
	// 						},
	// 					},
	// 				],
	// 			});
	// 		}
	// 	};
	// };	

	return (
		<div className='flex flex-col items-center justify-center h-full'>
			<img className='w-4/5 mb-5' src={logo} alt='logo' />
			{activeComponent === 'User' ? (
				<LoginUser onHostClick={handleClick} />
			) : (
				<LoginHost onUserClick={handleClick} />
			)}

			{/* 클립보드 테스트 */}
			{/* <br></br>
			<p className="mb-1 text-white font-bold">
				s938sdf90u 
				<CopyToClipboard  text="code" onCopy={() => Swal.fire({          
					width: 300,
					iconColor: '#2BDCDB',
					html: '초대 코드가 복사되었습니다!', 
					confirmButtonColor: '#2BDCDB',
					confirmButtonText: '확인',
				})}>
					<text className='inline'>
						<img className='w-4 cursor-pointer inline ml-1' src={copy} alt='copybtn' />
					</text>
				</CopyToClipboard> */}
			{/* <img className='w-4 cursor-pointer inline ml-1' onClick={()=> {createKakaoButton();}} src={sharing} alt="sharing" /> */}
			{/* </p> */}
		</div>
	);
}

export default MainPage;
