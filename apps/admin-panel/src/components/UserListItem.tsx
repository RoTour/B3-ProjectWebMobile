import { Box, Button, Card, Space, Text } from '@mantine/core';
import { User } from '@prisma/client';
import axios from 'axios';
import { useState } from 'react';
import { Ban, LockOpen } from 'tabler-icons-react';

export default function UserListItem(props: { user: User }) {
  const [banned, setBanned] = useState(props.user.banned);
  const toggleBanState = async () => {
    const { data } = await axios.post<User>(
      banned ? '/user/unban' : '/user/ban',
      {
        id: props.user.id,
      }
    );
    setBanned(data.banned);
  };
  return (
    <Card
      sx={{
        marginBottom: '1rem',
        display: 'flex',
        alignItems: 'center',
      }}
      shadow="md"
      p="md"
    >
      <Box
        sx={{
          width: '1rem',
          height: '1rem',
          borderRadius: '50%',
          backgroundColor: !banned ? '#e5e5e5' : '#f00',
        }}
      />
      <Space w={'sm'} />
      <Text sx={{ display: 'flex', alignItems: 'center' }}>
        <b>{props.user.id}</b>
        <Space w="lg" />
        <div>
          <div>
            {props.user.name} <small>({props.user.email})</small>
          </div>
          <small>
            <u>@{props.user.username}</u>
          </small>
        </div>
      </Text>
      <Box
        sx={{
          marginLeft: 'auto',
          display: 'flex',
        }}
      >
        <Button
          variant="gradient"
          gradient={{
            from: 'indigo',
            to: 'cyan',
          }}
          onClick={toggleBanState}
        >
          {banned ? <LockOpen /> : <Ban />}
        </Button>
        {/* TODO: Decide whether we need to add the ability to delete users */}
        {/* <Space w={'sm'} />
        <Button
          variant="gradient"
          gradient={{
            from: 'orange',
            to: 'red',
          }}
        >
          <Trash />
        </Button> */}
      </Box>
    </Card>
  );
}
