import React, {useState, useEffect} from 'react';
import tw from 'tailwind-styled-components';
import { WhiteBox } from '../../../util/Semantics';
import { TreasureInfo } from '../../../util/Interface';
import BoxHeader from '../../common/BoxHeader';
import TreasureBox from '../../common/TreasureBox';
interface TreasureListProps {
    treasures: TreasureInfo[]
}


function TreasureMap({treasures}: TreasureListProps) : JSX.Element {
	const [no, setNO] = useState<number>(0);
	const total = useState<number>(treasures.length);
	const [count, setCount] = useState<number>(0);
	const [lat, setLat] = useState<string>(treasures[0].lat);
	const [lng, setLng] = useState<string>(treasures[0].lng);

	const handleNO  = (i:number) : void => {
		setLat(treasures[i].lat);
		setLng(treasures[i].lng);
	};
	useEffect(() => {
		let n  = 0;
		for (let index = 0; index < treasures.length; index++) {
			if(treasures[index].status){
				n += 1;
			}
		}
		setCount(n);
	}, [treasures]);	
	
	useEffect(() => {
		if(treasures){
			const container = document.getElementById('map'); //지도를 담을 영역의 DOM 레퍼런스
			const options = { //지도를 생성할 때 필요한 기본 옵션
				center: new window.kakao.maps.LatLng(lat, lng),
				level: 2 //지도의 레벨(확대, 축소 정도)
			};
			
			const map = new window.kakao.maps.Map(container, options); //지도 생성 및 객체 리턴
			
			const imageFind = 'https://d2ab9z4xn2ddpo.cloudfront.net/treasure/find.png'; 
			const imageNOFind = 'https://d2ab9z4xn2ddpo.cloudfront.net/treasure/noFind.png'; 
			const imageSize = new window.kakao.maps.Size(36, 36); 
			const markerImage1 = new window.kakao.maps.MarkerImage(imageFind, imageSize); 
			const markerImage2 = new window.kakao.maps.MarkerImage(imageNOFind, imageSize); 

			// 지도에 마커를 표시합니다
			for (let i = 0; i < treasures.length; i ++) {
				if(treasures[i].status){
					const marker = new window.kakao.maps.Marker({
						map: map, // 마커를 표시할 지도
						position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng), // 마커를 표시할 위치
						clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
						image : markerImage1 // 마커 이미지 
					});				
					
					// 마커를 클릭했을 때 마커 위에 표시할 인포윈도우를 생성합니다
					const iwContent = `<div style="padding:5px;">${treasures[i].finderNick}</div>`, // 인포윈도우에 표출될 내용으로 HTML 문자열이나 document element가 가능합니다
						iwRemoveable = true; // removeable 속성을 ture 로 설정하면 인포윈도우를 닫을 수 있는 x버튼이 표시됩니다

					// 인포윈도우를 생성합니다
					const infowindow = new window.kakao.maps.InfoWindow({
						content : iwContent,
						removable : iwRemoveable
					});

					window.kakao.maps.event.addListener(marker, 'click', () => {
						infowindow.open(map, marker);
						setNO(i);
					});
				} else {
					const marker = new window.kakao.maps.Marker({
						map: map, // 마커를 표시할 지도
						position: new window.kakao.maps.LatLng(treasures[i].lat, treasures[i].lng), // 마커를 표시할 위치
						clickable: true, // 마커를 클릭했을 때 지도의 클릭 이벤트가 발생하지 않도록 설정합니다
						image : markerImage2 // 마커 이미지 
					});

					window.kakao.maps.event.addListener(marker, 'click', () => {
						setNO(i);
					});
				}
			}
		}
	}, [treasures, lat]);

	return (
		<>
			<WhiteBox>
				<BoxHeader title='보물 현황' total={4} num={2}/>
				<div className='w-full flex items-center'>
					{treasures.map((treasure, index) => {
						return ( 
							<div key={index}>
								{ treasure.status ?
									<>
										<img className='w-12 h-12 m-2 rounded-full' src={treasure.img} onClick={()=>handleNO(index)}/>
									</>
									:
									<>	
										<div className={`"w-12 h-12 m-2 g-no-repeat bg-cover bg-center bg-${treasure.img}"`}>
											
										</div>
									</>
								}
							</div>
						);
					})}
				</div>
				<div id="map" className='w-full h-72 rounded-xl mb-1'/>
			</WhiteBox>
			<WhiteBox>
				<div className='flex flex-col justify-center items-center text-base font-black my-2 text-gray5'>
					{treasures[no].status ?
						<>
							<p>{treasures[no].finderNick} 님이</p>
							<p>보물을 찾았어요!</p>
						</>
						: <p>아직 아무도 보물을 찾지 못했어요!</p>
					}
				</div>
				<TreasureBox treasure={treasures[no]}/>
			</WhiteBox>
		</>
	);
}
  
export default TreasureMap;
