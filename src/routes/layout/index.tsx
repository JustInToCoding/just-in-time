import {
  faHome,
  faRightFromBracket,
  faStopwatch,
  faTag,
  faUserClock,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ActionIcon, AppShell, Burger, NavLink } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { NavLink as Link, Outlet } from 'react-router';
import { useAuth } from '../../modules/moneybird';
import styles from './styles.module.scss';

export const Layout = () => {
  const [opened, { toggle }] = useDisclosure();
  const { logOut } = useAuth();

  return (
    <AppShell
      header={{ height: 40 }}
      navbar={{
        width: 300,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header>
        <div className={styles.burger}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
        </div>
        <div className={styles.spacer} />
        <div className={styles.logout}>
          <ActionIcon variant="filled" aria-label="Logout" onClick={logOut}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </ActionIcon>
        </div>
      </AppShell.Header>

      <AppShell.Navbar p="md">
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
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
};
