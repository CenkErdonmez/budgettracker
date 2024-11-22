"use client";
import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
function BudgetForm() {
  const formSchema = z.object({
    type: z.string({
      required_error: "Seçilmesi zorunlu alandır.",
    }),
    category: z.string().trim().min(1, {
      message: "Girilmesi zorunlu alandır.",
    }),
    category_limit: z
      .string({
        required_error: "Girilmesi zorunlu alandır.",
      })
      .refine((val) => !isNaN(Number(val)), {
        message: "Sayısal değer olmalıdır.",
      })
      .transform((val) => Number(val))
      .optional(),
    description: z.string().trim().optional(),
    amount: z
      .string({
        required_error: "Girilmesi zorunlu alandır.",
      })
      .refine((val) => !isNaN(Number(val)), {
        message: "Sayısal değer olmalıdır.",
      })
      .transform((val) => Number(val)),
    date: z.date({
      required_error: "Seçilmesi zorunlu alandır.",
    }),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "income",
      category: "",
      description: "",
      amount: 0,
      date: new Date(),
    },
  });
  const typeInput = useWatch({
    control: form.control,
    name: "type",
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values);
    form.reset();
  }
  return (
    <Dialog>
      <DialogTrigger className='border-2 rounded-md px-2 border-slate-700 dark:border-slate-400'>
        Gelir / Gider Ekle
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className='pb-4'>Gelir / Gider Ekle</DialogTitle>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='type'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gelir / Gider</FormLabel>
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
                    <FormLabel>Kategori</FormLabel>
                    <FormControl>
                      <Input placeholder='Kategori giriniz' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {typeInput === "expense" && (
                <FormField
                  control={form.control}
                  name='category_limit'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Limit</FormLabel>
                      <FormControl>
                        <Input placeholder='Yüzde giriniz' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
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
                    <FormLabel>Date of birth</FormLabel>
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
              <Button type='submit'>Submit</Button>
            </form>
          </Form>
          <DialogDescription></DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}

export default BudgetForm;

