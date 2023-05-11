import { useState } from 'react';
import HintList from './HintList';
import HintDetail from './HintDetail';
import { TreasureInfo } from '../../utils/Interfaces';
import { Modal } from '../../utils/Semantics';
import tw from 'tailwind-styled-components';

interface HintModalProps {
	open: boolean
	onClose: () => void;
	treasures: TreasureInfo[];
}

interface StyledDivProps {
	active: string
}

const DynamicModal = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  `}
`;

function HintModal({open, onClose, treasures}: HintModalProps): JSX.Element {
	const [selectedTreasure, setSelectedTreasure] = useState<TreasureInfo | null>(
		null
	);

	const handleClick = (treasure: TreasureInfo) => {
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
		<DynamicModal active={open ? '1' : ''}>
			{open ? (
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
							<div className='grid grid-cols-3 gap-2 h-96 overflow-scroll'>
								{treasures.map((treasure) => (
									<HintList
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
			) : null}
		</DynamicModal>
	);
}

export default HintModal;
