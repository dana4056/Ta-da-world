import { useEffect, useRef } from 'react';
import usePlayerLocation from '../../hooks/usePlayerLocation';
// 리덕스와 연동하여 이미지는 차후 변경해줘야함
const playerImage = require('../../assets/images/avatar4.jpg');

interface LocationData {
  latitude : number,
  longitude : number
}

interface PlayerLocation {
data: LocationData | null
error: string | null
getCurrentLocation: () => void
}

function PlayMap(): JSX.Element {
	const playerLocation: PlayerLocation = usePlayerLocation();
	// create a marker only if markerRef.current is not initialized
	const markerRef = useRef<any | null>(null);

	useEffect(() => {
		if (playerLocation.data) {
			console.log('playerLocation: ', playerLocation.data);
			const container = document.getElementById('map');
			const options = {
				center: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
				level: 2
			};
      
			const map = new window.kakao.maps.Map(container, options);

			if (!markerRef.current) {
				// Create a custome marker image
				const imageSize = new window.kakao.maps.Size(36, 36);
				const playerMarkerImage = new window.kakao.maps.MarkerImage(playerImage, imageSize);

				// Create a marker with the custom image and position
				markerRef.current = new window.kakao.maps.Marker({
					map: map,
					position: new window.kakao.maps.LatLng(playerLocation.data.latitude, playerLocation.data.longitude),
					// clickable: true,
					image: playerMarkerImage
				});
			} else {
				// Create a custome marker image
				const imageSize = new window.kakao.maps.Size(36, 36);
				const playerMarkerImage = new window.kakao.maps.MarkerImage(playerImage, imageSize);

				// Update the position of the existing marker
				const newPosition = new window.kakao.maps.LatLng(
					playerLocation.data.latitude,
					playerLocation.data.longitude
				);
				markerRef.current.setPosition(newPosition);
				markerRef.current.setImage(playerMarkerImage);
				map.setCenter(newPosition);
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
