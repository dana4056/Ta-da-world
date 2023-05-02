import { WhiteBox } from '../../../util/Semantics';
import BoxHeader from '../../common/BoxHeader';
import { TreasureInfo } from '../../../util/Interface';

interface TreasureListProps {
    treasures: TreasureInfo[]
}

function TreasureBoard({treasures}: TreasureListProps) : JSX.Element {
	return (
		<WhiteBox>
			<BoxHeader title='보물 현황' total={4} num={2}/>
			{treasures.map((treasure, index) => {
				return ( 
					<div className='w-full flex items-center' key={index}>
						{ treasure.status ?
							<>
								<img className='w-12 h-12 m-2 rounded-full' key={index} src={treasure.img}/>
								<p className='text-base'>{treasure.finderNick}</p>
							</>
							:
							<>
								<p>{treasure?.finderNick}</p>
							</>
						}
					</div>
				);
			})}
		</WhiteBox>
	);
}
  
export default TreasureBoard;
