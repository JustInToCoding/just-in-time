import { useMutation, useQuery } from '@tanstack/react-query';
import { getActivities, postActivities } from '../adapters/activities-localstorage';
import { Activity } from '../models/activities';

export const useActivities = ({
  projectId = '',
  enabled,
}: {
  projectId?: string;
  enabled?: boolean;
}) => {
  // Queries
  const query = useQuery({
    queryKey: ['activities', projectId],
    queryFn: () => getActivities(projectId),
    enabled,
  });

  // Mutations
  const mutation = useMutation({
    mutationFn: (activities: Activity[]) => postActivities(projectId, activities),
    onSuccess: async () => {
      // Invalidate queries that depend on the time entry data
      await query.refetch();
    },
  });

  return {
    query,
    mutation,
  };
};
