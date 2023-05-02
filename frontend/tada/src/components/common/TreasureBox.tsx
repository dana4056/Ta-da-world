import tw from 'tailwind-styled-components';
import { TreasureInfo } from '../../util/Interface';

interface StyledDivProps {
	active: string;
}

interface TreasureInfoProps {
	treasure : TreasureInfo | null;
}

const Header = tw.div`
 	w-full
	text-lg text-gray5 font-black
	mb-1 mt-2 mx-2
`;

const Card = tw.div`
	flex flex-col items-center
	w-full
	bg-white rounded-lg shadow dark:bg-gray4 
	mb-6
`;

const Text = tw.p`
	my-3 font-bold text-gray5
`;

const Img = tw.img<StyledDivProps>`
	${({ active }) => `
		${active ? 'rounded-t-lg' : 'rounded-lg'}
  	`}
`;

function TreasureBox({treasure}: TreasureInfoProps) : JSX.Element {
	return (
		<div>
			<Header>보물</Header>
			<Card>
				<Img active ='1' src={treasure?.img}/>
				<Text> Hint: {treasure?.hint}</Text>
			</Card>
			<Header>보상</Header>
			<Card>
				{ treasure?.rewardImg ?
					<Img active = {treasure.reward ? '1':''} src={treasure.rewardImg}/>
					: null
				}
				{ treasure?.reward ?
					<Text>{treasure.reward}</Text> : null
				}
			</Card>
		</div>
	);
}
  
export default TreasureBox;
