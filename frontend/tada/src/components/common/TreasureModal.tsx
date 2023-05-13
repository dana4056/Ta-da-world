import tw from 'tailwind-styled-components';
import { BsX } from 'react-icons/bs';
import {
	Modal,
	ModalSection,
	ModalHeader,
	WhiteBox,
} from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';
import TreasureInfoBox from './TreasureInfoBox';

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

function TreasureModal({
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
						<div>보물 정보</div>
						<BsX
							onClick={() => {
								close();
							}}
							size="32"
							color="#535453"
						/>
					</ModalHeader>
					<div className="flex flex-col items-center overflow-y-scroll">
						<WhiteBox className="my-0 text-white bg-main">
							{treasure?.status ? (
								<>
									<p>{treasure.finderNick} 님이</p>
									<p>보물을 찾았어요!</p>
								</>
							) : (
								<p>아직 아무도 보물을 찾지 못했어요!</p>
							)}
						</WhiteBox>
						{treasure ? (
							<TreasureInfoBox isHost={isHost} treasure={treasure} />
						) : null}
					</div>
				</ModalSection>
			) : null}
		</DynamicModal>
	);
}

export default TreasureModal;
