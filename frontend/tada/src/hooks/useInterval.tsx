import { useRef, useEffect } from 'react';

type CallbackFunction = () => void;

export function useInterval(callback: CallbackFunction, delay: number | null) {
	const savedCallback = useRef<CallbackFunction | null>(null);

	useEffect(() => {
		savedCallback.current = callback;
	}, [callback]);

	useEffect(() => {
		function tick() {
			savedCallback.current && savedCallback.current();
		}
		if (delay !== null) {
			const id = setInterval(tick, delay);
			return () => clearInterval(id);
		}
	}, [delay]);
}
