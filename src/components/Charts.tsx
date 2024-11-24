"use client";
import React from "react";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Separator } from "@/components/ui/separator";
type BudgetItem = {
  type: string;
  category: string;
  description: string;
  amount: number;
  date: string;
};

const chartConfig = {
  income: {
    label: "Gelir",
    color: "hsl(var(--chart-1))",
  },
  expense: {
    label: "Gider",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;
type Grouped = {
  [key: string]: {
    income: number;
    expense: number;
    [key: string]: number;
  };
};
function groupByMonth(data: BudgetItem[]) {
  const grouped: Grouped = {};
  data.forEach((item) => {
    const [, month, year] = item.date.split("/").map(Number);
    const key = `${year}-${month.toString().padStart(2, "0")}`;
    if (!grouped[key]) {
      grouped[key] = { income: 0, expense: 0 };
    }
    grouped[key][item.type] += Number(item.amount);
  });
  return Object.entries(grouped)
    .sort(
      ([keyA], [keyB]) => new Date(keyA).getTime() - new Date(keyB).getTime()
    )
    .map(([key, value]) => ({
      month: key,
      ...value,
    }));
}

function groupByYear(data: BudgetItem[]) {
  const grouped: Grouped = {};
  data.forEach((item) => {
    const year = item.date.split("/")[2];
    if (!grouped[year]) {
      grouped[year] = { income: 0, expense: 0 };
    }
    grouped[year][item.type] += Number(item.amount);
  });
  return Object.entries(grouped)
    .sort(([keyA], [keyB]) => parseInt(keyA, 10) - parseInt(keyB, 10))
    .map(([key, value]) => ({
      year: key,
      ...value,
    }));
}

function calculatePercentageChange(
  current: number | undefined,
  previous: number | undefined
): string {
  if (previous === undefined || previous === 0) {
    if (current === undefined || current === 0) {
      return "No data";
    }
    return "+100%";
  }
  if (current === undefined || current === 0) {
    return "-100%";
  }
  if (current === previous) {
    return "0%";
  }
  const change = ((current - previous) / previous) * 100;
  return `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
}

export function Charts() {
  interface MonthlyData {
    income: number;
    expense: number;
    month: string;
  }
  interface YearlyData {
    income: number;
    expense: number;
    year: string;
  }
  const [loading, setLoading] = React.useState(true);
  const [monthlyData, setMonthlyData] = React.useState<MonthlyData[]>([]);
  const [yearlyData, setYearlyData] = React.useState<YearlyData[]>([]);
  const [monthlyIncomeChange, setMonthlyIncomeChange] = React.useState("N/A");
  const [monthlyExpenseChange, setMonthlyExpenseChange] = React.useState("N/A");
  const [yearlyIncomeChange, setYearlyIncomeChange] = React.useState("N/A");
  const [yearlyExpenseChange, setYearlyExpenseChange] = React.useState("N/A");

  React.useEffect(() => {
    const currentBudget = window.localStorage.getItem("budget");

    if (currentBudget) {
      const budget = JSON.parse(currentBudget) as BudgetItem[];

      const monthly = groupByMonth(budget);
      const yearly = groupByYear(budget);

      setMonthlyData(monthly);
      setYearlyData(yearly);

      if (monthly.length > 1) {
        const lastMonth = monthly[monthly.length - 1];
        const previousMonth = monthly[monthly.length - 2];
        setMonthlyIncomeChange(
          calculatePercentageChange(
            Number(lastMonth.income),
            Number(previousMonth.income)
          )
        );
        setMonthlyExpenseChange(
          calculatePercentageChange(
            Number(lastMonth.expense),
            Number(previousMonth.expense)
          )
        );
      }

      if (yearly.length > 1) {
        const lastYear = yearly[yearly.length - 1];
        const previousYear = yearly[yearly.length - 2];
        setYearlyIncomeChange(
          calculatePercentageChange(
            Number(lastYear.income),
            Number(previousYear.income)
          )
        );
        setYearlyExpenseChange(
          calculatePercentageChange(
            Number(lastYear.expense),
            Number(previousYear.expense)
          )
        );
      }
    }

    setLoading(false);
  }, []);

  const hasData = monthlyData.length > 0 || yearlyData.length > 0;

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex w-full flex-wrap gap-4 border rounded-md p-2'>
      <h2 className='text-xl font-bold'>Bütçe Grafikleri</h2>
      <Separator />
      <Tabs className='w-full' defaultValue='monthly'>
        <TabsList>
          <TabsTrigger value='monthly'>Aylık Grafik</TabsTrigger>
          <TabsTrigger value='yearly'>Yıllık Grafik</TabsTrigger>
        </TabsList>
        <div className='w-full'>
          <TabsContent className='w-full' value='monthly'>
            <Card className='w-full border-0'>
              <CardHeader>
                <CardTitle>Aylık Gelir-Gider Grafiği</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasData ? (
                  <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                    Henüz hiç bütçe verisi bulunmamaktadır.
                  </div>
                ) : (
                  <ChartContainer config={chartConfig}>
                    <BarChart data={monthlyData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey='month'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator='dashed' />}
                      />
                      <Bar
                        dataKey='income'
                        fill='var(--color-income)'
                        radius={4}
                      />
                      <Bar
                        dataKey='expense'
                        fill='var(--color-expense)'
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex flex-col gap-1'>
                  <div className='flex gap-2 font-medium leading-none'>
                    Gelirler:{" "}
                    {monthlyIncomeChange === "N/A" ? (
                      <span>Karşılaştırma yapılacak veri yok.</span>
                    ) : monthlyIncomeChange === "No data" ? (
                      <span>{monthlyIncomeChange}</span>
                    ) : monthlyIncomeChange.startsWith("-") ? (
                      <>
                        Gelirleriniz {monthlyIncomeChange} azaldı.{" "}
                        <TrendingDown className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Gelirleriniz {monthlyIncomeChange} arttı.{" "}
                        <TrendingUp className='h-4 w-4' />
                      </>
                    )}
                  </div>
                  <div className='flex gap-2 font-medium leading-none'>
                    Gider:{" "}
                    {monthlyExpenseChange === "N/A" ? (
                      <span>Karşılaştırma yapılacak veri yok.</span>
                    ) : monthlyExpenseChange === "No data" ? (
                      <span>{monthlyExpenseChange}</span>
                    ) : monthlyExpenseChange.startsWith("-") ? (
                      <>
                        Giderleriniz {monthlyExpenseChange} azaldı.{" "}
                        <TrendingDown className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Giderleriniz {monthlyExpenseChange} arttı.{" "}
                        <TrendingUp className='h-4 w-4' />
                      </>
                    )}
                  </div>
                </div>
                <div className='leading-none text-muted-foreground'>
                  Aylık gelirler ve giderlerini görebilirsiniz.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value='yearly'>
            <Card className='w-full border-0'>
              <CardHeader>
                <CardTitle>Yıllık Gelir-Gider Grafiği</CardTitle>
              </CardHeader>
              <CardContent>
                {!hasData ? (
                  <div className='flex h-[300px] items-center justify-center text-muted-foreground'>
                    Henüz hiç bütçe verisi bulunmamaktadır.
                  </div>
                ) : (
                  <ChartContainer config={chartConfig}>
                    <BarChart data={yearlyData}>
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey='year'
                        tickLine={false}
                        tickMargin={10}
                        axisLine={false}
                      />
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent indicator='dashed' />}
                      />
                      <Bar
                        dataKey='income'
                        fill='var(--color-income)'
                        radius={4}
                      />
                      <Bar
                        dataKey='expense'
                        fill='var(--color-expense)'
                        radius={4}
                      />
                    </BarChart>
                  </ChartContainer>
                )}
              </CardContent>
              <CardFooter className='flex-col items-start gap-2 text-sm'>
                <div className='flex flex-col gap-1'>
                  <div className='flex gap-2 font-medium leading-none'>
                    Gelir:{" "}
                    {yearlyIncomeChange === "N/A" ? (
                      <span>Karşılaştırma yapılacak veriler yok.</span>
                    ) : yearlyIncomeChange === "No data" ? (
                      <span>{yearlyIncomeChange}</span>
                    ) : yearlyIncomeChange.startsWith("-") ? (
                      <>
                        Gelirleriniz {yearlyIncomeChange} azaldı.{" "}
                        <TrendingDown className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Gelirleriniz {yearlyIncomeChange} arttı.{" "}
                        <TrendingUp className='h-4 w-4' />
                      </>
                    )}
                  </div>
                  <div className='flex gap-2 font-medium leading-none'>
                    Gider:{" "}
                    {yearlyExpenseChange === "N/A" ? (
                      <span>Karşılaştırma yapılacak veriler yok.</span>
                    ) : yearlyExpenseChange === "No data" ? (
                      <span>{yearlyExpenseChange}</span>
                    ) : yearlyExpenseChange.startsWith("-") ? (
                      <>
                        Giderleriniz {yearlyExpenseChange} azaldı.{" "}
                        <TrendingDown className='h-4 w-4' />
                      </>
                    ) : (
                      <>
                        Giderleriniz {yearlyExpenseChange} arttı.{" "}
                        <TrendingUp className='h-4 w-4' />
                      </>
                    )}
                  </div>
                </div>
                <div className='leading-none text-muted-foreground'>
                  Yıllık gelirler ve giderlerini görebilirsiniz.
                </div>
              </CardFooter>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

