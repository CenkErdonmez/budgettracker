"use client";
import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const [loading, setLoading] = React.useState(true);
  const [currentTheme, setCurrentTheme] = React.useState("dark");
  const { setTheme } = useTheme();
  const { theme } = useTheme();
  React.useEffect(() => {
    setCurrentTheme(theme || "dark");
    setLoading(false);
  });

  return (
    <>
      {currentTheme === "dark" ? (
        <Button onClick={() => setTheme("light")} variant='outline' size='icon'>
          <Sun />
        </Button>
      ) : (
        <Button onClick={() => setTheme("dark")} variant='outline' size='icon'>
          <Moon />
        </Button>
      )}
    </>
  );
}

