import * as React from "react";
import { createRef, useEffect, useState } from 'react';
import { Person, makeData } from './data/data';
import { Button, Field, Input, Radio, RadioGroup } from '@fluentui/react-components';
import { EditRegular, DeleteRegular } from '@fluentui/react-icons';
import {
  ColumnDef,
  Table,
  TableRef,
  TableState,
  TableView,
  createColumnHelper,
  useSkipper,
} from '@prt-ts/fluent-react-table-v2';
import { useNavigate } from 'react-router-dom'; 
import {
  FontIncrease24Regular,
  FontDecrease24Regular,
  TextFont24Regular,
  MoreHorizontal24Filled,
} from "@fluentui/react-icons";
import {
  Toolbar,
  ToolbarButton,
  ToolbarDivider,
  Menu,
  MenuTrigger,
  MenuPopover,
  MenuList,
  MenuItem,
} from "@fluentui/react-components";
import { tableViews as views } from './data/tableView';
import { ColumnPinningState } from '@tanstack/react-table';

const ColumnIdAccessMapping = {
  "First Name" : "firstName",
  "Last Name" : "lastName" 
}

export function TableExample2() {
  const navigate = useNavigate();
  const columnHelper = createColumnHelper<Person>();
  const tableRef = createRef<TableRef<Person>>();
  const [data, setData] = useState<Person[]>([]);
  const [tableViews, setTableViews] = useState<TableView[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectionMode, setSelectionMode] = useState<
    'single' | 'multiple' | undefined
  >('multiple');

  const logSelectedRows = () => {
    const table = tableRef.current?.table;
    const selectedRow = table
      ?.getSelectedRowModel()
      .flatRows.map((row) => row.original);
    console.log(selectedRow);
  };

  const logTableState = () => {
    const tableState = tableRef.current?.getTableState();
    console.log(tableState);
  };

  // Give our default column cell renderer editing superpowers!
  const defaultColumn: Partial<ColumnDef<Person>> = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const initialValue = getValue()
      // We need to keep and update the state of the cell normally
      const [value, setValue] = React.useState(initialValue)

      // When the input is blurred, we'll call our table meta's updateData function
      const onBlur = () => {
        table.options.meta?.updateData(index, id, value)
      }

      // If the initialValue is changed external, sync it up with our state
      React.useEffect(() => {
        setValue(initialValue)
      }, [initialValue])

      return (
        <Input
          value={value as string}
          onChange={(e, data) => setValue(data.value)}
          onBlur={onBlur}
          appearance="filled-lighter"
        />
      )
    },
  }

  const saveCurrentTableState = () => {
    const tableState = tableRef.current?.getTableState();
    localStorage.setItem('view1', JSON.stringify(tableState));
    console.log(tableState);
  };

  const applyLastSavedTableState = () => {
    const tableState = JSON.parse(localStorage.getItem('view1') || '') as TableState;
    tableRef.current?.applyTableState(tableState);
    console.log(tableState);
  };

  const applyBeforeEditState = () => {
    const localStorageString = localStorage.getItem('table1_edit_temp');
    if (!localStorageString) return;

    const tableState = JSON.parse(localStorageString) as TableState;
    tableRef.current?.applyTableState(tableState);
    console.log(tableState);
  };

  const [autoResetPageIndex, skipAutoResetPageIndex] = useSkipper();
  const onUpdateDate = (rowIndex, columnId, value) => {
    // Skip page index reset until after next rerender
    console.log(rowIndex, columnId, value)
    skipAutoResetPageIndex()
    setData(old =>
      ([...old]).map((row, index) => {
        if (index === rowIndex) {
          const accessor = ColumnIdAccessMapping[columnId] ?? columnId
          return {
            ...old[rowIndex]!,
            [accessor]: value,
          }
        }
        return row
      })
    )
  }


  const columns = React.useMemo(() => [
    columnHelper.accessor('id', {
      id: 'Pin',
      header: () => 'Pin',
      cell: ({ row }) =>
        row.getIsPinned() ? (
          <button
            onClick={() => row.pin(false, true, false)}
          >
            ❌
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '4px' }}>
            <button
              onClick={() =>
                row.pin('top', true, false)
              }
            >
              ⬆️
            </button>
            <button
              onClick={() =>
                row.pin('bottom', true, true)
              }
            >
              ⬇️
            </button>
          </div>
        ),
      aggregatedCell: () => null,
      filterFn: 'arrIncludesSome',
      enableGrouping: false,
      enableHiding: false,
    }),
    columnHelper.accessor('id', {
      id: 'ID',
      header: () => 'ID',
      cell: ({ getValue, table: { getState } }) => {
        return (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              icon={<EditRegular />}
              aria-label="Edit"
              size="small"
              onClick={async () => {
                const tableState = getState();
                localStorage.setItem('table1_edit_temp', JSON.stringify(tableState));
                navigate(`/dummy-edit/${getValue()}/edit`);
              }}
            />
            <Button
              icon={<DeleteRegular />}
              aria-label="Delete"
              size="small"
              onClick={() => {
                const confirm = window.confirm(
                  'Are you sure you want to delete this row?'
                );
                if (confirm) {
                  alert('Deleted');
                }
              }}
            />
            <strong>{getValue()}</strong>
          </div>
        );
      },
      aggregatedCell: () => null,
      filterFn: 'arrIncludesSome',
      enableGrouping: false,
      enableHiding: false,
    }),
    columnHelper.accessor('firstName', {
      id: 'First Name',
      header: () => 'First Name',
      filterFnDefinition: () => 'firstName',
    }),
    columnHelper.accessor((row) => row.lastName, {
      id: 'Last Name', 
      header: () => <span>Last Name</span>,
      aggregatedCell: () => null,
    }),
    columnHelper.accessor('age', {
      id: 'Age',
      header: () => 'Age',
      cell: (info) => info.renderValue(),
      filterFn: 'includesString',
      aggregationFn: 'mean',
      minSize: 10,
      size:300,
      maxSize: 800,
      enableGrouping: false,
    }),
    columnHelper.accessor('visits', {
      id: 'Visits',
      header: () => <span>Visits</span>,
      filterFn: 'inNumberRange',
      enableHiding: false,
    }),
    columnHelper.accessor('progress', {
      id: 'Progress',
      header: 'Profile Progress',
      aggregatedCell: () => null,
    }),
    columnHelper.accessor('address.street', {
      id: 'Street',
      header: 'Street',
      aggregatedCell: () => null,
    }),
    columnHelper.accessor('address.city', {
      id: 'City',
      header: 'City',
      aggregatedCell: () => null,
    }),
    columnHelper.accessor('address.state', {
      id: 'State',
      header: 'State',
      aggregatedCell: () => null,
      filterFn: 'arrIncludesAll',
    }),
    columnHelper.accessor('address.zipCode', {
      id: 'Zip Code',
      header: 'Zip Code',
      aggregatedCell: () => null,
      enableColumnFilter: false,
      enableGlobalFilter: false,
      enableGrouping: false,
      enableHiding: false,
      enablePinning: false,
      enableSorting: false,
    }),
    columnHelper.accessor('address.country', {
      id: 'Country',
      header: 'Country',
      aggregatedCell: () => null,
      filterFn: 'arrIncludes',
    }), 
    columnHelper.accessor('status', {
      id: 'Status',
      header: 'Status',
      aggregatedCell: () => null,
      filterFn: 'arrIncludesSome',
    }),
    columnHelper.accessor(({createdAt}) => createdAt, {
      id: 'Created At',
      header: 'Created At',
      cell: (info) =>
        info.renderValue()
          ? new Date(info.renderValue() as Date)?.toLocaleDateString()
          : '',
      aggregatedCell: () => null,
      filterFn: 'inDateRange',
    }) as ColumnDef<Person>,
  ] as ColumnDef<Person>[]
  , [])

  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setData(() => makeData(10000));
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  // get data from server
  useEffect(
    () => {
      const timeout = setTimeout(() => {
        setTableViews(() => views);
        setIsLoading(false);
      }, 1000);

      return () => clearTimeout(timeout);
    },
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
    []
  );

  // apply before edit state so that the table state is applied after the data is loaded
  useEffect(
    () => {
      applyBeforeEditState();
      if (data?.length > 0) {
        localStorage.removeItem('table1_edit_temp');
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [data]
  );

  const defaultPinnedColumns : ColumnPinningState = React.useMemo(() => {
    return {
      left: ["ID"],
      right: ["Status"]
    } as ColumnPinningState
  }, [])


  return (
    <div>
      {/* <div style={{
        display: 'flex',
        gap: '10px',
      }}>
      <Button onClick={logSelectedRows}>Log Selected Rows</Button>
      <Button onClick={logTableState}>Get Table State</Button>
      <Button onClick={saveCurrentTableState}>Save Current View</Button>
      <Button onClick={applyLastSavedTableState}>
        Apply Last Saved Table State
      </Button>
        </div>
      <Field label="Selection Mode">
        <RadioGroup
          value={selectionMode}
          onChange={(_, data) =>
            setSelectionMode(data.value as unknown as 'single' | 'multiple')
          }
          layout="horizontal"
        >
          <Radio value={''} label="None" />
          <Radio value={'single'} label="Single" />
          <Radio value={'multiple'} label="Multiple" />
        </RadioGroup>
      </Field> */}
      <Table
        autoResetPageIndex={autoResetPageIndex}
        onUpdateData={onUpdateDate}
        ref={tableRef}
        data={data}
        // defaultColumn={defaultColumn}
        columns={columns}
        pageSize={100}
        pageSizeOptions={[10, 20, 100, 1000, 10000]}
        isLoading={isLoading}
        gridTitle={<strong>Grid Header</strong>}
        headerMenu={(selectedItems) => (
          <TopToolbar selectedItems={selectedItems} />
        )}
        rowSelectionMode={selectionMode}
        columnVisibility={{
          progress: false,
          firstName: false,
        }}
        columnPinningState={defaultPinnedColumns}
        // sortingState={[
        //   { id: "id", desc: false }
        // ]}
        // columnPinningState={
        //   {
        //     left: ["state"],
        //   }
        // }
        // groupingState={["status"]}
        // expandedState={{
        //   "status:complicated": true
        // }}
        // noItemPage={<div>No Item</div>}
        // noFilterMatchPage={<div>No Filter Match</div>}
        views={tableViews}
        onTableViewSave={(tableView) => {
          console.log(tableView);
          setTableViews((prev) => [...prev, tableView]);
        }}
        onTableViewDelete={(tableView) => {
          console.log(tableView);
          setTableViews((prev) =>
            prev.filter((view) => view.id !== tableView.id)
          );
        }}
        tableHeight='790px'
      />
    </div>
  );
}

export const TopToolbar: React.FC<{
  selectedItems: Person[];
}> = ({ selectedItems }) => {

  console.log(selectedItems);
  return (
    <>
      Selected Items: {selectedItems?.length}
      <Toolbar aria-label="Default" >
        <ToolbarButton
          aria-label="Increase Font Size"
          appearance="primary"
          icon={<FontIncrease24Regular />}
        />
        <ToolbarButton
          aria-label="Decrease Font Size"
          icon={<FontDecrease24Regular />}
        />
        <ToolbarButton aria-label="Reset Font Size" icon={<TextFont24Regular />} />
        {selectedItems?.length === 1 && (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Button
              icon={<EditRegular />}
              aria-label="Edit"
              size="small"
              onClick={async () => {
                alert('Edit');
              }}
            />
            <Button
              icon={<DeleteRegular />}
              aria-label="Delete"
              size="small"
              onClick={() => {
                const confirm = window.confirm(
                  'Are you sure you want to delete this row?'
                );
                if (confirm) {
                  alert('Deleted');
                }
              }}
            />
          </div>
        )}
        {selectedItems?.length === 1 && (
          <><ToolbarDivider />
            <Menu>
              <MenuTrigger>
                <ToolbarButton aria-label="More" icon={<MoreHorizontal24Filled />} />
              </MenuTrigger>

              <MenuPopover>
                <MenuList>
                  <MenuItem>New </MenuItem>
                  <MenuItem>New Window</MenuItem>
                  <MenuItem disabled>Open File</MenuItem>
                  <MenuItem>Open Folder</MenuItem>
                </MenuList>
              </MenuPopover>
            </Menu></>)}
      </Toolbar></>
  );
}


