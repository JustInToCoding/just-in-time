import { useContext } from 'react';
import { APITokenContext } from '../context/api-token-context';

export const useMoneybird = () => {
  const [APIToken, setAPIToken] = useContext(APITokenContext);

  return {
    isLoggedIn: APIToken !== undefined,
    fetch: (resource: string, init?: RequestInit) =>
      APIToken
        ? fetch(`/moneybird-proxy/v2/${resource}`, {
            headers: [['Authorization', `Bearer ${APIToken}`]],
            ...init,
          })
        : Promise.reject(new Error('API Token was not set.')),
    validateAPIToken: async (token: string) => {
      try {
        const result = await fetch(`/moneybird-proxy/v2/administrations`, {
          headers: [['Authorization', `Bearer ${token}`]],
        });
        console.log(result);
        return result.ok;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    setAPIToken,
    logOut: () => setAPIToken(null),
  };
};
