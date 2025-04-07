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

export const postTimeEntry = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  timeEntry: Omit<
    TimeEntry,
    | 'user'
    | 'project'
    | 'events'
    | 'notes'
    | 'created_at'
    | 'updated_at'
    | 'id'
    | 'administration_id'
    | 'contact'
    | 'detail'
  >,
): Promise<TimeEntry> => {
  return fetcher('time_entries', true, {
    method: 'POST',
    body: JSON.stringify({ time_entry: timeEntry }),
  }).then((response) => response.json());
};
