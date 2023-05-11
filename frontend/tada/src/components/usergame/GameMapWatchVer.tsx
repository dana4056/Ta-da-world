import { useEffect, useState } from 'react';
import useWatchLocation from '../../hooks/useWatchLocation';
import { TreasureInfo, CurrentLocation } from '../../utils/Interfaces';
import { getDistanceFromLatLonInKm } from '../../utils/Calculates';

// 리덕스와 연동하여 이미지는 차후 변경해줘야함
const playerImage = require('../../assets/images/avatar4.jpg');
const treasureImage = 'https://d2ab9z4xn2ddpo.cloudfront.net/treasure/find.png';

const treasures: TreasureInfo[] = [
	{
		id: 1,
		imgPath: '',
		lat: '37.5012469966539',
		lng: '127.0393134326118',
		hint: 'string',
		rewardImgPath: '',
		reward: '치킨',
		status: true,
		finderNick: ''
	},
	{
		id: 2,
		imgPath: '',
		lat: '37.50107375007303',
		lng: '127.03871678551988',
		hint: 'string',
		rewardImgPath: '',
		reward: '피자',
		status: true,
		finderNick: ''
	},
	{
		id: 3,
		imgPath: '',
		lat: ' 37.50130535912221',
		lng: '127.03991850318069',
		hint: 'string',
		rewardImgPath: '',
		reward: '빙수',
		status: true,
		finderNick: ''
	},
	{
		id: 4,
		imgPath: '',
		lat: '37.50077162547905',
		lng: '127.03958460124498',
		hint: 'string',
		rewardImgPath: '',
		reward: '커피',
		status: true,
		finderNick: ''
	},
	{
		id: 5,
		imgPath: '',
		lat: '37.51254109829138',
		lng: '127.03182025987998',
		hint: 'string',
		rewardImgPath: '',
		reward: '미에로화이바',
		status: true,
		finderNick: ''
	},
	{
		id: 6,
		imgPath: '',
		lat: '37.51227077723606',
		lng: '127.03189366540164',
		hint: 'string',
		rewardImgPath: '',
		reward: '빈츠',
		status: true,
		finderNick: ''
	},
	{
		id: 7,
		imgPath: '',
		lat: '37.51308608143174',
		lng: '127.0322785841547',
		hint: 'string',
		rewardImgPath: '',
		reward: '콜라',
		status: true,
		finderNick: ''
	},
	{
		id: 8,
		imgPath: '',
		lat: '37.51357291306831',
		lng: '127.03120142017693',
		hint: 'string',
		rewardImgPath: '',
		reward: '물',
		status: true,
		finderNick: ''
	},
	{
		id: 9,
		imgPath: '',
		lat: '37.35121368492915',
		lng: '127.1084811925532',
		hint: 'string',
		rewardImgPath: '',
		reward: '탐앤탐스',
		status: true,
		finderNick: ''
	},
	{
		id: 10,
		imgPath: '',
		lat: '37.351573523656604',
		lng: '127.10663352070739',
		hint: 'string',
		rewardImgPath: '',
		reward: '야생화공원',
		status: true,
		finderNick: ''
	},
	{
		id: 11,
		imgPath: '',
		lat: '37.3532213855854',
		lng: '127.10775889819736',
		hint: 'string',
		rewardImgPath: '',
		reward: '솔빛유치원',
		status: true,
		finderNick: ''
	},
	{
		id: 12,
		imgPath: '',
		lat: '37.35318581120607',
		lng: '127.10724529359813',
		hint: 'string',
		rewardImgPath: '',
		reward: '집 뒤',
		status: true,
		finderNick: ''
	},
	{
		id: 13,
		imgPath: '',
		lat: '37.35310056092826',
		lng: '127.10686141830374',
		hint: 'string',
		rewardImgPath: '',
		reward: '109동',
		status: true,
		finderNick: ''
	},
	{
		id: 14,
		imgPath: '',
		lat: '37.353222702955776',
		lng: '127.10630288983339',
		hint: 'string',
		rewardImgPath: '',
		reward: '집 놀이터',
		status: true,
		finderNick: ''
	},
	{
		id: 15,
		imgPath: '',
		lat: '37.51295649729189',
		lng: '127.02812742203585',
		hint: 'string',
		rewardImgPath: '',
		reward: '플로라랩',
		status: true,
		finderNick: ''
	},
	{
		id: 16,
		imgPath: '',
		lat: '37.512839250631785',
		lng: '127.02861091895682',
		hint: 'string',
		rewardImgPath: '',
		reward: '주차장',
		status: true,
		finderNick: ''
	},
	{
		id: 17,
		imgPath: '',
		lat: '37.51313433287461',
		lng: '127.02859689291957',
		hint: 'string',
		rewardImgPath: '',
		reward: '창성빌딩',
		status: true,
		finderNick: ''
	}
];

function GameMapWatchVer(): JSX.Element {
	const playerLocation: CurrentLocation = useWatchLocation();
	const [treasureNumber, setTreasureNumber] = useState<number>(0);
	// const [open, setOpen] = useState<boolean>(false);

	// const openModal = (): void => {
	// 	setOpen(true);
	// };
	// const closeModal = (): void => {
	// 	setOpen(false);
	// };

	useEffect(() => {
		console.log('WATCH PLAYER');
		playerLocation.getCurrentLocation();
	}, []);

	useEffect(() => {
		if (playerLocation.data) {
			console.log('new location rendering: ', playerLocation.data);
			const container = document.getElementById('map');
			const options = {
				center: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
				level: 1
			};
      
			const map = new window.kakao.maps.Map(container, options);

			const imageSize = new window.kakao.maps.Size(45, 45);
			const playerMarkerImage = new window.kakao.maps.MarkerImage(playerImage, imageSize);
			const playerMarker = new window.kakao.maps.Marker({
				map: map,
				position: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
				image: playerMarkerImage
			});

			if (treasures) {
				const treasureMarkerImage = new window.kakao.maps.MarkerImage(treasureImage, imageSize);

				for (let i = 0; i < treasures.length; i ++) {
					const distance = getDistanceFromLatLonInKm(
						playerLocation.data.latitude,
						playerLocation.data.longitude,
						parseFloat(treasures[i].lat),
						parseFloat(treasures[i].lng)
					);
					if (distance < 0.1) {
						const marker = new window.kakao.maps.Marker({
							map: map,
							position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng),
							clickable: true,
							image: treasureMarkerImage
						});
						
						window.kakao.maps.event.addListener(marker, 'click', () => {
							console.log('treasure id: ', treasures[i].id);
							setTreasureNumber(treasures[i].id);
							// openModal();
						});
					}
				}
			}
		}
	}, [playerLocation.data]);

	useEffect(() => {
		console.log('current treasure number: ', treasureNumber);
	}, [treasureNumber]);

	return (
		<>
			<div id="map" className='w-full h-full mb-1'/>
		</>
	);
}

export default GameMapWatchVer;
