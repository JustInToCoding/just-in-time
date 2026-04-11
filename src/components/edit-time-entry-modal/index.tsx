import { faCheck, faClock, faClose, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Checkbox, Grid, Group, Modal, Select, Stack } from '@mantine/core';
import { TimeInput } from '@mantine/dates';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import dayjs from 'dayjs';
import { FC, useEffect, useState } from 'react';
import { ActivityCombobox } from '../../modules/just-in-time/components/activity-combobox';
import { useActivities } from '../../modules/just-in-time/query-hooks/use-activities';
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
  const { updateMutation, deleteMutation } = useTimeEntries({ enabled: false });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const { query: activitiesQuery, mutation: activitiesMutation } = useActivities({
    projectId: timeEntry?.project_id || undefined,
  });

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
    if (
      timeEntry?.description &&
      timeEntry.project_id &&
      activitiesQuery.data &&
      !activitiesQuery.data.includes(timeEntry.description)
    ) {
      activitiesMutation.mutate([...activitiesQuery.data, timeEntry.description]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeEntry, activitiesQuery.data]);

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

  const handleDelete = async () => {
    if (!timeEntry) return;
    try {
      await deleteMutation.mutateAsync(timeEntry.id);
      notifications.show({
        color: 'green',
        title: 'Deleted',
        message: 'Time entry deleted successfully',
        icon: <FontAwesomeIcon icon={faCheck} />,
      });
      setConfirmDelete(false);
      onClose();
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Error deleting time entry',
        message: JSON.stringify(error),
        icon: <FontAwesomeIcon icon={faClose} />,
      });
    }
  };

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
    <Modal opened={!!timeEntry} onClose={onClose} title="Edit time entry" size="90%">
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
                resetOnProjectChange={false}
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
        <Group justify="flex-end" mt="md">
          {confirmDelete ? (
            <Group gap="xs">
              <Button
                variant="subtle"
                color="gray"
                onClick={() => setConfirmDelete(false)}
                disabled={deleteMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                color="red"
                loading={deleteMutation.isPending}
                onClick={handleDelete}
                leftSection={<FontAwesomeIcon icon={faTrash} />}
              >
                Confirm delete
              </Button>
            </Group>
          ) : (
            <Button
              variant="subtle"
              color="red"
              onClick={() => setConfirmDelete(true)}
              leftSection={<FontAwesomeIcon icon={faTrash} />}
            >
              Delete
            </Button>
          )}
        </Group>
      </form>
    </Modal>
  );
};
