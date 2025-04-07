import { faAngleDoubleLeft, faAngleDoubleRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Center, Container, ContainerProps, Grid, Stack, Text, Title } from '@mantine/core';
import dayjs from 'dayjs';
import { FC, useMemo } from 'react';
import styles from './styles.module.scss';

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
    date: Date;
    onChange: (date: Date) => void;
  } & Omit<ContainerProps, 'onChange'>
> = ({ durationWorkedInWeekdays, date, onChange = () => {}, ...rest }) => {
  const startOfWeek = useMemo(() => dayjs(date).startOf('week'), [date]);
  const weekTotal = useMemo(
    () =>
      Object.values(durationWorkedInWeekdays)
        .reduce((acc, value) => acc.add(value), dayjs.duration(0, 'minutes'))
        .format('HH:mm'),
    [durationWorkedInWeekdays],
  );

  return (
    <Container pl={8} pr={8} fluid {...rest}>
      <Grid columns={24}>
        <Grid.Col span="auto">
          <Title order={2}>{dayjs(date).format('D MMMM YYYY')}</Title>
        </Grid.Col>
        <Grid.Col span="content" className={styles.today}>
          <Center h="100%" onClick={() => onChange(dayjs().toDate())}>
            Today
          </Center>
        </Grid.Col>
      </Grid>
      <Grid columns={24} mt="lg">
        <Grid.Col span={1} p={0} className={styles.prevweek}>
          <Center h="100%" onClick={() => onChange(dayjs(date).subtract(1, 'week').toDate())}>
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
                onClick={() => onChange(day.toDate())}
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
          <Center h="100%" onClick={() => onChange(dayjs(date).add(1, 'week').toDate())}>
            <FontAwesomeIcon icon={faAngleDoubleRight} />
          </Center>
        </Grid.Col>
        <Grid.Col span={2} offset={1} className={styles.weektotal}>
          <Stack h="100%" align="stretch" justify="space-around" gap={0} pt={1} pb={1}>
            <Center>
              <Text>Weektotal</Text>
            </Center>
            <Center>
              <Text>{weekTotal}</Text>
            </Center>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
};
