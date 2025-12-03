import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ComplaintForm from './components/ComplaintForm';
import ResultCard from './components/ResultCard';
import HistoryList from './components/HistoryList';
import { ComplaintData, AnalysisResult, HistoryItem } from './types';
import { classifyComplaint } from './services/geminiService';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  // View state: 'form' | 'result' | 'history'
  // Derived from: result !== null (shows result), isHistoryOpen (shows history), else form
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Load history on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('complaint_history');
    if (savedHistory) {
        try {
            setHistory(JSON.parse(savedHistory));
        } catch (e) {
            console.error("Failed to parse history", e);
        }
    }
  }, []);

  const saveToHistory = (complaint: ComplaintData, analysis: AnalysisResult) => {
    const newItem: HistoryItem = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        complaint,
        result: analysis
    };
    
    // Keep only last 5 items
    const updatedHistory = [newItem, ...history].slice(0, 5);
    setHistory(updatedHistory);
    localStorage.setItem('complaint_history', JSON.stringify(updatedHistory));
  };

  const handleComplaintSubmit = async (data: ComplaintData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setIsHistoryOpen(false);

    try {
      const analysis = await classifyComplaint(data.title, data.content);
      setResult(analysis);
      saveToHistory(data, analysis);
    } catch (err: any) {
      setError(err.message || "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setIsHistoryOpen(false);
    setError(null);
  };

  const handleHistoryToggle = () => {
    // If we are on result screen, toggle back to it? No, history is a separate "page" essentially.
    // If history is open, close it. If closed, open it.
    setIsHistoryOpen(!isHistoryOpen);
  };

  const handleHistorySelect = (item: HistoryItem) => {
      setResult(item.result);
      setIsHistoryOpen(false);
  };

  // Determine what to render
  let content;
  if (isHistoryOpen) {
      content = (
          <HistoryList 
            history={history} 
            onSelect={handleHistorySelect} 
            onBack={() => setIsHistoryOpen(false)} 
          />
      );
  } else if (result) {
      content = <ResultCard result={result} onReset={handleReset} />;
  } else {
      content = (
        <div className={`transition-opacity duration-300 ${isLoading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
            <ComplaintForm onSubmit={handleComplaintSubmit} isLoading={isLoading} />
        </div>
      );
  }

  return (
    <Layout onHistoryClick={handleHistoryToggle}>
      <div className="space-y-6">
        {!isHistoryOpen && !result && (
            <div className="text-center mb-8 animate-fade-in-down">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">어디에 문의해야 할지 고민되시나요?</h2>
                <p className="text-slate-500">
                    민원 내용을 입력하시면 AI가 내용을 분석하여<br className="md:hidden" /> 담당 부서를 자동으로 안내해 드립니다.
                </p>
            </div>
        )}

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r shadow-sm mb-6 animate-shake" role="alert">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700 font-medium">오류가 발생했습니다</p>
                <p className="text-sm text-red-600 mt-1">{error}</p>
              </div>
            </div>
          </div>
        )}

        {content}

        {/* Features/Info grid - only show on form view */}
        {!result && !isHistoryOpen && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 text-center text-sm text-slate-500 animate-fade-in-up">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 text-[#005EB8] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-700 block mb-1">빠른 분류</span>
                    Gemini 2.5 Flash 모델로 즉시 분석합니다.
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                    <div className="w-10 h-10 bg-blue-50 text-[#005EB8] rounded-full flex items-center justify-center mx-auto mb-3">
                         <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-700 block mb-1">정확한 배정</span>
                    교육청 업무 매뉴얼 기반으로 판단합니다.
                </div>
                <div className="p-4 bg-white rounded-lg shadow-sm border border-slate-100">
                     <div className="w-10 h-10 bg-blue-50 text-[#005EB8] rounded-full flex items-center justify-center mx-auto mb-3">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                        </svg>
                    </div>
                    <span className="font-semibold text-slate-700 block mb-1">우선순위 식별</span>
                    긴급한 민원을 놓치지 않도록 표시합니다.
                </div>
            </div>
        )}
      </div>
    </Layout>
  );
};

export default App;