# Edit Time Entry + Refresh Button Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add an edit modal for existing time entries and a manual refresh button, available on both the Time Logger and Time Entries pages.

**Architecture:** A dedicated `EditTimeEntryModal` component pre-fills a form from a `TimeEntry` object and calls a new `updateMutation` on submit. The `TimeEntryTable` gets an optional `onEdit` prop that, when provided, shows an edit icon per row. Both pages manage a `selectedEntry` state to control the modal.

**Tech Stack:** React 19, TypeScript 5, Mantine 7 (Modal, Select, TimeInput, Checkbox, Button, ActionIcon), FontAwesome icons, Day.js, TanStack React Query 5.

---

## File Map

| Action | File |
|---|---|
| Modify | `src/modules/moneybird/adapters/time-entry.ts` |
| Modify | `src/modules/moneybird/query-hooks/use-time-entries.ts` |
| Modify | `src/components/time-entry-table/index.tsx` |
| Create | `src/components/edit-time-entry-modal/index.tsx` |
| Modify | `src/routes/time-entries/index.tsx` |
| Modify | `src/routes/time-logger/index.tsx` |

---

### Task 1: Add `patchTimeEntry` adapter

**Files:**
- Modify: `src/modules/moneybird/adapters/time-entry.ts`

- [ ] **Step 1: Add `patchTimeEntry` to the adapter**

Open `src/modules/moneybird/adapters/time-entry.ts` and append after the `postTimeEntry` export:

```ts
export const patchTimeEntry = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  id: string,
  timeEntry: Partial<
    Omit<
      TimeEntry,
      | 'user'
      | 'project'
      | 'events'
      | 'notes'
      | 'created_at'
      | 'updated_at'
      | 'id'
      | 'administration_id'
      | 'contact'
      | 'detail'
    >
  >,
): Promise<TimeEntry> => {
  return fetcher(`time_entries/${id}`, true, {
    method: 'PATCH',
    body: JSON.stringify({ time_entry: timeEntry }),
  }).then((response) => response.json());
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/moneybird/adapters/time-entry.ts
git commit -m "feat: add patchTimeEntry adapter"
```

---

### Task 2: Add `updateMutation` to `useTimeEntries`

**Files:**
- Modify: `src/modules/moneybird/query-hooks/use-time-entries.ts`

- [ ] **Step 1: Import `patchTimeEntry` and add `updateMutation`**

Replace the entire file content:

```ts
import { useMutation, useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import { getTimeEntries, patchTimeEntry, postTimeEntry } from '../adapters/time-entry';
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
      await query2.refetch();
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      timeEntry,
    }: {
      id: string;
      timeEntry: Partial<
        Omit<
          TimeEntry,
          | 'user'
          | 'project'
          | 'events'
          | 'notes'
          | 'created_at'
          | 'updated_at'
          | 'id'
          | 'administration_id'
          | 'contact'
          | 'detail'
        >
      >;
    }) => patchTimeEntry(fetcher, id, timeEntry),
    onSuccess: async () => {
      await query2.refetch();
    },
  });

  return {
    query: query2,
    createMutation,
    updateMutation,
  };
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/modules/moneybird/query-hooks/use-time-entries.ts
git commit -m "feat: add updateMutation to useTimeEntries"
```

---

### Task 3: Add `onEdit` prop to `TimeEntryTable`

**Files:**
- Modify: `src/components/time-entry-table/index.tsx`

- [ ] **Step 1: Add edit column to the table**

Replace the entire file content:

