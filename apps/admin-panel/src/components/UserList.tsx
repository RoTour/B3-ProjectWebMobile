import { User } from '@prisma/client';
import UserListItem from './UserListItem';

export interface UserListProps {
  users: User[];
}

export default function UserList({ users }: UserListProps) {
  return (
    <>
      {users.map((user) => (
        <UserListItem key={user.id} user={user}></UserListItem>
      ))}
    </>
  );
}
