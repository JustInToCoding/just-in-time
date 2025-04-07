import { useQuery } from '@tanstack/react-query';
import { getUsers } from '../adapters/users';
import { useAuth } from '../hooks/use-auth';

export const useUsers = (
  enabled?: boolean,
  includeAccountants?: boolean,
  includeInactive?: boolean,
) => {
  const { fetcher } = useAuth();

  // Queries
  const query = useQuery({
    queryKey: ['users', includeAccountants, includeInactive],
    queryFn: () =>
      getUsers(fetcher, {
        include_accountants: includeAccountants,
        include_inactive: includeInactive,
      }),
    enabled,
  });

  return {
    query,
  };
};
