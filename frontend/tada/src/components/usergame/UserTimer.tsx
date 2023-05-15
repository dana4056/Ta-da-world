import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useInterval } from '../../hooks/useInterval';

interface TimeProps {
	start: string;
	time: string;
}

function UserTimer({ start, time }: TimeProps): JSX.Element {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const date: Date = new Date();
	const startD: Date = new Date(start);
	const startDate: Date = new Date(
		startD.getTime() - startD.getTimezoneOffset() * 60000
	);
	const gap: number = date.getTime() - startDate.getTime(); //gap시작 시간으로 부터 경과한 시간
	const [count, setCount] = useState<number>(60);

	useEffect(() => {
		if (time) {
			setCount(Math.ceil(Number(time) * 60 - gap / 1000));
		}
	}, [start, time]);

	useInterval(() => {
		if (count - 1 <= 0) {
			//게임 멈추기
			navigate('/userend');
		}
		setCount((count) => count - 1);
	}, 1000);

	return (
		<div>
			{Math.floor(count / 60)}:{Math.ceil(count % 60)}
		</div>
	);
}

export default UserTimer;
