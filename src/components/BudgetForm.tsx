"use client";
import React from "react";
import { z } from "zod";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import CategoryForm from "./CategoryForm";

interface CategoryItem {
  type: string;
  category: string;
  category_limit: string;
}

interface BudgetItem {
  id: string;
  type: string;
  category: string;
  amount: string;
  description?: string;
  date: string;
  createdAt: string;
}

interface CategoryTotal {
  spent: number;
  limit: number;
  remaining: number;
  percentageUsed: number;
}

const StorageKeys = {
  CATEGORIES: "categories",
  BUDGET: "budget",
  CATEGORY_TOTALS: "category_totals",
} as const;

function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

function getCategoryLimit(category: string): number {
  const categories = localStorage.getItem(StorageKeys.CATEGORIES);
  if (!categories) return 0;

  const parsedCategories: CategoryItem[] = JSON.parse(categories);
  const categoryItem = parsedCategories.find(
    (item) => item.type === "expense" && item.category === category
  );

  return categoryItem ? Number(categoryItem.category_limit) : 0;
}

function calculateCategoryTotal(category: string): CategoryTotal {
  const limit = getCategoryLimit(category);
  const budgetData = localStorage.getItem(StorageKeys.BUDGET);

  if (!budgetData) {
    return {
      spent: 0,
      limit,
      remaining: limit,
      percentageUsed: 0,
    };
  }

  const budget: BudgetItem[] = JSON.parse(budgetData);
  const spent = budget
    .filter((item) => item.type === "expense" && item.category === category)
    .reduce((total, item) => total + Number(item.amount), 0);

  const remaining = limit - spent;
  const percentageUsed = (spent / limit) * 100;

  return {
    spent,
    limit,
    remaining,
    percentageUsed,
  };
}

function updateCategoryTotals(category: string): void {
  const totals = calculateCategoryTotal(category);
  const currentTotals = localStorage.getItem(StorageKeys.CATEGORY_TOTALS);
  const allTotals = currentTotals ? JSON.parse(currentTotals) : {};

  allTotals[category] = totals;
  localStorage.setItem(StorageKeys.CATEGORY_TOTALS, JSON.stringify(allTotals));
}

