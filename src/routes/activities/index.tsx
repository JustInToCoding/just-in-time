import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Grid, Select, Stack, Text, TextInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { notifications } from '@mantine/notifications';
import { useCallback, useState } from 'react';
import { ActivityTable } from '../../modules/components/activity-table';
import { useActivities } from '../../modules/just-in-time/query-hooks/use-activities';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';

export const Activities = () => {
  const { query: projectsQuery } = useProjects('state:all');
  const [projectId, setProjectId] = useState<string | null>(null);
  const { query, mutation } = useActivities({
    projectId: projectId || undefined,
    enabled: !!projectsQuery.data,
  });

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: {
      activity: '',
    },

    validate: {
      activity: (value) => isNotEmpty('Email must be filled in')(value),
    },
  });

  const handleSubmit = useCallback(
    async ({ activity }: { activity: string }) => {
      try {
        if (!query.data) {
          throw new Error('Something went wrong, please try again later');
        }
        await mutation.mutateAsync([...query.data, activity]);
        notifications.show({
          color: 'green',
          title: 'Success',
          message: 'Activity created successfully',
          icon: <FontAwesomeIcon icon={faCheck} />,
        });
      } catch (error) {
        notifications.show({
          color: 'red',
          title: 'Error creating activity',
          message: JSON.stringify(error),
          icon: <FontAwesomeIcon icon={faClose} />,
        });
        console.error('Error creating activity:', error);
      }
      form.reset();
    },
    [mutation, form, query.data],
  );

  const handleDelete = useCallback(
    async (activity: string) => {
      try {
        if (!query.data) {
          throw new Error('Something went wrong, please try again later');
        }
        await mutation.mutateAsync(query.data.filter((a) => a !== activity));
        notifications.show({
          color: 'green',
          title: 'Success',
          message: 'Activity deleted successfully',
          icon: <FontAwesomeIcon icon={faCheck} />,
        });
      } catch (error) {
        notifications.show({
          color: 'red',
          title: 'Error deleting activity',
          message: JSON.stringify(error),
          icon: <FontAwesomeIcon icon={faClose} />,
        });
        console.error('Error deleting activity:', error);
      }
    },
    [mutation, query.data],
  );

  return (
    <Stack gap="md">
      <Select
        label="Select project"
        placeholder="Select project"
        name="Select project"
        data={projectsQuery.data?.map((project) => ({
          value: project.id,
          label: project.name,
        }))}
        value={projectId}
        onChange={setProjectId}
        required
        mt="xs"
      />

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Grid mt="md">
          <Grid.Col span={11}>
            <TextInput
              withAsterisk
              label="Activity"
              placeholder="Activity"
              key={form.key('activity')}
              {...form.getInputProps('activity')}
            />
          </Grid.Col>
          <Grid.Col span={1}>
            <Stack justify="flex-end" align="flex-end" h="100%">
              <Button disabled={!projectId || !query.isSuccess} type="submit">
                Add
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      </form>

      {query.isError && <Text>{query.error.message}</Text>}
      {query.isLoading && <Text>Loading...</Text>}
      {query.data?.length ? (
        <ActivityTable activities={query.data} onDelete={handleDelete} />
      ) : (
        <Text>There are no activities found.</Text>
      )}
    </Stack>
  );
};
