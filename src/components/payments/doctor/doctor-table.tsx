"use client"
import { DoctorsPaymentsColumns } from "@/components/table/Columns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Transaction } from "@/types"
import { flexRender, getCoreRowModel, getPaginationRowModel, getSortedRowModel, SortingState, useReactTable } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { memo, useMemo, useState } from "react"
import MobileTransactionTable from "../shared/MobileTransaction"

const DoctorTransactionTable= memo(({data}:{data:Transaction[]}) => {
    const [sorting, setSorting] = useState<SortingState>([])
    const [searchQuery, setSearchQuery] = useState<string>("")
    const [typeFilter, setTypeFilter] = useState<string>("all")
  
    const filteredData = useMemo(() => {
        return data.filter((transaction) => {
            const matchesSearch =
                transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                transaction.counterparty?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                false;
    
            const matchesType = typeFilter === "all" || transaction.type === typeFilter;
    
            return matchesSearch && matchesType;
        });
    }, [data, searchQuery, typeFilter]); 
  
 console.log("rerendering")
  
    const table = useReactTable({
      data: filteredData,
      columns: DoctorsPaymentsColumns,
      state: {
        sorting,
      },
      onSortingChange: setSorting,
      getCoreRowModel: getCoreRowModel(),
      getPaginationRowModel: getPaginationRowModel(),
      getSortedRowModel: getSortedRowModel(),
    })
  
    return (
      <div>
        <Card className="border-slate-200 dark:border-neutral-700 shadow-sm dark:shadow-slate-900/10 dark:bg-dark-400 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Your complete payment history</CardDescription>
              </div>
  
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5  h-4 w-4 text-neutral-400" />
                  <Input
                    type="search"
                    placeholder="Search transactions..."
                    className="pl-9 bg-white dark:bg-transparent dark:border-neutral-600 dark:focus:bg-dark-500/30 dark:focus:outline-none dark:focus-visible:ring-green-500"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
  
                <Select value={typeFilter} onValueChange={(value)=>setTypeFilter(value)}>
                  <SelectTrigger className="w-full sm:w-[180px] bg-white dark:bg-transparent dark:border-neutral-600 dark:focus:bg-dark-500/30 dark:focus:ring-green-500">
                    <SelectValue placeholder="Filter by type" />
                  </SelectTrigger>
                  <SelectContent className="bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-700 ">
                    <SelectItem value="all" className="dark:hover:bg-neutral-800">All Types</SelectItem>
                    <SelectItem value="payment" className="dark:hover:bg-neutral-800">Payments</SelectItem>
                    <SelectItem value="withdrawal" className="dark:hover:bg-neutral-800">Withdrawals</SelectItem>
                    <SelectItem value="refund" className="dark:hover:bg-neutral-800">Refunds</SelectItem>
                  </SelectContent>
                </Select>
  
                
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="hidden md:block rounded-md border border-slate-200 dark:border-neutral-700 overflow-hidden">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-dark-500/90">
                  {table.getHeaderGroups().map((headerGroup) => (
                    <TableRow
                      key={headerGroup.id}
                      className="hover:bg-slate-50 dark:hover:bg-dark-500/70 border-slate-200 dark:border-neutral-700"
                    >
                      {headerGroup.headers.map((header) => (
                        <TableHead key={header.id} className="text-slate-500 dark:text-white">
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows?.length ? (
                    table.getRowModel().rows.map((row) => (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        className="hover:bg-slate-50 dark:hover:bg-dark-500/30 border-slate-200 dark:border-slate-700"
                      >
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                        ))}
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={DoctorsPaymentsColumns.length} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

              {/* Mobile view - card-based layout */}
          <div className="md:hidden space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((transaction) => (
                <MobileTransactionTable key={transaction.id} transaction={transaction} />
              ))
            ) : (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">No results found.</div>
            )}
          </div>
  
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-slate-500 dark:text-neutral-400">
                Showing {table.getRowModel().rows.length} of {data.length} transactions
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="border-slate-200 dark:border-neutral-700 bg-white dark:bg-green-500 dark:disabled:bg-green-500/50"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="border-slate-200 dark:border-neutral-700 bg-white dark:bg-green-500 dark:disabled:bg-green-500/50"
                >
                  Next
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  },(prevProps, nextProps) => (prevProps.data.length === nextProps.data.length && prevProps.data.every((item, index) => item.id === nextProps.data[index].id)))

DoctorTransactionTable.displayName = "DoctorTransactionTable"

export default DoctorTransactionTable