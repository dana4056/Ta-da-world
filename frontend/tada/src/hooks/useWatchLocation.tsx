import { useState, useCallback, useRef, useEffect } from 'react';

interface LocationData {
  latitude : number
  longitude : number
}

interface WatchLocation {
  data: LocationData | null
  error: string | null
  getCurrentLocation: () => void
}

function useWatchLocation(): WatchLocation {
	const [data, setData] = useState<LocationData | null>(null);
	const [error, setError] = useState<string | null>(null);
	const watchId = useRef<number | null>(null);

	// Geolocation의 `getCurrentPosition` 메소드에 대한 성공 callback 핸들러
	const handleSuccess = (position: GeolocationPosition) : void => {
		const { latitude, longitude } = position.coords;

		setData({
			latitude,
			longitude,
		});
	};
	// Geolocation의 `getCurrentPosition` 메소드에 대한 실패 callback 핸들러
	const handleError = (error: GeolocationPositionError) => {
		setError(error.message);
	};

	const getCurrentLocation = useCallback(() => {
		const { geolocation } = navigator;
  
		if (!geolocation) {
			setError('Geolocation is not supported');
			return;
		}

		// 단순 위치 받기
		// geolocation.getCurrentPosition(handleSuccess, handleError, options);

		watchId.current = geolocation.watchPosition(handleSuccess, handleError, {
			enableHighAccuracy: true,
			timeout: Infinity,
			maximumAge: 0, // Track location every 0 seconds
		});
	}, []);

	// Clear the watch when the component is unmounted
	useEffect(() => {
		return () => {
			if (watchId.current !== null && navigator.geolocation) {
				navigator.geolocation.clearWatch(watchId.current);
			}
		};
	}, []);

	return { data, error, getCurrentLocation };
}

export default useWatchLocation;
