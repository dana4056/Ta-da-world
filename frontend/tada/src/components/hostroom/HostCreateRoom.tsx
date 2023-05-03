import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { change } from '../../stores/host';
import { Circle } from '../../util/Semantics';
import { TreasureInfo } from '../../util/Interface';
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
	const a  = 'https://d2ab9z4xn2ddpo.cloudfront.net/%EC%84%9E%EA%B8%B0.png';
	const treasures : TreasureInfo[] = [
		{
			id: 1,
			img: a,
			lat: '37.5128064',
			lng: '127.0284288',
			hint: '학동역',
			rewardImg: a,
			reward: '나의 망므~',
			status : false,
			finderNick: null
		},
		{
			id: 2,
			img: a,
			lat: '37.513035165378085',
			lng: '127.02883155684492',
			hint: '카페 마오지래',
			rewardImg: '',
			reward: '커피',
			status : false,
			finderNick: null
		},
		{
			id: 3,
			img: a,
			lat: '37.512846012270565',
			lng: '127.0285939551883',
			hint: '주차장',
			rewardImg: a,
			reward: '',
			status : false,
			finderNick: null
		},
	];

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
			{section==='list' && <List treasures={treasures}/>}
			{section==='register' && <Register/>}
			{section !== 'register' && <div className='w-full flex justify-end'> <Circle className='fixed bottom-3 shadow-lg' onClick={startWait}> go! </Circle></div>}
		</div>
	);
}
  
export default HostCreateRoom;
