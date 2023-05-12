import { useState } from 'react';
import tw from 'tailwind-styled-components';
import { Modal, ModalSection, ModalHeader } from '../../utils/Semantics';
import { BsX } from 'react-icons/bs';
import GameCapture from './GameCapture';
import RewardSuccess from './RewardSuccess';
import RewardFail from './RewardFail';

import { RootState } from '../../stores';
import { useSelector } from 'react-redux';

// const camImg = require('../../assets/images/camera.png');

interface GameModalProps {
	open: boolean;
	close: () => void;
	treasureId: number
}

interface StyledDivProps {
	active: string;
}

const DynamicModal = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  `}
`;

function GameModal({open, close, treasureId}: GameModalProps): JSX.Element{
	console.log('현재 판별 보물 번호: ', treasureId);
	const userId = useSelector((state: RootState) => state.user.userId);
	const [captureMode, setCaptureMode] = useState<boolean>(true);
	const [rewardMode, setRewardMode] = useState<boolean>(false);
	const [success, setSuccess] = useState<boolean | null>(null);
	const handleSubmit = (msg: string) => {
		console.log('--------------msg--------------: ', msg);
		if (msg === 'Success') {
			setSuccess(true);
			setCaptureMode(false);
			setRewardMode(true);
		}
		if (msg === 'Fail') {
			setSuccess(false);
			setCaptureMode(false);
			setRewardMode(true);
		}

		setTimeout(() => {
			close();
			setCaptureMode(true);
			setRewardMode(false);
			setSuccess(null);
		}, 5000);
	};

	return (
		<DynamicModal active = {open ? '1' : ''}>
			{open ? (
				<ModalSection>
					{ captureMode ? <>
						<ModalHeader>
							<div>
								보물 사진 찍기
							</div>
							<BsX onClick={()=> {close();}} size="32" color="#535453"/>
						</ModalHeader>
						<GameCapture userId={userId} treasureId={treasureId} onSubmit={handleSubmit} /> 
					</> : null}
					{ rewardMode ? <>
						{ success ? 
							<RewardSuccess />
							:
							<RewardFail />
						}
					</> : null}
				</ModalSection>
			) : null}
		</DynamicModal>
	);
}

export default GameModal;
