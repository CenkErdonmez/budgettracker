import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
import Cards from "@/components/Cards";
import BudgetForm from "@/components/BudgetForm";

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <BudgetForm />
          <ModeToggle />
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <Cards />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

