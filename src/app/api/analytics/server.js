"use server"
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server"

export async function getAnalytics({ period = '30d' }) {
  const { userId } = await auth();

  if (!userId) throw new Error("Unauthorized");

  const user = await prisma.user.findUnique({
    where: { clerkUserId: userId }
  });

  if (!user) throw new Error("User not Found!");

  const startDate = new Date();
  switch (period) {
    case "7d": startDate.setDate(startDate.getDate() - 7); break;
    case "15d": startDate.setDate(startDate.getDate() - 15); break;
    case "30d":
    default: startDate.setDate(startDate.getDate() - 30); break;
  }

  const entries = await prisma.entry.findMany({
    where: { userId: user.id, createdAt: { gte: startDate } },
    orderBy: { createdAt: 'asc' }
  });

  const moodData = entries.reduce((acc, entry) => {
    const date = entry.createdAt.toISOString().split('T')[0];
    if (!acc[date]) acc[date] = { totalScore: 0, count: 0 };
    acc[date].totalScore += entry.moodScore;
    acc[date].count += 1;
    return acc;
  }, {});

  const analyticsData = Object.entries(moodData).map(([date, data]) => ({
    date,
    averageScore: Number((data.totalScore / data.count).toFixed(1)),
    entryCount: data.count,
  }));

  const overallStats = {
    totalEntries: entries.length,
    averageScore:
      Number((entries.reduce((a, e) => a + e.moodScore, 0) / entries.length).toFixed(1)),
    mostFrequentMood:
      Object.entries(
        entries.reduce((acc, e) => {
          acc[e.mood] = (acc[e.mood] || 0) + 1;
          return acc;
        }, {})
      ).sort((a, b) => b[1] - a[1])[0]?.[0],
    dailyAverage: Number((entries.length / (period === "7d" ? 7 : period === "15d" ? 15 : 30)).toFixed(1)),
  };

  return {
    success: true,
    data: { timeline: analyticsData, stats: overallStats }
  };
}