```tsx
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Badge, Pagination, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';

const getDuration = (startedAt: string, endedAt: string, pausedDuration: number = 0) => {
  const duration = dayjs(endedAt).subtract(pausedDuration, 'seconds').diff(startedAt, 'minutes');

  return dayjs.duration(duration, 'minutes').format('HH:mm');
};

const chunk = <T,>(array: T[], size: number): T[][] => {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
};

export const TimeEntryTable: FC<{
  timeEntries: TimeEntry[];
  perPage?: number;
  hideProject?: boolean;
  hideContact?: boolean;
  hideDate?: boolean;
  onEdit?: (entry: TimeEntry) => void;
}> = ({
  timeEntries = [],
  perPage = 15,
  hideProject = false,
  hideContact = false,
  hideDate = false,
  onEdit,
}) => {
  const [activePage, setPage] = useState(1);
  const data = useMemo(() => chunk(timeEntries, perPage), [timeEntries, perPage]);

  if (!timeEntries.length) {
    return <span>No time entries found</span>;
  }

  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            {!hideProject && <Table.Th>Project</Table.Th>}
            {!hideContact && <Table.Th>Contact</Table.Th>}
            <Table.Th>Description</Table.Th>
            {!hideDate && <Table.Th>Date</Table.Th>}
            <Table.Th>Period</Table.Th>
            <Table.Th>Paused</Table.Th>
            <Table.Th>Worked</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Status</Table.Th>
            {onEdit && <Table.Th />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data[activePage - 1].map((timeEntry) => (
            <Table.Tr key={timeEntry.id}>
              {!hideProject && <Table.Td>{timeEntry.project?.name}</Table.Td>}
              {!hideContact && <Table.Td>{timeEntry.contact?.company_name}</Table.Td>}
              <Table.Td>{timeEntry.description}</Table.Td>
              {!hideDate && <Table.Td>{dayjs(timeEntry.started_at).format('DD-MM-YYYY')}</Table.Td>}
              <Table.Td>
                {dayjs(timeEntry.started_at).format('HH:mm')} -{' '}
                {dayjs(timeEntry.ended_at).format('HH:mm')}
              </Table.Td>
              <Table.Td>
                {dayjs.duration(timeEntry.paused_duration || 0, 'seconds').format('HH:mm')}
              </Table.Td>
              <Table.Td>
                {getDuration(
                  timeEntry.started_at,
                  timeEntry.ended_at,
                  timeEntry.paused_duration || 0,
                )}
              </Table.Td>
              <Table.Td>{timeEntry.user?.name}</Table.Td>
              <Table.Td>
                {timeEntry.events.findIndex(
                  (event) => event.action === 'time_entry_sales_invoice_created',
                ) !== -1 ? (
                  <Badge color="lime">Billed</Badge>
                ) : (
                  timeEntry.billable && <Badge color="orange">Billable</Badge>
                )}
              </Table.Td>
              {onEdit && (
                <Table.Td>
                  <ActionIcon variant="subtle" onClick={() => onEdit(timeEntry)}>
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </ActionIcon>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {data.length > 1 && <Pagination total={data.length} value={activePage} onChange={setPage} />}
    </div>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/time-entry-table/index.tsx
git commit -m "feat: add optional onEdit prop to TimeEntryTable"
```

---

### Task 4: Create `EditTimeEntryModal` component

**Files:**
- Create: `src/components/edit-time-entry-modal/index.tsx`

- [ ] **Step 1: Create the modal component**

Create the file `src/components/edit-time-entry-modal/index.tsx`:

