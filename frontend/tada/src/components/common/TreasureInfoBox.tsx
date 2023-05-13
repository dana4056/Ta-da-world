import tw from 'tailwind-styled-components';
import { WhiteBox } from '../../utils/Semantics';
import { TreasureInfo } from '../../utils/Interfaces';
import { GraButton } from '../../utils/Semantics';

interface StyledDivProps {
	active: string;
}

interface TreasureInfoProps {
	treasure: TreasureInfo | null;
	isHost: boolean;
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

function TreasureInfoBox({ treasure, isHost }: TreasureInfoProps): JSX.Element {
	const handleDownload = async () => {
		if (!treasure?.imgPath) {
			console.error('No image path provided');
			return;
		}

		const response = await fetch(treasure.imgPath);
		const blob = await response.blob();

		const url = URL.createObjectURL(blob);

		const a = document.createElement('a');
		a.href = url;
		a.download = `treasure_image_${treasure.id}`;

		document.body.appendChild(a);

		a.click();

		document.body.removeChild(a);
	};

	return (
		<>
			<WhiteBox>
				<Header>보물</Header>
				<Img active="1" src={treasure?.imgPath} />
				<Text> Hint: {treasure?.hint}</Text>
				<GraButton
					className="z-10"
					from="from-orange"
					to="to-orange2"
					onClick={handleDownload}
				>
					보물 사진 다운로드
				</GraButton>
			</WhiteBox>
			{isHost ? (
				<WhiteBox>
					<Header>보상</Header>
					{treasure?.rewardImgPath ? (
						<Img
							active={treasure.reward ? '1' : ''}
							src={treasure.rewardImgPath}
						/>
					) : null}
					{treasure?.reward ? <Text>{treasure.reward}</Text> : null}
				</WhiteBox>
			) : null}
		</>
	);
}

export default TreasureInfoBox;
