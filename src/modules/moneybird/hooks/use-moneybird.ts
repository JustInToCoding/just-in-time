import { useContext } from 'react';
import { APITokenContext } from '../context/api-token-context';

export const useMoneybird = () => {
  const [APIToken, setAPIToken] = useContext(APITokenContext);

  return {
    setAPIToken,
    fetch: (resource: string, init?: RequestInit) =>
      APIToken
        ? fetch(`/moneybird-proxy/v2/${resource}`, {
            headers: [['Authorization', `Bearer ${APIToken}`]],
            ...init,
          })
        : Promise.reject(new Error('API Token was not set.')),
    logOut: () => setAPIToken(null),
  };
};
