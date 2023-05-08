import { useState, useEffect, useRef } from 'react'; 
import { Label } from '../../../util/Semantics';
import ListModal from './ListModal';
import { TreasureInfo } from '../../../util/Interface';

interface ListProps {
    treasures: TreasureInfo[]
}

function List({treasures}: ListProps) : JSX.Element {
	const [modalOpen, setModalOpen] = useState<boolean>(false);
	const [no, setNO] = useState<number>(0);
	const [lat, setLat] = useState<string>('');
	const [lng, setLng] = useState<string>('');
	
	const handleNO  = (i:number) : void => {
		setLat(treasures[i].lat);
		setLng(treasures[i].lng);
		setNO(i);
	};

	useEffect(() => {
		if(treasures.length){
			const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
			const options = { //지도를 생성할 때 필요한 기본 옵션
				center: new window.kakao.maps.LatLng(lat, lng),
				level: 2 //지도의 레벨(확대, 축소 정도)
			};
			
			const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
			
			const imageSrc = 'https://d2ab9z4xn2ddpo.cloudfront.net/treasure/find.png'; 
			const imageSize = new window.kakao.maps.Size(32, 32); 
			const markerImage = new window.kakao.maps.MarkerImage(imageSrc, imageSize); 

			// 지도에 마커를 표시합니다
			for (let i = 0; i < treasures.length; i ++) {
				const marker = new window.kakao.maps.Marker({
					map: map, // 마커를 표시할 지도
					position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng), // 마커를 표시할 위치
					clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
					image : markerImage // 마커 이미지 
				});

				window.kakao.maps.event.addListener(marker, 'click', () => {
					handleNO(i);
					modalTreasureOpen();
				});
			}
		}

	}, [treasures, lat]);

	useEffect(() => {
		if(treasures.length){
			handleNO(0);
		}
	}, []);

	//모달창 열기
	const modalTreasureOpen = (): void => {
		setModalOpen(true);
	};
	
	//모달창 닫기
	const closeModal = () : void => {
		setModalOpen(false);
	};

	return (
		<>
			{ treasures.length ?
				<ListModal open={modalOpen} close={closeModal} treasure={treasures[no]}/>
				: null
			}

			<div className='h-full px-4 '>
      		<Label>보물 지도</Label>
				{ treasures.length ?
					<>
						<div className='flex justify-end w-full px-1 text-sm'>총 {treasures.length}개</div>
			  			<div className='flex items-center w-full py-2 mb-2 overflow-x-scroll bg-white2 rounded-xl'>
							{treasures.map((treasure, index) => {
								return ( 
									<div key={index} style={{ backgroundImage: `url(${treasure.imgPath})` }} className='w-12 h-12 mx-2 bg-center bg-cover rounded-full g-no-repeat' onClick={()=>handleNO(index)}/>
								);
							})}
						</div>
						<div id="map" className='w-full mb-1 h-3/4 rounded-xl'/>
					</>
					:
					<div className='flex flex-col items-center justify-center h-3/4'>
						<img className='w-1/3' src='https://d2ab9z4xn2ddpo.cloudfront.net/treasure/find.png'/>
						<div className='mt-2 text-xl font-bold text-gray5'> 아직 숨긴 보물이 없어요! </div>
					</div>
				}
			</div>
		</>
	);
}
  
export default List;
