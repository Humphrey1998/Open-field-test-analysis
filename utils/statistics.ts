import { MouseData, StatsSummary, MetricType, GroupData } from '../types';

export const calculateStats = (data: number[]): StatsSummary => {
  const n = data.length;
  if (n === 0) return { mean: 0, sem: 0, n: 0, stdDev: 0 };

  const sum = data.reduce((a, b) => a + b, 0);
  const mean = sum / n;

  const variance = data.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n > 1 ? n - 1 : 1);
  const stdDev = Math.sqrt(variance);
  const sem = stdDev / Math.sqrt(n);

  return { mean, sem, n, stdDev };
};

export const getMetricDataForGroup = (group: GroupData, metric: MetricType): number[] => {
  return group.mice.map(mouse => mouse.values[metric]);
};
