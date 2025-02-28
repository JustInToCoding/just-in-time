import { FC, PropsWithChildren, useState } from 'react';
import { APITokenContext } from '../context/api-token-context';

export const APITokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [APIToken, setter] = useState<string | null>(localStorage.getItem('APIToken'));

  const setAPIToken = (token: string | null | undefined) => {
    if (token !== null && token !== undefined) {
      setter(token);
      localStorage.setItem('APIToken', token);
    } else {
      localStorage.removeItem('APIToken');
      setter(null);
    }
  };

  return <APITokenContext value={[APIToken, setAPIToken]}>{children}</APITokenContext>;
};
