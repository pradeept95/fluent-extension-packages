import * as React from 'react';
import {
  DrawerBody,
  DrawerHeader,
  DrawerHeaderTitle,
  InlineDrawer,
  Button,
  Caption1Stronger,
  makeStyles,
  shorthands,
  DrawerFooter,
} from '@fluentui/react-components';
import {
  Accordion,
  AccordionHeader,
  AccordionItem,
  AccordionPanel,
} from "@fluentui/react-components";
import { Dismiss24Regular } from '@fluentui/react-icons';
import { RowData, Table, flexRender } from '@tanstack/react-table';
import { Filter } from './Filter'; 
import { ClearFilterIcon } from '../icon-components/GridIcons';
import { Show } from '@prt-ts/react-control-flow';


const useFilterDrawerStyles = makeStyles({
  drawerBody: {
    ...shorthands.overflow('hidden', 'auto'),
    /* width */

    ':hover': {
      ...shorthands.overflow('auto', 'auto'),
    },

    '::-webkit-scrollbar': {
      width: '6px',
      height: '4px',
      ...shorthands.borderRadius('50%'),
    },

    /* Track */
    '::-webkit-scrollbar-track': {
      'background-color': '#f1f1f1',
    },

    /* Handle */
    '::-webkit-scrollbar-thumb': {
      'background-color': '#888',
    },

    /* Handle on hover */
    '::-webkit-scrollbar-thumb:hover': {
      'background-color': '#555',
    },
  },
});

type FilterDrawerProps<TItem extends RowData> = { 
  table: Table<TItem>;
};

export const FilterDrawer = <TItem extends RowData>({ 
  table
}: FilterDrawerProps<TItem>) => {

  const headerGroups = table.getHeaderGroups();
  const styles = useFilterDrawerStyles();

  const resetAllFilters = React.useCallback(() => {
    table.setGlobalFilter('');
    table.resetColumnFilters();
  }, [table]);

   /* eslint-disable @typescript-eslint/no-non-null-assertion */
   const { dispatchDrawerAction, drawerState } = table.options.meta!;

  return (
    <InlineDrawer position="end" open={drawerState?.isFilterDrawerOpen} separator size='medium'>
      <DrawerHeader>
        <DrawerHeaderTitle
          action={
            <Button
              appearance="subtle"
              aria-label="Close"
              icon={<Dismiss24Regular />}
              onClick={() => dispatchDrawerAction?.({ type: "CLOSE_FILTER_DRAWER" })}
            />
          }
        >
          Column Filters
        </DrawerHeaderTitle>
      </DrawerHeader>

      <DrawerBody className={styles.drawerBody}>
        <Accordion multiple collapsible>
          {headerGroups.map((headerGroup) => {
            const canApplyFilter = headerGroup.depth === headerGroups?.length - 1;

            if (!canApplyFilter) return null;

            return headerGroup.headers.map((header) => {
              const canFilter = header.column.getCanFilter();
              if (!canFilter) return null;

              return (
                <Show when={header.column.getCanFilter()} key={header.column.id}>
                  <AccordionItem value={header.column.id} key={header.column.id}>
                    <AccordionHeader expandIconPosition='end'>
                      <Caption1Stronger>
                        Filter by{' '}
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </Caption1Stronger>
                    </AccordionHeader>
                    <AccordionPanel>
                      <Filter column={header.column} table={table} />
                    </AccordionPanel>
                  </AccordionItem>
                </Show>
              );
            });
          })}
        </Accordion>
      </DrawerBody>
      <DrawerFooter>
        <Button icon={<ClearFilterIcon />} onClick={resetAllFilters} style={{ width: "100%" }}>
          Clear All Filters
        </Button>
      </DrawerFooter>
    </InlineDrawer>
  );
};
