import { useState, useEffect, useRef } from 'react'; 
import { Label } from '../../../hooks/Semantics';
import TreasureModal from './TreasureModal ';

interface TreasureInfo {
	id: number;
	img: string;
	lat: string;
	lng: string;
	hint: string;
	reword_img: string;
	reword: string;
}

function List() : JSX.Element {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [treasure, setTreasure] = useState<TreasureInfo | null>(null);

	const a  = 'https://d2ab9z4xn2ddpo.cloudfront.net/%EC%84%9E%EA%B8%B0.png';
	const treasureList : Array<TreasureInfo> = [
		{
			id: 1,
			img: a,
			lat: '37.5128064',
			lng: '127.0284288',
			hint: '학동역',
			reword_img: a,
			reword: '나의 망므~'
		},
		{
			id: 2,
			img: a,
			lat: '37.513035165378085',
			lng: '127.02883155684492',
			hint: '카페 마오지래',
			reword_img: '',
			reword: '커피'
		},
		{
			id: 3,
			img: a,
			lat: '37.512846012270565',
			lng: '127.0285939551883',
			hint: '주차장',
			reword_img: a,
			reword: ''
		},
	];
	
	useEffect(() => {
		if(treasureList){
			const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
			const options = { //지도를 생성할 때 필요한 기본 옵션
				center: new window.kakao.maps.LatLng(treasureList[0].lat, treasureList[0].lng),
				level: 2 //지도의 레벨(확대, 축소 정도)
			};
			
			const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
			
			const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png'; 
			const imageSize = new window.kakao.maps.Size(24, 35); 
			const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 

			// 지도에 마커를 표시합니다
			for (let i = 0; i < treasureList.length; i ++) {
				const marker = new window.kakao.maps.Marker({
					map: map, // 마커를 표시할 지도
					position: new window.kakao.maps.LatLng(treasureList[i].lat, treasureList[i].lng), // 마커를 표시할 위치
					clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
					image : markerImage // 마커 이미지 
				});

				window.kakao.maps.event.addListener(marker, 'click', () => {
					console.log('마커 클릭');
					modalTreasureOpen(treasureList[i]);
				});
			}
		}

	}, []);

	useEffect(() => {
		if(treasure){
			setModalOpen(true);
		}
	}, [treasure]);

	//모달창 열기
	const modalTreasureOpen = (t : TreasureInfo): void => {
		setTreasure(t);
	};
	
	//모달창 닫기
	const closeModal = () : void => {
		setTreasure(null);
		setModalOpen(false);
	};

	return (
		<>
			<TreasureModal open={modalOpen} close={closeModal} treasure={treasure}/>
			<div className=' h-full px-4'>
      		<Label>보물 지도</Label>
				{treasureList.length ?
					<>
						<div className='w-full flex justify-end'>총 {treasureList.length}개</div>
						<div id="map" className='w-full h-5/6 rounded-xl mb-1'/>
					</>
					:<div>아직 숨긴 보물이 없어요! 보물 찾으라는 이미지 넣어버리기 ㅋ</div>
				}
			</div>
		</>
	);
}
  
export default List;
