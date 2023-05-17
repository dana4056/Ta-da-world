import React from 'react';

const sharing = require('../../assets/images/send.png');

const KAKAO_API_KEY = process.env.REACT_APP_JS_KEY_KAKAO;

declare global {
    interface Window {
        Kakao: any;
    }
}

interface ShareButtonProps {
    title: string;
    description: string;
	code: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({
	title,
	description,
	code
}) => {
	const handleClick = () => {
		if (!window.Kakao.isInitialized()) {
			window.Kakao.init(KAKAO_API_KEY);
		}
        

		window.Kakao.Link.sendDefault({
			objectType: 'feed',
			content: {
				title,
				description,
				imageUrl: 'https://cdn-icons-png.flaticon.com/512/4230/4230569.png',
				link: {
					mobileWebUrl: `https://ta-da.world?code=${code}`,
					webUrl: `https://ta-da.world?code=${code}`,
				},
			},
			buttons: [
				{
					title: '게임하러 가기!',
					link: {
						mobileWebUrl: `https://ta-da.world?code=${code}`,
						webUrl: `https://ta-da.world?code=${code}`,
					},
				},
			],
		});
	};

	return <img onClick={handleClick} className='inline w-4 ml-1 cursor-pointer' src={sharing} alt='sharingbtn'/>;
};

export default ShareButton;
