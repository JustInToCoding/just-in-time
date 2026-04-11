# Edit Time Entry + Refresh Button — Design Spec

**Date:** 2026-04-11  
**Status:** Approved

---

## Overview

Add the ability to edit existing time entries via a modal, and add a refresh button to manually re-fetch time entries. Both features are available on the Time Logger and Time Entries pages.

---

## Architecture

### Approach

Dedicated `EditTimeEntryModal` component — self-contained, no changes to the existing create form in TimeLogger. The modal pre-fills from an existing `TimeEntry` object and calls an `updateMutation` on submit.

---

## Components & Files

### New: `src/components/edit-time-entry-modal/index.tsx`

A Mantine `Modal` containing a form pre-filled from the provided `TimeEntry`. Fields mirror the create form in TimeLogger:

| Field | Input type | Notes |
|---|---|---|
| Project | `Select` | Required |
| Contact | `Select` | Optional |
| Start time | `TimeInput` | Derived from `started_at` ISO string |
| End time | `TimeInput` | Derived from `ended_at` ISO string |
| Paused duration | `TimeInput` | Derived from `paused_duration` seconds |
| Description | `ActivityCombobox` | Required |
| Billable | `Checkbox` | |

On submit, the form reconstructs full ISO timestamps by combining the date from the existing `started_at` with the edited `HH:mm` values. Calls `updateMutation.mutateAsync(...)` then closes the modal and shows a success/error notification.

Props:
```ts
{
  timeEntry: TimeEntry | null;  // null = modal closed
  onClose: () => void;
}
```

### Modified: `src/modules/moneybird/adapters/time-entry.ts`

Add `patchTimeEntry`:

```ts
patchTimeEntry(fetcher, id: string, fields: Partial<...>): Promise<TimeEntry>
```

Sends `PATCH time_entries/:id` with `{ time_entry: fields }`.

### Modified: `src/modules/moneybird/query-hooks/use-time-entries.ts`

Add `updateMutation` alongside `createMutation`. On success, calls `query2.refetch()`.

### Modified: `src/components/time-entry-table/index.tsx`

Add optional `onEdit?: (entry: TimeEntry) => void` prop. When provided, append an actions column with an edit icon button per row. When `onEdit` is absent, the column is hidden (preserves existing usage in TimeLogger's read-only table — unless the consuming page passes `onEdit` there too).

### Modified: `src/routes/time-entries/index.tsx`

- Add `selectedEntry` state (`TimeEntry | null`, default `null`)
- Pass `onEdit={setSelectedEntry}` to `TimeEntryTable`
- Render `EditTimeEntryModal` with `timeEntry={selectedEntry}` and `onClose={() => setSelectedEntry(null)}`
- Add a `Button` (with refresh icon) that calls `query.refetch()`; show a loading indicator while `query.isFetching`

### Modified: `src/routes/time-logger/index.tsx`

- Same `selectedEntry` state + modal wiring
- Pass `onEdit={setSelectedEntry}` to `TimeEntryTable`
- Add refresh button calling `query.refetch()`

---

## Data Flow

```
User clicks edit icon in row
  → setSelectedEntry(timeEntry)
  → EditTimeEntryModal opens, pre-filled

User submits form
  → patchTimeEntry(fetcher, id, fields)  [adapter]
  → updateMutation.onSuccess → query.refetch()
  → modal closes, success notification shown

User clicks refresh button
  → query.refetch()
  → loading indicator shown while fetching
```

---

## Error Handling

- API errors during update shown via Mantine notification (same pattern as create)
- Modal stays open on error so the user can retry or cancel

---

## Out of Scope

- Delete time entry
- Bulk editing
- Optimistic updates
