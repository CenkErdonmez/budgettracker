import * as React from "react";
import { ArrowBigLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { Home, DollarSign, BarChart2 } from "lucide-react";
const data = {
  navMain: [
    {
      title: "Ana Sayfa",
      url: "/",
      icon: Home,
    },
    {
      title: "Gelir / Gider Ekle",
      url: "/addBudget",
      icon: DollarSign,
    },
    {
      title: "Raporlar ve Analizler",
      url: "/report",
      icon: BarChart2,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar>
      <SidebarHeader className='text-lg md:text-xl h-16 font-bold border-b'>
        <p className='p-2'>Bütçe Takip Uyguluması</p>
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <a
              className='flex justify-start items-center text-sm md:text-lg text-foreground'
              href={item.url}
            >
              <item.icon className='mr-2 h-4 w-4' />
              {item.title}
            </a>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

