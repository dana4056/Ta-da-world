import { useState, useRef } from 'react';
import tw from 'tailwind-styled-components';
import { Modal, ModalSection, Button, ModalHeader } from '../../../utils/Semantics';
import Webcam from 'react-webcam';
import { MdCameraswitch } from 'react-icons/md';
import { BsX } from 'react-icons/bs';

interface openProps {
	open: boolean;
	close: (s:string) => void;
}

interface StyledDivProps {
	active: string;
}

const DynamicModal = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
	`}
	h-620px
`;

function CaptureModal({ open, close}: openProps): JSX.Element{
	const [capture, setCapture] = useState<boolean>(true);
	const [focus, setFocus] = useState<boolean>(true);
	const [capturebase64, setCapturebase64] = useState<string>('');
	const camref = useRef<any>(null);

	//촬용 버튼 클릭
	const captureScreenshot  = (): void  => {
		const screenshot = camref.current?.getScreenshot();
		setCapturebase64(screenshot);
		setCapture(false);
	};

	//다시 찍기
	const reset  = (): void  => {
		setCapture(true);
	};

	const changeFocus = (): void => {
		setFocus(!focus);
	};

	const videoConstraints = {
		facingMode: { exact: 'environment' }
	};

	return (
		<DynamicModal active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 사진 찍기
						</div>
						<BsX onClick={()=> {close('');}} size="32" color="#535453"/>
					</ModalHeader>
					{ capture ?
						<div className='w-full flex flex-col j items-center justify-center'>
							{focus ?
								<Webcam
									ref={camref}
									mirrored={true}
									height = {200}
									width = {360}
									screenshotFormat="image/jpeg"
									className='rounded-lg mb-2'
									videoConstraints={videoConstraints}
								/>
								:
								<Webcam
									ref={camref}
									mirrored={false}
									height = {200}
									width = {360}
									screenshotFormat="image/jpeg"
									className='rounded-lg mb-2'
								/>	
							}
							<MdCameraswitch className='w-full felx justify-end' onClick={changeFocus} size="24" color="#535453"/>
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
								<Button onClick={()=> {close(capturebase64);}}>저장</Button>
							</>
						}
					</div>
				</ModalSection>
			) : null}
		</DynamicModal>
	);
}

export default CaptureModal;
