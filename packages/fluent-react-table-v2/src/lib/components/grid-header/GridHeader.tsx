import {
  Popover,
  PopoverTrigger,
  Button,
  PopoverSurface,
  MenuGroupHeader, 
  Divider,
  Input,
  Tooltip,
  Checkbox,
  useArrowNavigationGroup,
} from '@fluentui/react-components';
import * as React from 'react';
import {
  ToggleGroupColumnIcon,
  ToggleSelectColumnIcon,
} from '../icon-components/GridIcons';
import { useGridHeaderStyles } from './useGridHeaderStyles';
import { RowData, Table, TableState } from '@tanstack/react-table';
import {
  Album24Regular,
  FilterDismissFilled,
  FilterFilled,
} from '@fluentui/react-icons';
import { Search24Regular } from '@fluentui/react-icons';
import { ActionType, DrawerTableState } from '../reducer';

type GridHeaderProps<TItem extends RowData> = {
  table: Table<TItem>;
  gridTitle: JSX.Element | React.ReactNode;
  headerMenu?: JSX.Element | React.ReactNode;
  globalFilter: string;
  setGlobalFilter: (value: string) => void;

  applyTableState: (tableState: TableState) => boolean  
};

export const GridHeader = <TItem extends RowData>(
  props: GridHeaderProps<TItem>
) => {
  const { table, gridTitle, globalFilter, setGlobalFilter } = props;
  const focusAttribute = useArrowNavigationGroup({ axis: "horizontal", circular: true });

  /* eslint-disable @typescript-eslint/no-non-null-assertion */
  const { dispatchDrawerAction, drawerState } = table.options.meta!;
  const styles = useGridHeaderStyles();

  return (
    <div className={styles.tableTopHeaderContainer}>
      <div className={styles.tableTopHeaderLeft}>{gridTitle}</div>
      <div className={styles.tableTopHeaderRight} {...focusAttribute}>
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

          <PopoverSurface className={styles.popoverSurface}>
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

          <PopoverSurface className={styles.popoverSurface}>
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
            onClick={() => {
              dispatchDrawerAction?.({ type: "TOGGLE_VIEW_DRAWER" });
            }}
            icon={<Album24Regular />}
            aria-label="View Menu"
          />
        </Tooltip>
        <DebouncedInput
          value={globalFilter ?? ''}
          onChange={(value) => setGlobalFilter(String(value))}
          className="p-2 font-lg shadow border border-block"
          placeholder="Search all columns..."
          dispatch={dispatchDrawerAction}
          drawerState={drawerState} 
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
  
  drawerState,
  dispatch,
}: {
  value: string | number;
  onChange: (value: string | number) => void;
  debounce?: number;

  drawerState: DrawerTableState,
  dispatch: React.Dispatch<ActionType<string>>
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
      aria-label="Search keyword"
      placeholder="Search Keyword"
      value={value as string}
      onChange={(_, data) => setValue(data.value)}
      type="search"
      autoComplete="off"
      contentBefore={<Search24Regular />}
      style={{ width: '300px' }}
      contentAfter={
        <Tooltip
          content={drawerState?.isFilterDrawerOpen ? 'Close Filter Window' : 'Open Advance Filter'}
          relationship="label"
        >
          <Button
            appearance="subtle"
            icon={drawerState?.isFilterDrawerOpen ? <FilterDismissFilled /> : <FilterFilled />}
            aria-label={drawerState?.isFilterDrawerOpen ? 'Close filter panel' : 'Open advanced filter'}
            onClick={() => { 
              dispatch?.({ type: "TOGGLE_FILTER_DRAWER" });
            }}
          />
        </Tooltip>
      }
    />
  );
}
