import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/nav/Header';

const RootLayout = (): JSX.Element => {
	const location = useLocation();

	const excludedPaths: string[] = [
		'/',
		'/username',
		'/userloading',
		'/usercharacter',
	];

	return (
		<div className='flex flex-col items-center w-full h-screen min-h-screen'>
			{!excludedPaths.includes(location.pathname) && <Header />}
			<main className='w-full h-full'>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
