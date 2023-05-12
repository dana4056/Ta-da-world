import React from 'react';
import BoxHeader from '../common/HeaderBox';

interface TreasureInfo {
	id: number;
	imgPath: string;
	lat: string;
	lng: string;
	hint: string;
	rewardImgPath: string;
	reward: string;
	status: boolean;
	finderNick: string | null;
}

interface TreasureListProps {
	treasureList: TreasureInfo[];
}

const treasureImg = require('../../assets/images/opentreasure.png');

function UserTreasureList({ treasureList }: TreasureListProps): JSX.Element {
	console.log(treasureList);
	return (
		<div className='p-5'>
			{treasureList && treasureList.length > 0 ? (
				<BoxHeader total={0} num={treasureList.length} title='찾은 보물' />
			) : (
				''
			)}
			{treasureList && treasureList.length > 0 ? (
				<div className='grid h-auto grid-cols-2 gap-10'>
					{treasureList.map((treasure) => (
						<div key={treasure.id}>
							<img src={treasureImg} alt='' />
							<p>{treasure.reward}</p>
						</div>
					))}
				</div>
			) : (
				<p>찾은 보물이 없습니다.</p>
			)}
		</div>
	);
}

export default UserTreasureList;
