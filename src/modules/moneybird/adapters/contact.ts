import { Contact } from '../models/contact';

export const getContacts = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  params?: {
    query?: string;
    per_page?: string;
    page?: string;
  },
): Promise<Contact[]> => {
  return fetcher(
    'contacts' +
      (params !== undefined
        ? '?' +
          new URLSearchParams({
            ...(params.query && { query: params.query }),
            ...(params.per_page && { per_page: params.per_page }),
            ...(params.page && { page: params.page }),
          }).toString()
        : ''),
    true,
  ).then((response) => response.json());
};
