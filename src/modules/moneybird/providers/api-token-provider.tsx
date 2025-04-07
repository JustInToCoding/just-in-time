import { FC, PropsWithChildren, useEffect, useState } from 'react';
import { APISettingsContext } from '../context/api-settings-context';
import { useUsers } from '../query-hooks/use-users';

export const APISettingsProvider: FC<PropsWithChildren> = ({ children }) => {
  const [APIToken, _setAPIToken] = useState<string | null>(localStorage.getItem('APIToken'));
  const [administration, _setAdministration] = useState<string | null>(
    localStorage.getItem('administration'),
  );
  const { query } = useUsers(!!administration);
  const [user, _setUser] = useState<string | null>(localStorage.getItem('user'));

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

  const setUser = (_userId: string | null | undefined) => {
    if (_userId !== null && _userId !== undefined) {
      _setUser(_userId);
      localStorage.setItem('user', _userId);
    } else {
      localStorage.removeItem('user');
      _setUser(null);
    }
  };

  useEffect(() => {
    if (!user && query.data?.[0]) {
      const userId = query.data[0].id;
      setUser(userId);
      localStorage.setItem('user', userId);
    }
  }, [query.data, user]);

  return (
    <APISettingsContext
      value={{ APIToken, setAPIToken, administration, setAdministration, user, setUser }}
    >
      {children}
    </APISettingsContext>
  );
};
