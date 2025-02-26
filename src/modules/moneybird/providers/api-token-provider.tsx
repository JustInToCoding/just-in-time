import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { APITokenContext } from '../context/api-token-context';

export const APITokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [APIToken, setter] = useState<string | undefined>(undefined);

  useEffect(() => {
    const localStorageAPIToken = localStorage.getItem('APIToken');
    if (localStorageAPIToken !== null) {
      setter(localStorageAPIToken);
    }
  }, []);

  const setAPIToken = (token: string | null | undefined) => {
    if (token !== null && token !== undefined) {
      setter(token);
      localStorage.setItem('APIToken', token);
    } else {
      setter(undefined);
      localStorage.removeItem('APIToken)');
    }
  };

  return (
    <APITokenContext.Provider value={[APIToken, setAPIToken]}>{children}</APITokenContext.Provider>
  );
};
