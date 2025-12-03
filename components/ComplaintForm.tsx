import React, { useState } from 'react';
import { ComplaintData } from '../types';

interface ComplaintFormProps {
  onSubmit: (data: ComplaintData) => void;
  isLoading: boolean;
}

const ComplaintForm: React.FC<ComplaintFormProps> = ({ onSubmit, isLoading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;
    onSubmit({ title, content });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="block text-sm font-semibold text-slate-700">
          민원 제목
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="예: 급식 위생 관련 문의드립니다."
          disabled={isLoading}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none disabled:bg-slate-50 disabled:text-slate-500"
          required
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="content" className="block text-sm font-semibold text-slate-700">
          민원 내용
        </label>
        <textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="상세한 민원 내용을 입력해주세요..."
          disabled={isLoading}
          rows={6}
          className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all outline-none resize-none disabled:bg-slate-50 disabled:text-slate-500"
          required
        />
      </div>

      <button
        type="submit"
        disabled={isLoading || !title.trim() || !content.trim()}
        className={`w-full py-3.5 px-6 rounded-lg font-bold text-white shadow-sm transition-all flex items-center justify-center space-x-2
          ${isLoading 
            ? 'bg-blue-400 cursor-not-allowed' 
            : 'bg-[#005EB8] hover:bg-[#004a94] active:transform active:scale-[0.98]'
          }`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>분석 중입니다...</span>
          </>
        ) : (
          <>
            <span>담당 부서 확인하기</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </>
        )}
      </button>
    </form>
  );
};

export default ComplaintForm;