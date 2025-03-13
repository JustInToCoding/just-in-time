import { Project } from '../models/project';

export const getProjects = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  params?: { filter?: string; per_page?: string; page?: string },
): Promise<Project[]> => {
  return fetcher(
    'projects' + (params !== undefined ? '?' + new URLSearchParams(params).toString() : ''),
    true,
  ).then((response) => response.json());
};
