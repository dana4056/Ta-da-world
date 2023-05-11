import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../stores';
import { changecode } from '../stores/host';
import { useCookies } from 'react-cookie';
import Swal from 'sweetalert2';
import DeleteHost from '../components/hosthome/DeleteHost';
import RoomStatus from '../components/hosthome/RoomStatus';
import useApi from '../hooks/useApi';

function HostHomePage(): JSX.Element {
	const dispatch = useDispatch();
	const [cookie] = useCookies(['accessToken']);
	const status = useSelector((state: RootState) => state.host.status);
	const roomstatusApi = useApi(); //방 상태 조회

	useEffect(()=>{
		if(cookie.accessToken !=='undefined'){
			console.log('hosthome 방 상태 조회');
			roomstatusApi.fetchNotBodyApiWithToken('GET', '/rooms/host/status');
		}
	}, []);

	useEffect(() => {
		if(roomstatusApi.data?.success){
			const code = roomstatusApi.data.data.code;
			const status = roomstatusApi.data.data.status;
			const refreshToken = '';
			dispatch(changecode({refreshToken, status, code}));
		} else if(roomstatusApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '방 조회 실패', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [roomstatusApi.data]);

	return (
		<div className='h-full'>
			<div className='flex flex-col items-center justify-center h-5/6'>
				<RoomStatus status={status} />
			</div>
			<DeleteHost />
		</div>
	);
}

export default HostHomePage;
