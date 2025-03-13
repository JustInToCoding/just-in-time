import { useQuery } from '@tanstack/react-query';
import { getAdministrations } from '../adapters/administrations';
import { useAuth } from '../hooks/use-auth';

export const useAdministrations = () => {
  const { fetcher } = useAuth();

  // Queries
  const query = useQuery({
    queryKey: ['administrations'],
    queryFn: () => getAdministrations(fetcher),
  });

  return {
    query,
  };
};
