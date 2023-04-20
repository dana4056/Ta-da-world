import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';

const RootLayout = () => {
	return (
		<div className="flex flex-col min-h-screen">
			<Header />
			<main className="flex flex-col mt-60">
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
