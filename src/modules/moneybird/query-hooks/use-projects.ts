import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../adapters/project';
import { useAuth } from '../hooks/use-auth';

export const useProjects = (
  filter?: 'state:all' | 'state:archived' | 'state:active',
  per_page?: string,
  page?: string,
) => {
  const { fetcher } = useAuth();

  // Queries
  const query = useQuery({
    queryKey: ['projects', filter, per_page, page],
    queryFn: () => getProjects(fetcher, { filter, per_page, page }),
  });

  return {
    query,
  };
};
