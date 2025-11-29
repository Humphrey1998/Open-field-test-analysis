import React from 'react';
import ReactMarkdown from 'react-markdown';
import { AnalysisReport } from '../types';

interface AnalysisReportViewProps {
  report: AnalysisReport;
  onAnalyze: () => void;
}

const AnalysisReportView: React.FC<AnalysisReportViewProps> = ({ report, onAnalyze }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50 rounded-t-xl flex justify-between items-center">
        <h2 className="font-bold text-slate-700 flex items-center gap-2">
          <i className="fas fa-robot text-purple-500"></i> 智能分析报告
        </h2>
        <button 
          onClick={onAnalyze}
          disabled={report.loading}
          className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all flex items-center gap-2 ${
            report.loading 
            ? 'bg-slate-200 text-slate-500 cursor-not-allowed' 
            : 'bg-purple-600 hover:bg-purple-700 text-white hover:shadow-md'
          }`}
        >
          {report.loading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> 分析中...
            </>
          ) : (
            <>
              <i className="fas fa-magic"></i> 开始分析
            </>
          )}
        </button>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {report.markdown ? (
          <div className="prose prose-sm prose-slate max-w-none">
             <ReactMarkdown>{report.markdown}</ReactMarkdown>
             {report.timestamp && (
               <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400 text-right">
                 生成时间: {new Date(report.timestamp).toLocaleString()}
               </div>
             )}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center text-2xl text-slate-300">
              <i className="fas fa-file-alt"></i>
            </div>
            <p className="text-sm">点击右上角按钮生成基于当前数据的AI分析报告</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisReportView;
