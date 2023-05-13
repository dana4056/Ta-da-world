import React, { useState } from 'react';
import BoxHeader from '../common/HeaderBox';
import TreasureModal from '../common/TreasureModal';

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

	const [no, setNo] = useState<number>(0);
	const [open, setOpen] = useState<boolean>(false);

	const handleNo = (i: number): void => {
		console.log(i);
		setNo(i);
	};

	//map 모달창 열기
	const openModal = (): void => {
		setOpen(true);
	};
	//map 모달창 닫기
	const closeModal = (): void => {
		setOpen(false);
	};

	return (
		<>
			<TreasureModal
				isHost={false}
				open={open}
				close={closeModal}
				treasure={treasureList[no]}
			/>
			<div className="p-5">
				{treasureList && treasureList.length > 0 ? (
					<BoxHeader total={0} num={treasureList.length} title="찾은 보물" />
				) : (
					''
				)}
				{treasureList && treasureList.length > 0 ? (
					<div className="grid h-auto grid-cols-2 gap-10">
						{treasureList.map((treasure, index) => (
							<div
								onClick={() => {
									handleNo(index);
									openModal();
								}}
								key={treasure.id}
							>
								<img src={treasureImg} alt="" />
								<p>{treasure.reward}</p>
							</div>
						))}
					</div>
				) : (
					<p className="text-lg ">찾은 보물이 없습니다. 🥺</p>
				)}
			</div>
		</>
	);
}

export default UserTreasureList;