```tsx
import { faCheck, faClock, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, Grid, Modal, Select, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { FC, useEffect } from 'react';
import { ActivityCombobox } from '../../modules/just-in-time/components/activity-combobox';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';
import { useContacts } from '../../modules/moneybird/query-hooks/use-contacts';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';
import { useTimeEntries } from '../../modules/moneybird/query-hooks/use-time-entries';

type FormValues = {
  started_at: string;
  ended_at: string;
  paused_duration: string;
  project_id: string | null;
  contact_id: string | null;
  billable: boolean;
  description: string;
};

const secondsToHHMM = (seconds: number | null): string => {
  if (!seconds) return '00:00';
  return dayjs.duration(seconds, 'seconds').format('HH:mm');
};

export const EditTimeEntryModal: FC<{
  timeEntry: TimeEntry | null;
  onClose: () => void;
}> = ({ timeEntry, onClose }) => {
  const { query: projectsQuery } = useProjects('state:all');
  const { query: contactsQuery } = useContacts();
  const { updateMutation } = useTimeEntries({ enabled: false });

  const form = useForm<FormValues>({
    mode: 'controlled',
    initialValues: {
      started_at: '',
      ended_at: '',
      paused_duration: '00:00',
      project_id: null,
      contact_id: null,
      billable: true,
      description: '',
    },
    validate: {
      started_at: isNotEmpty('Start time must be filled in'),
      ended_at: isNotEmpty('End time must be filled in'),
      project_id: isNotEmpty('Project must be filled in'),
      description: isNotEmpty('Description must be filled in'),
    },
  });

  useEffect(() => {
    if (timeEntry) {
      form.setValues({
        started_at: dayjs(timeEntry.started_at).format('HH:mm'),
        ended_at: dayjs(timeEntry.ended_at).format('HH:mm'),
        paused_duration: secondsToHHMM(timeEntry.paused_duration),
        project_id: timeEntry.project_id,
        contact_id: timeEntry.contact_id,
        billable: timeEntry.billable,
        description: timeEntry.description,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeEntry]);

  const handleSubmit = async (values: FormValues) => {
    if (!timeEntry) return;

    const date = timeEntry.started_at;
    const tmp1 = dayjs(values.started_at, 'HH:mm');
    const startedAt = dayjs(date).set('hour', tmp1.hour()).set('minute', tmp1.minute());
    const tmp2 = dayjs(values.ended_at, 'HH:mm');
    const endedAt = dayjs(date).set('hour', tmp2.hour()).set('minute', tmp2.minute());

    let pausedDuration: number | null = null;
    if (values.paused_duration && values.paused_duration !== '00:00') {
      const [hours, minutes] = values.paused_duration.split(':').map(Number);
      pausedDuration = dayjs.duration({ hours, minutes }).asSeconds();
    }

    try {
      await updateMutation.mutateAsync({
        id: timeEntry.id,
        timeEntry: {
          started_at: startedAt.toISOString(),
          ended_at: endedAt.toISOString(),
          paused_duration: pausedDuration,
          project_id: values.project_id,
          contact_id: values.contact_id,
          billable: values.billable,
          description: values.description,
        },
      });
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Time entry updated successfully',
        icon: <FontAwesomeIcon icon={faCheck} />,
      });
      onClose();
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error updating time entry',
        message: JSON.stringify(error),
        icon: <FontAwesomeIcon icon={faClose} />,
      });
    }
  };

  return (
    <Modal opened={!!timeEntry} onClose={onClose} title="Edit time entry" size="xl">
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid columns={24}>
          <Grid.Col span="auto">
            <Select
              label="Select project"
              placeholder="Select project"
              data={projectsQuery.data?.map((project) => ({
                value: project.id,
                label: project.name,
              }))}
              required
              key={form.key('project_id')}
              {...form.getInputProps('project_id')}
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Select
              label="Select contact"
              placeholder="Select contact"
              data={contactsQuery.data?.map((contact) => ({
                value: contact.id,
                label: contact.company_name || contact.firstname + ' ' + contact.lastname,
              }))}
              key={form.key('contact_id')}
              {...form.getInputProps('contact_id')}
              clearable
            />
          </Grid.Col>
        </Grid>
        <Grid mt="xs" columns={24}>
          <Grid.Col span={3}>
            <TimeInput
              label="Start time"
              required
              key={form.key('started_at')}
              {...form.getInputProps('started_at')}
              leftSection={<FontAwesomeIcon icon={faClock} />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TimeInput
              label="End time"
              required
              key={form.key('ended_at')}
              {...form.getInputProps('ended_at')}
              leftSection={<FontAwesomeIcon icon={faClock} />}
            />
          </Grid.Col>
          <Grid.Col span={3}>
            <TimeInput
              label="Paused"
              key={form.key('paused_duration')}
              {...form.getInputProps('paused_duration')}
              leftSection={<FontAwesomeIcon icon={faClock} />}
            />
          </Grid.Col>
          <Grid.Col span="auto">
            <Stack justify="flex-end" w="100%" h="100%">
              <ActivityCombobox
                required
                label="Description"
                projectId={form.getInputProps('project_id').value}
                key={form.key('description')}
                {...form.getInputProps('description')}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span="content">
            <Stack justify="flex-end" align="center" h="100%">
              <Checkbox
                label="Billable"
                key={form.key('billable')}
                {...form.getInputProps('billable', { type: 'checkbox' })}
              />
            </Stack>
          </Grid.Col>
          <Grid.Col span="content">
            <Stack justify="flex-end" align="center" h="100%">
              <Button type="submit" loading={updateMutation.isPending}>
                Save
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>
    </Modal>
  );
};
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/edit-time-entry-modal/index.tsx
git commit -m "feat: add EditTimeEntryModal component"
```

