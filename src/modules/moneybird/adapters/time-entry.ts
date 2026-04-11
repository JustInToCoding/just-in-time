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

export const deleteTimeEntry = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  id: string,
): Promise<void> => {
  return fetcher(`time_entries/${id}`, true, {
    method: 'DELETE',
  }).then(() => undefined);
};

export const patchTimeEntry = (
  fetcher: (input: string, useAdministration: boolean, ...args: any[]) => Promise<Response>,
  id: string,
  timeEntry: Partial<
    Omit<
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
    >
  >,
): Promise<TimeEntry> => {
  return fetcher(`time_entries/${id}`, true, {
    method: 'PATCH',
    body: JSON.stringify({ time_entry: timeEntry }),
  }).then((response) => response.json());
};
