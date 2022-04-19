import { Pagination } from '@mantine/core';
import { showNotification } from '@mantine/notifications';
import axios from 'axios';
import { useEffect, useState } from 'react';
import useLogin from '../hooks/useLogin';

export default function DashboardPage() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const { token } = useLogin();
  useEffect(() => {
    axios
      .get<never[]>('/user?page=' + page, {
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
  }, [page, token]);
  return (
    <div>
      <h1>Hii</h1>
      {JSON.stringify(users, null, 2)}
      <Pagination
        page={page}
        total={totalPages}
        onChange={(newPage) => setPage(newPage)}
      />
    </div>
  );
}
