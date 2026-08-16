"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  ColumnFiltersState,
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
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  searchPlaceholder?: string;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });

  return (
    <div className="space-y-4">
      {searchKey && (
        <div className="flex max-w-sm items-center gap-2 rounded-xl border border-surface-sunken bg-surface-card px-3.5 py-2 text-sm transition-colors focus-within:border-brand-orange">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            placeholder={searchPlaceholder}
            value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn(searchKey)?.setFilterValue(event.target.value)}
            className="w-full border-none bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground focus:ring-0"
          />
        </div>
      )}

      <div className="overflow-hidden rounded-2xl border border-surface-sunken bg-surface-card shadow-sm">
        <Table>
          <TableHeader className="border-b border-surface-sunken bg-surface-base">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="font-semibold text-muted-foreground">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row, index) => (
                <motion.tr
                  key={row.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  data-state={row.getIsSelected() && "selected"}
                  className="border-b border-surface-sunken transition-colors hover:bg-surface-sunken/40 data-[state=selected]:bg-surface-sunken"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </motion.tr>
              ))
            ) : (
              <TableRow className="hover:bg-transparent">
                <TableCell colSpan={columns.length} className="h-32 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface-sunken">
                      <Search className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">
                      No results found.
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-end space-x-3 py-2">
        <button
          className="rounded-xl border border-surface-sunken bg-surface-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-surface-sunken active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
        >
          Previous
        </button>
        <button
          className="rounded-xl border border-surface-sunken bg-surface-card px-4 py-2 text-xs font-semibold text-foreground shadow-sm transition-all hover:bg-surface-sunken active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
        >
          Next
        </button>
      </div>
    </div>
  );
}
