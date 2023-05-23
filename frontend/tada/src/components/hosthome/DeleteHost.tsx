import { useEffect } from 'react';
import Swal from 'sweetalert2';
import useApi from '../../hooks/useApi';
import useLogout from '../../hooks/useLogout';

function DeleteHost(): JSX.Element {
	const deleteApi = useApi();
	const logoutApi = useLogout();

	useEffect(()=>{
		if(deleteApi.data?.success){
			logoutApi.handleLogout();
		} else if(deleteApi.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '회원탈퇴 실패!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [deleteApi.data]);

	const deleteHost = () :void => {
		Swal.fire({
			text: '회원 탈퇴를 진행하시겠습니까?',
			width: 300,
			showCancelButton: true,
			iconColor: '#2BDCDB ',
			confirmButtonColor: '#2BDCDB ',
			confirmButtonText: '탈퇴',
			cancelButtonText: '취소'
		}).then(function(e){
			if(e.isConfirmed === true) {
				//방 변경
				deleteApi.fetchNotBodyApiWithToken('DELETE', '/users');
			}
		});
	};
	
	return (
		<div className="flex items-end justify-end w-full pr-4 text-white mt-11">
			<p onClick={deleteHost}>회원탈퇴</p>
		</div>
	);
}

export default DeleteHost;
