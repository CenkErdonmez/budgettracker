import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
import { Charts } from "@/components/Charts";
import DonutCharts from "@/components/DonutCharts";
import { ClearDataDialog } from "@/components/ClearDataDialog";

function Analysis() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <ClearDataDialog />
          </div>
          <ModeToggle />
        </header>
        <div className='grid gap-2 md:grid-cols-2 p-2 md:p-8 bg:background'>
          <Charts />
          <DonutCharts />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Analysis;

