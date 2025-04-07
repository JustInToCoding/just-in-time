import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Notifications } from '@mantine/notifications';
import '@mantine/notifications/styles.css';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import duration from 'dayjs/plugin/duration';
import updateLocale from 'dayjs/plugin/updateLocale';
import weekday from 'dayjs/plugin/weekday';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router';
import { ProtectedRoute } from './components/protected-route';
import { APISettingsProvider } from './modules/moneybird';
import { Layout } from './routes/layout';
import { Projects } from './routes/projects';
import { Setup } from './routes/setup';
import { Administration } from './routes/setup/administration';
import { Login } from './routes/setup/login';
import { TimeEntries } from './routes/time-entries';
import { TimeLogger } from './routes/time-logger';

dayjs.extend(customParseFormat);
dayjs.extend(duration);
dayjs.extend(weekday);
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  weekStart: 1,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="dark">
      <Notifications />
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <APISettingsProvider>
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
                {/* <Route index element={<Home />} /> */}
                <Route index element={<Navigate replace to="/time-logger" />} />
                <Route path="time-logger" element={<TimeLogger />} />
                <Route path="time-entries" element={<TimeEntries />} />
                <Route path="projects" element={<Projects />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </APISettingsProvider>
      </QueryClientProvider>
    </MantineProvider>
  </StrictMode>,
);
