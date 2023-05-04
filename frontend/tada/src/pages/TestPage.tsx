import React, { useState } from 'react';
import HintListModal from '../components/play/HintListModal';

interface Treasure {
	id: number;
	isFound: boolean;
	hint: string;
}

const treasures: Treasure[] = [
	{ id: 0, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 1, isFound: true, hint: '김민경 닮은 바위를 찾아보세요' },
	{ id: 2, isFound: false, hint: '김민경 닮은 바위를 찾아보세요' },
	{ id: 3, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 4, isFound: false, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 5, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 6, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 7, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 8, isFound: false, hint: '한원석 닮은 바위를 찾아보세요' },
	{ id: 9, isFound: true, hint: '한원석 닮은 바위를 찾아보세요' },
];

function TestPage(): JSX.Element {
	const [modalOpen, setModalOpen] = useState(false);

	const openModal = () => {
		setModalOpen(true);
	};

	const closeModal = () => {
		setModalOpen(false);
	};

	return (
		<>
			{modalOpen && (
				<HintListModal treasures={treasures} onClose={closeModal} />
			)}
			<button
				className='px-4 py-2 text-white bg-gradient-to-r from-blue to-blue2'
				onClick={openModal}
			>
				힌트보기
			</button>
		</>
	);
}

export default TestPage;
