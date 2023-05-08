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
	}
];

function PlayMap(): JSX.Element {
	const playerLocation: WatchLocation = useWatchLocation();

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
							console.log('i: ', i);
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
