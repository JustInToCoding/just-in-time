import { Badge, Pagination, Table } from '@mantine/core';
import dayjs from 'dayjs';
import { FC, useMemo, useState } from 'react';
import { TimeEntry } from '../../modules/moneybird/models/time-entry';

const getDuration = (startedAt: string, endedAt: string, pausedDuration: number = 0) => {
  const duration = dayjs(endedAt).subtract(pausedDuration, 'seconds').diff(startedAt, 'minutes');

  return dayjs.duration(duration, 'minutes').format('HH:mm');
};

const chunk = <T,>(array: T[], size: number): T[][] => {
  if (!array.length) {
    return [];
  }
  const head = array.slice(0, size);
  const tail = array.slice(size);
  return [head, ...chunk(tail, size)];
};

export const TimeEntryTable: FC<{ timeEntries: TimeEntry[]; perPage?: number }> = ({
  timeEntries = [],
  perPage = 15,
}) => {
  const [activePage, setPage] = useState(1);
  const data = useMemo(() => chunk(timeEntries, perPage), [timeEntries, perPage]);

  if (!timeEntries.length) {
    return <span>No time entries found</span>;
  }

  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Project</Table.Th>
            <Table.Th>Contact</Table.Th>
            <Table.Th>Description</Table.Th>
            <Table.Th>Date</Table.Th>
            <Table.Th>Period</Table.Th>
            <Table.Th>Paused</Table.Th>
            <Table.Th>Worked</Table.Th>
            <Table.Th>User</Table.Th>
            <Table.Th>Status</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {data[activePage - 1].map((timeEntry) => (
            <Table.Tr key={timeEntry.id}>
              <Table.Td>{timeEntry.project?.name}</Table.Td>
              <Table.Td>{timeEntry.contact?.company_name}</Table.Td>
              <Table.Td>{timeEntry.description}</Table.Td>
              <Table.Td>{dayjs(timeEntry.started_at).format('DD-MM-YYYY')}</Table.Td>
              <Table.Td>
                {dayjs(timeEntry.started_at).format('HH:mm')} -{' '}
                {dayjs(timeEntry.ended_at).format('HH:mm')}
              </Table.Td>
              <Table.Td>
                {dayjs.duration(timeEntry.paused_duration || 0, 'seconds').format('HH:mm')}
              </Table.Td>
              <Table.Td>
                {getDuration(
                  timeEntry.started_at,
                  timeEntry.ended_at,
                  timeEntry.paused_duration || 0,
                )}
              </Table.Td>
              <Table.Td>{timeEntry.user?.name}</Table.Td>
              <Table.Td>
                {timeEntry.events.findIndex(
                  (event) => event.action === 'time_entry_sales_invoice_created',
                ) !== -1 ? (
                  <Badge color="lime">Billed</Badge>
                ) : (
                  timeEntry.billable && <Badge color="orange">Billable</Badge>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {data.length > 1 && <Pagination total={data.length} value={activePage} onChange={setPage} />}
    </div>
  );
};
