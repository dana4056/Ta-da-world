import styles from '../../assets/css/RewardFail.module.css';

const closetreasure = require('../../assets/images/closetreasure.png');

function RewardFail(): JSX.Element {
	return (
		<div className="flex flex-col items-center justify-center w-screen h-screen ">
			<img className={`${styles.shake} w-3/5`} src={closetreasure} alt="" />
			<p className="w-full pt-10 text-xl font-bold text-center text-gray5">
					보물과 일치하지 않습니다!
			</p>
		</div>
	);
}

export default RewardFail;
