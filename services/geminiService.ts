import { GoogleGenAI } from "@google/genai";
import { GroupData, MetricType } from "../types";
import { calculateStats, getMetricDataForGroup } from "../utils/statistics";

const API_KEY = process.env.API_KEY || '';

export const generateAnalysisReport = async (
  groups: GroupData[],
  selectedMetrics: MetricType[]
): Promise<string> => {
  if (!API_KEY) {
    return "错误：未配置 API KEY。请确保环境变量中包含有效的 Google Gemini API Key。";
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  // Prepare a textual summary of the data for the AI
  let dataSummary = "实验数据摘要:\n";
  
  groups.forEach(group => {
    dataSummary += `\n组名: ${group.name} (样本量 n=${group.mice.length})\n`;
    selectedMetrics.forEach(metric => {
      const values = getMetricDataForGroup(group, metric);
      const stats = calculateStats(values);
      dataSummary += `  - ${metric}: Mean=${stats.mean.toFixed(3)}, SEM=${stats.sem.toFixed(3)}, SD=${stats.stdDev.toFixed(3)}\n`;
      // Adding subset of raw data helps AI context but keeping it brief to avoid token limits with large N
      const rawPreview = values.length > 20 ? values.slice(0, 20).join(', ') + '...' : values.join(', ');
      dataSummary += `    (原始数据预览: [${rawPreview}])\n`;
    });
  });

  const prompt = `
    你是一位专业的生物统计学和神经科学专家。请根据以下旷场试验（Open Field Test）的数据进行分析。

    ${dataSummary}

    请生成一份详细的中文分析报告（Markdown格式），包含以下部分：

    ### 1. 描述性统计总结
    简要描述各组在主要指标（总距离、中央区时间、平均速度）上的数值表现。

    ### 2. 两两比较显著性差异分析 (模拟推断)
    **重要**：请基于 Mean ± SEM 和样本量 n，对各组之间（特别是对照组与其他组）是否存在统计学显著差异进行逻辑推断。
    *   **必须使用 Markdown 表格** 展示比较结果。
    *   表格格式如下：
    
    | 对比组别 (Group A vs B) | 指标 (Metric) | 差异显著性预估 | 推断理由 (基于 Mean/SEM) |
    | :--- | :--- | :--- | :--- |
    | Control vs Model | 总距离 | *** (显著) | Mean差异极大且误差棒不重叠 |
    | ... | ... | ... | ... |
    
    *请注意：标注为“显著(p<0.05)”、“极显著(p<0.01)”或“不显著(ns)”。声明此为基于统计概量的AI估算。*

    ### 3. 行为学意义解读
    结合旷场试验原理分析：
    *   **焦虑样行为**：重点分析中央区时间 (Center Time) 和中央区进入次数。
    *   **运动探索能力**：重点分析总距离 (Total Distance) 和平均速度。
    
    ### 4. 结论
    简明扼要的结论。

    语气要求：严谨、学术、客观。
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "未能生成分析报告。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "生成报告时发生错误。请检查网络连接或 API Key。";
  }
};