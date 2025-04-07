import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { getTimeEntries, postTimeEntry } from '../adapters/time-entry';
import { APISettingsContext } from '../context/api-settings-context';
import { useAuth } from '../hooks/use-auth';
import { TimeEntry } from '../models/time-entry';

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
  const { user } = useContext(APISettingsContext);

  // Queries
  const query2 = useQuery({
    queryKey: ['time-entries', filter, per_page, page, query],
    queryFn: () => getTimeEntries(fetcher, { filter, per_page, page, query }),
    enabled,
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (
      timeEntry: Omit<
        TimeEntry,
        | 'user'
        | 'project'
        | 'events'
        | 'notes'
        | 'created_at'
        | 'updated_at'
        | 'id'
        | 'user_id'
        | 'administration_id'
        | 'contact'
        | 'detail'
      >,
    ) =>
      user
        ? postTimeEntry(fetcher, { ...timeEntry, user_id: user })
        : Promise.reject(new Error('User is not set')),
    onSuccess: async () => {
      // Invalidate queries that depend on the time entry data
      await query2.refetch();
    },
  });

  return {
    query: query2,
    createMutation,
  };
};
