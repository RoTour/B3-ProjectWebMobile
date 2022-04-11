import { Redirect, Route } from 'react-router-dom';
import LoginPage from '../pages/Login';

export function App() {
  return (
    <div style={{ height: '100%' }}>
      {/* START: routes */}
      <Route path="/" exact render={() => <LoginPage />} />
      <Redirect to="/" />
      {/* END: routes */}
    </div>
  );
}

export default App;
