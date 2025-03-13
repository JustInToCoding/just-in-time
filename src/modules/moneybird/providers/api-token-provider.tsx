import { FC, PropsWithChildren, useState } from 'react';
import { APITokenContext } from '../context/api-token-context';

export const APITokenProvider: FC<PropsWithChildren> = ({ children }) => {
  const [APIToken, _setAPIToken] = useState<string | null>(localStorage.getItem('APIToken'));
  const [administration, _setAdministration] = useState<string | null>(
    localStorage.getItem('administration'),
  );

  const setAPIToken = (token: string | null | undefined) => {
    if (token !== null && token !== undefined) {
      _setAPIToken(token);
      localStorage.setItem('APIToken', token);
    } else {
      localStorage.removeItem('APIToken');
      _setAPIToken(null);
    }
  };

  const setAdministration = (_administration: string | null | undefined) => {
    if (_administration !== null && _administration !== undefined) {
      _setAdministration(_administration);
      localStorage.setItem('administration', _administration);
    } else {
      localStorage.removeItem('administration');
      _setAdministration(null);
    }
  };

  return (
    <APITokenContext value={{ APIToken, setAPIToken, administration, setAdministration }}>
      {children}
    </APITokenContext>
  );
};
