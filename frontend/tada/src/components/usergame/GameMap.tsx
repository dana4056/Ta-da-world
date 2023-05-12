import { useEffect, useState } from 'react';
import { useInterval } from '../../hooks/useInterval';
import useCurrentLocation from '../../hooks/useCurrentLocation';
import { TreasureInfo, CurrentLocation } from '../../utils/Interfaces';
import { getDistanceFromLatLonInKm } from '../../utils/Calculates';
import useApi from '../../hooks/useApi';

import GameModal from './GameModal';
import HintModal from '../usergame/HintModal';

// const treasures: TreasureInfo[] = [
// 	{
// 		id: 1,
// 		imgPath: '',
// 		lat: '37.5012469966539',
// 		lng: '127.0393134326118',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '치킨',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 2,
// 		imgPath: '',
// 		lat: '37.50107375007303',
// 		lng: '127.03871678551988',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '피자',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 3,
// 		imgPath: '',
// 		lat: ' 37.50130535912221',
// 		lng: '127.03991850318069',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '빙수',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 4,
// 		imgPath: '',
// 		lat: '37.50077162547905',
// 		lng: '127.03958460124498',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '커피',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 5,
// 		imgPath: '',
// 		lat: '37.51254109829138',
// 		lng: '127.03182025987998',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '미에로화이바',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 6,
// 		imgPath: '',
// 		lat: '37.51227077723606',
// 		lng: '127.03189366540164',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '빈츠',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 7,
// 		imgPath: '',
// 		lat: '37.51308608143174',
// 		lng: '127.0322785841547',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '콜라',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 8,
// 		imgPath: '',
// 		lat: '37.51357291306831',
// 		lng: '127.03120142017693',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '물',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 9,
// 		imgPath: '',
// 		lat: '37.35121368492915',
// 		lng: '127.1084811925532',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '탐앤탐스',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 10,
// 		imgPath: '',
// 		lat: '37.351573523656604',
// 		lng: '127.10663352070739',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '야생화공원',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 11,
// 		imgPath: '',
// 		lat: '37.3532213855854',
// 		lng: '127.10775889819736',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '솔빛유치원',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 12,
// 		imgPath: '',
// 		lat: '37.35318581120607',
// 		lng: '127.10724529359813',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '집 뒤',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 13,
// 		imgPath: '',
// 		lat: '37.35310056092826',
// 		lng: '127.10686141830374',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '109동',
// 		status: true,
// 		finderNick: ''
// 	},
// 	{
// 		id: 14,
// 		imgPath: '',
// 		lat: '37.353222702955776',
// 		lng: '127.10630288983339',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '집 놀이터',
// 		status: false,
// 		finderNick: ''
// 	},
// {
// 	id: 15,
// 	imgPath: '',
// 	lat: '37.51295649729189',
// 	lng: '127.02812742203585',
// 	hint: 'string',
// 	rewardImgPath: '',
// 	reward: '플로라랩',
// 	status: true,
// 	finderNick: ''
// },
// 	{
// 		id: 16,
// 		imgPath: '',
// 		lat: '37.512839250631785',
// 		lng: '127.02861091895682',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '주차장',
// 		status: false,
// 		finderNick: ''
// 	},
// 	{
// 		id: 17,
// 		imgPath: '',
// 		lat: '37.51313433287461',
// 		lng: '127.02859689291957',
// 		hint: 'string',
// 		rewardImgPath: '',
// 		reward: '창성빌딩',
// 		status: true,
// 		finderNick: ''
// 	}
// ];

interface GameMapProps {
	roomId: number
	character: number
}

function GameMap({ roomId, character }: GameMapProps): JSX.Element {
	const playerImage = require(`../../assets/images/avatar${character}.jpg`);
	const hintImage = require('../../assets/images/bottle.png');
	const openTreasureImage = require('../../assets/images/opentreasure.png');
	const closeTreasureImage = require('../../assets/images/closetreasure_color.png');
	const playerLocation: CurrentLocation = useCurrentLocation();
	const treasureLocation = useApi();

	const [treasures, setTreasures] = useState<TreasureInfo[] | null>(null);
	const [treasureNumber, setTreasureNumber] = useState<number>(0);
	const [open, setOpen] = useState<boolean>(false);
	const [hintOpen, setHintOpen] = useState<boolean>(false);


	const renderMarkers = () => {
		console.log('-------RENDERING!-------');

		if (playerLocation.data) {
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
				console.log('-------TREASURES MARKING-------');
				console.log('-------TREASURES-------', treasures);

				for (let i = 0; i < treasures.length; i ++) {
					console.log('-------TREASURE-------', treasures);
					const distance = getDistanceFromLatLonInKm(
						playerLocation.data.latitude,
						playerLocation.data.longitude,
						parseFloat(treasures[i].lat),
						parseFloat(treasures[i].lng)
					);

					console.log('-------DISTANCE-------', distance);

					if (distance < 5) {
						if (treasures[i].status) {
							const treasureMarkerImage = new window.kakao.maps.MarkerImage(openTreasureImage, imageSize);
							const marker = new window.kakao.maps.Marker({
								map: map,
								position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng),
								clickable: true,
								image: treasureMarkerImage
							});
						
							window.kakao.maps.event.addListener(marker, 'click', () => {
								console.log('선택한 보물: ', treasures[i].id);
								setTreasureNumber(treasures[i].id);
								openModal();
							});

						} else {
							const treasureMarkerImage = new window.kakao.maps.MarkerImage(closeTreasureImage, imageSize);
							const marker = new window.kakao.maps.Marker({
								map: map,
								position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng),
								clickable: true,
								image: treasureMarkerImage
							});
						
							window.kakao.maps.event.addListener(marker, 'click', () => {
								console.log('선택한 보물: ', treasures[i].id);
								setTreasureNumber(treasures[i].id);
								openModal();
							});
						}
					}
				}
			}
		} else {
			console.log('RENDERING FAILED!');
		}
	};

	const openModal = (): void => {
		setOpen(true);
	};
	const closeModal = (): void => {
		setOpen(false);
	};

	const openHintModal = (): void => {
		setHintOpen(true);
	};
	const closeHintModal = (): void => {
		setHintOpen(false);
	};

	useEffect(() => {
		renderMarkers();
	}, [playerLocation.data]);

	useEffect(() => {
		setTreasures(treasureLocation.data?.data);
	}, [treasureLocation.data]);
	
	useInterval(
		() => {
			playerLocation.getCurrentLocation();
		},
		1000
	);
	useInterval(
		() => {
			treasureLocation.fetchGetApi(`/treasures?roomId=${roomId}`);
		},
		3000
	);

	return (
		<>
			<GameModal open={open} close={closeModal} treasureId={treasureNumber} />
			<HintModal open={hintOpen} onClose={closeHintModal} treasures={treasures} />
			<div id="map" className='w-full h-full mb-1'/>
			<div className='fixed z-10 flex items-center justify-center w-20 h-20 bg-white border-2 rounded-full shadow-xl bottom-12 right-6 border-main'>
				<img className='w-12 h-12' src={hintImage} alt="HINT" onClick={openHintModal} />
			</div>
		</>
	);
}

export default GameMap;
