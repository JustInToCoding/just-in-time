import { Container } from '@mantine/core';
import { Outlet } from 'react-router';

export const Setup = () => {
  return (
    <Container size={460} my={30}>
      <Outlet />
    </Container>
  );
};
