import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Select } from '@mantine/core';
import { DatePickerInput, DatesRangeValue, DateValue } from '@mantine/dates';
import dayjs from 'dayjs';
import { useState } from 'react';
import { EditTimeEntryModal } from '../../components/edit-time-entry-modal';
import { TimeEntryTable } from '../../components/time-entry-table';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';
import { useTimeEntries } from '../../modules/moneybird/query-hooks/use-time-entries';

export const TimeEntries = () => {
  const [state, setState] = useState<string | null>('all');
  const [projectId, setProjectId] = useState<string | null>(null);
  const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
  const { query: projectsQuery } = useProjects('state:all');

  const [period, setPeriod] = useState<DatesRangeValue<DateValue>>([
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
        value={projectId}
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
      <ActionIcon
        variant="subtle"
        mt="xs"
        onClick={() => query.refetch()}
        loading={query.isFetching}
        aria-label="Refresh"
      >
        <FontAwesomeIcon icon={faRefresh} />
      </ActionIcon>
      {query.isPending ? (
        <span>Loading...</span>
      ) : query.isError ? (
        <span>Error: {query.error.message}</span>
      ) : (
        <TimeEntryTable timeEntries={query.data} onEdit={setSelectedEntry} />
      )}
      <EditTimeEntryModal timeEntry={selectedEntry} onClose={() => setSelectedEntry(null)} />
    </div>
  );
};

