import { useId, useState } from 'react';
import type { ReactNode } from 'react';
import './DataTable.css';

export interface Column<Row> {
  key: string;
  header: string;
  /** Cell content. Defaults to `String(row[key])`. */
  render?: (row: Row) => ReactNode;
  /** Value used for sorting. Defaults to `row[key]`. */
  sortValue?: (row: Row) => string | number;
  sortable?: boolean;
  align?: 'start' | 'end';
  /** The cell that names the row. Rendered as `<th scope="row">`. Exactly one column should set this. */
  isRowHeader?: boolean;
}

export type SortDirection = 'ascending' | 'descending';
export interface SortState {
  key: string;
  direction: SortDirection;
}

export interface DataTableProps<Row> {
  /** Visible title of the table. Also its accessible name. */
  caption: string;
  columns: Column<Row>[];
  rows: Row[];
  getRowId: (row: Row) => string;
  defaultSort?: SortState;
  /** Shown instead of the body when there are no rows. */
  emptyMessage?: string;
}

function valueOf<Row>(row: Row, col: Column<Row>): string | number {
  if (col.sortValue) return col.sortValue(row);
  const v = (row as Record<string, unknown>)[col.key];
  return typeof v === 'number' ? v : String(v ?? '');
}

/**
 * Native `<table>` with a `<caption>`, `<th scope="col">` headers and one `<th scope="row">` per row.
 * Sortable headers contain a real `<button>`, and the sorted column carries `aria-sort`.
 * A polite status message announces each sort change, because `aria-sort` alone is not announced
 * when it changes.
 *
 * The table scrolls sideways inside its own focusable region on narrow screens, so keyboard users
 * can scroll it. This is the one place the page is allowed to scroll in two directions (WCAG 1.4.10
 * exempts data tables).
 */
export function DataTable<Row>({ caption, columns, rows, getRowId, defaultSort, emptyMessage = 'No rows to show.' }: DataTableProps<Row>) {
  const captionId = useId();
  const [sort, setSort] = useState<SortState | undefined>(defaultSort);
  const [announcement, setAnnouncement] = useState('');

  const sortedRows = (() => {
    if (!sort) return rows;
    const col = columns.find((c) => c.key === sort.key);
    if (!col) return rows;
    const factor = sort.direction === 'ascending' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = valueOf(a, col);
      const bv = valueOf(b, col);
      if (typeof av === 'number' && typeof bv === 'number') return (av - bv) * factor;
      return String(av).localeCompare(String(bv), undefined, { numeric: true }) * factor;
    });
  })();

  const toggleSort = (col: Column<Row>) => {
    const direction: SortDirection = sort?.key === col.key && sort.direction === 'ascending' ? 'descending' : 'ascending';
    setSort({ key: col.key, direction });
    setAnnouncement(`Sorted by ${col.header}, ${direction}.`);
  };

  return (
    <div role="region" aria-labelledby={captionId} tabIndex={0} className="steady-table-wrap">
      <table className="steady-table">
        <caption id={captionId} className="steady-table__caption">
          {caption}
        </caption>
        <thead>
          <tr>
            {columns.map((col) => {
              const isSorted = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  aria-sort={isSorted ? sort.direction : undefined}
                  className={col.align === 'end' ? 'steady-table__end' : undefined}
                >
                  {col.sortable ? (
                    <button type="button" className="steady-table__sort" onClick={() => toggleSort(col)}>
                      {col.header}
                      <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false" className="steady-table__arrow">
                        <path d="M8 3v10M4 7l4-4 4 4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={isSorted && sort.direction === 'ascending' ? 1 : 0.35} />
                        <path d="M4 9l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" opacity={isSorted && sort.direction === 'descending' ? 1 : 0.35} />
                      </svg>
                    </button>
                  ) : (
                    col.header
                  )}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {sortedRows.length === 0 ? (
            <tr>
              <td colSpan={columns.length}>{emptyMessage}</td>
            </tr>
          ) : (
            sortedRows.map((row) => (
              <tr key={getRowId(row)}>
                {columns.map((col) => {
                  const content = col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '');
                  const className = col.align === 'end' ? 'steady-table__end' : undefined;
                  return col.isRowHeader ? (
                    <th key={col.key} scope="row" className={className}>
                      {content}
                    </th>
                  ) : (
                    <td key={col.key} className={className}>
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))
          )}
        </tbody>
      </table>
      <div role="status" className="steady-vh">
        {announcement}
      </div>
    </div>
  );
}
