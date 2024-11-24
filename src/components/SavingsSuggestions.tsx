"use client";

import React from "react";
import { analyzeBudgetAndGetSuggestions } from "@/lib/savingsAnalyzer";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Lightbulb, ChevronDown, ChevronUp } from "lucide-react";

const INITIAL_SUGGESTIONS_LIMIT = 3;

export function SavingsSuggestions() {
  const [suggestions, setSuggestions] = React.useState<string[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAll, setShowAll] = React.useState(false);

  React.useEffect(() => {
    try {
      const budget = localStorage.getItem("budget");
      if (budget) {
        const parsedBudget = JSON.parse(budget);
        const budgetSuggestions = analyzeBudgetAndGetSuggestions(parsedBudget);
        setSuggestions(budgetSuggestions);
      } else {
        setSuggestions(["Henüz bütçe verisi bulunmamaktadır."]);
      }
    } catch (error) {
      console.error("Error analyzing budget:", error);
      setSuggestions(["Bütçe analizi sırasında bir hata oluştu."]);
    } finally {
      setLoading(false);
    }
  }, []);

  const displayedSuggestions = showAll
    ? suggestions
    : suggestions.slice(0, INITIAL_SUGGESTIONS_LIMIT);

  const hasMoreSuggestions = suggestions.length > INITIAL_SUGGESTIONS_LIMIT;

  if (loading) {
    return (
      <Card className='w-full'>
        <CardContent className='p-4'>Yükleniyor...</CardContent>
      </Card>
    );
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='flex items-center gap-2 text-lg'>
          <Lightbulb className='h-5 w-5' />
          Tasarruf Önerileri
        </CardTitle>
      </CardHeader>
      <CardContent className='space-y-4'>
        <ul className='space-y-2'>
          {displayedSuggestions.map((suggestion, index) => (
            <li
              key={index}
              className='flex items-start gap-2 text-sm text-muted-foreground'
            >
              <span className='mt-0.5'>•</span>
              {suggestion}
            </li>
          ))}
        </ul>

        {hasMoreSuggestions && (
          <Button
            variant='ghost'
            className='w-full'
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? (
              <span className='flex items-center gap-2'>
                Daha Az Göster <ChevronUp className='h-4 w-4' />
              </span>
            ) : (
              <span className='flex items-center gap-2'>
                {suggestions.length - INITIAL_SUGGESTIONS_LIMIT} Öneri Daha
                <ChevronDown className='h-4 w-4' />
              </span>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}

