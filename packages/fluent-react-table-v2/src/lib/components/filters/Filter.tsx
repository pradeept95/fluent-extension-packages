import { Column, RowData, Table } from '@tanstack/react-table';
import { FilterMultiSelectCheckbox } from './FilterMultiSelectCheckbox';
import { Field, Input, makeStyles } from '@fluentui/react-components';
import { FilterSelectRadio } from './FilterSelectRadio';
import { FilterNumberRange } from './FilterNumberRange';
import { FilterDateRange } from './FilterDateRange';
import { FilterDate } from './FilterDate';

const useFilterStyles = makeStyles({
  searchInput: {
    width: '100%',
  },
  searchInputField: {
    width: '100%',
    flexGrow: 1,
  },
  searchContainer: {
    display: 'flex',
    marginBottom: '8px',
    marginLeft: '10px',
    marginRight: '10px',
  },
});

export const Filter = <TItem extends RowData>({
  column,
  table,
}: {
  column: Column<TItem, RowData>;
  table: Table<TItem>;
}) => {
  const filterFunctionName = column.columnDef.filterFn;
  const styles = useFilterStyles();

  switch (filterFunctionName) {
    case 'arrIncludesSome':
      return <FilterMultiSelectCheckbox column={column} table={table} />;
    case 'arrIncludesAll':
    case 'arrIncludes':
      return <FilterSelectRadio column={column} table={table} />;
    case 'inNumberRange':
      return <FilterNumberRange column={column} table={table} />;

    case 'inDateRange': {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows?.find(x => Boolean(x.getValue(column.id)))?.getValue(column.id) as Date;

      if (typeof firstValue?.getMonth === 'function') {
        return <FilterDateRange column={column} table={table} />;
      }
      break;
    }

    case 'matchDate': {
      const firstValue = table
        .getPreFilteredRowModel()
        .flatRows[0]?.getValue(column.id) as Date;

      if (typeof firstValue.getMonth === 'function') {
        return <FilterDate column={column} table={table} />;
      }
      break;
    }
  }

  return (
    <div className={styles.searchContainer}>
      <Field size='small' className={styles.searchInputField}>
        <Input
          value={(column.getFilterValue() || '') as string}
          onChange={(_, data) => {
            column.setFilterValue(data.value);
          }}
          placeholder="Search Keyword..."
          size="small"
          className={styles.searchInput}
        />
      </Field>
    </div>
  );
};
