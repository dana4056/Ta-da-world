import React from 'react';

interface UserListItem {
	id: string;
	nick: string;
	imgNo: number;
}

interface UserListProps {
	users: UserListItem[] | null;
}

const UserList: React.FC<UserListProps> = ({ users }) => {
	return (
		<div className='px-2 mt-4 space-y-2 overflow-auto h-96'>
			{users && users.length > 0 ? (
				users.map((user) => (
					<div
						className='flex items-center w-5/6 h-16 pl-20 mx-auto font-bold bg-white shadow-lg rounded-2xl text-main'
						key={user.id}
					>
						<img
							className='w-12 h-12 mr-5 border-white rounded-full'
							src={require(`../../assets/images/avatar${user.imgNo.toString()}.jpg`)}
							alt=''
						/>
						<p className='text-lg font-bold'>{user.nick}</p>
					</div>
				))
			) : (
				<p>There is no users here</p>
			)}
		</div>
	);
};

export default UserList;
