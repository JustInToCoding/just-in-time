import { useProjects } from '../../modules/moneybird/query-hooks/use-projects';

export const Projects = () => {
  const { query } = useProjects();

  if (query.isPending) {
    return <span>Loading...</span>;
  }

  if (query.isError) {
    return <span>Error: {query.error.message}</span>;
  }

  return (
    <div>
      {query.data?.map((project) => (
        <p key={project.id}>
          {project.name} ({project.budget})
        </p>
      ))}
    </div>
  );
};
