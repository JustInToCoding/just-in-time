import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from './components/protected-route';
import { APITokenProvider } from './modules/moneybird';
import { Home } from './routes/home';
import { Layout } from './routes/layout';
import { Login } from './routes/login';
import { Projects } from './routes/projects';
import { TimeEntries } from './routes/time-entries';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <APITokenProvider>
        <BrowserRouter>
          <Routes>
            <Route path="login" element={<Login />} />
            <Route
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Home />} />
              <Route path="time-entries" element={<TimeEntries />} />
              <Route path="projects" element={<Projects />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </APITokenProvider>
    </MantineProvider>
  </StrictMode>,
);
