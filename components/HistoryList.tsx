import React from 'react';
import { HistoryItem, Priority } from '../types';

interface HistoryListProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onBack: () => void;
}

const HistoryList: React.FC<HistoryListProps> = ({ history, onSelect, onBack }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-slate-200 animate-fade-in">
        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
        </div>
        <p className="text-slate-500 mb-6 font-medium">저장된 민원 처리 이력이 없습니다.</p>
        <button 
            onClick={onBack} 
            className="px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center px-1">
         <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 text-[#005EB8]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            최근 처리 이력 <span className="text-sm font-normal text-slate-400 ml-1">(최근 5건)</span>
         </h3>
         <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-800 font-medium px-3 py-1 bg-slate-100 rounded-md hover:bg-slate-200 transition-colors">
           ✕ 닫기
         </button>
      </div>
      <div className="space-y-3">
        {history.map((item) => (
          <div 
            key={item.id}
            onClick={() => onSelect(item)}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-blue-300 hover:-translate-y-0.5 transition-all cursor-pointer group"
          >
            <div className="flex justify-between items-start mb-2">
              <span className={`px-2 py-0.5 rounded text-[11px] font-bold tracking-wide uppercase ${
                item.result.priority === Priority.URGENT ? 'bg-red-100 text-red-700 ring-1 ring-red-500/10' :
                item.result.priority === Priority.NORMAL ? 'bg-green-100 text-green-700 ring-1 ring-green-500/10' :
                'bg-blue-100 text-blue-700 ring-1 ring-blue-500/10'
              }`}>
                {item.result.priority}
              </span>
              <span className="text-xs text-slate-400 tabular-nums">
                {new Date(item.timestamp).toLocaleString('ko-KR', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <div className="flex justify-between items-end">
                <div>
                    <h4 className="font-bold text-slate-800 text-lg mb-1 group-hover:text-[#005EB8] transition-colors">
                    {item.result.department}
                    </h4>
                    <p className="text-slate-500 text-sm line-clamp-1 max-w-[240px]">
                    {item.complaint.title}
                    </p>
                </div>
                <div className="text-[#005EB8] opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                    </svg>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryList;