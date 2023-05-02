import React, { useEffect, useState } from 'react';

interface TimeProps {
    start: string;
    time: number;
}

function Timer({start, time}:TimeProps) : JSX.Element {
	const date : Date = new Date();
	const startDate : Date =  new Date(start);
	const gap : number = date.getTime() - startDate.getTime(); //gap시작 시간으로 부터 경과한 시간
	const [count, setCount] = useState<number>(Math.ceil(time*60-gap/1000));

	useEffect(() => {
		// 설정된 시간 간격마다 setInterval 콜백이 실행된다. 
		const id = setInterval(() => {
			// 타이머 숫자가 하나씩 줄어들도록
			setCount((count) => count - 1);
		}, 1000);
    
		// 0이 되면 카운트가 멈춤
		if(count === 0) {
			clearInterval(id);
		}
		return () => clearInterval(id);
		// 카운트 변수가 바뀔때마다 useEffecct 실행
	}, [count]);

	return <div>{Math.floor(count/60)}:{Math.ceil(count%60)}</div>;
}


export default Timer;