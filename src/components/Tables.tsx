"use client";
import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import IncomeTable from "./dataTable/IncomeTable";
import { Income } from "./dataTable/IncomeTable";
import ExpenseTable from "./dataTable/ExpenseTable";
import { Expense } from "./dataTable/ExpenseTable";
import { useSearchParams } from "next/navigation";
function Tables() {
  const [loading, setLoading] = React.useState(true);
  const [incomes, setIncomes] = React.useState([]);
  const [expenses, setExpenses] = React.useState([]);
  const searchParams = useSearchParams();
  const defaultType = searchParams.get("type");

  React.useEffect(() => {
    const currentBudget = window.localStorage.getItem("budget");

    if (currentBudget) {
      const budget = JSON.parse(currentBudget);
      setIncomes(
        budget
          .filter((item: { type: string }) => item.type === "income")
          .map((item: Income, index: number) => ({ ...item, id: index + 1 }))
      );
      setExpenses(
        budget
          .filter((item: { type: string }) => item.type === "expense")
          .map((item: Expense, index: number) => ({ ...item, id: index + 1 }))
      );
    }

    setLoading(false);
  }, []);

  return (
    <Tabs className='w-full' defaultValue={defaultType || "income"}>
      <TabsList>
        <TabsTrigger value='income'>Gelirler</TabsTrigger>
        <TabsTrigger value='expense'>Giderler</TabsTrigger>
      </TabsList>
      {loading ? (
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      ) : (
        <>
          <TabsContent className='w-full' value='income'>
            <IncomeTable data={incomes} />
          </TabsContent>
          <TabsContent value='expense'>
            <ExpenseTable data={expenses} />
          </TabsContent>
        </>
      )}
    </Tabs>
  );
}

export default Tables;

