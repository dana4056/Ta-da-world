import { useState } from 'react';
import tw from 'tailwind-styled-components';
import { Label, Input, Button } from '../../../hooks/Semantics';

const Textarea = tw.textarea`
	text-base
	bg-white2 rounded-lg border-2 border-gray
	py-3 px-3 mb-8
`;

const MiniButton = tw.div`
	flex justify-center items-center 
	w-24 h-7 
	bg-main3 rounded-lg 
	text-white text-sm font-bold
	ml-4
`;

function Register() : JSX.Element {
	const [treasure, setTreasure] = useState<string>('');
	const [lat, setLat] = useState<string>('');
	const [lon, setLon] = useState<string>('');
	const [hint, setHint] = useState<string>('');
	const [reward, setReward] = useState<string>('');
	const [rewardDes, setRewardDes] = useState<string>('');

	const handleHint = (e: React.ChangeEvent<HTMLTextAreaElement>) : void  => {
		setHint(e.target.value);
	};

	return (
		<div className='flex flex-col px-4'>
			<>
				<Label> 보물사진 </Label>
			</>
			<>
				<div className='flex'>
					<Label> 위치(위도/경도) </Label>
					<MiniButton> 미세조정 </MiniButton>
				</div>
				<div className='flex justify-around'>
					<Input type="text" placeholder="위도"/>
					<Input type="text" placeholder="경도"/>
				</div>
			</>
			<>
				<Label htmlFor="hint"> 힌트 </Label>
				<Textarea name="hint" id="hint" placeholder="보물의 힌트를 주세요!" onChange={handleHint}/>
			</>
			<div className='flex justify-center items-center mt-12'>
				<Button> 등록 </Button>
			</div>
		</div>
	);
}
  
export default Register;
