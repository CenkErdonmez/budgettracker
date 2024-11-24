"use client";

import * as React from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const storageItems = [
  { id: "budget", label: "Bütçe Verileri" },
  { id: "categories", label: "Kategoriler" },
  { id: "category_totals", label: "Kategori Toplamları" },
];

export function ClearDataDialog() {
  const [selectedItems, setSelectedItems] = React.useState<string[]>([]);
  const [open, setOpen] = React.useState(false);

  const handleClear = () => {
    if (selectedItems.length === 0) {
      toast.error("Lütfen temizlenecek verileri seçin");
      return;
    }

    selectedItems.forEach((item) => {
      localStorage.removeItem(item);
    });

    toast.success("Seçili veriler temizlendi");
    setOpen(false);
    setSelectedItems([]);

    // Reload the page after a short delay to reflect changes
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline' size='icon'>
          <Trash2 className='h-4 w-4' />
        </Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>Verileri Temizle</DialogTitle>
        </DialogHeader>
        <div className='grid gap-4 py-4'>
          {storageItems.map((item) => (
            <div key={item.id} className='flex items-center space-x-2'>
              <Checkbox
                id={item.id}
                checked={selectedItems.includes(item.id)}
                onCheckedChange={(checked) => {
                  setSelectedItems(
                    checked
                      ? [...selectedItems, item.id]
                      : selectedItems.filter((i) => i !== item.id)
                  );
                }}
              />
              <Label htmlFor={item.id}>{item.label}</Label>
            </div>
          ))}
        </div>
        <div className='flex justify-end'>
          <Button onClick={handleClear}>Temizle</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

