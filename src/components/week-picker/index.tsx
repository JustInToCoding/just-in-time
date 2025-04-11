import { faCalendarWeek } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  ButtonProps,
  Center,
  Indicator,
  PolymorphicComponentProps,
  Popover,
  Text,
} from '@mantine/core';
import { Calendar } from '@mantine/dates';
import dayjs from 'dayjs';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTimeEntries } from '../../modules/moneybird/query-hooks/use-time-entries';

const startOfWeek = (date: Date) => {
  return dayjs(date).startOf('week').subtract(1, 'day').toDate();
};

const endOfWeek = (date: Date) => {
  return dayjs(date).endOf('week').toDate();
};

const isInWeekRange = (date: Date, value: Date | null) => {
  return value
    ? dayjs(date).isBefore(endOfWeek(value)) && dayjs(date).isAfter(startOfWeek(value))
    : false;
};

const getDuration = (startedAt: string, endedAt: string, pausedDuration: number = 0) => {
  const duration = dayjs(endedAt).subtract(pausedDuration, 'seconds').diff(startedAt, 'minutes');

  return dayjs.duration(duration, 'minutes');
};

export const WeekPicker: FC<
  { value: Date; onChange: (value: Date) => void } & Omit<
    PolymorphicComponentProps<'button', ButtonProps>,
    'value' | 'onChange'
  >
> = ({ value, onChange, ...buttonProps }) => {
  const [hovered, setHovered] = useState<Date | null>(null);
  const [opened, setOpened] = useState(false);
  const [dateForPeriod, setDateForPeriod] = useState<Date>(value);
  const period = useMemo(
    () =>
      `${dayjs(dateForPeriod).startOf('month').subtract(6, 'days').format('YYYYMMDD')}..${dayjs(dateForPeriod).endOf('month').add(6, 'days').format('YYYYMMDD')}`,
    [dateForPeriod],
  );
  const { query } = useTimeEntries({
    filter: `state:all,period:${period}`,
  });

  useEffect(() => {
    setDateForPeriod(value);
  }, [value]);

  const getTimeEntryDurationForDate = useCallback(
    (date: Date) => {
      return query.data
        ?.filter((entry) =>
          dayjs(entry.started_at).startOf('day').isSame(dayjs(date).startOf('day')),
        )
        .reduce(
          (acc, entry) =>
            acc.add(getDuration(entry.started_at, entry.ended_at, entry.paused_duration || 0)),
          dayjs.duration(0, 'minutes'),
        );
    },
    [query.data],
  );

  const handlePickWeek = useCallback(
    (date: Date) => {
      onChange(date);
      setOpened(false);
      setHovered(null);
    },
    [onChange],
  );

  return (
    <Popover opened={opened} onChange={setOpened} position="bottom" withArrow shadow="md">
      <Popover.Target>
        <Button onClick={() => setOpened((o) => !o)} variant="transparent" {...buttonProps}>
          <Center h="100%">
            <FontAwesomeIcon icon={faCalendarWeek} />
          </Center>
        </Button>
      </Popover.Target>
      <Popover.Dropdown>
        <Calendar
          withCellSpacing={false}
          highlightToday
          defaultDate={value}
          getDayProps={(date) => {
            const isHovered = isInWeekRange(date, hovered);
            const isSelected = isInWeekRange(date, value);
            const isInRange = isHovered || isSelected;
            return {
              onMouseEnter: () => setHovered(date),
              onMouseLeave: () => setHovered(null),
              inRange: isInRange,
              firstInRange: isInRange && date.getDay() === 1,
              lastInRange: isInRange && date.getDay() === 0,
              selected: isSelected,
              onClick: () => handlePickWeek(date),
            };
          }}
          renderDay={(date) => {
            const day = date.getDate();
            const hours = getTimeEntryDurationForDate(date)?.asHours();
            return hours ? (
              <Indicator label={hours} size={12} color="green" position="top-end" offset={-6}>
                {day}
              </Indicator>
            ) : (
              <Text>{day}</Text>
            );
          }}
          onYearSelect={setDateForPeriod}
          onMonthSelect={setDateForPeriod}
          onPreviousMonth={setDateForPeriod}
          onNextMonth={setDateForPeriod}
        />
      </Popover.Dropdown>
    </Popover>
  );
};
