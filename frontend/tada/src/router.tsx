import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layout/RootLayout';

import MainPage from './pages/MainPage';
import HostHomePage from './pages/HostHomePage';
import HostRoomPage from './pages/HostRoomPage';
import UserWaitPage from './pages/UserWaitPage';

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
		],
	},
]);

export default router;
