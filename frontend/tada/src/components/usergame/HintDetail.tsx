import React, { useState } from 'react';
import styles from '../../assets/css/HintDetailPage.module.css';
import { TreasureInfo } from '../../utils/Interfaces';


// const note = require('../../assets/images/note.png');
const note = require('../../assets/images/note/note (4).png');
// const leftChevron = require('../../assets/images/left_chevron.png');
// const rightChevron = require('../../assets/images/right_chevron.png');

interface Treasure {
	id: number;
	isFound: boolean;
	hint: string;
}

interface HintDetailProps {
	index: number,
	treasure: TreasureInfo;
	onClose: () => void;
	// onPreviousHint: () => void;
	// onNextHint: () => void;
}

function HintDetail({
	index,
	treasure,
	onClose,
	// onPreviousHint,
	// onNextHint,
}: HintDetailProps): JSX.Element {
	const handlePreviousHint = () => {
		// previous
	};

	const handleNextHint = () => {
		// Next
	};


	return (


		<div
			className='relative flex items-center justify-center w-full h-full'
		>
			<img className='absolute' src={note} alt='' />
			<div className='relative z-10 text-center w-4/6'>
				<p className='mt-5 mb-5 text-xl font-semibold'>
					보물 {index + 1}의 힌트
				</p>
				<p className='h-28 mb-5 text-lg font-semibold text-gray4 overflow-scroll'>{treasure.hint}</p>
			</div>
		</div>
	);
}

export default HintDetail;
