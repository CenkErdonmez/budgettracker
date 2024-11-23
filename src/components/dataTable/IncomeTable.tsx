import React from "react";
import { DataTable } from "./data_table";
import { ColumnDef } from "@tanstack/react-table";
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

export default IncomeTable;

