import { AppSidebar } from "@/components/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/ThemeChanger";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Banknote, TrendingUp, TrendingDown } from "lucide-react";
export default function Page() {
  const cardElements = [
    {
      title: "Toplam Bütçe",
      icon: BarChart,
      description: `1000 TL`,
    },
    {
      title: "Gelir",
      icon: TrendingUp,
      description: `1000 TL`,
    },
    {
      title: "Gider",
      icon: TrendingDown,
      description: `1000 TL`,
    },
  ];
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className='flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4'>
          <SidebarTrigger className='-ml-1' />
          <ModeToggle />
        </header>
        <div className='flex flex-1 flex-col gap-4 p-4'>
          <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
            {cardElements.map((card, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className='flex items-center gap-2'>
                    <card.icon
                      className={
                        card.title === "Toplam Bütçe"
                          ? "text-blue-500"
                          : card.title === "Gelir"
                          ? "text-green-500"
                          : "text-red-500"
                      }
                    />
                    {card.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription
                    className={`flex items-center gap-2 ${
                      card.title === "Toplam Bütçe"
                        ? "text-blue-500"
                        : card.title === "Gelir"
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    <Banknote /> {card.description}{" "}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

