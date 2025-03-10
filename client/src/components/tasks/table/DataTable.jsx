import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { flexRender } from "@tanstack/react-table";
import { Loader } from "lucide-react";
import DottedSeperator from "@/components/common/DottedSeperator";
import DataFilters from "./DataFilters";
import TablePagination from "./TablePagination";
import { useState } from "react";

const DataTable = ({
  data,
  columns,
  loading,
  pagination,
  setPageNumber,
  setPageSize,
  filters,
  setFilters,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});

  const { totalCount, pageNumber, pageSize } = pagination || {};

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="block w-full lg:flex lg:items-center lg:justify-between">
        <DataFilters
          table={table}
          loading={loading}
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="my-4">
        <DottedSeperator />
      </div>

      <div className={`rounded-md ${loading ? "border-none" : "border"}`}>
        {loading ? (
          <Loader className="animate-spin mx-auto size-8" />
        ) : (
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getPrePaginationRowModel().rows?.length ? (
                table.getPrePaginationRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      <div className="mt-4">
        {!loading && (
          <TablePagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            setPageNumber={setPageNumber}
            setPageSize={setPageSize}
          />
        )}
      </div>
    </div>
  );
};
export default DataTable;
