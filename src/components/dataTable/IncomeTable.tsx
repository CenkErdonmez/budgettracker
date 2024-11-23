import React from "react";
import { DataTable } from "./data_table";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "../ui/button";
export type Income = {
  id: number;
  amount: number;
  category: string;
  date: string;
  description: string | null;
  type: string;
};
function IncomeTable({ data }: { data: Income[] }) {
  const columns: ColumnDef<Income>[] = [
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
      accessorKey: "description",
      header: "Açıklama",
    },
  ];
  return <DataTable columns={columns} data={data} />;
}

export default IncomeTable;

