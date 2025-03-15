import {
  faArrowRightArrowLeft,
  faHome,
  faRightFromBracket,
  faStopwatch,
  faTag,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { AppShell, Burger, Code, Divider, Group, NavLink, ScrollArea, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink as Link, Outlet } from 'react-router';
import { useAuth } from '../../modules/moneybird';

export const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { logOut } = useAuth();

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Text>Just In Time</Text>
            <Code fw={700}>v{__APP_VERSION__}</Code>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md" component={ScrollArea}>
          <NavLink
            label="Home"
            leftSection={<FontAwesomeIcon icon={faHome} />}
            component={Link}
            to="/"
          />
          <NavLink
            label="Time Logger"
            leftSection={<FontAwesomeIcon icon={faStopwatch} />}
            component={Link}
            to="/time-logger"
          />
          <NavLink
            label="Time Entries"
            leftSection={<FontAwesomeIcon icon={faUserClock} />}
            component={Link}
            to="/time-entries"
          />
          <NavLink
            label="Projects"
            leftSection={<FontAwesomeIcon icon={faTag} />}
            component={Link}
            to="/projects"
          />
        </AppShell.Section>
        <AppShell.Section>
          <Divider my="md" />
          <NavLink
            label="Change administration"
            leftSection={<FontAwesomeIcon icon={faArrowRightArrowLeft} />}
            component={Link}
            to="/setup/administration"
          />
          <NavLink
            label="Logout"
            leftSection={<FontAwesomeIcon icon={faRightFromBracket} />}
            onClick={logOut}
          />
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
