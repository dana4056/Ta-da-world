import React from 'react';
import { TreasureInfo } from '../../utils/Interfaces';

const closetreasure = require('../../assets/images/closetreasure.png');
const opentreasure = require('../../assets/images/opentreasure.png');

interface HintListProps {
	treasure: TreasureInfo;
	onClick: () => void;
}

function HintList({
	treasure,
	onClick,
}: HintListProps): JSX.Element {
	return (
		<div
			className='flex flex-col items-center justify-center cursor-pointer'
			onClick={onClick}
		>
			<img
				className='w-20'
				src={treasure.status ? opentreasure : closetreasure}
				alt=''
			/>
			<p className='text-lg font-semibold text-gray3'>보물 {treasure.id + 1}</p>
		</div>
	);
}

export default HintList;