function BudgetForm() {
  const [incomeOptions, setIncomeOptions] = React.useState<string[]>([]);
  const [expenseOptions, setExpenseOptions] = React.useState<string[]>([]);
  const [limitWarning, setLimitWarning] = React.useState<string>("");
  const [currentCategoryTotal, setCurrentCategoryTotal] =
    React.useState<CategoryTotal | null>(null);

  const formSchema = z
    .object({
      type: z.string({
        required_error: "Seçilmesi zorunlu alandır.",
      }),
      category: z.string({ required_error: "Seçilmesi zorunlu alandır." }),
      description: z.string().trim().optional(),
      amount: z.string({ required_error: "Girilmesi zorunlu alandır." }).trim(),
      date: z.date({
        required_error: "Seçilmesi zorunlu alandır.",
      }),
    })
    .superRefine((data, ctx) => {
      if (data.amount === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Girilmesi zorunlu alandır.",
          path: ["amount"],
        });
        return;
      }

      if (isNaN(Number(data.amount))) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sayı olmalıdır.",
          path: ["amount"],
        });
        return;
      }

      if (Number(data.amount) < 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Negatif olamaz.",
          path: ["amount"],
        });
        return;
      }

      if (data.type === "expense") {
        const categoryTotal = calculateCategoryTotal(data.category);
        const amount = Number(data.amount);
        const newTotal = categoryTotal.spent + amount;

        if (newTotal > categoryTotal.limit) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Kategori limitini aşıyor. Kalan: ${formatCurrency(
              categoryTotal.remaining
            )}`,
            path: ["amount"],
          });
        } else {
          const remainingAfterTransaction = categoryTotal.limit - newTotal;
          const percentageAfter = (newTotal / categoryTotal.limit) * 100;
          const formatedRemaining = formatCurrency(remainingAfterTransaction);
          if (percentageAfter > 80) {
            setLimitWarning(
              `Uyarı: İşlemden sonra ${formatedRemaining} limit kalacak (limitin %${(
                100 - percentageAfter
              ).toFixed(1)})`
            );
          } else {
            setLimitWarning("");
          }
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: "",
    },
  });

  const typeInput = useWatch({
    control: form.control,
    name: "type",
  });

  const categoryInput = useWatch({
    control: form.control,
    name: "category",
  });

  const router = useRouter();

  React.useEffect(() => {
    if (typeInput === "expense" && categoryInput) {
      const total = calculateCategoryTotal(categoryInput);
      setCurrentCategoryTotal(total);

      if (total.percentageUsed > 80) {
        setLimitWarning(
          `Dikkat: Bu kategoride ${total.remaining} limit kaldı (limitin %${(
            100 - total.percentageUsed
          ).toFixed(1)})`
        );
      } else {
        setLimitWarning("");
      }
    } else {
      setCurrentCategoryTotal(null);
      setLimitWarning("");
    }
  }, [typeInput, categoryInput]);

  React.useEffect(() => {
    if (typeInput) {
      form.setValue("category", "");
    }
  }, [typeInput, form]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const newItem: BudgetItem = {
      id: generateId(),
      ...values,
      date: format(values.date, "dd/MM/yyyy"),
      createdAt: new Date().toISOString(),
      amount: values.amount.replace(".", ""),
    };

    const currentBudget = localStorage.getItem(StorageKeys.BUDGET);
    const budget = currentBudget ? JSON.parse(currentBudget) : [];
    budget.push(newItem);
    localStorage.setItem(StorageKeys.BUDGET, JSON.stringify(budget));

    if (values.type === "expense") {
      updateCategoryTotals(values.category);
    }

    toast.success("İşlem başarıyla kaydedildi");
    router.push("/" + "?" + new URLSearchParams({ type: typeInput }));
    form.reset();
  }

  React.useEffect(() => {
    const categories = localStorage.getItem(StorageKeys.CATEGORIES);
    if (categories) {
      const parsedCategories: CategoryItem[] = JSON.parse(categories);
      const incomeSet = new Set<string>();
      const expenseSet = new Set<string>();

      parsedCategories.forEach((item) => {
        if (item.type === "income") {
          incomeSet.add(item.category);
        } else if (item.type === "expense") {
          expenseSet.add(item.category);
        }
      });

      setIncomeOptions(Array.from(incomeSet));
      setExpenseOptions(Array.from(expenseSet));
    }
  }, []);
  const formatCurrency = (value: number) => {
    const newValue = new Intl.NumberFormat("tr-TR", {
      style: "currency",
      currency: "TRY",
    }).format(value);
    return newValue;
  };
  return (
    <Card>
      <CardHeader>
        <div className='flex justify-between items-center'>
          <CardTitle>Gelir / Gider Ekle</CardTitle>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant='outline'>Kategori Ekle</Button>
            </DialogTrigger>
            <DialogContent className='sm:max-w-[425px]'>
              <CategoryForm />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='space-y-4 flex flex-col flex-wrap'
          >
            <FormField
              control={form.control}
              name='type'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Gelir / Gider Seç</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Gelir ve ya Gider seçimi yapınız' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='income'>Gelir</SelectItem>
                      <SelectItem value='expense'>Gider</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='category'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kategori Adı</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Kategori seçimi yapınız' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {typeInput === "income" ? (
                        incomeOptions.length > 0 ? (
                          incomeOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value='no-categories' disabled>
                            Henüz gelir kategorisi oluşturulmamış
                          </SelectItem>
                        )
                      ) : typeInput === "expense" ? (
                        expenseOptions.length > 0 ? (
                          expenseOptions.map((option) => (
                            <SelectItem key={option} value={option}>
                              {option}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value='no-categories' disabled>
                            Henüz gider kategorisi oluşturulmamış
                          </SelectItem>
                        )
                      ) : null}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Açıklama</FormLabel>
                  <FormControl>
                    <Input placeholder='Açıklama giriniz' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tutar</FormLabel>
                  <FormControl>
                    <Input placeholder='Tutar giriniz' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Tarih</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy")
                          ) : (
                            <span>Tarih seçiniz</span>
                          )}
                          <CalendarIcon className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {currentCategoryTotal && (
              <div className='text-sm space-y-1'>
                <div className='text-muted-foreground'>
                  Kategori Limiti: {formatCurrency(currentCategoryTotal.limit)}
                </div>
                <div className='text-muted-foreground'>
                  Harcanan: {formatCurrency(currentCategoryTotal.spent)} (
                  {currentCategoryTotal.percentageUsed.toFixed(1)}%)
                </div>
                <div className='font-medium'>
                  Kalan: {formatCurrency(currentCategoryTotal.remaining)}
                </div>
              </div>
            )}

            <div className='flex justify-start gap-2'>
              <Button type='submit'>Kaydet</Button>
            </div>

            {limitWarning && (
              <div className='text-sm text-yellow-600 font-medium'>
                {limitWarning}
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default BudgetForm;

