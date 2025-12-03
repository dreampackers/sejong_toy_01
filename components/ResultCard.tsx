import React from 'react';
import { AnalysisResult, Priority } from '../types';
import { DEPARTMENT_INFO } from '../constants';

interface ResultCardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const ResultCard: React.FC<ResultCardProps> = ({ result, onReset }) => {
  
  // Helper to get styles based on priority
  const getPriorityStyles = (priority: Priority) => {
    switch (priority) {
      case Priority.URGENT:
        return {
          badge: 'bg-red-100 text-red-800 border-red-200 ring-red-500/20',
        };
      case Priority.NORMAL:
        return {
          badge: 'bg-green-100 text-green-800 border-green-200 ring-green-500/20',
        };
      case Priority.LOW:
        return {
          badge: 'bg-blue-100 text-blue-800 border-blue-200 ring-blue-500/20',
        };
      default:
        return {
          badge: 'bg-gray-100 text-gray-800 border-gray-200 ring-gray-500/20',
        };
    }
  };

  const priorityStyles = getPriorityStyles(result.priority);

  // Helper for progress bar color
  const getProgressColor = (score: number) => {
    if (score >= 80) return 'bg-blue-600';
    if (score >= 50) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 animate-fade-in-up">
      {/* Header Section */}
      <div className="relative p-8 pb-6 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-2">
             <div className="flex items-center space-x-2">
                <span className="text-sm font-bold tracking-wider text-slate-400 uppercase">배정 담당 부서</span>
             </div>
             <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">
              {result.department}
             </h1>
             <p className="text-slate-500 font-medium">
               {DEPARTMENT_INFO[result.department as keyof typeof DEPARTMENT_INFO] || "부서 정보 없음"}
             </p>
          </div>

          <div className="flex-shrink-0">
            <div className={`inline-flex items-center px-4 py-2 rounded-full border shadow-sm ring-4 ring-opacity-50 ${priorityStyles.badge}`}>
              {result.priority === Priority.URGENT && (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2 animate-pulse">
                  <path fillRule="evenodd" d="M9.401 3.003c1.155-2 4.043-2 5.197 0l7.355 12.748c1.154 2-.29 4.5-2.599 4.5H4.645c-2.309 0-3.752-2.5-2.598-4.5L9.4 3.003zM12 8.25a.75.75 0 01.75.75v3.75a.75.75 0 01-1.5 0V9a.75.75 0 01.75-.75zm0 8.25a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
                </svg>
              )}
              <span className="font-extrabold text-lg">{result.priority}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-8 pt-6 space-y-8">
        {/* Confidence Progress Bar */}
        <div>
          <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-semibold text-slate-600">AI 분석 신뢰도</span>
            <span className="text-xl font-bold text-slate-900">{result.confidence}%</span>
          </div>
          <div className="w-full h-4 bg-slate-100 rounded-full overflow-hidden shadow-inner">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${getProgressColor(result.confidence)}`}
              style={{ width: `${result.confidence}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
             <span className="text-xs text-slate-400">0%</span>
             <span className="text-xs text-slate-400">100%</span>
          </div>
        </div>

        {/* Reason Section */}
        <div className="bg-slate-50 rounded-xl p-6 border border-slate-100">
           <h3 className="flex items-center text-slate-800 font-bold mb-3">
             <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="w-5 h-5 text-blue-600 mr-2">
               <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 2.625v-8.197A2.75 2.75 0 009 5.25v2.852c0 1.054-.423 2.062-1.17 2.755l-.656.613A.75.75 0 016.75 11h-1.5A2.25 2.25 0 003 13.25v.328a2.25 2.25 0 002.25 2.25h1.728a3.01 3.01 0 011.666.502l.704.422A2.25 2.25 0 0011.25 18h1.5zm-6-9v.75" />
             </svg>
             분류 사유
           </h3>
           <p className="text-slate-700 leading-relaxed">
             {result.reason}
           </p>
        </div>

        {/* Action Button */}
        <button 
          onClick={onReset}
          className="w-full py-4 bg-[#005EB8] text-white font-bold text-lg rounded-xl shadow-lg hover:bg-[#004a94] hover:shadow-xl transition-all transform active:scale-[0.99] flex items-center justify-center space-x-2"
        >
          <span>새로운 민원 처리하기</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ResultCard;