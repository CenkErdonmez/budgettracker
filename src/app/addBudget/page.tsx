import React from "react";
import BudgetForm from "@/components/BudgetForm";
import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
function Budget() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <ModeToggle />
        </header>
        <div className='flex flex-col justify-start items-start gap-4 p-4'>
          <BudgetForm />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export default Budget;

