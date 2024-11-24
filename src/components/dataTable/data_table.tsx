"use client";
import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  SortingState,
  getSortedRowModel,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "../ui/button";
import { PDFDocument, rgb } from "pdf-lib";
import { saveAs } from "file-saver";
import fontkit from "@pdf-lib/fontkit";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  });
  const exportToPDF = async () => {
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);
    let page = pdfDoc.addPage([595.28, 841.89]);
    const { width, height } = page.getSize();

    const fontUrl =
      "https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Me5Q.ttf";
    const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer());
    const customFont = await pdfDoc.embedFont(fontBytes);

    const fontSize = 10;
    const margin = 50;
    const cellPadding = 5;
    let y = height - 50;

    page.drawText("Bütçe Listesi", {
      x: margin,
      y,
      size: 14,
      font: customFont,
      color: rgb(0.1, 0.6, 0.5),
    });
    y -= 30;

    const headers = table
      .getAllColumns()
      .filter((column) => column.getIsVisible())
      .map((column) => {
        const accessorKey = (column.columnDef as { accessorKey: string })
          .accessorKey;
        if (accessorKey === "date") return "Tarih";
        if (accessorKey === "amount") return "Tutar";
        const header = column.columnDef.header;
        return typeof header === "string" ? header : accessorKey || column.id;
      });

    const cellWidth = (width - 2 * margin) / headers.length;
    const cellHeight = fontSize + 2 * cellPadding;

    const fitTextInCell = (text: string, maxWidth: number) => {
      const textWidth = customFont.widthOfTextAtSize(text, fontSize);
      if (textWidth <= maxWidth - 2 * cellPadding) {
        return text;
      }
      const ellipsis = "...";
      let truncated = text;
      while (
        customFont.widthOfTextAtSize(truncated + ellipsis, fontSize) >
        maxWidth - 2 * cellPadding
      ) {
        truncated = truncated.slice(0, -1);
      }
      return truncated + ellipsis;
    };

    const centerTextInCell = (
      text: string,
      cellX: number,
      textWidth: number
    ) => {
      return cellX + (cellWidth - textWidth) / 2;
    };

    headers.forEach((header, index) => {
      const x = margin + index * cellWidth;
      page.drawRectangle({
        x,
        y: y - cellHeight,
        width: cellWidth,
        height: cellHeight,
        borderColor: rgb(0, 0, 0),
        borderWidth: 1,
      });

      const fittedText = fitTextInCell(header, cellWidth);
      const textWidth = customFont.widthOfTextAtSize(fittedText, fontSize);
      const textX = centerTextInCell(fittedText, x, textWidth);

      page.drawText(fittedText, {
        x: textX,
        y: y - fontSize - cellPadding,
        size: fontSize,
        font: customFont,
        color: rgb(0, 0, 0),
      });
    });
    y -= cellHeight;

    // Rows
    const rows = table.getRowModel().rows.map((row) =>
      row.getVisibleCells().map((cell) => {
        const value = cell.getValue();
        return typeof value === "string" || typeof value === "number"
          ? value.toString()
          : JSON.stringify(value);
      })
    );

    for (const row of rows) {
      row.forEach((cell, index) => {
        const x = margin + index * cellWidth;
        page.drawRectangle({
          x,
          y: y - cellHeight,
          width: cellWidth,
          height: cellHeight,
          borderColor: rgb(0, 0, 0),
          borderWidth: 1,
        });

        const fittedText = fitTextInCell(cell, cellWidth);
        const textWidth = customFont.widthOfTextAtSize(fittedText, fontSize);
        const textX = centerTextInCell(fittedText, x, textWidth);

        page.drawText(fittedText, {
          x: textX,
          y: y - fontSize - cellPadding,
          size: fontSize,
          font: customFont,
          color: rgb(0, 0, 0),
        });
      });
      y -= cellHeight;
      if (y < margin) {
        y = height - margin;
        page = pdfDoc.addPage([595.28, 841.89]);
      }
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "Bütçe_listesi.pdf");
  };

  return (
    <>
      <div className='flex items-center justify-between space-x-2 py-4'>
        <div className='flex items-center py-4'>
          <Input
            placeholder='Kategori ara...'
            value={
              (table.getColumn("category")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("category")?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
        </div>
        <div>
          <Button onClick={exportToPDF}>Dışa Aktar</Button>
        </div>
      </div>
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
                >
                  Kayıt Bulunamadı.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </>
  );
}

