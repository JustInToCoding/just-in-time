import { Anchor, Button, Paper, PasswordInput, Text, Title } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useTransition } from 'react';
import { useNavigate } from 'react-router';
import { useAuth } from '../../modules/moneybird';
import styles from './styles.module.scss';

export const Login = () => {
  const { setAPIToken, validateAPIToken } = useAuth();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { APIToken: '' },
    validate: {
      APIToken: isNotEmpty('APIToken field can not be empty.'),
    },
  });

  const onSubmit = async ({ APIToken }: { APIToken: string }) => {
    const result = await validateAPIToken(APIToken);
    if (result) {
      setAPIToken(APIToken);
      startTransition(async () => {
        await navigate('/setup/administration');
      });
    } else {
      form.setFieldError('APIToken', 'The filled in APIToken is not valid.');
    }
  };

  if (isPending) return <p>You&apos;re succesfully logged in...</p>;

  return (
    <>
      <Title ta="center" className={styles.title}>
        Welcome back!
      </Title>
      <Text c="dimmed" size="sm" ta="center" mt={5}>
        Log in with your Moneybird API token.
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={form.onSubmit(onSubmit)}>
          <PasswordInput
            {...form.getInputProps('APIToken')}
            key={form.key('APIToken')}
            label="Insert Moneybird API token"
            withAsterisk
            required
            placeholder="Moneybird API token"
            mt="md"
          />
          <Button type="submit" fullWidth mt="xl">
            Sign in
          </Button>
          <Text c="dimmed" size="sm" ta="center" mt="lg">
            Do not have an Moneybird API token yet?{' '}
            <Anchor href="https://moneybird.com/user/applications/new" target="_blank" size="sm">
              Create API token for personal use
            </Anchor>
          </Text>
        </form>
      </Paper>
    </>
  );
};
