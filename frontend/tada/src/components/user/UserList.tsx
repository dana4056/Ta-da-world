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
						className='flex items-center justify-center w-5/6 h-16 pl-3 mx-auto font-bold bg-white shadow-lg rounded-2xl text-main'
						key={user.id}
					>
						<p>{user.nick}</p>
					</div>
				))
			) : (
				<p>There is no users here</p>
			)}
		</div>
	);
};

export default UserList;
