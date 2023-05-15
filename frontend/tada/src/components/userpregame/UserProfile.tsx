import React from 'react';

interface User {
	id: string;
	roomId: number;
	nickname: string;
	// profileImage: string;
	profileImage: number;
}

interface UserProfileProps {
	user: User;
}

const UserProfile: React.FC<UserProfileProps> = ({ user }) => {
	const avatar = require(`../../assets/images/avatar${user.profileImage || 1}.gif`);


	return (
		<div className='flex items-center justify-center pt-12 shadow-lg h-52 bg-main rounded-b-3xl'>
			<div className='flex items-center justify-center rounded-full w-52 h-52 bg-main2/50'>
				<div className='p-5'>
					<img
						className='border-4 border-white rounded-full'
						src={avatar}
					></img>
					<div className='flex items-center justify-center w-auto h-12 mt-5 text-lg font-semibold text-white border-2 rounded-full shadow-lg bg-gradient-to-r from-blue to-blue2'>
						<p>{user.nickname}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default UserProfile;
