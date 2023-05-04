import React from 'react';

interface HintModalProps {
	title: string;
	content: string;
	onClose: () => void;
}

const note = require('../../assets/images/note.png');

function HintModal({ title, content, onClose }: HintModalProps): JSX.Element {
	return (
		<>
			<div className='relative flex items-center justify-center w-full h-full'>
				<img className='absolute' src={note} alt='' />
				<div className='relative z-10 text-center -top-10'>
					<h2 className='w-48 mb-4 text-xl font-bold'>{title}</h2>
					<p className='absolute mt-5'>{content}</p>
					<button
						className='absolute px-4 py-2 text-white rounded bg-gradient-to-r from-blue to-blue2'
						onClick={onClose}
					>
						닫기
					</button>
				</div>
			</div>
		</>
	);
}

export default HintModal;
