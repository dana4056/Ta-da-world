import React from 'react';

const closetreasure = require('../../assets/images/closetreasure.png');
const opentreasure = require('../../assets/images/opentreasure.png');

interface Treasure {
	id: number;
	isFound: boolean;
	hint: string;
}

interface HintListComponentProps {
	treasure: Treasure;
	onClick: () => void;
}

function HintListComponent({
	treasure,
	onClick,
}: HintListComponentProps): JSX.Element {
	return (
		<div
			className='flex flex-col items-center justify-center cursor-pointer'
			onClick={onClick}
		>
			<img
				className='w-20'
				src={treasure.isFound ? opentreasure : closetreasure}
				alt=''
			/>
			<p className='text-lg font-semibold text-gray3'>보물 {treasure.id + 1}</p>
		</div>
	);
}

export default HintListComponent;
