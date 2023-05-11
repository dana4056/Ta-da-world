import {useState, useRef} from 'react';
import tw from 'tailwind-styled-components';
import Webcam from 'react-webcam';
import { Modal, ModalSection, Button, ModalHeader, Circle2 } from '../../util/Semantics';
import {BsX} from 'react-icons/bs';
import {MdCameraswitch} from 'react-icons/md';
import useApi from '../../hooks/useApi';

import { RootState } from '../../stores';
import { useSelector } from 'react-redux';

const camImg = require('../../assets/images/camera.png');

interface PlayModalProps {
	open: boolean;
	close: () => void;
	treasureId: number
}

interface StyledDivProps {
	active: string;
}

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  `}
`;

function PlayModal({open, close, treasureId}: PlayModalProps) : JSX.Element{
	console.log('MODAL: ', treasureId);
	// const userId = useSelector((state: RootState) => state.user.userId);
	const userId = '4_246333890';
	const api = useApi();
	console.log('data: ', api.data);
	const [capture, setCapture] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(true);
	const [capturebase64, setCapturebase64] = useState<string>('');
	const camref = useRef<any>(null);
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

		// api.fetchApiMulti('POST', `/treasures/answers/${treasureId}`, formData);
		api.fetchApiMulti('POST', `/treasures/answers/${6}`, formData);
	};

	//촬영 버튼 클릭
	const captureScreenshot  = () : void  => {
		const screenshot = camref.current?.getScreenshot();
		setCapturebase64(screenshot);
		setCapture(false);
	};

	//다시 찍기
	const reset  = () : void  => {
		setCapture(true);
	};

	// WebCam
	const changeFocus = () : void => {
		setFocus(!focus);
	};
	const videoConstraints = {
		facingMode: { exact: 'environment' }
	};

	return (
		<Modal2 active = {open ? '1' : ''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 사진 찍기
						</div>
						<BsX onClick={()=> {close();}} size="32" color="#535453"/>
					</ModalHeader>
					{ capture ?
						<div className='flex flex-col items-end w-full j'>
							{focus ?
								<Webcam
									ref={camref}
									mirrored={true}
									screenshotFormat="image/jpeg"
									className='h-full mb-2 rounded-lg'
								/>
								:
								<Webcam
									ref={camref}
									mirrored={true}
									screenshotFormat="image/jpeg"
									className='h-full mb-2 rounded-lg'
									videoConstraints={videoConstraints}
								/>
							}
							<MdCameraswitch onClick={changeFocus} size="20" color="#535453"/>
						</div>
						:
						<img src ={capturebase64}/>
					}
					<div className='flex justify-center w-full mt-3'>
						{ capture ?
							<Circle2 onClick={captureScreenshot}>
								<img src={camImg} alt="" />
							</Circle2>
							:
							<>
								<Button onClick={reset}>다시 찍기</Button>
								<Button onClick={submitTreasure}>전송</Button>
							</>
						}
					</div>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

export default PlayModal;
