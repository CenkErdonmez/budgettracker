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

export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className='w-3/4 md:w-full'>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <ModeToggle />
        </header>
        <div className='flex flex-col gap-4 p-4'>
          <Cards />
          <div className='flex w-full flex-col justify-start items-start gap-4 p-4'>
            <Separator />
            <Tables />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

