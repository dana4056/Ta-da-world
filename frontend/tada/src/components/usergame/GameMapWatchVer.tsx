import { useEffect, useState } from 'react';
import useWatchLocation from '../../hooks/useWatchLocation';
import { TreasureInfo, CurrentLocation } from '../../utils/Interfaces';
import { getDistanceFromLatLonInKm } from '../../utils/Calculates';
import useApi from '../../hooks/useApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../stores';

// import { dummy_treasures } from '../../utils/DummyTreasures';
import GameModal from './GameModal';
import HintModal from './HintModal';

interface GameMapProps {
	roomId: number
	character: number
	// foundTreasure: number
}

function GameMapWatchVer({ roomId, character }: GameMapProps): JSX.Element {
	const gameInfo = useSelector((state: RootState) => state.user);

	const playerImage = require(`../../assets/images/avatarPin/avatar${character || 1}.png`);
	const hintImage = require('../../assets/images/bottle.png');
	const openTreasureImage = require('../../assets/images/opentreasure.png');
	const closeTreasureImage = require('../../assets/images/closetreasure_color.png');
	const playerLocation: CurrentLocation = useWatchLocation();
	const treasureLocation = useApi();

	const [treasures, setTreasures] = useState<TreasureInfo[] | null>(null);
	const [treasureNumber, setTreasureNumber] = useState<number>(0);
	const [open, setOpen] = useState<boolean>(false);
	const [hintOpen, setHintOpen] = useState<boolean>(false);

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
					// console.log('-------TREASURE-------', treasures);
					const distance = getDistanceFromLatLonInKm(
						playerLocation.data.latitude,
						playerLocation.data.longitude,
						parseFloat(treasures[i].lat),
						parseFloat(treasures[i].lng)
					);

					// console.log('-------DISTANCE-------', distance);

					if (distance < 1) {
						if (treasures[i].status) {
							const treasureMarkerImage = new window.kakao.maps.MarkerImage(openTreasureImage, imageSize);
							const marker = new window.kakao.maps.Marker({
								map: map,
								position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng),
								clickable: false,
								image: treasureMarkerImage
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
			console.log('RENDERING FAILED');
		}
	};


	useEffect(() => {
		playerLocation.getCurrentLocation();
		treasureLocation.fetchGetApi(`/treaures?roomId=${roomId}`);
	}, []);

	useEffect(() => {
		setTreasures(treasureLocation.data?.data);
	}, [treasureLocation.data]);

	// useEffect(() => {
	// 	setTreasures(dummy_treasures);
	// }, []);

	useEffect(() => {
		treasureLocation.fetchGetApi(`/treasures?roomId=${roomId}`);
		renderMarkers();
	}, [playerLocation.data]);

	useEffect(() => {
		treasureLocation.fetchGetApi(`/treasures?roomId=${roomId}`);
		renderMarkers();
	}, [gameInfo.foundTreasure]);

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

export default GameMapWatchVer;
