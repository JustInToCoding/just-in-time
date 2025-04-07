import { faGithub } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRightArrowLeft,
  faRightFromBracket,
  faStopwatch,
  faTag,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  AppShell,
  Burger,
  Code,
  Divider,
  Group,
  NavLink,
  ScrollArea,
  Select,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useContext } from 'react';
import { NavLink as Link, Outlet } from 'react-router';
import { APISettingsContext, useAuth } from '../../modules/moneybird';
import { useUsers } from '../../modules/moneybird/query-hooks/use-users';

export const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { logOut } = useAuth();
  const { query } = useUsers();
  const { user, setUser } = useContext(APISettingsContext);

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
        <Group h="100%" px="md" justify="space-between">
          <Group>
            <Burger opened={opened} onClick={toggle} size="sm" />
            <Text>Just In Time</Text>
            <Code fw={700}>v{__APP_VERSION__}</Code>
          </Group>
          <Select
            placeholder="Select user"
            name="Select user"
            data={query.data?.map((user) => ({
              value: user.id,
              label: user.name,
            }))}
            value={user}
            onChange={setUser}
          />
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section grow my="md" component={ScrollArea}>
          {/* <NavLink
            label="Home"
            leftSection={<FontAwesomeIcon icon={faHome} />}
            component={Link}
            to="/"
          /> */}
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
            label="GitHub repository"
            leftSection={<FontAwesomeIcon icon={faGithub} />}
            href="https://github.com/JustInToCoding/just-in-time"
            target="_blank"
          />
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
