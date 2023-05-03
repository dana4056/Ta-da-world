import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { change } from '../../stores/host';
import { Circle } from '../../util/Semantics';
import tw from 'tailwind-styled-components';

import Info from './hostcreateroom/Info';
import List from './hostcreateroom/List';
import Register from './hostcreateroom/Register';

interface StyledDivProps {
	active: string;
}

const SectionOpt = tw.div<StyledDivProps>`
	w-1/3 h-12
	flex justify-center items-center
	${({ active }) => `
		${active ? 'font-bold' : 'font-medium'}
		${active ? 'text-main' : 'text-slate-300'}
		${active ? 'text-base' : 'text-sm'}
		${active ? 'border-b-4 border-b-main' : ' '}
  	`}
`;

function HostCreateRoom() : JSX.Element {
	const dispatch = useDispatch(); // 디스패치 함수를 가져옵니다
	const [section, setSection] = useState<string>('info');

	const handleClick = (e:string) : void => {
		setSection(e);
	};

	const startWait = () : void => {
		//예외처리 기본정보 & 보물 등록된 데이터 있어야함
		dispatch(change(2));
	};
	  
	return (
		<div className="h-full flex flex-col rounded-t-lg bg-white">
			<div className="flex mb-8">
				<SectionOpt active = {section === 'info' ? '1':''} onClick={()=>handleClick('info')}>
					기본정보
				</SectionOpt>
				<SectionOpt active = {section === 'list' ? '1':''} onClick={()=>handleClick('list')}>
					보물목록
				</SectionOpt>
				<SectionOpt active = {section === 'register' ? '1':''} onClick={()=>handleClick('register')}>
					보물등록
				</SectionOpt>
			</div>
			{section==='info' && <Info titleProps='api로받아야해' timeProps='60'/>}
			{section==='list' && <List/>}
			{section==='register' && <Register/>}
			{section !== 'register' &&<div className='w-full flex justify-end'> <Circle className='fixed bottom-3 shadow-lg' onClick={startWait}> go! </Circle></div>}
		</div>
	);
}
  
export default HostCreateRoom;
