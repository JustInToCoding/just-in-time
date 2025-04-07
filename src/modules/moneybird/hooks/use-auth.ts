import { useContext } from 'react';
import { APISettingsContext } from '../context/api-settings-context';

export const useAuth = () => {
  const { APIToken, setAPIToken, administration, setAdministration } =
    useContext(APISettingsContext);

  return {
    isLoggedIn: APIToken !== null,
    fetcher: (resource: string, useAdministration: boolean = false, init?: RequestInit) =>
      APIToken
        ? fetch(
            `/api/moneybird-proxy/v2/${useAdministration && administration !== null ? administration + '/' : ''}${resource}`,
            {
              headers: [
                ['Authorization', `Bearer ${APIToken}`],
                ['Content-Type', 'application/json'],
              ],
              ...init,
            },
          )
        : Promise.reject(new Error('API Token was not set.')),
    validateAPIToken: async (token: string) => {
      try {
        const result = await fetch(`/api/moneybird-proxy/v2/administrations`, {
          headers: [['Authorization', `Bearer ${token}`]],
        });
        return result.ok;
      } catch (e) {
        console.error(e);
        return false;
      }
    },
    setAPIToken,
    logOut: () => {
      setAPIToken(null);
      setAdministration(null);
    },
    administration,
    setAdministration,
  };
};
