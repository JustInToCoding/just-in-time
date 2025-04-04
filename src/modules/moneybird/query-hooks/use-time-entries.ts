import { useQuery } from '@tanstack/react-query';
import { getTimeEntries } from '../adapters/time-entry';
import { useAuth } from '../hooks/use-auth';

export const useTimeEntries = ({
  filter,
  per_page,
  page,
  query,
  enabled,
}: {
  filter?: string;
  per_page?: string;
  page?: string;
  query?: string;
  enabled?: boolean;
}) => {
  const { fetcher } = useAuth();

  // Queries
  const query2 = useQuery({
    queryKey: ['time-entries', filter, per_page, page, query],
    queryFn: () => getTimeEntries(fetcher, { filter, per_page, page, query }),
    enabled,
  });

  return {
    query: query2,
  };
};
