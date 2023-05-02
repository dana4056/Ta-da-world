import React, {useState, useEffect} from 'react';
import { Modal, ModalSection, Button, ModalHeader } from '../../../util/Semantics';
import tw from 'tailwind-styled-components';

import {BsX}  from 'react-icons/bs';

declare global {
	interface Window {
	  kakao: any;
	}
  }

//등록쪽에서 위도 받아와야함
interface openProps {
	open: boolean;
	close: (x:string, y:string) => void;
	latitude : string,
    longitude : string
}

interface StyledDivProps {
	active: string;
}

const Modal2 = tw(Modal)<StyledDivProps>`
	${({ active }) => `
		${active ? 'flex items-center justify-center' : ''}
  	`}
`;

function MapModal({open, close, latitude, longitude}: openProps) : JSX.Element{
	const [lat, setLat] = useState<string>(latitude);
	const [lon, setLon] = useState<string>(longitude);

	useEffect(() => {
		if(open){
			const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
			const options = { //지도를 생성할 때 필요한 기본 옵션
				center: new window.kakao.maps.LatLng(latitude, longitude), //지도의 중심좌표.
				level: 3 //지도의 레벨(확대, 축소 정도)
			};
		
			const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
		
			// 지도를 클릭한 위치에 표출할 마커입니다
			const marker = new window.kakao.maps.Marker({ 
				// 지도 중심좌표에 마커를 생성합니다 
				position: map.getCenter() 
			}); 
			// 지도에 마커를 표시합니다
			marker.setMap(map);
	
			window.kakao.maps.event.addListener(map, 'click', (e:any) => {
				// 클릭한 위도, 경도 정보를 가져옵니다 
				const latlng = e.latLng; 
				setLat(latlng.Ma);
				setLon(latlng.La);
				// 마커 위치를 클릭한 위치로 옮깁니다
				marker.setPosition(latlng);	
			});
		}
	}, [open]);

	return (
		<Modal2 active = {open ? '1':''}>
			{open ? (
				<ModalSection>
					<ModalHeader>
						<div>
							보물 좌표 설정
						</div>
						<BsX onClick={()=> {close('0', '0');}} size="32" color="#535453"/>
					</ModalHeader>
					<div id="map" className='w-full h-full rounded-xl mb-1'/>
					<Button onClick={()=> {close(lat, lon);}}>저장</Button>
				</ModalSection>
			) : null}
		</Modal2>
	);
}

export default MapModal;
