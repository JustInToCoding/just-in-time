import { User } from '../models/users';

export const getUsers = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  params?: {
    include_accountants?: boolean;
    include_inactive?: boolean;
  },
): Promise<User[]> => {
  return fetcher(
    'users' +
      (params !== undefined
        ? '?' +
          new URLSearchParams({
            ...(params.include_accountants && {
              include_accountant: String(params.include_accountants),
            }),
            ...(params.include_inactive && { include_inactive: String(params.include_inactive) }),
          }).toString()
        : ''),
    true,
  ).then((response) => response.json());
};
