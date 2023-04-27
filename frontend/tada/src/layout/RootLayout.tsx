import { Outlet } from 'react-router-dom';
import Header from '../components/nav/Header';

const RootLayout = () : JSX.Element => {
	return (
		<div className="h-screen min-h-screen w-full flex flex-col items-center">
			<Header />
			<main className="h-full w-full pr-4 pl-4">
				<Outlet />
			</main>
		</div>
	);
};

export default RootLayout;
