import { Group, Progress, Table, Text } from '@mantine/core';
import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';

export const Projects = () => {
  const { query } = useProjects('state:all');

  if (query.isPending) {
    return <span>Loading...</span>;
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>;
  }

  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Project name</Table.Th>
            <Table.Th>Budget (hours)</Table.Th>
            <Table.Th>Progress</Table.Th>
            <Table.Th>Remaining (hours)</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {query.data?.map((project) => (
            <Table.Tr key={project.id}>
              <Table.Td>
                <Group>
                  <Text>{project.name}</Text>
                </Group>
              </Table.Td>
              <Table.Td>{project.budget}</Table.Td>
              <Table.Td w={250}>
                {project.budget && <Progress value={0} size="lg" radius="xl" />}
              </Table.Td>
              <Table.Td>{project.budget && project.budget}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    </div>
  );
};
