import styles from '../../assets/css/RewardSuccess.module.css';

const treasureopacity = require('../../assets/images/treasureopacity.gif');
const topLogo = require('../../assets/images/topLogo.png');

function RewardSuccess(): JSX.Element {
	return (
		<div>
			<div className={styles.stage}>
				<div className={styles.scene}>
					<div className={styles.halo}>
						<i></i>
						<span className={styles['halo-star']}></span>
						<span className={styles['halo-star']}></span>
						<span className={styles['shalo-star']}></span>
						<i></i>
						<i></i>
						<i></i>
					</div>
					<img className={styles.topLogo} src={topLogo} alt="" />
					<img className={styles.treasure} src={treasureopacity} alt="" />
					<p
						className={`${styles.word1} text-white text-2xl font-bold  w-full text-center`}
					>
						축하합니다!
					</p>
					<p
						className={`${styles.word2} text-white text-2xl font-bold  w-full text-center`}
					>
						보물을 획득하셨습니다!
					</p>
					<div className={styles.planets}>
						<div className={styles.planet}></div>
						<div className={styles.planet}></div>
						<div className={styles.planet}></div>
						<div className={styles.planet}></div>
						<div className={styles.planet}></div>
						<div className={styles.planet}></div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default RewardSuccess;
