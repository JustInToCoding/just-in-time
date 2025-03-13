import { createContext } from 'react';

export const APITokenContext = createContext<{
  APIToken: string | null;
  setAPIToken: (token: string | null | undefined) => void;
  administration: string | null;
  setAdministration: (administration: string | null | undefined) => void;
}>({ APIToken: null, setAPIToken: () => {}, administration: null, setAdministration: () => {} });
