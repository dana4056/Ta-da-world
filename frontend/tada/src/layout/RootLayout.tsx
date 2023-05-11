import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../stores';
import Header from '../components/nav/Header';

const RootLayout = (): JSX.Element => {
	const ishost = useSelector((state: RootState) => state.host.accessToken);

	if(ishost){
		return (
			<div className='flex flex-col items-center w-full h-screen min-h-screen'>
				<Header/>
				<main className='w-full h-full'>
					<Outlet />
				</main>
			</div>
		);
	}else{
		return(
			<div className='flex flex-col items-center w-full h-screen min-h-screen'>
				<main className='w-full h-full'>
					<Outlet />
				</main>
			</div>
		);
	}
	
};

export default RootLayout;
