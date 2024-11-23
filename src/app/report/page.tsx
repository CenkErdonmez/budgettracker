import React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
import { Charts } from "@/components/Charts";
function Reports() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <ModeToggle />
        </header>
        <div className='flex w-full flex-col justify-start items-start gap-4 p-4'>
          <Charts />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Reports;

