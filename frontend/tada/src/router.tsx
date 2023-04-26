import { createBrowserRouter } from 'react-router-dom';

import RootLayout from './layout/RootLayout';

import MainPage from './pages/MainPage';
import HostHomePage from './pages/HostHomePage';
import HostRoomPage from './pages/HostRoomPage';

const router = createBrowserRouter([
	{
		path: '/',
		element: <RootLayout />,
		children: [
			{ index: true, element: <MainPage/> },
			{
				path: 'hosthome',
				element: <HostHomePage/>,
			},
			{
				path: 'hostroom',
				element: <HostRoomPage/>,
			},
		]
	},
]);

export default router;
