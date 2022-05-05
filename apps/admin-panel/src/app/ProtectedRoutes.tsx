import { PropsWithChildren } from 'react';
import { useHistory } from 'react-router-dom';
import useLogin from '../hooks/useLogin';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface ProtectedRoutesProps {}

export default function ProtectedRoutes(
  props: PropsWithChildren<ProtectedRoutesProps>
) {
  const { token } = useLogin();
  const router = useHistory();
  if (!token) {
    router.push('/');
    return null;
  }
  return <>{props.children} </>;
}
