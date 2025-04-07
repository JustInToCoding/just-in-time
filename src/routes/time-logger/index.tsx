import { faCheck, faClock, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Box, Button, Card, Checkbox, Grid, Paper, Select, Stack, TextInput } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { useMemo, useState } from 'react';
import { DayInWeekPicker } from '../../components/day-in-week-picker';
import { TimeEntryTable } from '../../components/time-entry-table';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';
import { useContacts } from '../../modules/moneybird/query-hooks/use-contacts';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';
import { useTimeEntries } from '../../modules/moneybird/query-hooks/use-time-entries';

const filterByDate = (data: TimeEntry[], date: Date) => {
  return data.filter((entry) => {
    const entryDate = dayjs(entry.started_at).startOf('day');
    return entryDate.isSame(dayjs(date).startOf('day'));
  });
};

type FormReturnType = {
  started_at: string;
  ended_at: string;
  paused_duration?: string;
  project_id?: string;
  contact_id?: string;
  billable: boolean;
  description: string;
};

export const TimeLogger = () => {
  const { query: projectsQuery } = useProjects('state:all');
  const { query: contactsQuery } = useContacts();

  const [date, setDate] = useState<Date>(dayjs().toDate());
  const period = [dayjs(date).startOf('week').toDate(), dayjs(date).endOf('week').toDate()];
  const { query, createMutation } = useTimeEntries({
    filter: `state:all,period:${dayjs(period[0]).format('YYYYMMDD')}..${dayjs(period[1]).format('YYYYMMDD')}`,
  });

  const form = useForm<FormReturnType>({
    mode: 'uncontrolled',
    initialValues: {
      started_at: dayjs().subtract(1, 'hour').format('HH:mm'),
      ended_at: dayjs().format('HH:mm'),
      paused_duration: undefined,
      project_id: undefined,
      contact_id: undefined,
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

  const handleSubmit = async (values: FormReturnType) => {
    const startedAt = dayjs(values.started_at, 'HH:mm');
    const endedAt = dayjs(values.ended_at, 'HH:mm');
    let pausedDuration: number | undefined = undefined;

    if (values.paused_duration) {
      const [hours, minutes] = values.paused_duration.split(':').map(Number);
      pausedDuration = dayjs
        .duration({
          hours,
          minutes,
        })
        .asSeconds();
    }

    const timeEntry = {
      ...values,
      project_id: values.project_id || null,
      contact_id: values.contact_id || null,
      started_at: startedAt.toISOString(),
      ended_at: endedAt.toISOString(),
      paused_duration: pausedDuration || null,
    };

    console.log(timeEntry);

    try {
      await createMutation.mutateAsync(timeEntry);
      notifications.show({
        color: 'green',
        title: 'Success',
        message: 'Time entry created successfully',
        icon: <FontAwesomeIcon icon={faCheck} />,
      });
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error creating time entry',
        message: JSON.stringify(error),
        icon: <FontAwesomeIcon icon={faClose} />,
      });
      console.error('Error creating time entry:', error);
    }
  };

  const timeEntriesForDate = useMemo(() => {
    if (!query.data) return [];

    return filterByDate(query.data, date);
  }, [query.data, date]);

  const durationWorkedInWeekdays = useMemo(() => {
    const tmp = {
      0: dayjs.duration(0, 'minutes'),
      1: dayjs.duration(0, 'minutes'),
      2: dayjs.duration(0, 'minutes'),
      3: dayjs.duration(0, 'minutes'),
      4: dayjs.duration(0, 'minutes'),
      5: dayjs.duration(0, 'minutes'),
      6: dayjs.duration(0, 'minutes'),
    };
    if (!query.data) return tmp;

    return query.data.reduce((acc, entry) => {
      const entryDate = dayjs(entry.started_at).weekday();
      const durationWorked = dayjs.duration(
        dayjs(entry.ended_at)
          .subtract(entry.paused_duration || 0, 'seconds')
          .diff(entry.started_at, 'minutes'),
        'minutes',
      );
      acc[entryDate] = acc[entryDate].add(durationWorked);
      return acc;
    }, tmp);
  }, [query.data]);

  return (
    <Box>
      <DayInWeekPicker
        durationWorkedInWeekdays={durationWorkedInWeekdays}
        date={date}
        onChange={setDate}
      />
      <Card mt="lg">
        <form onSubmit={form.onSubmit(handleSubmit)}>
          <Grid columns={24}>
            <Grid.Col span={3}>
              <TimeInput
                label="Start time"
                key={form.key('started_at')}
                {...form.getInputProps('started_at')}
                leftSection={<FontAwesomeIcon icon={faClock} />}
              />
            </Grid.Col>
            <Grid.Col span={3}>
              <TimeInput
                label="End time"
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
              <TextInput
                label="Description"
                placeholder="Description"
                key={form.key('description')}
                {...form.getInputProps('description')}
              />
            </Grid.Col>
          </Grid>
          <Grid mt="xs">
            <Grid.Col span="auto">
              <Select
                label="Select project"
                placeholder="Select project"
                name="Select project"
                data={projectsQuery.data?.map((project) => ({
                  value: project.id,
                  label: project.name,
                }))}
                key={form.key('project_id')}
                {...form.getInputProps('project_id')}
              />
            </Grid.Col>
            <Grid.Col span="auto">
              <Select
                label="Select contact"
                placeholder="Select contact"
                name="Select contact"
                data={contactsQuery.data?.map((contact) => ({
                  value: contact.id,
                  label: contact.company_name || contact.firstname + ' ' + contact.lastname,
                }))}
                key={form.key('contact_id')}
                {...form.getInputProps('contact_id')}
              />
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
                <Button type="submit">Submit</Button>
              </Stack>
            </Grid.Col>
          </Grid>
        </form>
      </Card>

      <Paper shadow="sm" p="xl" withBorder mt="md">
        {query.isPending ? (
          <span>Loading...</span>
        ) : query.isError ? (
          <span>Error: {query.error.message}</span>
        ) : (
          <TimeEntryTable timeEntries={timeEntriesForDate} />
        )}
      </Paper>
    </Box>
  );
};
