export async function getAnalyticsClient(period) {
  const res = await fetch(`/api/analytics?period=${period}`);
  return res.json();
}
