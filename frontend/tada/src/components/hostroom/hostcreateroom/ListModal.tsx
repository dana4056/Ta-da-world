import React, {useState, useRef} from 'react';
import tw from 'tailwind-styled-components';
import {BsX}  from 'react-icons/bs';
import { TreasureInfo } from '../../../util/Interface';
import { Modal, ModalSection, ModalHeader } from '../../../util/Semantics';
import TreasureInfoBox from '../../common/TreasureInfoBox';


interface openProps {
	open: boolean;
	close: () => void;
	treasure : TreasureInfo | null;
}

interface StyledDivProps {
	active: string;
}

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  	`}
`;

function ListModal({ open, close, treasure}: openProps) : JSX.Element{
	//사진 삭제
	const reset  = () : void  => {
		//
	};

	return (
		<Modal2 active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 정보
						</div>
						<BsX onClick={()=> {close();}} size="32" color="#535453"/>
					</ModalHeader>
					<div className='flex flex-col items-center overflow-y-scroll'>
						{treasure ?
							<TreasureInfoBox isHost={true} treasure={treasure} />
							: null
						}
						<div className='w-full flex justify-end mb-2 text-main'>보물 삭제하기</div>
					</div>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

export default ListModal;
