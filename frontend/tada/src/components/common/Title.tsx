interface StyledDivProps {
	title: string;
    subTitle: string;
}

function Title({title, subTitle}: StyledDivProps): JSX.Element {
	return (
		<>
			<p className='mb-1 text-white font-bold'>{subTitle}</p>
			<div className='w-4/5 h-12 flex flex-col justify-center items-center bg-white rounded-3xl shadow-lg mb-4'>
				<p className='text-main text-xl font-black'>{title}</p>		
			</div>
		</>
	);
}
  
export default Title;
