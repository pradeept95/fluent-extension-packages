import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverSurface,
  MenuGroupHeader,
  Checkbox,
  Divider,
  Input,
  Tooltip,
} from '@fluentui/react-components';
import * as React from 'react';
import {
  ToggleGroupColumnIcon,
  ToggleSelectColumnIcon,
} from '../icon-components/GridIcons';
import { useGridHeaderStyles } from './useGridHeaderStyles';
import { Table, TableState } from '@tanstack/react-table';
import {
  Album24Regular,
  FilterDismissFilled,
  FilterFilled,
} from '@fluentui/react-icons';
import { Search24Regular } from '@fluentui/react-icons';

type GridHeaderProps<TItem extends object> = {
  table: Table<TItem>;
  gridTitle: JSX.Element | React.ReactNode;
  headerMenu?: JSX.Element | React.ReactNode;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;

  applyTableState: (tableState: Partial<TableState>) => boolean

  openFilterDrawer: boolean;
  setFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;

  openViewsDrawer: boolean;
  setViewsDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export const GridHeader = <TItem extends object>(
  props: GridHeaderProps<TItem>
) => {
  const { table, gridTitle, globalFilter, setGlobalFilter } = props;
  const styles = useGridHeaderStyles();

  return (
    <div className={styles.tableTopHeaderContainer}>
      <div className={styles.tableTopHeaderLeft}>{gridTitle}</div>
      <div className={styles.tableTopHeaderRight}>
        {props.headerMenu}
        {props.headerMenu && <Divider vertical />}
        <Popover withArrow>
          <PopoverTrigger disableButtonEnhancement>
            <Tooltip content={'Toggle Group Column'} relationship="label">
              <Button
                icon={<ToggleGroupColumnIcon />}
                aria-label="Toggle Group Column"
              />
            </Tooltip>
          </PopoverTrigger>

          <PopoverSurface>
            <div className={styles.tableTopHeaderColumnTogglePopover}>
              <MenuGroupHeader>Group Columns</MenuGroupHeader>
              {table.getAllLeafColumns().map((column) => {
                if (column.id === 'select') return null;
                if (column.id === 'id') return null;

                return (
                  <Checkbox
                    key={column.id}
                    checked={column.getIsGrouped()}
                    onChange={column.getToggleGroupingHandler()}
                    disabled={!column.getCanGroup() || !column.getIsVisible()}
                    label={<span>{column.columnDef.id}</span>}
                  />
                );
              })}
            </div>
          </PopoverSurface>
        </Popover>
        <Popover withArrow>
          <PopoverTrigger disableButtonEnhancement>
            <Tooltip content={'Toggle Column Visibility'} relationship="label">
              <Button
                icon={<ToggleSelectColumnIcon />}
                aria-label="Toggle Column Visibility"
              />
            </Tooltip>
          </PopoverTrigger>

          <PopoverSurface>
            <div className={styles.tableTopHeaderColumnTogglePopover}>
              <MenuGroupHeader>Toggle Columns</MenuGroupHeader>
              <Checkbox
                checked={table.getIsAllColumnsVisible()}
                onChange={table.getToggleAllColumnsVisibilityHandler()}
                label={'Toggle All'}
              />
              <Divider />
              {table.getAllLeafColumns().map((column) => {
                if (column.id === 'select') return null;

                return (
                  <Checkbox
                    key={column.id}
                    checked={column.getIsVisible()}
                    onChange={column.getToggleVisibilityHandler()}
                    label={column.id}
                    disabled={!column.getCanHide()}
                  />
                );
              })}
            </div>
          </PopoverSurface>
        </Popover>
        <Tooltip content={'Table Views Management'} relationship="label">
          <Button
            // appearance="subtle"
            onClick={() => props.setViewsDrawerOpen((value) => !value)}
            icon={<Album24Regular />}
            aria-label="View Menu"
          />
        </Tooltip>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
          openFilterDrawer={props.openFilterDrawer}
          setFilterDrawerOpen={props.setFilterDrawerOpen}
        />
      </div>
    </div>
  );
};

// A debounced input react component
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  openFilterDrawer,
  setFilterDrawerOpen,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;

  openFilterDrawer: boolean;
  setFilterDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
  const [value, setValue] = React.useState<string | number>('');

  React.useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  React.useEffect(() => {
    const timeout = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeout);
  }, [value, onChange, debounce]);

  return (
    <Input
      placeholder="Search Keyword"
      value={value as string}
      onChange={(_, data) => setValue(data.value)}
      type="search"
      autoComplete="off"
      contentBefore={<Search24Regular />}
      style={{ width: '300px' }}
      contentAfter={
        <Tooltip
          content={openFilterDrawer ? 'Close Filter Window' : 'Open Advance Filter'}
          relationship="label"
        >
          <Button
            appearance="subtle"
            icon={openFilterDrawer ? <FilterDismissFilled /> : <FilterFilled />}
            aria-label="View Menu"
            onClick={() => {
              setFilterDrawerOpen((open) => !open);
            }}
          />
        </Tooltip>
      }
    />
  );
}
