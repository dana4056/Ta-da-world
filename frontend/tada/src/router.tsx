import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/RootLayout';

import MainPage from './pages/MainPage';
import OauthKakao from './pages/oauth/OauthKakao';
import HostHomePage from './pages/HostHomePage';
import HostRoomPage from './pages/HostRoomPage';
import UserWaitPage from './pages/UserWaitPage';
import UserNamePage from './pages/UserNamePage';
import UserLoadingPage from './pages/UserLoadingPage';
import UserCharacterPage from './pages/UserCharacterPage';
import UserGamePage from './pages/UserGamePage';
import UserEndPage from './pages/UserEndPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{ index: true, element: <MainPage /> },
			{
				path: 'hosthome',
				element: <HostHomePage />,
			},
			{
				path: 'hostroom',
				element: <HostRoomPage />,
			},
			{
				path: 'username',
				element: <UserNamePage />,
			},
			{
				path: 'usercharacter',
				element: <UserCharacterPage />,
			},
			{
				path: 'userwait',
				element: <UserWaitPage />,
			},
			{
				path: 'userloading',
				element: <UserLoadingPage />,
			},
			{
				path: 'usergame',
				element: <UserGamePage />,
			},
			{
				path: 'userend',
				element: <UserEndPage />,
			},
		],
	},
	{
		path: '/users/oauth2-kakao',
		element: <OauthKakao />,
	},
]);

export default router;
