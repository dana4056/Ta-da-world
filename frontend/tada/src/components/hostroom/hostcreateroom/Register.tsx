import { useState, useEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { changeTreasure } from '../../../stores/watch';
import tw from 'tailwind-styled-components';
import { Label, Input, Button } from '../../../utils/Semantics';
import Swal from 'sweetalert2';
import { MdAddPhotoAlternate } from 'react-icons/md';
import { BsCameraFill } from 'react-icons/bs';
import useApi from '../../../hooks/useApi';
import useCurrentLocation  from '../../../hooks/useCurrentLocation';
import CaptureModal from './CaptureModal';
import RegisterModal from './RegisterModal';

const plus = require('../../../assets/images/plus.png');

const Textarea = tw.textarea`
	text-base w-full
	bg-white2 rounded-lg border-2 border-gray
	py-3 px-3 mt-2 mb-8
`;

const MiniButton = tw.div`
	flex justify-center items-center 
	w-24 h-7 
	bg-main3 rounded-lg 
	text-white text-sm font-bold
	ml-4
`;

function Register(): JSX.Element {
	const dispatch = useDispatch();
	const [treasure, setTreasure] = useState<string>('');
	const [lat, setLat] = useState<string>('0');
	const [lon, setLon] = useState<string>('0');
	const [hint, setHint] = useState<string>('');
	const [reward, setReward] = useState<string>('');
	const [rewardDes, setRewardDes] = useState<string>('');
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [modalOpen2, setModalOpen2] = useState<boolean>(false);
	const fileInput = useRef<any>(null);
	const location: any = useCurrentLocation();
	const registerTresure = useApi();
	const check: any = /^[0-9]+./; 
	const geolocationOptions = {
		enableHighAccuracy: true,
		timeout: 1000 * 60 * 1, // 1 min (1000 ms * 60 sec * 1 minute = 60 000ms)
		maximumAge: 1000 * 3600 * 24, // 24 hour
	};

	// 보물 실시간 위치
	useEffect(() => {
		if(treasure){
			location.getCurrentLocation(geolocationOptions);
		}
	}, [treasure]);

	useEffect(() => {
		if(treasure){
			setLat(location.data?.latitude);
			setLon(location.data?.longitude);
		}
	}, [location.data]);

	//보물 등록 api
	useEffect(() => {
		if(registerTresure.data?.success){
			dispatch(changeTreasure(1));
			setTreasure('');
			setLon('');
			setLat('');
			setHint('');
			setReward('');
			setRewardDes('');
			Swal.fire({          
				width: 300,
				iconColor: '#2BDCDB',
				html: '보물 등록 성공!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}else if(registerTresure.data){
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				html: '보물 등록 실패!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	}, [registerTresure.data]);

	//힌트 작성	
	const handleHint = (e: React.ChangeEvent<HTMLTextAreaElement>): void  => {
		setHint(e.target.value);
	};

	//위도 작성	
	const handleLat = (e: React.ChangeEvent<HTMLInputElement>): void  => {
		setLat(e.target.value);
	};

	//경도 작성	
	const handleLon = (e: React.ChangeEvent<HTMLInputElement>): void  => {
		setLon(e.target.value);
	};

	//보상 설명 작성
	const handleRewardDes  = (e: React.ChangeEvent<HTMLTextAreaElement>): void  => {
		setRewardDes(e.target.value);
	};

	//보상 이미지 업로드하기
	const uploadImg=()=>{
		fileInput.current.click();
	};

	const handleUploadImg = (e : React.ChangeEvent<HTMLInputElement>):void => {
		const target = e.currentTarget;
		const file = (target.files as FileList)[0];

		if(file){
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onloadend = function(){
				const base64 : any = reader.result;
				setReward(base64);
			};
		}
	};

	//사진 찍기 모달창 열기
	const openCaptureModal = (): void => {
		setModalOpen(true);
	};

	//사진찍기 모달창 닫기
	const closeCaptureModal = (base64:string): void => {
		if(base64){
			setTreasure(base64);
		}
		setModalOpen(false);
	};

	//map 모달창 열기
	const openMapModal = (): void => {
		if(treasure){
			setModalOpen2(true);
		}else{
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보물 사진을 먼저 등록해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}
	};

	//map 모달창 닫기
	const closeMapModal = (latt:string, lonn:string): void => {
		if(latt !=='0' && lonn !== '0'){
			setLat(latt);
			setLon(lonn);
		}
		setModalOpen2(false);
	};
		
	useEffect(() => {
		if(treasure){
			setLat(location.data?.latitude);
			setLon(location.data?.longitude);
		}
	}, [location.data]);

	const checkAva = (): void  => {
		//유효성 검사
		if (!treasure) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보물 사진을 등록해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}  else if(lat === '0' || lon ==='0' ) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보물 위치를 설정해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else if(!check.test(lat) || !check.test(lon)) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '유효하지않은 위치입니다.', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		}  else if (!hint) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보물 힌트를 등록해주세요!', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else if(!reward && !rewardDes) {
			Swal.fire({
				icon: 'warning',               
				width: 300,
				iconColor: '#2BDCDB',
				text: '보상 사진 또는 설명을 입력해주세요.', 
				confirmButtonColor: '#2BDCDB',
				confirmButtonText: '확인',
			});
		} else {
			registerTreasure();
		} 
	};

	//api 요청할 곳
	const registerTreasure = (): void  => {
		const formData = new FormData();

		const arr: string[] = treasure.split(',');
		const mime: string | null = arr[0].match(/:(.*?);/)?.[1] || '';
		const bstr: string = atob(arr[1]);
		let n: number = bstr.length;
		const u8arr: Uint8Array = new Uint8Array(n);
		while (n--) {
			u8arr[n] = bstr.charCodeAt(n);
		}				
		const file = new File([u8arr], 'image.png', {type:mime});
		formData.append('treasureFile', file);


		if(reward.length){
			const arr2: string[] = reward.split(',');
			const mime2: string | null = arr2[0].match(/:(.*?);/)?.[1] || '';
			const bstr2: string = atob(arr2[1]);
			let n2: number = bstr2.length;
			const u8arr2: Uint8Array = new Uint8Array(n2);
		
			while (n2--) {
				u8arr2[n2] = bstr2.charCodeAt(n2);
			}
					
			const file2 = new File([u8arr2], 'image.png', {type:mime2});
			formData.append('rewardFile', file2);
		}

		const treasureInfo = {
			lat: lat,
			lng: lon,
			hint: hint,
			reward: rewardDes
		};
		
		const treasureRequest = new Blob([JSON.stringify(treasureInfo)], { type: 'application/json' });
		formData.append('treasureRequest', treasureRequest );
	
		registerTresure.fetchApiWithTokenMuti('POST', '/treasures', formData);
	};

	return (
		<>
			<CaptureModal open={modalOpen} close={closeCaptureModal}/>
			<RegisterModal open={modalOpen2} close={closeMapModal} latitude={lat} longitude={lon}/>
			<div className='flex flex-col px-4 overflow-y-scroll'>
				<>
					<Label> 보물 사진 </Label>
					<div className='flex flex-col items-center w-full mb-8'>
						{treasure ?
							<img src={treasure} className='mt-2 bg-auto rounded-lg w-52 bg-white2'/>
							:
							<img src={plus} onClick={openCaptureModal} className='w-48 h-48 mt-2 rounded-lg'/>
						}
						<div className='flex justify-end w-48'>
							<BsCameraFill onClick={openCaptureModal} size="24" color="#69BFFF"/>
						</div>
					</div>
				</>
				<>
					<div className='flex'>
						<Label> 위치 (위도/경도) </Label>
						<MiniButton onClick={openMapModal} > 미세 조정 </MiniButton>
					</div>
					<div className='flex justify-around'>
						<Input value = {lat|| ''} disabled type="text" placeholder="위도" onChange={handleLat}/>
						<Input value = {lon|| ''} disabled type="text" placeholder="경도" onChange={handleLon}/>
					</div>
				</>
				<>
					<Label htmlFor="hint"> 힌트 </Label>
					<div className='w-full'>
						<Textarea value={hint||''} name="hint" id="hint" placeholder="보물의 힌트를 주세요!" onChange={handleHint}/>
					</div>
				</>
				<div className='mb-4 border-b-2 border-b-gray'/>
				<>
					<Label> 보상 사진 </Label>
					<div className='flex flex-col items-center w-full mb-8'>
						{reward ?
							<img src={reward} className='mt-2 bg-auto rounded-lg w-52 bg-white2'/>
							:
							<img src={plus} className='w-48 h-48 mt-2 rounded-lg'/>
						}
						<div className='flex justify-end w-48'>
							<MdAddPhotoAlternate size="28" color="#69BFFF" onClick={()=>uploadImg()}/>
						</div>
						<input ref={fileInput} type="file" style={{ display: 'none' }} onChange={(e) => {handleUploadImg(e);}}/>
					</div>
				</>
				<>
					<Label htmlFor="rewardDes"> 보상 설명 </Label>
					<div>
						<Textarea value={rewardDes||''} name="rewardDes" id="rewardDes" placeholder="보상 설명을 해주세요!" onChange={handleRewardDes}/>
					</div>
				</>
				<div className='flex items-center justify-center mb-5'>
					<Button onClick={checkAva}> 등록 </Button>
				</div>
			</div>
		</>
	);
}

export default Register;
