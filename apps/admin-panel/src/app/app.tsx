import { Redirect, Route } from 'react-router-dom';
import DashboardPage from '../pages/Dashboard';
import LoginPage from '../pages/Login';
import ProtectedRoutes from './ProtectedRoutes';

export function App() {
  return (
    <div style={{ height: '100%' }}>
      {/* START: routes */}
      <Route path="/" exact render={() => <LoginPage />} />
      <ProtectedRoutes>
        <Route path={'/dashboard'} exact render={() => <DashboardPage />} />
      </ProtectedRoutes>
      <Redirect to="/" />
      {/* END: routes */}
    </div>
  );
}

export default App;
