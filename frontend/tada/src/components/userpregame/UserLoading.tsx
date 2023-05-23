import React from 'react';

interface UserLoadingProps {
	label: string;
	value: string;
}

function UserLoading(props: UserLoadingProps): JSX.Element {
	return (
		<div className='shadow-lg'>
			<div className='flex flex-col items-center justify-center w-24 space-y-2 bg-white rounded-lg shadow-inner h-28 shadow-gray2'>
				<p className='text-lg font-semibold text-gray3'>{props.label}</p>
				<p className='text-5xl font-black text-orange'>{props.value}</p>
			</div>
		</div>
	);
}

export default UserLoading;
