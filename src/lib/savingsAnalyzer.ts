interface BudgetItem {
  type: "income" | "expense";
  amount: string | number;
  category: string;
  date: string;
}

interface SavingsRule {
  condition: (data: BudgetItem[]) => boolean;
  message: string;
  priority: number;
}

export function analyzeBudgetAndGetSuggestions(budget: BudgetItem[]): string[] {
  if (!budget || budget.length === 0) {
    return [
      "Henüz yeterli veri bulunmamaktadır. Bütçe verilerinizi ekledikçe öneriler sunulacaktır.",
    ];
  }

  const totalIncome = budget
    .filter((item) => item.type === "income")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalExpense = budget
    .filter((item) => item.type === "expense")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const categoryTotals = budget
    .filter((item) => item.type === "expense")
    .reduce((acc, item) => {
      const category = item.category;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += Number(item.amount);
      return acc;
    }, {} as Record<string, number>);

  const rules: SavingsRule[] = [
    {
      condition: () => totalExpense > totalIncome * 0.9,
      message:
        "Harcamalarınız gelirinizin %90'ını aşıyor. Acil durum fonu oluşturmak için harcamalarınızı azaltmayı düşünün.",
      priority: 1,
    },
    {
      condition: () => totalExpense > totalIncome * 0.7,
      message:
        "Harcamalarınız gelirinizin %70'ini aşıyor. Tasarruf için iyi bir fırsat olabilir.",
      priority: 2,
    },
    ...Object.entries(categoryTotals).map(
      ([category, amount]): SavingsRule => ({
        condition: () => (amount / totalExpense) * 100 > 30,
        message: `"${category}" kategorisindeki harcamalarınız toplam giderlerinizin %${(
          (amount / totalExpense) *
          100
        ).toFixed(
          1
        )}'ini oluşturuyor. Bu kategoriyi gözden geçirmenizi öneririz.`,
        priority: 3,
      })
    ),
    {
      condition: () => totalIncome > totalExpense * 1.3,
      message:
        "Gelirinizin önemli bir kısmını biriktiriyorsunuz. Bu birikimleri yatırıma yönlendirmeyi düşünebilirsiniz.",
      priority: 4,
    },
    {
      condition: () => true,
      message:
        "Düzenli bütçe takibi yaparak tasarruf fırsatlarını daha iyi değerlendirebilirsiniz.",
      priority: 5,
    },
  ];

  const suggestions = rules
    .filter((rule) => rule.condition(budget))
    .sort((a, b) => a.priority - b.priority)
    .map((rule) => rule.message);

  return suggestions;
}

