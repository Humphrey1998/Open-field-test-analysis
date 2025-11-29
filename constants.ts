import { GroupData, MetricType } from './types';

export const COLORS = [
  '#3b82f6', // blue-500
  '#ef4444', // red-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#8b5cf6', // violet-500
  '#ec4899', // pink-500
];

export const DEFAULT_GROUPS: GroupData[] = [
  {
    id: 'g1',
    name: 'Control (对照组)',
    color: COLORS[0],
    mice: [
      { id: 'c1', values: { [MetricType.TOTAL_DISTANCE]: 2500, [MetricType.CENTER_TIME]: 45, [MetricType.CENTER_ENTRIES]: 12, [MetricType.VELOCITY]: 5.2, [MetricType.REARING]: 15 } },
      { id: 'c2', values: { [MetricType.TOTAL_DISTANCE]: 2450, [MetricType.CENTER_TIME]: 50, [MetricType.CENTER_ENTRIES]: 14, [MetricType.VELOCITY]: 5.1, [MetricType.REARING]: 18 } },
      { id: 'c3', values: { [MetricType.TOTAL_DISTANCE]: 2600, [MetricType.CENTER_TIME]: 40, [MetricType.CENTER_ENTRIES]: 10, [MetricType.VELOCITY]: 5.5, [MetricType.REARING]: 12 } },
      { id: 'c4', values: { [MetricType.TOTAL_DISTANCE]: 2550, [MetricType.CENTER_TIME]: 48, [MetricType.CENTER_ENTRIES]: 13, [MetricType.VELOCITY]: 5.3, [MetricType.REARING]: 16 } },
    ]
  },
  {
    id: 'g2',
    name: 'Model (模型组)',
    color: COLORS[1],
    mice: [
      { id: 'm1', values: { [MetricType.TOTAL_DISTANCE]: 1500, [MetricType.CENTER_TIME]: 15, [MetricType.CENTER_ENTRIES]: 4, [MetricType.VELOCITY]: 3.1, [MetricType.REARING]: 5 } },
      { id: 'm2', values: { [MetricType.TOTAL_DISTANCE]: 1600, [MetricType.CENTER_TIME]: 20, [MetricType.CENTER_ENTRIES]: 5, [MetricType.VELOCITY]: 3.3, [MetricType.REARING]: 6 } },
      { id: 'm3', values: { [MetricType.TOTAL_DISTANCE]: 1450, [MetricType.CENTER_TIME]: 10, [MetricType.CENTER_ENTRIES]: 3, [MetricType.VELOCITY]: 3.0, [MetricType.REARING]: 4 } },
      { id: 'm4', values: { [MetricType.TOTAL_DISTANCE]: 1550, [MetricType.CENTER_TIME]: 18, [MetricType.CENTER_ENTRIES]: 6, [MetricType.VELOCITY]: 3.2, [MetricType.REARING]: 7 } },
    ]
  }
];

export const METRIC_OPTIONS = Object.values(MetricType);
