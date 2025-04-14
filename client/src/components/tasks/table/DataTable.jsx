import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useState } from "react";
import { flexRender } from "@tanstack/react-table";
import TablePagination from "./TablePagination";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown, Loader } from "lucide-react";
import DataFilters from "../DataFilters";
import DottedSeperator from "@/components/common/DottedSeperator";
import TaskDetailsDilalog from "../details/TaskDetailsDilalog";

const DataTable = ({
  columns,
  data,
  pagination,
  setPageNumber,
  setPageSize,
  filterData,
  loading,
}) => {
  const [sorting, setSorting] = useState([]);
  const [columnFilters, setColumnFilters] = useState([]);
  const [columnVisibility, setColumnVisibility] = useState({});
  const [rowSelection, setRowSelection] = useState({});
  const { pageNumber, pageSize, totalCount } = pagination;
  const [openTaskDetailsDialog, setOpenTaskDetailsDialog] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
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
    <>
      <div className="space-y-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between flex-wrap">
          <DataFilters
            filterData={filterData}
            setPageNumber={setPageNumber}
            setPageSize={setPageSize}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                Columns
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter(
                  (column) => column.getCanHide() && column.id !== "action"
                )
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) =>
                        column.toggleVisibility(!!value)
                      }
                    >
                      {column.columnDef.meta?.label || column.id}
                    </DropdownMenuCheckboxItem>
                  );
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <DottedSeperator className="my-4" />
        {loading ? (
          <div className="w-full rounded-lg border h-[200px] flex flex-col items-center justify-center">
            <Loader className="!size-8 animate-spin" />
          </div>
        ) : (
          <div className="border rounded-md grid grid-cols-1 overflow-auto">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="px-4 py-2">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getPrePaginationRowModel().rows?.length ? (
                  table.getPrePaginationRowModel().rows.map((row) => (
                    <TableRow key={row.id} className="hover:bg-gray-100">
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          className="px-4 py-2 whitespace-nowrap"
                        >
                          {cell.column.id === "title" ? (
                            <span
                              className="font-medium cursor-pointer hover:underline transition"
                              onClick={() => {
                                setSelectedTaskId(row.original._id);
                                setOpenTaskDetailsDialog(true);
                              }}
                              title={row.original.title}
                            >
                              {row.original.title.length > 30
                                ? row.original.title.substring(0, 27) + "..."
                                : row.original.title}
                            </span>
                          ) : (
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
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
          </div>
        )}

        <div>
          <TablePagination
            pageNumber={pageNumber}
            pageSize={pageSize}
            totalCount={totalCount}
            setPageNumber={setPageNumber}
            setPageSize={setPageSize}
          />
        </div>
      </div>

      <TaskDetailsDilalog
        open={openTaskDetailsDialog}
        setOpen={setOpenTaskDetailsDialog}
        taskId={selectedTaskId}
      />
    </>
  );
};
export default DataTable;
