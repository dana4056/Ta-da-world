import { createBrowserRouter } from 'react-router-dom';
import RootLayout from './layout/RootLayout';

import MainPage from './pages/MainPage';
import OauthKakao from './oauth/OauthKakao';
import HostHomePage from './pages/HostHomePage';
import HostRoomPage from './pages/HostRoomPage';
import UserWaitPage from './pages/UserWaitPage';
import UserNamePage from './pages/UserNamePage';
import UserLoadingPage from './pages/UserLoadingPage';
import UserCharacterPage from './pages/UserCharacterPage';
import UserPlayPage from './pages/UserPlayPage';
import TestPage from './pages/TestPage';

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
				path: 'userwait',
				element: <UserWaitPage />,
			},
			{
				path: 'username',
				element: <UserNamePage />,
			},
			{
				path: 'userloading',
				element: <UserLoadingPage />,
			},
			{
				path: 'usercharacter',
				element: <UserCharacterPage />,
			},
			{
				path: 'userplay',
				element: <UserPlayPage />,
			},
			{
				path: 'test',
				element: <TestPage />,
			},
		],
	},
	{
		path: '/users/oauth2-kakao',
		element: <OauthKakao />,
	},
]);

export default router;
