import * as React from "react";
import { ArrowBigLeft } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Ana Sayfa",
      url: "/",
    },
    {
      title: "Gelir / Gider Ekle",
      url: "/addBudget",
    },
    {
      title: "Raporlar ve Analizler",
      url: "/report",
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader className='text-lg md:text-xl font-bold pb-4'>
        Bütçe Takip Uyguluması
      </SidebarHeader>
      <SidebarContent>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <a
              className='flex justify-start items-center text-sm md:text-lg text-foreground'
              href={item.url}
            >
              <ArrowBigLeft /> {item.title}
            </a>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}

