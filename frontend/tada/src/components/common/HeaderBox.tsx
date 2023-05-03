interface StyledDivProps {
	title: string;
    total: number;
    num : number;
}


function HeaderBox({title, total, num}: StyledDivProps) : JSX.Element {
	return (
		<div className='w-full mt-1 mb-3 flex items-center'>
			<p className='mx-2 font-black text-gray5'>{title}</p>
			{ total ?
				<p className='px-2 py-1 font-semibold text-sm text-center text-white border-white rounded-lg bg-gradient-to-r from-orange to-orange2'>
					{num} / {total}
				</p>
				:
				<p className='px-2 py-1 font-semibold text-sm text-center text-white border-white rounded-lg bg-gradient-to-r from-orange to-orange2'>
					{num}
				</p>
			}
		</div>
	);
}
  
export default HeaderBox;
