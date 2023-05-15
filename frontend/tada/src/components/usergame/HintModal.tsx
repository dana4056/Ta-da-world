import { useState } from 'react';
import HintList from './HintList';
import HintDetail from './HintDetail';
import { TreasureInfo } from '../../utils/Interfaces';
import { Modal } from '../../utils/Semantics';
import tw from 'tailwind-styled-components';
import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Mousewheel, Keyboard } from 'swiper';


interface HintModalProps {
	open: boolean
	onClose: () => void;
	treasures: TreasureInfo[];
}

interface StyledDivProps {
	active: string
}

const DynamicModal = tw(Modal) <StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  `}
`;

function HintModal({ open, onClose, treasures }: HintModalProps): JSX.Element {
	// const [selectedTreasure, setSelectedTreasure] = useState<TreasureInfo | null>(
	// 	null
	// );

	// const handleClick = (treasure: TreasureInfo) => {
	// 	setSelectedTreasure(treasure);
	// };

	// const handleCloseTreasureHint = () => {
	// 	setSelectedTreasure(null);
	// };

	const [selectedIndex, setSelectedIndex] = useState<number | null>(
		null
	);

	const handleClick = (idx: number) => {
		setSelectedIndex(idx);
	};

	const handleCloseTreasureHint = () => {
		setSelectedIndex(null);
	};


	const repeatHint = (idx: number) => {
		const arr = [];
		for (let i = 0; i < treasures.length; i++) {
			arr.push(
				<SwiperSlide className='h-full'>
					<HintDetail
						index={(idx + i - 1) % treasures.length}
						treasure={treasures[(idx + i - 1) % treasures.length]}
						onClose={handleCloseTreasureHint}
					/>

				</SwiperSlide>
			);
		}
		return arr;
	};

	return (
		<DynamicModal active={open ? '1' : ''}>
			{open ? (
				<div className='relative flex items-center justify-center w-full h-full'>
					{selectedIndex ? (
						<div className='relative z-10 flex flex-col justify-center items-center'>
							<Swiper
								cssMode={true}
								navigation={true}
								pagination={true}
								mousewheel={true}
								keyboard={true}
								modules={[Navigation, Mousewheel, Keyboard]}
								className="mySwiper h-96 w-80"
							>
								{repeatHint(selectedIndex)}
							</Swiper>
							<button
								className='px-4 py-2 bg-white rounded-full w-1/2 items-center'
								onClick={handleCloseTreasureHint}
							>
								뒤로가기
							</button>
						</div>

					) : (
						<div className='relative z-10 flex flex-col w-5/6 p-2 space-y-5 rounded-xl bg-white2/90 min-h-min'>
							<p className='mx-auto mt-3 text-xl font-bold text-center'>
								힌트 리스트
							</p>
							<div className='grid grid-cols-3 gap-2 h-96 overflow-scroll'>
								{treasures.map((treasure, index) => (
									<HintList
										key={treasure.id}
										index={index + 1}
										treasure={treasure}
										onClick={() => handleClick(index + 1)}
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
