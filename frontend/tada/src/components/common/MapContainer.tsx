import React, { useEffect } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

const MapContainer = () => {
	useEffect(() => {
		const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
		const options = { //지도를 생성할 때 필요한 기본 옵션
			center: new window.kakao.maps.LatLng(33.450701, 126.570667), //지도의 중심좌표.
			level: 3 //지도의 레벨(확대, 축소 정도)
		};
    
		const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
    
		// 지도를 클릭한 위치에 표출할 마커입니다
		const marker = new window.kakao.maps.Marker({ 
			// 지도 중심좌표에 마커를 생성합니다 
			position: map.getCenter() 
		}); 
		// 지도에 마커를 표시합니다
		marker.setMap(map);

		window.kakao.maps.event.addListener(map, 'click', (e:any) => {
			  // 클릭한 위도, 경도 정보를 가져옵니다 
			  const latlng = e.latLng; 
			  console.log(latlng);
			  // 마커 위치를 클릭한 위치로 옮깁니다
			  marker.setPosition(latlng);

		});

	}, []);

	return (
		<div id="map" style={{ width: '100vw', height: '100vh' }} />
	);
};

export default MapContainer; 