import {
  Button,
  Card,
  Center,
  Container,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { LoginDto } from '@projetweb-b3/dto';
import axios, { AxiosError, AxiosResponse } from 'axios';
import * as IsEmail from 'email-validator';
import { SyntheticEvent, useEffect, useState } from 'react';
import { At, Key } from 'tabler-icons-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const onSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: LoginDto = { email: email, password };
    // FIXME: The url isn't correct
    axios
      .post(`/auth/login`, payload)
      .then(({ data }: AxiosResponse<{ accessToken: string }>) => {
        // setTokenAndNavigate(data.accessToken);
        console.log({ data });
      })
      .catch((error: AxiosError) => {
        if (error.response) {
          const { data } = error.response;
          if (data.error) {
            setEmailError(data.error);
          }
        }
      });
  };
  useEffect(() => {
    if (!IsEmail.validate(email)) {
      setEmailError('Email is not valid');
    } else {
      setEmailError('');
    }
  }, [email]);
  useEffect(() => {
    if (password.length < 3) {
      setPasswordError('Password must be at least 3 characters long');
    } else {
      setPasswordError('');
    }
  }, [password]);
  return (
    <Container fluid={true}>
      <Center>
        <Card sx={{ minWidth: '500px' }}>
          <form onSubmit={onSubmit}>
            <Center>
              <Text>
                <h1>Login</h1>
              </Text>
            </Center>
            <TextInput
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              label="Username"
              required={true}
              error={emailError}
              icon={<At size={14} />}
            />
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              label="Password"
              required={true}
              error={passwordError}
              icon={<Key size={14} />}
            />
            <Button
              sx={{ marginTop: '1rem' }}
              type="submit"
              disabled={Boolean(emailError || passwordError)}
            >
              Log-in
            </Button>
          </form>
        </Card>
      </Center>
    </Container>
  );
}
