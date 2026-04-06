import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Center,
  Container,
  ContainerProps,
  Grid,
  Group,
  Popover,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import { WeekPicker } from '../week-picker';
import styles from './styles.module.scss';

const formatAsHoursAndMinutes = (duration: plugin.Duration) => {
  const totalMinutes = duration.asMinutes();
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

export const DayInWeekPicker: FC<
  {
    durationWorkedInWeekdays: {
      0: plugin.Duration;
      1: plugin.Duration;
      2: plugin.Duration;
      3: plugin.Duration;
      4: plugin.Duration;
      5: plugin.Duration;
      6: plugin.Duration;
    };
    durationWorkedInWeek: Record<string, plugin.Duration>;
    date: string;
    onChange: (date: string) => void;
  } & Omit<ContainerProps, 'onChange'>
> = ({ durationWorkedInWeekdays, durationWorkedInWeek, date, onChange = () => {}, ...rest }) => {
  const startOfWeek = useMemo(() => dayjs(date).startOf('week'), [date]);
  const weekTotal = useMemo(() => {
    const totalMinutes = Object.values(durationWorkedInWeekdays).reduce(
      (acc, value) => acc + value.asMinutes(),
      0,
    );
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;
    return `${totalHours.toString().padStart(2, '0')}:${remainingMinutes.toString().padStart(2, '0')}`;
  }, [durationWorkedInWeekdays]);

  return (
    <Container pl={8} pr={8} fluid {...rest}>
      <Grid columns={24} gap="md">
        <Grid.Col span="auto">
          <Title order={2}>{dayjs(date).format('D MMMM YYYY')}</Title>
        </Grid.Col>
        <Grid.Col span={2}>
          <WeekPicker
            value={date}
            onChange={onChange}
            p={0}
            h="100%"
            w="100%"
            variant="transparent"
            className={styles.action}
          />
        </Grid.Col>
        <Grid.Col span={2}>
          <Center
            w="100%"
            h="100%"
            p={8}
            onClick={() => onChange(dayjs().toISOString())}
            className={styles.action}
          >
            Today
          </Center>
        </Grid.Col>
      </Grid>
      <Grid columns={24} mt="lg">
        <Grid.Col span={1} p={0} className={styles.prevweek}>
          <Center h="100%" onClick={() => onChange(dayjs(date).subtract(1, 'week').toISOString())}>
            <FontAwesomeIcon icon={faAngleDoubleLeft} />
          </Center>
        </Grid.Col>
        {Array.from({ length: 7 }).map((_, index) => {
          const day = startOfWeek.add(index, 'day');
          return (
            <Grid.Col
              span="auto"
              key={index}
              p={0}
              className={`${styles.day} ${dayjs(date).isSame(day, 'date') ? styles.selected : styles.unselected}`}
            >
              <Stack
                h="100%"
                align="stretch"
                justify="space-around"
                gap={0}
                onClick={() => onChange(day.toISOString())}
                pt={1}
                pb={1}
              >
                <Center>
                  <Text>{day.format('dd D')}</Text>
                </Center>
                <Center>
                  <Text>{durationWorkedInWeekdays[index].format('HH:mm')}</Text>
                </Center>
              </Stack>
            </Grid.Col>
          );
        })}
        <Grid.Col span={1} p={0} className={styles.nextweek}>
          <Center h="100%" onClick={() => onChange(dayjs(date).add(1, 'week').toISOString())}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Center>
        </Grid.Col>
        <Grid.Col span={2} offset={1} p={0}>
          <Popover position="bottom" shadow="md">
            <Popover.Target>
              <Center h="100%" p={8} className={styles.action}>
                <Stack h="100%" align="stretch" justify="space-around" gap={0} pt={1} pb={1}>
                  <Center>
                    <Text>Week {dayjs(date).week()}</Text>
                  </Center>
                  <Center>
                    <Text>{weekTotal}</Text>
                  </Center>
                </Stack>
              </Center>
            </Popover.Target>
            <Popover.Dropdown>
              {Object.entries(durationWorkedInWeek).map(([projectName, duration]) => (
                <Group key={projectName} justify="space-between" mb={4}>
                  <Text>{projectName}</Text>
                  <Text>{formatAsHoursAndMinutes(duration)}</Text>
                </Group>
              ))}
            </Popover.Dropdown>
          </Popover>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
