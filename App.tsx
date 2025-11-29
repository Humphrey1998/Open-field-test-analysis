import React, { useState } from 'react';
import DataInput from './components/DataInput';
import Visualization from './components/Visualization';
import AnalysisReportView from './components/AnalysisReportView';
import { GroupData, MetricType, AnalysisReport } from './types';
import { DEFAULT_GROUPS } from './constants';
import { generateAnalysisReport } from './services/geminiService';

const App: React.FC = () => {
  const [groups, setGroups] = useState<GroupData[]>(DEFAULT_GROUPS);
  const [report, setReport] = useState<AnalysisReport>({
    markdown: '',
    loading: false,
    timestamp: null
  });

  const handleAnalyze = async () => {
    setReport(prev => ({ ...prev, loading: true }));
    try {
      // Analyze main metrics
      const metricsToAnalyze = [MetricType.TOTAL_DISTANCE, MetricType.CENTER_TIME, MetricType.VELOCITY];
      const markdown = await generateAnalysisReport(groups, metricsToAnalyze);
      setReport({
        markdown,
        loading: false,
        timestamp: Date.now()
      });
    } catch (e) {
      setReport({
        markdown: "分析失败，请稍后重试。",
        loading: false,
        timestamp: Date.now()
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
              <i className="fas fa-mouse"></i>
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-700 to-blue-500">
              BioStats AI <span className="text-slate-400 font-normal text-sm ml-2">旷场试验分析系统</span>
            </h1>
          </div>
          <a 
            href="https://github.com/google/generative-ai-js" 
            target="_blank" 
            rel="noreferrer"
            className="text-slate-400 hover:text-slate-600 transition-colors text-sm"
          >
            <i className="fab fa-google mr-1"></i> Powered by Gemini 2.5
          </a>
        </div>
      </header>

      {/* Main Content Grid */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Data Input (Span 4) */}
        <div className="lg:col-span-4 h-[600px] lg:h-auto lg:sticky lg:top-24 self-start">
           <DataInput groups={groups} setGroups={setGroups} />
        </div>

        {/* Right Column: Visualization & Analysis (Span 8) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Visualization groups={groups} metric={MetricType.TOTAL_DISTANCE} />
            <Visualization groups={groups} metric={MetricType.CENTER_TIME} />
            <Visualization groups={groups} metric={MetricType.VELOCITY} />
            <Visualization groups={groups} metric={MetricType.REARING} />
          </div>

          {/* AI Analysis Section */}
          <div className="h-[500px]">
            <AnalysisReportView report={report} onAnalyze={handleAnalyze} />
          </div>

        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          &copy; {new Date().getFullYear()} BioStats AI. Designed for Neuroscience Research.
          <br className="sm:hidden"/>
          <span className="hidden sm:inline"> • </span>
          Statistics are estimates. Always verify with standard statistical software.
        </div>
      </footer>
    </div>
  );
};

export default App;
