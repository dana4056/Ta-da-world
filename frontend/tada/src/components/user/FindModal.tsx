import React, {useState, useRef} from 'react';
import tw from 'tailwind-styled-components';
import Webcam from 'react-webcam';
import { Modal, ModalSection, Button, ModalHeader } from '../../util/Semantics';
import {BsX} from 'react-icons/bs';
import {MdCameraswitch} from 'react-icons/md';

interface openProps {
	open: boolean;
	close: (s:string) => void;
}

interface StyledDivProps {
	active: string;
}

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  `}
`;

function FindModal({ open, close}: openProps) : JSX.Element{
	const [capture, setCapture] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(true);
	const [capturebase64, setCapturebase64] = useState<string>('');
	const camref = useRef<any>(null);

	//촬용 버튼 클릭
	const captureScreenshot  = () : void  => {
		const screenshot = camref.current?.getScreenshot();
		setCapturebase64(screenshot);
		setCapture(false);
	};

	//다시 찍기
	const reset  = () : void  => {
		setCapture(true);
	};

	const changeFocus = () : void => {
		setFocus(!focus);
	};

	const videoConstraints = {
		facingMode: { exact: 'environment' }
	};

	return (
		<Modal2 active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 사진 찍기
						</div>
						<BsX onClick={()=> {close('');}} size="32" color="#535453"/>
					</ModalHeader>
					{ capture ?
						<div className='w-full flex flex-col j items-end'>
							{focus ?
								<Webcam
									ref={camref}
									mirrored={true}
									screenshotFormat="image/jpeg"
									className='rounded-lg mb-2 h-full'
								/>
								:
								<Webcam
									ref={camref}
									mirrored={true}
									screenshotFormat="image/jpeg"
									className='rounded-lg mb-2 h-full'
									videoConstraints={videoConstraints}
								/>
							}
							<MdCameraswitch onClick={changeFocus} size="24" color="#535453"/>
						</div>
						:
						<img src ={capturebase64}/>
					}
					<div className='w-full flex justify-center mt-3'>
						{ capture ?
							<Button onClick={captureScreenshot}>사진 촬영</Button>
							:
							<>
								<Button onClick={reset}>다시 찍기</Button>
								<Button onClick={()=> {close(capturebase64);}}>전송</Button>
							</>
						}
					</div>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

export default FindModal;
