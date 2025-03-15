import { Badge, Card, Group, Progress, Text } from '@mantine/core';
import { Project } from '../../modules/moneybird/models/project';

export const ProjectCard = (project: Project) => {
  return (
    <Card
      key={project.id}
      withBorder
      mt="md"
      radius="md"
      padding="md"
      bg="var(--mantine-color-body)"
    >
      <Text fz="lg" fw={300}>
        {project.name}
      </Text>
      {project.budget && (
        <>
          <Group justify="space-between" mt="xs">
            <Text fz="sm" c="dimmed">
              Progress
            </Text>
            <Text fz="sm" c="dimmed">
              {project.budget} hour budget
            </Text>
          </Group>
          <Progress value={54.31} mt="md" size="lg" radius="xl" />
          <Group justify="space-between" mt="md">
            <Text fz="sm">100 hours declared</Text>
            <Badge size="sm">300 hours remaining</Badge>
          </Group>
        </>
      )}
    </Card>
  );
};
