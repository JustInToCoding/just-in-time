import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';
import { ProtectedRoute } from './components/protected-route';
import { APITokenProvider } from './modules/moneybird';
import { Home } from './routes/home';
import { Layout } from './routes/layout';
import { Projects } from './routes/projects';
import { Setup } from './routes/setup';
import { Administration } from './routes/setup/administration';
import { Login } from './routes/setup/login';
import { TimeEntries } from './routes/time-entries';
import { TimeLogger } from './routes/time-logger';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <APITokenProvider>
          <BrowserRouter>
            <Routes>
              <Route path="setup" element={<Setup />}>
                <Route path="login" element={<Login />} />
                <Route path="administration" element={<Administration />} />
              </Route>
              <Route
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="time-logger" element={<TimeLogger />} />
                <Route path="time-entries" element={<TimeEntries />} />
                <Route path="projects" element={<Projects />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </APITokenProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
