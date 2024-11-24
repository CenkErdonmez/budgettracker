"use client";
import React, { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Banknote, TrendingUp, TrendingDown } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/app/store/store";
import {
  setTotalBalance,
  setTotalIncome,
  setTotalExpense,
  setLoading,
} from "@/app/store/budgetSlice";

function Cards() {
  const dispatch = useDispatch();
  const { totalBalance, totalIncome, totalExpense, loading } = useSelector(
    (state: RootState) => state.budget
  );

  useEffect(() => {
    const currentBudget = window.localStorage.getItem("budget");

    if (currentBudget) {
      const budget = JSON.parse(currentBudget);
      const income = budget
        .filter((item: { type: string }) => item.type === "income")
        .reduce(
          (acc: number, item: { amount: number }) => acc + Number(item.amount),
          0
        );
      const expense = budget
        .filter((item: { type: string }) => item.type === "expense")
        .reduce(
          (acc: number, item: { amount: number }) => acc + Number(item.amount),
          0
        );
      const balance = income - expense;
      dispatch(setTotalBalance(balance));
      dispatch(setTotalIncome(income));
      dispatch(setTotalExpense(expense));
    }

    dispatch(setLoading(false));
  }, [dispatch]);

  const cardElements = [
    {
      title: "Toplam Bütçe",
      icon: BarChart,
      description: `${totalBalance} TL`,
    },
    {
      title: "Gelir",
      icon: TrendingUp,
      description: `${totalIncome} TL`,
    },
    {
      title: "Gider",
      icon: TrendingDown,
      description: `${totalExpense} TL`,
    },
  ];

  return (
    <div className='grid auto-rows-min gap-4 md:grid-cols-3 '>
      {loading ? (
        <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
          <Skeleton className='h-10 w-full' />
        </div>
      ) : (
        cardElements.map((card, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className='flex items-center gap-2'>
                <card.icon
                  className={
                    card.title === "Toplam Bütçe"
                      ? "text-blue-500"
                      : card.title === "Gelir"
                      ? "text-green-500"
                      : "text-red-500"
                  }
                />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription
                className={`flex items-center gap-2 ${
                  card.title === "Toplam Bütçe"
                    ? "text-blue-500"
                    : card.title === "Gelir"
                    ? "text-green-500"
                    : "text-red-500"
                }`}
              >
                <Banknote /> {card.description}{" "}
              </CardDescription>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}

export default Cards;

