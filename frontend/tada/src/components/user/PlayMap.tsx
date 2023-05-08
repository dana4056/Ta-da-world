import { useState, useEffect } from 'react';
import useWatchLocation from '../../hooks/useWatchLocation';
import { TreasureInfo, WatchLocation } from '../../util/Interface';
import { getDistanceFromLatLonInKm } from '../../util/Calculate';
// 리덕스와 연동하여 이미지는 차후 변경해줘야함
const playerImage = require('../../assets/images/avatar4.jpg');
const treasureImage = require('../../assets/images/treasure_opacity.gif');

const treasures: TreasureInfo[] = [
	{
		id: 1,
		imgPath: 'string',
		lat: '37.5012469966539',
		lng: '127.0393134326118',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 2,
		imgPath: 'string',
		lat: '37.50107375007303',
		lng: '127.03871678551988',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 3,
		imgPath: 'string',
		lat: ' 37.50130535912221',
		lng: '127.03991850318069',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 4,
		imgPath: 'string',
		lat: '37.50077162547905',
		lng: '127.03958460124498',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 5,
		imgPath: 'string',
		lat: '37.51254109829138',
		lng: '127.03182025987998',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 6,
		imgPath: 'string',
		lat: '37.51227077723606',
		lng: '127.03189366540164',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 7,
		imgPath: 'string',
		lat: '37.51308608143174',
		lng: '127.0322785841547',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	},
	{
		id: 8,
		imgPath: 'string',
		lat: '37.51357291306831',
		lng: '127.03120142017693',
		hint: 'string',
		rewardImgPath: 'string',
		reward: 'string',
		status: true,
		finderNick: 'string'
	}
];

function PlayMap(): JSX.Element {
	const playerLocation: WatchLocation = useWatchLocation();
	const [currentTreasure, setCurrentTreasure] = useState<TreasureInfo | null>(null);
	// create a marker only if markerRef.current is not initialized
	// const markerRef = useRef<any | null>(null);

	useEffect(() => {
		if (playerLocation.data) {
			console.log('new location rendering: ', playerLocation.data);
			const container = document.getElementById('map');
			const options = {
				center: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
				level: 2
			};
      
			const map = new window.kakao.maps.Map(container, options);

			const imageSize = new window.kakao.maps.Size(36, 36);
			const playerMarkerImage = new window.kakao.maps.MarkerImage(playerImage, imageSize);
			const playerMarker = new window.kakao.maps.Marker({
				map: map,
				position: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
				image: playerMarkerImage
			});
			// console.log('playerMarker: ', playerMarker);
			if (treasures) {
				// const container = document.getElementById('map');
				// const options = {
				// 	center: new window.kakao.maps.LatLng(playerLocation.data?.latitude, playerLocation.data?.longitude),
				// 	level: 2
				// };
	
				// const map = new window.kakao.maps.Map(container, options);
				// const imageSize = new window.kakao.maps.Size(36, 36);
				const treasureMarkerImage = new window.kakao.maps.MarkerImage(treasureImage, imageSize);
	
				for (let i = 0; i < treasures.length; i ++) {
					const distance = getDistanceFromLatLonInKm(
						playerLocation.data.latitude,
						playerLocation.data.longitude,
						parseFloat(treasures[i].lat),
						parseFloat(treasures[i].lng)
					);
					if (distance < 0.05) {
						const marker = new window.kakao.maps.Marker({
							map: map,
							position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng),
							clickable: true,
							image: treasureMarkerImage
						});

						window.kakao.maps.event.addListener(marker, 'click', () => {
							setCurrentTreasure(treasures[i]);
							console.log('currentTreasure: ', currentTreasure);
						});
					}
				}
			}
		}
	}, [playerLocation.data]);

	useEffect(() => {
		console.log('---------------------');
		playerLocation.getCurrentLocation();
	}, []);

	return (
		<div id="map" className='w-full h-full mb-1'/>
	);
}

export default PlayMap;
