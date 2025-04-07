import { createContext } from 'react';

export const APISettingsContext = createContext<{
  APIToken: string | null;
  setAPIToken: (token: string | null | undefined) => void;
  administration: string | null;
  setAdministration: (administration: string | null | undefined) => void;
  user: string | null;
  setUser: (userId: string | null | undefined) => void;
}>({
  APIToken: null,
  setAPIToken: () => {},
  administration: null,
  setAdministration: () => {},
  user: null,
  setUser: () => {},
});
