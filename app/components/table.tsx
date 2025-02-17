import React from 'react';

interface TableProps<T> {
  data: T[];
  highlightedId?: string;
  idField?: keyof T;
  excludeFields?: string[];
}

export const DynamicTable = <T extends Record<string, any>>({
  data,
  highlightedId,
  idField = '_id',
  excludeFields = []
}: TableProps<T>) => {
  if (!data.length) return null;

  // Get column headers from the first data item
  const columns = Object.keys(data[0]).filter(key => !excludeFields.includes(key));

  // Function to format header text
  const formatHeader = (header: string) => {
    return header
      .replace(/([A-Z])/g, ' $1') // Add space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .trim()
      .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize first letter of each word
  };

  // Function to format cell content
  const formatCell = (value: any) => {
    if (value === null || value === undefined) return '-';
    if (typeof value === 'boolean') return value ? 'Yes' : 'No';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-800">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider opacity-75"
              >
                {formatHeader(column)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
          {data.map((item) => (
            <tr
              key={String(item[idField])}
              className={`
                ${highlightedId === item[idField] ? 'bg-blue-50/50 dark:bg-blue-900/20' : ''}
                hover:bg-gray-50/50 dark:hover:bg-gray-800/50
              `}
            >
              {columns.map((column) => (
                <td
                  key={column}
                  className="whitespace-nowrap px-6 py-4 text-sm"
                >
                  {formatCell(item[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
