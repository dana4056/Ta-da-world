import React from 'react';
import RewardSuccess from '../components/reward/RewardSuccess';
import RewardFail from '../components/reward/RewardFail';

function RewardTestPage(): JSX.Element {
	return (
		<div>
			{/* <RewardSuccess /> */}
			<RewardFail />
		</div>
	);
}

export default RewardTestPage;
