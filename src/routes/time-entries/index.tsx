import { Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import { TimeEntryTable } from '../../components/time-entry-table';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';
import { useTimeEntries } from '../../modules/moneybird/query-hooks/use-time-entries';

export const TimeEntries = () => {
  const [state, setState] = useState<string | null>('all');
  const [projectId, setProjectId] = useState<string | null>(null);
  const { query: projectsQuery } = useProjects('state:all');

  const [period, setPeriod] = useState<[Date | null, Date | null]>([
    dayjs().startOf('month').toDate(),
    dayjs().endOf('month').toDate(),
  ]);
  const { query } = useTimeEntries({
    filter: `state:${state},period:${dayjs(period[0]).format('YYYYMMDD')}..${dayjs(period[1]).format('YYYYMMDD')},project_id:${projectId || ''}`,
    enabled: !!projectsQuery.data,
  });

  return (
    <div>
      <DatePickerInput
        type="range"
        label="Pick dates range"
        placeholder="Pick dates range"
        allowSingleDateInRange
        value={period}
        onChange={setPeriod}
      />
      <Select
        label="Filter by project"
        placeholder="Select project"
        name="Filter by project"
        data={projectsQuery.data?.map((project) => ({
          value: project.id,
          label: project.name,
        }))}
        onChange={setProjectId}
        clearable
        mt="xs"
      />
      <Select
        label="filter by state"
        placeholder="Select state"
        name="filter by state"
        data={[
          { value: 'all', label: 'All' },
          { value: 'open', label: 'Open' },
          { value: 'non_billable', label: 'Non billable' },
        ]}
        value={state}
        onChange={setState}
        clearable
        mt="xs"
      />
      {query.isPending ? (
        <span>Loading...</span>
      ) : query.isError ? (
        <span>Error: {query.error.message}</span>
      ) : (
        <TimeEntryTable timeEntries={query.data} />
      )}
    </div>
  );
};
