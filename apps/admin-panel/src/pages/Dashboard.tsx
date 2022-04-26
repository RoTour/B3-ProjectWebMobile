import { Pagination, Space, TextInput } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { showNotification } from '@mantine/notifications';
import { User } from '@prisma/client';
import axios from 'axios';
import { useCallback, useEffect, useState } from 'react';
import { Search } from 'tabler-icons-react';
import UserList from '../components/UserList';
import useLogin from '../hooks/useLogin';

export default function DashboardPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [search] = useDebouncedValue(searchTerm, 500);
  const { token } = useLogin();
  const fetchUsers = useCallback((): Promise<void> => {
    return axios
      .get<User[]>(`/user?page=${page}&search=${search}`, {
        headers: {
          Authorization: 'Bearer ' + token,
        },
      })
      .then((res) => {
        setUsers(res.data);
        let total = +res.headers['x-total-count'];
        total = Math.ceil(total / 10);
        setTotalPages(total);
      })
      .catch((err) => {
        showNotification({
          message: err.response.data.message,
          color: 'red',
        });
      });
  }, [page, search, token]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers, search]);
  return (
    <div>
      <TextInput
        icon={<Search />}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <Space h="md" />
      <UserList users={users} />
      {totalPages > 1 && (
        <Pagination
          page={page}
          total={totalPages}
          onChange={(newPage) => setPage(newPage)}
        />
      )}
    </div>
  );
}
