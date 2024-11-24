"use client";
import React from "react";
import { TrendingUp } from "lucide-react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface BudgetItem {
  id: string;
  type: "expense" | "income";
  category: string;
  description: string;
  amount: string;
  date: string;
  createdAt: string;
}

interface Category {
  type: "expense" | "income";
  category: string;
  category_limit: string;
}

interface CategoryTotal {
  spent: number;
  limit: number;
  remaining: number;
  percentageUsed: number;
}

interface CategoryTotals {
  [key: string]: CategoryTotal;
}

interface ChartDataItem {
  name: string;
  value: number;
  fill: string;
  percentageUsed?: number;
}

const ExpensePieChart: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [chartData, setChartData] = React.useState<ChartDataItem[]>([]);
  const [totalAmount, setTotalAmount] = React.useState<number>(0);
  const [categories, setCategories] = React.useState<Category[]>([]);

  React.useEffect(() => {
    const budget: BudgetItem[] = JSON.parse(
      localStorage.getItem("budget") || "[]"
    );
    const categories: Category[] = JSON.parse(
      localStorage.getItem("categories") || "[]"
    );
    const categoryTotals: CategoryTotals = JSON.parse(
      localStorage.getItem("category_totals") || "{}"
    );

    setCategories(categories.filter((cat) => cat.type === "expense"));

    if (selectedCategory === "all") {
      const expensesByCategory = budget
        .filter((item) => item.type === "expense")
        .reduce<Record<string, number>>((acc, curr) => {
          if (!acc[curr.category]) {
            acc[curr.category] = 0;
          }
          acc[curr.category] += Number(curr.amount);
          return acc;
        }, {});

      const data: ChartDataItem[] = Object.entries(expensesByCategory).map(
        ([category, amount], index) => ({
          name: category,
          value: amount,
          fill: `hsl(${(index * 137.5) % 360}, 70%, 50%)`,
        })
      );

      setChartData(data);
      setTotalAmount(data.reduce((sum, item) => sum + Number(item.value), 0));
    } else {
      const categoryTotal = categoryTotals[selectedCategory];
      if (categoryTotal) {
        setChartData([
          {
            name: "Harcanan Limit",
            value: categoryTotal.spent,
            fill: `hsl(${
              categoryTotal.percentageUsed > 80 ? "0" : "200"
            }, 70%, 50%)`,
          },
          {
            name: "Kalan Limit",
            value: categoryTotal.remaining,
            fill: "hsl(150, 70%, 50%)",
          },
        ]);
        setTotalAmount(categoryTotal.limit);
      }
    }
  }, [selectedCategory]);

  const chartConfig: ChartConfig = {
    value: {
      label: "Amount",
    },
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(amount);
  };

  return (
    <div className='flex w-full flex-col gap-4 border p-2'>
      <h2 className='text-xl font-bold'>Giderler Analizi</h2>
      <Select onValueChange={setSelectedCategory} value={selectedCategory}>
        <SelectTrigger className='w-full'>
          <SelectValue placeholder='Select a category' />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value='all'>Tüm Giderler</SelectItem>
          {categories.map((cat) => (
            <SelectItem key={cat.category} value={cat.category}>
              {cat.category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Card className='flex flex-col border-0'>
        <CardHeader className='items-center pb-0'>
          <CardTitle>
            {selectedCategory === "all"
              ? "Toplam Gider Miktarı"
              : `${selectedCategory}'ın Limit Kullanımı Oranı`}
          </CardTitle>
        </CardHeader>
        <CardContent className='flex-1 pb-0'>
          <ChartContainer
            config={chartConfig}
            className='mx-auto aspect-square max-h-[250px]'
          >
            <PieChart>
              <ChartTooltip />
              <Pie
                data={chartData}
                dataKey='value'
                nameKey='name'
                innerRadius={60}
                strokeWidth={5}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor='middle'
                          dominantBaseline='middle'
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className='fill-foreground text-3xl font-bold'
                          >
                            {formatAmount(totalAmount)}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className='fill-muted-foreground'
                          >
                            Toplam
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpensePieChart;

