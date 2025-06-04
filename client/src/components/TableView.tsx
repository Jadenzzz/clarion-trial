import type {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
} from "@tanstack/react-table";
import React, { useEffect, useRef, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useInView } from "motion/react";
import { useVirtualizer } from "@tanstack/react-virtual";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

export default function TableView<TData extends { id: string }>({
  data,
  columns,
  //   onRowClick,
  //   expandedContent,
  //   is_loading,
  fetchNextPage,
  hasNextPage,
  default_sort,
  row_height = 60,
  tooltip_ref,
  selected_row_ids,
  setSelectedRowIds,
}: {
  className?: string;
  data: TData[];
  columns: ColumnDef<TData>[];
  onRowClick?: (request: TData) => void;
  expandedContent?: (request: TData) => React.ReactNode;
  is_loading?: boolean;
  search_placeholder?: string;
  fetchNextPage?: () => void;
  hasNextPage?: boolean;
  default_sort?: {
    id: string;
    desc: boolean;
  };
  row_height?: number;
  tooltip_ref?: React.RefObject<HTMLDivElement | null>;
  selected_row_ids?: string[];
  setSelectedRowIds?: (ids: string[]) => void;
}) {
  // State
  const [sorting, setSorting] = useState<SortingState>([
    ...(default_sort ? [default_sort] : []),
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState({});
  const [expanded, setExpanded] = useState({});

  // Create the table instance
  const table = useReactTable({
    data: data,
    columns: columns,
    getCoreRowModel: getCoreRowModel(),
    // getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    // getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onExpandedChange: setExpanded,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
      expanded,
    },
  });

  const { rows } = table.getRowModel();
  const parentRef = useRef<HTMLDivElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => row_height,
    overscan: row_height + 10,
  });

  const ref = useRef<HTMLDivElement>(null);

  const inview = useInView(ref);

  useEffect(() => {
    if (inview && hasNextPage) {
      fetchNextPage?.();
    }
  }, [inview, hasNextPage, fetchNextPage]);

  return (
    <div className="relative rounded border overflow-auto min-h-[calc(100vh-380px)] max-h-[calc(100vh-380px)]">
      <div ref={parentRef} className="w-full h-full">
        {/* Table Header */}
        <div
          className="flex sticky top-0 z-30 bg-gray-100 border-b border-gray-300 "
          style={{
            width: table.getTotalSize(),
            height: "32px",
            maxWidth: table.getTotalSize(),
            minWidth: table.getTotalSize(),
          }}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex w-full">
              {headerGroup.headers.map((header, index) => (
                <div
                  key={header.id}
                  className={` w-full p-2 whitespace-nowrap font-medium text-sm text-black  border-gray-300 flex items-center transition-all  truncate ${
                    index === 0
                      ? "sticky left-0 z-40 bg-neutral-100 border-r border-b"
                      : ""
                  } ${
                    header.column.getCanSort()
                      ? "cursor-pointer select-none hover:bg-neutral-200"
                      : ""
                  }`}
                  style={{
                    width: header.getSize(),
                    height: "32px",
                    maxWidth: header.getSize(),
                    minWidth: header.getSize(),
                  }} // Reduced height
                  onClick={header.column.getToggleSortingHandler()}
                >
                  {selected_row_ids !== undefined &&
                    setSelectedRowIds !== undefined &&
                    index == 0 && (
                      <div className="w-4 h-4 mr-1  z-50"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}>
                        <Checkbox
                          checked={data.every((row: TData) =>
                            selected_row_ids.includes(row.id)
                          )}
                          onChange={(e) => {
                            e.stopPropagation();
                          }}
                          onCheckedChange={(checked) => {
                            setSelectedRowIds(
                              checked ? data.map((row: TData) => row.id) : []
                            );
                          }}
                          className="cursor-pointer z-50"
                        />
                      </div>
                    )}
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  {header.column.getCanSort() &&
                    (header.column.getIsSorted() === "asc" ? (
                      <ArrowUp className="h-3 w-3 ml-1.5 text-neutral-600" />
                    ) : header.column.getIsSorted() === "desc" ? (
                      <ArrowDown className="h-3 w-3 ml-1.5 text-neutral-600" />
                    ) : (
                      <ArrowUpDown className="h-3 w-3 ml-1.5 text-neutral-600" />
                    ))}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div
          style={{
            height: `${rowVirtualizer.getTotalSize()}px`,
            width: "100%",
            position: "relative",
            zIndex: 10,
          }}
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow, row_index) => {
            const row = rows[virtualRow.index];
            return (
              <div
                key={row_index}
                data-index={virtualRow.index}
                ref={rowVirtualizer.measureElement}
                className="flex w-full max-h-full hover:bg-gray-50 absolute top-0 left-0 group"
                style={{
                  height: `${virtualRow.size}px`,
                  transform: `translateY(${virtualRow.start}px)`,
                }}
              >
                {row.getVisibleCells().map((cell, index) => {
                  return (
                    <div
                      key={index}
                      className={`p-2 whitespace-nowrap overflow-hidden text-sm text-neutral-600 border-b border-gray-200 flex items-center  ${
                        index === 0
                          ? `sticky left-0 z-20 cursor-pointer  group-hover:bg-gray-50 bg-white border-r border-b`
                          : ""
                      }`}
                      style={{
                        width: cell.column.getSize(),
                        maxWidth: cell.column.getSize(),
                        minWidth: cell.column.getSize(),
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {!!tooltip_ref && (
          <div
            ref={tooltip_ref}
            className="fixed text-sm font-normal text-neutral-700 z-[100] hidden bg-white border border-neutral-200 rounded-lg p-2 shadow-lg max-w-[400px] whitespace-normal"
          />
        )}

        <div className="h-[1px]">
          <div>
            <div ref={ref} className="h-[1px]" />
          </div>
        </div>
      </div>
    </div>
  );
}
