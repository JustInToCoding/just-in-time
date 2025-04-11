import { Button, Table } from '@mantine/core';
import { FC } from 'react';
import { Activity } from '../../just-in-time/models/activities';

export const ActivityTable: FC<{
  activities: Activity[];
  onDelete?: (activity: Activity) => void;
}> = ({ activities, onDelete = () => {} }) => {
  return (
    <Table>
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Activity</Table.Th>
          <Table.Th>Actions</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {activities.map((activity) => (
          <Table.Tr key={activity}>
            <Table.Td>{activity}</Table.Td>
            <Table.Td>
              <Button onClick={() => onDelete(activity)}>Delete</Button>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};
