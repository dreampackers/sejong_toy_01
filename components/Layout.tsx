import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  onHistoryClick?: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onHistoryClick }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center">
      <header className="w-full bg-[#005EB8] text-white py-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 max-w-3xl flex justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => window.location.reload()}>
             {/* Simple Icon representing document/government */}
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-blue-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0012 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75z" />
            </svg>
            <div>
              <h1 className="text-lg md:text-xl font-bold tracking-tight">세종시교육청</h1>
              <p className="text-xs md:text-sm text-blue-100 opacity-90">민원 자동 분류 시스템</p>
            </div>
          </div>
          
          {onHistoryClick && (
            <button 
                onClick={onHistoryClick}
                className="flex items-center space-x-1 px-3 py-1.5 bg-[#004a94] rounded-lg hover:bg-[#003d7a] transition-colors text-sm font-medium border border-blue-400/30"
            >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>처리 이력</span>
            </button>
          )}
        </div>
      </header>
      <main className="w-full max-w-3xl px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="w-full py-4 text-center text-slate-400 text-xs">
        &copy; {new Date().getFullYear()} Sejong City Office of Education. Powered by Google Gemini.
      </footer>
    </div>
  );
};

export default Layout;