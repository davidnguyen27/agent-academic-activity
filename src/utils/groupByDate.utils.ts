export const groupByCreatedAt = <T extends { createdAt?: string }>(items: T[], days: number = 30) => {
  const result: { date: string; count: number }[] = [];

  const now = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(now.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const count = items.filter((item) => {
      if (!item.createdAt) return false;
      return item.createdAt.startsWith(dateStr);
    }).length;

    result.push({ date: dateStr, count });
  }

  return result;
};
