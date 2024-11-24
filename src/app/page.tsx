import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
import Cards from "@/components/Cards";
import Tables from "@/components/Tables";
import { Separator } from "@/components/ui/separator";
import { Suspense } from "react";
import { ClearDataDialog } from "@/components/ClearDataDialog";
export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='w-3/4 md:w-full'>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <div className='flex items-center gap-2'>
            <SidebarTrigger className='-ml-1' />
            <ClearDataDialog />
          </div>
          <ModeToggle />
        </header>
        <div className='flex flex-col gap-4 p-4'>
          <Cards />
          <div className='flex w-full flex-col justify-start items-start gap-4 p-4'>
            <Separator />
            <Suspense fallback={<div>Loading...</div>}>
              <Tables />
            </Suspense>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

