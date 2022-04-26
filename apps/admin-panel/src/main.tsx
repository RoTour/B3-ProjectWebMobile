import { AppShell, MantineProvider } from '@mantine/core';
import { NotificationsProvider } from '@mantine/notifications';
import Axios from 'axios';
import { StrictMode } from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import App from './app/app';
import AppHeader from './components/Header';
import { environment } from './environments/environment';
import './globals.css';

function Application() {
  return (
    <StrictMode>
      <BrowserRouter>
        <MantineProvider>
          <NotificationsProvider>
            <AppShell
              padding="md"
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
          </NotificationsProvider>
        </MantineProvider>
      </BrowserRouter>
    </StrictMode>
  );
}

Axios.defaults.baseURL = environment.apiBaseUrl;

ReactDOM.render(<Application />, document.getElementById('root'));
