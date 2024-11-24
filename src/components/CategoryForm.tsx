"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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
import { toast } from "sonner";

function CategoryForm() {
  const formSchema = z
    .object({
      type: z.string({
        required_error: "Seçilmesi zorunlu alandır.",
      }),
      category: z
        .string({
          required_error: "Girilmesi zorunlu alandır.",
        })
        .min(1, {
          message: "Girilmesi zorunlu alandır.",
        })
        .trim(),
      category_limit: z.string().trim().optional(),
    })
    .superRefine((data, ctx) => {
      if (typeInput === "expense" && data.category_limit === "") {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Limit belirlemelisiniz.",
          path: ["category_limit"],
        });
      }
      if (
        typeInput === "expense" &&
        data.category_limit !== "" &&
        isNaN(Number(data.category_limit))
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Sayısal değer olmalıdır.",
          path: ["category_limit"],
        });
      }
      if (
        typeInput === "expense" &&
        data.category_limit !== "" &&
        Number(data.category_limit) <= 0
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Negatif bir sayi giremezsiniz.",
          path: ["category_limit"],
        });
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "",
      category: "",
      category_limit: "",
    },
  });
  const typeInput = useWatch({
    control: form.control,
    name: "type",
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const categories = window.localStorage.getItem("categories");
    if (categories) {
      const parsedCategories = JSON.parse(categories);
      const isDuplicate = parsedCategories.some(
        (category: any) =>
          category.type === values.type && category.category === values.category
      );
      if (isDuplicate) {
        toast.error("Bu kategori zaten mevcut");
        return;
      }
      parsedCategories.push(values);
      window.localStorage.setItem(
        "categories",
        JSON.stringify(parsedCategories)
      );
    } else {
      window.localStorage.setItem("categories", JSON.stringify([values]));
    }
    toast.success("Kategori Eklendi");
    form.reset();
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kategori Ekle</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
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
                      <Input placeholder='Limit giriniz' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <Button type='submit'>Ekle</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default CategoryForm;

