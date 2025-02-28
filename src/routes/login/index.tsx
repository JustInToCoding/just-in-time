import { Button, PasswordInput } from '@mantine/core';
import { isNotEmpty, useForm } from '@mantine/form';
import { useEffect, useTransition } from 'react';
import { useNavigate } from 'react-router';
import { useMoneybird } from '../../modules/moneybird';

export const Login = () => {
  const { isLoggedIn, setAPIToken, validateAPIToken } = useMoneybird();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: { APIToken: '' },
    validate: {
      APIToken: isNotEmpty('APIToken field can not be empty.'),
    },
  });

  useEffect(() => {
    if (isLoggedIn) {
      startTransition(async () => {
        await navigate('/');
      });
    }
  }, [isLoggedIn, navigate]);

  if (isPending) return <p>You&apos;re logged in. Navigating to home page...</p>;

  const onSubmit = async ({ APIToken }: { APIToken: string }) => {
    const result = await validateAPIToken(APIToken);
    if (result) {
      setAPIToken(APIToken);
    } else {
      form.setFieldError('APIToken', 'The filled in APIToken is not valid.');
    }
  };

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <PasswordInput
        {...form.getInputProps('APIToken')}
        key={form.key('APIToken')}
        label="Insert Moneybird API token"
        withAsterisk
        placeholder="Input placeholder"
      />
      <Button type="submit" mt="md">
        Submit
      </Button>
    </form>
  );
};
