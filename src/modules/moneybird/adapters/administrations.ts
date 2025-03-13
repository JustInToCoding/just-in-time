import { Administration } from '../models/administration';

export const getAdministrations = (
  fetcher: (input: string, ...args: any[]) => Promise<Response>,
): Promise<Administration[]> => {
  return fetcher('administrations').then((response) => response.json());
};
