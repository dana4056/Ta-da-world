import React, {useState, useRef} from 'react';
import tw from 'tailwind-styled-components';
import { Modal, ModalSection, Button, ModalHeader, Label } from '../../../hooks/Semantics';
import {BsX}  from 'react-icons/bs';

const Header = tw.div`
 	w-full
	text-lg text-gray5 font-black
	mb-1 mt-2
`;

const Card = tw.div`
	flex flex-col items-center
	w-full
	bg-white rounded-lg shadow dark:bg-gray4 
	mb-6
`;

const Text = tw.p`
	my-3 font-bold text-gray5
`;

interface TreasureInfo {
	id: number;
	img: string;
	lat: string;
	lng: string;
	hint: string;
	reword_img: string;
	reword: string;
}


interface openProps {
	open: boolean;
	close: () => void;
	treasure : {
		id: number;
		img: string;
		lat: string;
		lng: string;
		hint: string;
		reword_img: string;
		reword: string;
	} | null;
}

interface StyledDivProps {
	active: string;
}

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  	`}
`;

const Img = tw.img<StyledDivProps>`
	${({ active }) => `
		${active ? 'rounded-t-lg' : 'rounded-lg'}
  	`}
`;

function TreasureModal({ open, close, treasure}: openProps) : JSX.Element{
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
						<Header>보물</Header>
						<Card>
							<Img active ='1' src={treasure?.img}/>
							<Text> Hint: {treasure?.hint}</Text>
						</Card>
						<Header>보상</Header>
						<Card>
							{ treasure?.reword_img ?
								<Img active = {treasure?.reword ? '1':''} src={treasure?.reword_img}/>
								: null
							}
							{ treasure?.reword ?
								<Text>{treasure?.reword}</Text> : null
							}
						</Card>
						<div className='w-full flex justify-end mb-2 text-main'>보물 삭제하기</div>
					</div>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

export default TreasureModal ;
