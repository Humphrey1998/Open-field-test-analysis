export enum MetricType {
  TOTAL_DISTANCE = '总距离 (Total Distance)',
  CENTER_TIME = '中央区时间 (Center Time)',
  CENTER_ENTRIES = '中央区进入次数 (Center Entries)',
  VELOCITY = '平均速度 (Velocity)',
  REARING = '站立次数 (Rearing)',
}

export interface MouseData {
  id: string;
  values: Record<MetricType, number>;
}

export interface GroupData {
  id: string;
  name: string;
  mice: MouseData[];
  color: string;
}

export interface StatsSummary {
  mean: number;
  sem: number;
  n: number;
  stdDev: number;
}

export interface AnalysisReport {
  markdown: string;
  loading: boolean;
  timestamp: number | null;
}
