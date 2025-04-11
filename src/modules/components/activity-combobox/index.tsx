import { Combobox, InputBase, useCombobox } from '@mantine/core';
import { FC, useEffect, useMemo, useState } from 'react';
import { useActivities } from '../../just-in-time/query-hooks/use-activities';

export const ActivityCombobox: FC<{
  projectId?: string;
  label?: string;
  required?: boolean;
  value?: string;
  onChange?: (value: string) => void;
  error?: string;
  onFocus?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement, Element>) => void;
}> = ({
  projectId,
  label,
  required = false,
  value,
  onChange = () => {},
  error,
  onFocus = () => {},
  onBlur = () => {},
}) => {
  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
  });

  const { query, mutation } = useActivities({
    projectId,
  });

  const [search, setSearch] = useState('');

  const exactOptionMatch = useMemo(
    () => query.data?.some((item) => item === search) || false,
    [query.data, search],
  );
  const filteredOptions = useMemo(
    () =>
      exactOptionMatch
        ? query.data || []
        : query.data?.filter((item) => item.toLowerCase().includes(search.toLowerCase().trim())) ||
          [],
    [exactOptionMatch, query.data, search],
  );

  useEffect(() => {
    console.log('onChange called');
    onChange('');
    setSearch('');
  }, [projectId]);

  return (
    <Combobox
      store={combobox}
      position="bottom"
      onOptionSubmit={(val) => {
        if (val === '$create') {
          if (query.data) {
            mutation.mutate([...query.data, search]);
            onChange(search);
          }
        } else {
          onChange(val);
          setSearch(val);
        }

        combobox.closeDropdown();
      }}
    >
      <Combobox.Target>
        <InputBase
          label={label}
          rightSection={<Combobox.Chevron />}
          value={search}
          error={error}
          onChange={(event) => {
            combobox.openDropdown();
            combobox.updateSelectedOptionIndex();
            setSearch(event.currentTarget.value);
          }}
          onClick={() => combobox.openDropdown()}
          onFocus={(event) => {
            combobox.openDropdown();
            onFocus(event);
          }}
          onBlur={(event) => {
            combobox.closeDropdown();
            setSearch(value || '');
            onBlur(event);
          }}
          placeholder={!projectId ? 'Select project first... ' : 'Search activity'}
          rightSectionPointerEvents="none"
          w="100%"
          required={required}
          disabled={!projectId}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        {filteredOptions.length === 0 && (
          <Combobox.Empty>
            No activities found. Type something to create an activity.
          </Combobox.Empty>
        )}
        <Combobox.Options>
          {filteredOptions.map((item) => (
            <Combobox.Option value={item} key={item}>
              {item}
            </Combobox.Option>
          ))}
          {!exactOptionMatch && search.trim().length > 0 && (
            <Combobox.Option value="$create">
              + Create activity &quot;{search}&quot;
            </Combobox.Option>
          )}
        </Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
};
