import * as React from "react";
import { ColumnDef, ColumnFiltersState, ColumnOrderState, ColumnPinningState, ExpandedState, GroupingState, RowSelectionState, SortingState, VisibilityState } from "@tanstack/react-table";
import { TableView } from "./TableView";

export type TableProps<TItem extends object> = {
    /**
     * Table Columns definitions.
     */
    defaultColumn?: Partial<ColumnDef<TItem>>
    columns: ColumnDef<TItem>[];

    /**
     * Table data.
     */
    data: TItem[];

    /**
     * Table loading state.
     */
    isLoading?: boolean;

    /**
     * Grid title
     */
    gridTitle?: JSX.Element | React.ReactNode;

    /**
     * Table header menu
     */
    headerMenu?: (selectedItems : TItem[]) => JSX.Element | React.ReactNode;

    /**
     * Table default page size.
     */
    pageSize?: number;

    /**
     * Table page size options
     */
    pageSizeOptions?: number[];

    /**
     * Row selection mode.
     */
    rowSelectionMode?: "single" | "multiple";

    /**
     * Default global filter value.
     */
    defaultGlobalFilter?: string;

    /**
     * Column filter state
     */
    columnFilterState?: ColumnFiltersState;

    /** 
     * Column Visibility
     */
    columnVisibility?: VisibilityState;

    /**
     * Sorting state
     */
    sortingState?: SortingState;

    /**
     * Grouping state
     */
    groupingState?: GroupingState;

    /**
     * Grouping Expanded state
     */
    expandedState?: ExpandedState;
    
    /**
     * Row selection state
     */
    rowSelectionState?: RowSelectionState; 
    
    /**
     * Column pinning state
     */
    columnPinningState?: ColumnPinningState;

    /**
     * Column order state
     */
    columnOrderState?: ColumnOrderState;

    /**
    * Component visible if the no item match the filter condition
    * @default defaultNoItemComponent
    */
    noFilterMatchPage?: React.ReactNode;

    /**
     * Component visible in the grid body if there is no items in the list
     * @default defaultNoItemComponent
     */
    noItemPage?: React.ReactNode;

    /**
     * Table Views
     */
    views?: TableView[];

    /**
     * Max height of the table
     */
    tableHeight?: string;

    autoResetPageIndex?: boolean; 
    onUpdateData?: (rowIndex: number, columnId: string, value: unknown) => void

    /**
     * Callback when a table view is saved
     */
    onTableViewSave?: (tableView: TableView) => void;

    /**
     * Callback when a table view is deleted
     */
    onTableViewDelete?: (tableView: TableView) => void;
};