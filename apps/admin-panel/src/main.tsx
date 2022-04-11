import { AppShell } from '@mantine/core';
import Axios from 'axios';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import AppHeader from './components/Header';
import AppNavbar from './components/Navbar';
import { environment } from './environments/environment';
import './globals.css';

function Application() {
  return (
    <StrictMode>
      <BrowserRouter>
        <AppShell
          padding="md"
          navbar={<AppNavbar />}
          header={<AppHeader />}
          styles={(theme) => ({
            main: {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[8]
                  : theme.colors.gray[0],
            },
          })}
        >
          <App />
        </AppShell>
      </BrowserRouter>
    </StrictMode>
  );
}

Axios.defaults.baseURL = environment.apiBaseUrl;

ReactDOM.render(<Application />, document.getElementById('root'));
