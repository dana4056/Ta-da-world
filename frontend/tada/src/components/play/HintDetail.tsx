import React, { useState } from 'react';
import styles from '../../assets/css/HintDetailPage.module.css';

const note = require('../../assets/images/note.png');
const leftChevron = require('../../assets/images/left_chevron.png');
const rightChevron = require('../../assets/images/right_chevron.png');

interface Treasure {
	id: number;
	isFound: boolean;
	hint: string;
}

interface HintDetailProps {
	treasure: Treasure;
	onClose: () => void;
	onPreviousHint: () => void;
	onNextHint: () => void;
}

function HintDetail({
	treasure,
	onClose,
	onPreviousHint,
	onNextHint,
}: HintDetailProps): JSX.Element {
	const handlePreviousHint = () => {
		// previous
	};

	const handleNextHint = () => {
		// Next
	};

	const [startX, setStartX] = useState<number | null>(null);

	const handleTouchStart = (event: React.TouchEvent) => {
		setStartX(event.touches[0].clientX);
	};

	const handleTouchEnd = (event: React.TouchEvent) => {
		const endX = event.changedTouches[0].clientX;
		if (startX !== null && Math.abs(endX - startX) > 50) {
			if (endX > startX) {
				onPreviousHint();
			} else {
				onNextHint();
			}
		}
		setStartX(null);
	};

	return (
		<div
			className='relative flex items-center justify-center w-full h-full'
			onTouchStart={handleTouchStart}
			onTouchEnd={handleTouchEnd}
		>
			<img className='absolute' src={note} alt='' />
			<div className='relative z-10 text-center'>
				<p className='mb-10 text-xl font-semibold'>
					보물 {treasure.id + 1}의 힌트
				</p>
				<p className='mb-5 text-lg font-semibold text-gray4'>{treasure.hint}</p>
				<button
					className='px-4 py-2 mt-10 bg-white rounded-full '
					onClick={onClose}
				>
					뒤로가기
				</button>
			</div>
			<img
				className='absolute left-0 cursor-pointer'
				src={leftChevron}
				alt=''
				onClick={onPreviousHint}
			/>
			<img
				className='absolute right-0 cursor-pointer'
				src={rightChevron}
				alt=''
				onClick={onNextHint}
			/>
		</div>
	);
}

export default HintDetail;
