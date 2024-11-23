import React from "react";
import { DataTable } from "./data_table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
export type Expense = {
  id: number;
  amout: number;
  category: string;
  date: string;
  description: string | null;
  type: string;
  category_limit: number;
};
function ExpenseTable({ data }: { data: Expense[] }) {
  const columns: ColumnDef<Expense>[] = [
    {
      accessorKey: "id",
      header: "Sıra",
    },
    {
      accessorKey: "category",
      header: "Kategori",
    },
    {
      accessorKey: "date",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tarih
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
    },
    {
      accessorKey: "amount",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Tutar
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(amount);

        return <div className='font-medium'>{formatted}</div>;
      },
    },
    {
      accessorKey: "category_limit",
      header: ({ column }) => {
        return (
          <Button
            variant='ghost'
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Limit
            <ArrowUpDown className='ml-2 h-4 w-4' />
          </Button>
        );
      },
      cell: ({ row }) => {
        const amount = parseFloat(row.getValue("amount"));
        const formatted = new Intl.NumberFormat("tr-TR", {
          style: "currency",
          currency: "TRY",
        }).format(amount);

        return <div className='font-medium'>{formatted}</div>;
      },
    },
    {
      accessorKey: "description",
      header: "Açıklama",
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

export default ExpenseTable;

