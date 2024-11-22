"use client";
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Banknote, TrendingUp, TrendingDown } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
function Cards() {
  const totalBalance = useSelector(
    (state: RootState) => state.budget.totalBalance
  );
  const totalIncome = useSelector(
    (state: RootState) => state.budget.totalIncome
  );
  const totalExpense = useSelector(
    (state: RootState) => state.budget.totalExpense
  );
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
    <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
      {cardElements.map((card, index) => (
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
      ))}
    </div>
  );
}

export default Cards;

