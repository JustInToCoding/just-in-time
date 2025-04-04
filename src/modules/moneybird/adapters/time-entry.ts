import { TimeEntry } from '../models/time-entry';

export const getTimeEntries = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  params?: {
    filter?: string;
    per_page?: string;
    page?: string;
    query?: string;
  },
): Promise<TimeEntry[]> => {
  return fetcher(
    'time_entries' +
      (params !== undefined
        ? '?' +
          new URLSearchParams({
            ...(params.filter && { filter: params.filter }),
            ...(params.per_page && { per_page: params.per_page }),
            ...(params.page && { page: params.page }), // Not sure if this one exists
            ...(params.query && { query: params.query }),
          }).toString()
        : ''),
    true,
  ).then((response) => response.json());
};
