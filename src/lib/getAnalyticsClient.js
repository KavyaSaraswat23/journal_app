"use client";

export async function getAnalyticsClient(period = "30d") {
  const res = await fetch(`/api/analytics?period=${period}`);
  if (!res.ok) throw new Error("Failed to fetch analytics");
  return res.json();
}
