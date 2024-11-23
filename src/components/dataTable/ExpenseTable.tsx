import React from "react";
import { DataTable } from "./data_table";
import { ColumnDef } from "@tanstack/react-table";
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
      accessorKey: "category_limit",
      header: "Limit",
    },
    {
      accessorKey: "date",
      header: "Tarih",
    },
    {
      accessorKey: "amount",
      header: "Amount",
    },
    {
      accessorKey: "description",
      header: "Açıklama",
    },
  ];

  return <DataTable columns={columns} data={data} />;
}

export default ExpenseTable;

