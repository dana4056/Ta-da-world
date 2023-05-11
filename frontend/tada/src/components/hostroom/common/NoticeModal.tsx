import React, {useState} from 'react';
import tw from 'tailwind-styled-components';
import Swal from 'sweetalert2';
import {BsX}  from 'react-icons/bs';
import { Modal, ModalHeader} from '../../../util/Semantics';
import { Button } from '../../../util/Semantics';

interface openProps {
	open: boolean;
	close: (s:string) => void;
}

interface StyledDivProps {
	active: string;
}

function NoticeModal({ open, close}: openProps) : JSX.Element{
	const [notice, setNotice] = useState<string>('');

	//공지 작성	
	const handleNotice = (e : React.ChangeEvent<HTMLTextAreaElement>) : void  => {
		setNotice(e.target.value);
	};

	//공지 보내기	
	const sendNotice = () : void  => {
		if(notice){
			close(notice);
		}else{
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '공지를 입력해주세요', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	};

	return (
		<Modal2 active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>공지하기</div>
						<BsX onClick={()=> {close('');}} size="32" color="#535453"/>
					</ModalHeader>
					<Textarea value={notice||''} name="notice" id="notice" placeholder='전체 공지!' onChange={handleNotice}/>
					<Button onClick={sendNotice}>보내기</Button>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

const Textarea = tw.textarea`
	w-full h-full
	text-base
	bg-white rounded-lg border-2 border-gray
	py-3 px-3 my-2
`;

const ModalSection = tw.div`
	w-full h-full
	flex flex-col justify-center items-center
	w-full h-30 max-w-xs
	bg-white2 rounded-lg border-8 border-white2
	py-2 px-1
`;

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  	`}
`;

export default NoticeModal;
