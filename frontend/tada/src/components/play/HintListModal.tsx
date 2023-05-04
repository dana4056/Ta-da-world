import React, { useState } from 'react';
import HintListComponent from './HintListComponent';
import HintDetail from './HintDetail';

interface Treasure {
	id: number;
	isFound: boolean;
	hint: string;
}

interface HintListModalProps {
	treasures: Treasure[];
	onClose: () => void;
}

function HintListModal({
	treasures,
	onClose,
}: HintListModalProps): JSX.Element {
	const [selectedTreasure, setSelectedTreasure] = useState<Treasure | null>(
		null
	);

	const handleClick = (treasure: Treasure) => {
		setSelectedTreasure(treasure);
	};

	const handleCloseTreasureHint = () => {
		setSelectedTreasure(null);
	};

	const handlePreviousHint = () => {
		if (selectedTreasure) {
			const currentIndex = treasures.findIndex(
				(treasure) => treasure.id === selectedTreasure.id
			);
			const newIndex = (currentIndex - 1 + treasures.length) % treasures.length;
			setSelectedTreasure(treasures[newIndex]);
		}
	};

	const handleNextHint = () => {
		if (selectedTreasure) {
			const currentIndex = treasures.findIndex(
				(treasure) => treasure.id === selectedTreasure.id
			);
			const newIndex = (currentIndex + 1) % treasures.length;
			setSelectedTreasure(treasures[newIndex]);
		}
	};

	return (
		<div className='relative flex items-center justify-center w-full h-full'>
			{selectedTreasure ? (
				<HintDetail
					treasure={selectedTreasure}
					onClose={handleCloseTreasureHint}
					onPreviousHint={handlePreviousHint}
					onNextHint={handleNextHint}
				/>
			) : (
				<div className='relative z-10 flex flex-col w-5/6 p-2 space-y-5 rounded-xl bg-white2/90 min-h-min'>
					<p className='mx-auto mt-3 text-xl font-bold text-center'>
						힌트 리스트
					</p>
					<div className='grid grid-cols-3 gap-2'>
						{treasures.map((treasure) => (
							<HintListComponent
								key={treasure.id}
								treasure={treasure}
								onClick={() => handleClick(treasure)}
							/>
						))}
					</div>
					<button
						className='px-4 py-2 mx-auto mt-10 mb-2 bg-white rounded-full '
						onClick={onClose}
					>
						닫기
					</button>
				</div>
			)}
		</div>
	);
}

export default HintListModal;
