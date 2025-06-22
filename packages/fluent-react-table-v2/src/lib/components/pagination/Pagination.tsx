import { Button, Dropdown, Input, Option, useId } from "@fluentui/react-components";
import { RowData, Table } from "@tanstack/react-table";
import { usePaginationStyle } from "./usePaginationStyles";
import {
  ArrowNextFilled,
  ArrowPreviousFilled,
  NextRegular,
  PreviousRegular,
} from "@fluentui/react-icons";
import { useMemo } from "react";
import { For, Show } from "@prt-ts/react-control-flow";

type PaginationProps<TItem extends RowData> = {
  table: Table<TItem>
};

const range = (from: number, to: number, step = 1): number[] =>
  [...Array(Math.floor((to - from) / step) + 1)]?.map(
    (_, i) => from + i * step
  );

const DEFAULT_NUMBER_OF_PAGE_BTN = 5;

export const Pagination = <TItem extends RowData>(
  props: PaginationProps<TItem>
) => {
  const { table } = props;
  const { pageSizeOptions } = table.options.meta || {}
  const pageSizeSelectionId = useId("page-size-selector");
  const styles = usePaginationStyle();

  const totalNumberOfPage = table.getPageCount();
  const currentPage = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;

  // get total item count and number of item in current page
  const totalItemCount = table.getFilteredRowModel().rows.length;
  const numberOfItemsInCurrentPage = table.getRowModel().rows.length;

  const pageSelectionOptions: number[] = useMemo(() => {
    let start = currentPage - Math.floor(DEFAULT_NUMBER_OF_PAGE_BTN / 2);
    let end = currentPage + Math.floor(DEFAULT_NUMBER_OF_PAGE_BTN / 2);

    if (start < 1) {
      start = 1;
      end = totalNumberOfPage > DEFAULT_NUMBER_OF_PAGE_BTN
        ? DEFAULT_NUMBER_OF_PAGE_BTN
        : totalNumberOfPage;
    } else if (end > totalNumberOfPage) {
      const possibleStart = totalNumberOfPage - DEFAULT_NUMBER_OF_PAGE_BTN + 1;
      start = possibleStart < 1 ? 1 : possibleStart;
      end = totalNumberOfPage;
    }
    const currentPageOptions: number[] =
      end - start >= 0 ? range(start, end) : [];
    return currentPageOptions?.length ? [...currentPageOptions] : [1];
  }, [totalNumberOfPage, currentPage]);

  return (
    <div className={styles.paginationContainer}>
      <div className={styles.wrapper}>
        <div className={styles.pageSelectionWrapper}>
          <Dropdown
            id={pageSizeSelectionId}
            size="small"
            selectedOptions={[`${pageSize}`]}
            placeholder="Select Page Size"
            value={table.getState().pagination.pageSize.toString()}
            onOptionSelect={(_, data) =>
              table.setPageSize(Number(+data.selectedOptions?.[0]))
            }
            className={styles.pageSelectionDropdown}
            aria-label={"Select Page Size"}
          >
            <Show when={pageSelectionOptions?.length > 0}>
              <For each={pageSizeOptions}>
                {(option) => (
                  <Option key={option} value={`${option}`}>
                    {`${option}`}
                  </Option>
                )}
              </For>
            </Show>
          </Dropdown>
          <Show when={pageSelectionOptions?.length > 0 && totalItemCount > 0}>
            <span className={styles.pageSizeText}>
              Showing {numberOfItemsInCurrentPage} of {totalItemCount} items
            </span>
          </Show>
        </div>
        <div className={styles.pageBtnContainer}>
          <div>
            <span>
              Page{" "}
              <strong>
                {table.getState().pagination.pageIndex + 1} of{" "}
                {table.getPageCount()}
              </strong>
            </span>
            <span>
              {" "}
              | Go to page:{" "}
              <Input
                type="number"
                size="small"
                value={`${table.getState().pagination.pageIndex + 1}`}
                onChange={(e, data) => {
                  const page = data.value ? Number(e.target.value) - 1 : 0;
                  if (page >= 0 && page < table.getPageCount()) {
                    table.setPageIndex(page);
                  }
                }}
                className={styles.pageSizeInput}
                aria-label="Page Number"
                autoComplete={"off"}
                autoCorrect={"off"}
              />
            </span>
          </div>
          <Button
            size="small"
            className={styles.pageBtn}
            shape="circular"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
            icon={<PreviousRegular />}
            aria-label="Go to first page"
          />
          <Button
            size="small"
            className={styles.pageBtn}
            shape="circular"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            icon={<ArrowPreviousFilled />}
            aria-label="Go to previous page"
          />
          <For each={pageSelectionOptions}>
            {(option, index) => (
              <Button
                shape="circular"
                key={index}
                appearance={option - 1 === currentPage ? "primary" : undefined}
                onClick={() => table.setPageIndex(option - 1)}
                aria-label={`Show Page ${option}`}
                size="small"
                className={styles.pageBtn}
              >
                {option}
              </Button>
            )}
          </For>
          <Button
            size="small"
            className={styles.pageBtn}
            shape="circular"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            icon={<ArrowNextFilled />}
            aria-label="Go to next page"
          />
          <Button
            size="small"
            shape="circular"
            className={styles.pageBtn}
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
            icon={<NextRegular />}
            aria-label="Go to last page"
          />
        </div>
      </div>
    </div>
  );
};
