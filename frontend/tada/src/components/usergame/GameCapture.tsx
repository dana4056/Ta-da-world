import { useState, useRef, useEffect } from 'react';
import { BlueCircle, Button  } from '../../utils/Semantics';
import Webcam from 'react-webcam';
import { MdCameraswitch } from 'react-icons/md';
import useApi from '../../hooks/useApi';

const camImg = require('../../assets/images/camera.png');

interface GameCaptureProps {
  userId: string,
  treasureId: number,
  onSubmit: (msg: string) => void
}

function GameCapture({ userId, treasureId, onSubmit }: GameCaptureProps): JSX.Element {

	const api = useApi();
	console.log('data: ', api.data);
	const [capture, setCapture] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(true);
	const [capturebase64, setCapturebase64] = useState<string>('');
	const camref = useRef<any>(null);

  	//촬영 버튼 클릭
	const captureScreenshot  = (): void  => {
		const screenshot = camref.current?.getScreenshot();
		setCapturebase64(screenshot);
		setCapture(false);
	};

	//다시 찍기
	const reset  = (): void  => {
		setCapture(true);
	};

	// WebCam
	const changeFocus = (): void => {
		setFocus(!focus);
	};
	const videoConstraints = {
		facingMode: { exact: 'environment' }
	};

	const submitTreasure = (): void => {
		const formData = new FormData();

		const arr: string[] = capturebase64.split(',');
		const mime: string | null = arr[0].match(/:(.*?);/)?.[1] || '';
		const bstr: string = atob(arr[1]);
		let n: number = bstr.length;
		const u8arr: Uint8Array = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}
		const file = new File([u8arr], 'image.png', {type:mime});
		formData.append('answerFile', file);

		const userInfo = {
			userId: userId
		};
		const userDto = new Blob([JSON.stringify(userInfo)], { type: 'application/json' });
		formData.append('userDto', userDto);

		api.fetchApiMulti('POST', `/treasures/answers/${treasureId}`, formData);
		// api.fetchApiMulti('POST', `/treasures/answers/${6}`, formData);
	};

	useEffect(() => {
		if (api.data) {
			onSubmit(api.data.message);
		}
	});

	return (
		<>
			{ capture ?
				<div className='flex flex-col items-end justify-center w-full'>
					{focus ?
						<Webcam
							ref={camref}
							mirrored={true}
							screenshotFormat="image/jpeg"
							className='h-56 mx-auto my-5 rounded-lg'
						/>
						:
						<Webcam
							ref={camref}
							mirrored={true}
							screenshotFormat="image/jpeg"
							className='h-56 mx-auto my-5 rounded-lg'
							videoConstraints={videoConstraints}
						/>
					}
					<MdCameraswitch className='mr-8' onClick={changeFocus} size="25" color="#535453"/>
				</div>
				:
				<img src ={capturebase64}/>
			}
			<div className='flex justify-center w-full mt-5'>
				{ capture ?
					<BlueCircle onClick={captureScreenshot}>
						<img src={camImg} alt="" />
					</BlueCircle>
					:
					<>
						<Button onClick={reset}>다시 찍기</Button>
						<Button onClick={submitTreasure}>전송</Button>
					</>
				}
			</div>
		</>
	);
}

export default GameCapture;
