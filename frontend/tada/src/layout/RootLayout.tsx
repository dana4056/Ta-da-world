import { Outlet, useLocation } from 'react-router-dom';
import Header from '../components/nav/Header';

const RootLayout = (): JSX.Element => {
	const location = useLocation();

	return (
		<div className='flex flex-col items-center w-full h-screen min-h-screen'>
			{location.pathname !== '/' && <Header />}
			<main className='w-full h-full'>
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
