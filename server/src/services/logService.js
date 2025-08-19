import Log from "../models/Log.js";

export const getLogStatsService = async (seconds) => {
  const since = new Date(Date.now() - seconds * 1000);

  const logs = await Log.find({ timestamp: { $gte: since } });

  const total = logs.length;
  const counts = { INFO: 0, WARN: 0, ERROR: 0 };

  logs.forEach((log) => {
    counts[log.level] = (counts[log.level] || 0) + 1;
  });

  const errorRate = total > 0 ? (counts.ERROR / total) * 100 : 0;

  return {
    total,
    counts,
    errorRate: errorRate.toFixed(2),
  };
};