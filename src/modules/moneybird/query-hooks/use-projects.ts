import { useQuery } from '@tanstack/react-query';
import { getProjects } from '../adapters/project';
import { useAuth } from '../hooks/use-auth';

export const useProjects = () => {
  const { fetcher } = useAuth();

  // Queries
  const query = useQuery({
    queryKey: ['projects'],
    queryFn: () => getProjects(fetcher),
  });

  return {
    query,
  };
};
