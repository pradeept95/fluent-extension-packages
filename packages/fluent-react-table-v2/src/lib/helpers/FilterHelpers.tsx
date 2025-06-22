import { FilterFn } from "@tanstack/react-table";

export const arrIncludesSome: FilterFn<unknown> = (row, columnId, value) => {
    // Rank the item
    const rowValue = row.getValue(columnId);
    const lowerCaseValues = (value || []).map((v: string) => `${v || ''}`.toLowerCase());
    const passed =
      Array.isArray(value) &&
      (value?.length === 0 || lowerCaseValues.includes(`${rowValue}`?.toLowerCase()));

    return passed;
};

export const dateRange: FilterFn<unknown> = (row, columnId, value) => {
  // filter by date range
  const rowValue = row.getValue(columnId) as Date;

  // compare the date range
  // case if no start date or end date is selected
  // case if start date is selected
  // case if end date is selected

  if (!value || value.length === 0) {
    return true;
  }
  else if (value.length === 2 && value[0] && !value[1]) {
    return typeof rowValue?.getMonth === 'function' && rowValue >= value[0];
  }
  else if (value.length === 2 && !value[0] && value[1]) {
    return typeof rowValue?.getMonth === 'function' && rowValue <= value[1];
  }
  else if (value.length === 2 && !value[0] && !value[1]) {
    return true;
  }

  const passed = typeof rowValue?.getMonth === 'function' && value[0] <= rowValue && rowValue <= value[1];
  return passed;
};


export const date: FilterFn<unknown> = (row, columnId, value : Date) => {
  // filter by date range
  const rowValue = row.getValue(columnId) as Date;

  // compare the date range
  // case if no start date or end date is selected
  // case if start date is selected
  // case if end date is selected

  if (!value) {
    return true;
  }

  const passed = typeof rowValue?.getMonth === 'function' && new Date(value)?.toDateString() === rowValue?.toDateString();

  return passed;
};
