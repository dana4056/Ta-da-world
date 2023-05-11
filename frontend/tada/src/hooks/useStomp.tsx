import { useEffect, useState } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

const baseURL = 'https://ta-da.world/api';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	profileImage: string;
}

const useStomp = () => {
	const [error, setError] = useState<string | null>(null);

	const stompConnect = (user: User, onMessageReceived: () => Promise<void>) => {
		useEffect(() => {
			try {
				const socket = new SockJS(`${baseURL}/ws/room`);
				const stompClient = Stomp.over(socket);
				stompClient.connect({}, () => {
					console.log('STOMP connected');
					const data = {
						messageType: 'ENTER',
						userId: `${user.id}`,
						roomId: `${user.roomId}`,
						nickname: `${user.nickname}`,
						imgNo: `${user.profileImage}`,
					};
					console.log('socket : send data : ', data);
					stompClient.send('/pub/send', {}, JSON.stringify(data));
					stompClient.subscribe(
						`/sub/${user.roomId}`,
						(Ms) => {
							const msObj = JSON.parse(Ms.body);
							if (msObj.messageType === 'ENTER') {
								onMessageReceived();
								console.log('someone entered');
							} else if (msObj.messageType === 'NOTICE') {
								console.log('someone noticed');
								alert(msObj.message);
							}
							console.log('msObj : ', msObj);
						},
						{}
					);
				});
			} catch (error: any) {
				setError(`socket error: ${error.message}`);
			}
		}, [user]);
	};

	return { error, stompConnect };
};

export default useStomp;