---

### Task 5: Wire up edit modal and refresh button in Time Entries page

**Files:**
- Modify: `src/routes/time-entries/index.tsx`

- [ ] **Step 1: Update the Time Entries page**

Replace the entire file content:

```tsx
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, Select } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
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
```

- [ ] **Step 2: Verify TypeScript compiles**

```bash
npm run build 2>&1 | tail -20
```

Expected: no new errors.

- [ ] **Step 3: Commit**

```bash
git add src/routes/time-entries/index.tsx
git commit -m "feat: wire up edit modal and refresh button in TimeEntries"
```

---

### Task 6: Wire up edit modal and refresh button in Time Logger page

**Files:**
- Modify: `src/routes/time-logger/index.tsx`

- [ ] **Step 1: Add missing imports**

In `src/routes/time-logger/index.tsx`:

Change the FontAwesome icons import from:
```tsx
import { faCheck, faClock, faClose } from '@fortawesome/free-solid-svg-icons';
```
to:
```tsx
import { faCheck, faClock, faClose, faRefresh } from '@fortawesome/free-solid-svg-icons';
```

Change the Mantine import from:
```tsx
import { Box, Button, Card, Checkbox, Grid, Paper, Select, Stack } from '@mantine/core';
```
to:
```tsx
import { ActionIcon, Box, Button, Card, Checkbox, Grid, Paper, Select, Stack } from '@mantine/core';
```

Add these two new imports after the existing import block:
```tsx
import { EditTimeEntryModal } from '../../components/edit-time-entry-modal';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';
```

- [ ] **Step 2: Add `selectedEntry` state inside `TimeLogger`**

After the existing `useState` declarations (after `const [date, setDate] = ...`), add:

```tsx
const [selectedEntry, setSelectedEntry] = useState<TimeEntry | null>(null);
```

- [ ] **Step 3: Add refresh button and wire up `onEdit` and modal**

In the JSX, make three targeted changes:

1. Add a refresh `ActionIcon` just before the closing `</Card>` tag (after the submit button `Grid.Col`), inside a new `Grid.Col`:

```tsx
<Grid.Col span="content">
  <Stack justify="flex-end" align="center" h="100%">
    <ActionIcon
      variant="subtle"
      onClick={() => query.refetch()}
      loading={query.isFetching}
      aria-label="Refresh"
    >
      <FontAwesomeIcon icon={faRefresh} />
    </ActionIcon>
  </Stack>
</Grid.Col>
```

2. Change the `TimeEntryTable` line inside the `<Paper>` to pass `onEdit`:

```tsx
<TimeEntryTable timeEntries={timeEntriesForDate} hideDate onEdit={setSelectedEntry} />
```

3. Add the modal just before the closing `</Box>`:

```tsx
<EditTimeEntryModal timeEntry={selectedEntry} onClose={() => setSelectedEntry(null)} />
```

- [ ] **Step 4: Verify TypeScript compiles and lints clean**

```bash
npm run build 2>&1 | tail -20
npm run lint 2>&1 | tail -20
```

Expected: no errors.

- [ ] **Step 5: Commit**

```bash
git add src/routes/time-logger/index.tsx
git commit -m "feat: wire up edit modal and refresh button in TimeLogger"
```
