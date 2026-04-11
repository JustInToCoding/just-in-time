import { Group, Progress, Table, Text } from '@mantine/core';
import { useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import { getAllTimeEntries } from '../../modules/moneybird/adapters/time-entry';
import { useAuth } from '../../modules/moneybird/hooks/use-auth';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';

export const Projects = () => {
  const { fetcher } = useAuth();
  const { query } = useProjects('state:all');
  const timeEntriesQuery = useQuery({
    queryKey: ['time-entries-all'],
    queryFn: () => getAllTimeEntries(fetcher, { filter: 'state:all' }),
    enabled: !!query.data,
  });

  const hoursPerProject = useMemo(() => {
    if (!timeEntriesQuery.data) return {} as Record<string, number>;
    return timeEntriesQuery.data.reduce(
      (acc, entry) => {
        if (!entry.project_id) return acc;
        const minutes = dayjs(entry.ended_at)
          .subtract(entry.paused_duration || 0, 'seconds')
          .diff(entry.started_at, 'minutes');
        acc[entry.project_id] = (acc[entry.project_id] || 0) + minutes / 60;
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [timeEntriesQuery.data]);

  if (query.isPending) {
    return <span>Loading...</span>;
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>;
  }

  return (
    <div>
      <Table highlightOnHover striped>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Project name</Table.Th>
            <Table.Th>Budget (hours)</Table.Th>
            <Table.Th>Progress</Table.Th>
            <Table.Th>Remaining (hours)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {query.data?.map((project) => {
            const workedHours = hoursPerProject[project.id] || 0;
            const progressPercent = project.budget
              ? Math.min((workedHours / project.budget) * 100, 100)
              : null;
            const remaining = project.budget !== null ? project.budget - workedHours : null;

            return (
              <Table.Tr key={project.id}>
                <Table.Td>
                  <Group>
                    <Text>{project.name}</Text>
                  </Group>
                </Table.Td>
                <Table.Td>{project.budget ?? '-'}</Table.Td>
                <Table.Td w={250}>
                  {progressPercent !== null && (
                    <Progress
                      value={progressPercent}
                      size="lg"
                      radius="xl"
                      color={progressPercent >= 100 ? 'red' : progressPercent >= 80 ? 'orange' : 'blue'}
                    />
                  )}
                </Table.Td>
                <Table.Td>{remaining !== null ? remaining.toFixed(1) : '-'}</Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </div>
  );
};
