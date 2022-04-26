import {
  Alert,
  Button,
  Card,
  Center,
  Container,
  PasswordInput,
  Text,
  TextInput,
} from '@mantine/core';
import { LoginDto } from '@projetweb-b3/dto';
import * as IsEmail from 'email-validator';
import { SyntheticEvent, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { AlertCircle, At, Key } from 'tabler-icons-react';
import useLogin from '../hooks/useLogin';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [generalError, setGeneralError] = useState('');

  const { login } = useLogin();
  const router = useHistory();
  const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setGeneralError('');
    const payload: LoginDto = { email: email, password };
    try {
      await login(payload);
      router.push('/dashboard');
    } catch (error) {
      return;
    }
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
            {generalError && (
              <Alert
                icon={<AlertCircle size={16} />}
                title="Bummer!"
                color="red"
                sx={{ marginBottom: '1rem' }}
              >
                {generalError}
              </Alert>
            )}
            <TextInput
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              label="E-Mail"
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
