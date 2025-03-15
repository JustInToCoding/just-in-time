import { Project } from '../models/project';

export const getProjects = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  params?: {
    filter?: 'state:all' | 'state:archived' | 'state:active';
    per_page?: string;
    page?: string;
  },
): Promise<Project[]> => {
  return fetcher(
    'projects' +
      (params !== undefined
        ? '?' +
          new URLSearchParams({
            ...(params.filter && { filter: params.filter }),
            ...(params.per_page && { per_page: params.per_page }),
            ...(params.page && { page: params.page }),
          }).toString()
        : ''),
    true,
  ).then((response) => response.json());
};
