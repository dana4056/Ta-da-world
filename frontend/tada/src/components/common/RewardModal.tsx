import tw from 'tailwind-styled-components';
import { BsX } from 'react-icons/bs';
import {
	Modal,
	ModalSection,
	ModalHeader
} from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';
// import TreasureInfoBox from './TreasureInfoBox';
import RewardInfoBox from './RewardInfoBox';

interface openProps {
	open: boolean;
	isHost: boolean;
	close: () => void;
	treasure: TreasureInfo | null;
}

interface StyledDivProps {
	active: string;
}

const DynamicModal = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
	`}
`;

function RewardModal({
	open,
	close,
	treasure,
	isHost,
}: openProps): JSX.Element {
	return (
		<DynamicModal active={open ? '1' : ''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>보상 정보</div>
						<BsX
							onClick={() => {
								close();
							}}
							size="32"
							color="#535453"
						/>
					</ModalHeader>
					<div className="flex flex-col items-center overflow-y-scroll">
						{treasure ? (
							<RewardInfoBox isHost={isHost} treasure={treasure} />
						) : null}
					</div>
				</ModalSection>
			) : null}
		</DynamicModal>
	);
}

export default RewardModal;
