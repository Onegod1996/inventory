import React from 'react';

interface TableProps {
  children: React.ReactNode;
  className?: string;
}

interface TableSectionProps {
  children: React.ReactNode;
  className?: string;
}

interface TableRowProps {
  children: React.ReactNode;
  className?: string;
}

interface TableCellProps {
  children: React.ReactNode;
  className?: string;
  header?: boolean;
}

export const Table: React.FC<TableProps> = ({ children, className = '' }) => (
  <div className="overflow-x-auto">
    <table className={`min-w-full divide-y divide-neutral-200 ${className}`}>
      {children}
    </table>
  </div>
);

export const TableHeader: React.FC<TableSectionProps> = ({ children, className = '' }) => (
  <thead className={`bg-neutral-50 ${className}`}>
    {children}
  </thead>
);

export const TableBody: React.FC<TableSectionProps> = ({ children, className = '' }) => (
  <tbody className={`divide-y divide-neutral-200 ${className}`}>
    {children}
  </tbody>
);

export const TableRow: React.FC<TableRowProps> = ({ children, className = '' }) => (
  <tr className={`${className}`}>
    {children}
  </tr>
);

export const TableCell: React.FC<TableCellProps> = ({ 
  children, 
  className = '', 
  header = false 
}) => {
  const baseClasses = 'px-4 py-3 text-sm';
  const cellClasses = header 
    ? `${baseClasses} font-medium text-neutral-500 uppercase tracking-wider text-left ${className}`
    : `${baseClasses} text-neutral-900 ${className}`;
  
  return header ? (
    <th className={cellClasses}>{children}</th>
  ) : (
    <td className={cellClasses}>{children}</td>
  );
};