import { useEffect } from 'react';

function UserPlayPage(): JSX.Element {

	useEffect(() => {
		const container = document.getElementById('map');
		const options = {
			center: new window.kakao.maps.LatLng(37.50149686385121, 127.03979703137054),
			level: 3
		};

		const map = new window.kakao.maps.Map(container, options);
	});

	return (
		<div id="map" className='w-full h-full mb-1'/>
	);
}

export default UserPlayPage;
