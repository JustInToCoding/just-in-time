import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Anchor, Box, Button, Center, Group, Paper, Select, Title } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../modules/moneybird';
import { useAdministrations } from '../../modules/moneybird/query-hooks/use-administrations';
import styles from './styles.module.scss';

export const Administration = () => {
  const { logOut, setAdministration } = useAuth();
  const navigate = useNavigate();
  const [, startTransition] = useTransition();
  const { query } = useAdministrations();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { administration: '' },
    validate: {
      administration: isNotEmpty('Administration can not be empty.'),
    },
  });

  const onSubmit = ({ administration }: { administration: string }) => {
    setAdministration(administration);
    startTransition(async () => {
      await navigate('/');
    });
  };

  const goBackToLogin = () => {
    logOut();

    startTransition(async () => {
      await navigate('/setup/login');
    });
  };

  if (query.isPending) {
    return <span>Loading...</span>;
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>;
  }

  return (
    query.data && (
      <>
        <Title ta="center" className={styles.title}>
          Select administration
        </Title>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={form.onSubmit(onSubmit)}>
            <Select
              {...form.getInputProps('administration')}
              label="Administration"
              placeholder="Pick administration"
              data={query.data.map((administration) => ({
                value: administration.id,
                label: administration.name,
              }))}
              withAsterisk
              required
              maxDropdownHeight={200}
            />
            <Group justify="space-between" mt="lg" className={styles.controls}>
              <Anchor
                component="button"
                onClick={goBackToLogin}
                c="dimmed"
                size="sm"
                className={styles.control}
              >
                <Center inline>
                  <FontAwesomeIcon icon={faArrowLeft} />
                  <Box ml={5}>Back to the login page</Box>
                </Center>
              </Anchor>
              <Button type="submit" className={styles.control}>
                Choose administration
              </Button>
            </Group>
          </form>
        </Paper>
      </>
    )
  );
};
