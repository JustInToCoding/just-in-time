import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../adapters/contact';
import { useAuth } from '../hooks/use-auth';

export const useContacts = (search?: string, per_page?: string, page?: string) => {
  const { fetcher } = useAuth();

  // Queries
  const query = useQuery({
    queryKey: ['contacts', search, per_page, page],
    queryFn: () => getContacts(fetcher, { query: search, per_page, page }),
  });

  return {
    query,
  };
};
