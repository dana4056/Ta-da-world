import { useState } from 'react';

interface LocationObject {
    latitude : number,
    longitude : number
}

function getCurrentLocation() {
	const [data, setData] = useState<LocationObject>();
	const [error, setError] = useState<string>();

	// Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
	const handleSuccess = (pos:any) : void => {
		const { latitude, longitude } = pos.coords;

		setData({
			latitude,
			longitude,
		});
	};

	// Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
	const handleError = (error:any) => {
		setError(error.message);
	};

	async function useCurrentLocation(options = {}) {
		const { geolocation } = navigator;

		// 사용된 브라우저에서 지리적 위치(Geolocation)가 정의되지 않은 경우 오류로 처리합니다.
		if (!geolocation) {
			setError('Geolocation is not supported.');
			return;
		}

		// Geolocation API 호출
		await geolocation.getCurrentPosition(handleSuccess, handleError, options);
	}

	return { data, error, useCurrentLocation };
}

export default getCurrentLocation;
