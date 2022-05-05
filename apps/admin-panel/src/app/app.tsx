import { Redirect, Route } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import DashboardPage from '../pages/Dashboard';
import LoginPage from '../pages/Login';

export function App() {
  const { token } = useLogin();
  return (
    <div style={{ height: '100%' }}>
      {/* START: routes */}
      {token !== null && (
        <Route
          path="/dashboard"
          exact
          render={() => {
            console.log('dashboard???');
            return <DashboardPage />;
          }}
        />
      )}
      <Route path="/" exact render={() => <LoginPage />} />
      <Redirect to="/" />
      {/* END: routes */}
    </div>
  );
}

export default App;
