import type { Table } from '@tanstack/react-table';
import * as xlsx from 'xlsx';

export function exportTableToCSV<TData = any>(
  /**
   * The table to export.
   * @type Table<TData>
   */
  table: Table<TData>,
  opts: {
    /**
     * The filename for the CSV file.
     * @default "table"
     * @example "tasks"
     */
    filename?: string;
    /**
     * The columns to exclude from the CSV file.
     * @default []
     * @example ["select", "actions"]
     */
    excludeColumns?: (keyof TData | 'select' | 'actions')[];

    /**
     * Whether to export only the selected rows.
     * @default false
     */
    onlySelected?: boolean;
  } = {},
): void {
  const {
    filename = 'table',
    excludeColumns = [],
    onlySelected = false,
  } = opts;

  // Retrieve headers (column names)
  const headers = table
    .getAllLeafColumns()

    .map(column => ({
      id: column.id,
      label: (column.columnDef.meta as any)?.label ?? column.id,
    }))
    .filter(item => item.label !== 'select' && item.label !== 'actions')
    .filter(id => !excludeColumns.includes(id as any));
  // Build CSV content
  const csvContent = [
    headers.map(header => header.label).join(','),
    ...(onlySelected
      ? table.getFilteredSelectedRowModel().rows
      : table.getRowModel().rows
    ).map(row =>
      headers
        .map(header => {
          let cellValue = row.getValue(header.id);
          if (cellValue === null || cellValue === undefined)
            return 'Chưa cập nhật';
          if (typeof cellValue === 'boolean')
            cellValue = cellValue ? 'Có' : 'Không';
          // Handle values that might contain commas or newlines
          return typeof cellValue === 'string'
            ? `"${cellValue.replace(/"/g, '""')}"`
            : cellValue;
        })
        .join(','),
    ),
  ].join('\n');

  // Create a Blob with CSV content
  const workbook = xlsx.read(csvContent, { type: 'string', raw: true });

  // Convert the workbook to a binary string
  const wbout = xlsx.write(workbook, { bookType: 'xlsx', type: 'binary' });

  // Create a Blob with the binary string
  const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });

  // Create a link and trigger the download
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.xlsx`);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function s2ab(s: string) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) {
    view[i] = s.charCodeAt(i) & 0xff;
  }
  return buf;
}
