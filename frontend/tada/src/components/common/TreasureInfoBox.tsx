import tw from 'tailwind-styled-components';
import { WhiteBox } from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';

interface StyledDivProps {
	active: string;
}

interface TreasureInfoProps {
	treasure : TreasureInfo | null;
	isHost : boolean;
}

const Header = tw.div` 
	w-full
	text-lg text-gray5 font-black
	mb-1 mt-2 px-2
`;

const Text = tw.p`
	my-2 font-bold text-gray5
`;

const Img = tw.img<StyledDivProps>`
	${({ active }) => `
		${active ? 'rounded-t-lg' : 'rounded-lg'}
	`}
`;

function TreasureInfoBox({treasure, isHost}: TreasureInfoProps): JSX.Element {
	return (
		<>
			<WhiteBox>
				<Header>보물</Header>
				<Img active ='1' src={treasure?.imgPath}/>
				<Text> Hint: {treasure?.hint}</Text>
			</WhiteBox>
			{isHost?
				<WhiteBox>
					<Header>보상</Header>
					{ treasure?.rewardImgPath ?
						<Img active = {treasure.reward ? '1':''} src={treasure.rewardImgPath}/>
						: null
					}
					{ treasure?.reward ?
						<Text>{treasure.reward}</Text> : null
					}
				</WhiteBox>
				:
				null	
			}
		</>
	);
}
  
export default TreasureInfoBox;
