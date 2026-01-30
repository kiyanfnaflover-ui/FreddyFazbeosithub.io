import React, { useState } from 'react';
import { searchFazgle, SearchResult } from '../services/geminiService';

const BrowserWindow: React.FC = () => {
  const [url, setUrl] = useState('http://www.fazgle.com/');
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<{summary: string, links: SearchResult[]} | null>(null);
  const [view, setView] = useState<'home' | 'results' | 'error'>('home');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setView('results');
    setIsSearching(true);
    setUrl(`http://www.fazgle.com/search?q=${encodeURIComponent(query)}`);
    
    const results = await searchFazgle(query);
    setSearchResults(results);
    setIsSearching(false);
  };

  const navigateHome = () => {
    setView('home');
    setUrl('http://www.fazgle.com/');
    setSearchResults(null);
    setQuery('');
  };

  return (
    <div className="flex flex-col h-full bg-[#c0c0c0] font-sans select-none">
      {/* Menu Bar */}
      <div className="flex gap-2 px-1 text-black text-xs border-b border-gray-400 pb-0.5">
          <span>File</span><span>Edit</span><span>View</span><span>Favorites</span><span>Tools</span><span>Help</span>
      </div>

      {/* Toolbar */}
      <div className="bg-[#d4d0c8] p-1 border-b border-white flex items-center gap-1">
         <div className="flex gap-0.5">
            <button className="h-6 w-6 border border-gray-400 bg-[#c0c0c0] active:border-black flex items-center justify-center text-lg leading-none pb-1" onClick={() => {}} title="Back">⬅</button>
            <button className="h-6 w-6 border border-gray-400 bg-[#c0c0c0] active:border-black flex items-center justify-center text-lg leading-none pb-1" onClick={() => {}} title="Forward">➡</button>
            <button className="h-6 w-6 border border-gray-400 bg-[#c0c0c0] active:border-black flex items-center justify-center text-lg leading-none pb-1 text-red-600 font-bold" onClick={() => setIsSearching(false)} title="Stop">×</button>
            <button className="h-6 w-6 border border-gray-400 bg-[#c0c0c0] active:border-black flex items-center justify-center text-lg leading-none pb-1" onClick={navigateHome} title="Home">🏠</button>
         </div>
         <div className="w-[1px] h-6 bg-gray-500 mx-1"></div>
         <div className="flex gap-0.5">
             <button className="h-6 px-1 border border-gray-400 bg-[#c0c0c0] text-xs flex items-center gap-1">
                 <span>🔎</span> Search
             </button>
             <button className="h-6 px-1 border border-gray-400 bg-[#c0c0c0] text-xs flex items-center gap-1">
                 <span>⭐</span> Favorites
             </button>
         </div>
      </div>

      {/* Address Bar */}
      <div className="bg-[#d4d0c8] p-1 pt-0 border-b border-gray-500 flex items-center gap-2 text-xs">
          <span className="text-gray-600">Address</span>
          <div className="flex-1 bg-white border border-gray-500 inset-shadow h-5 flex items-center px-1 font-sans">
              <span className="mr-1">📄</span>
              <input 
                  type="text" 
                  value={url} 
                  readOnly
                  className="flex-1 outline-none text-black bg-transparent w-full"
              />
              <span className="ml-1">▼</span>
          </div>
          <button className="h-5 px-2 border border-gray-400 bg-[#c0c0c0] flex items-center gap-1 text-xs">
              Go
          </button>
      </div>
      
      {/* Content Area */}
      <div className="flex-1 bg-white relative overflow-y-auto border-t border-black p-0">
        {view === 'home' && (
          <div className="flex flex-col items-center mt-20 font-serif">
            {/* Logo */}
            <div className="text-6xl font-bold mb-4 tracking-tight flex items-baseline">
              <span className="text-[#1240AB]">F</span>
              <span className="text-[#DD1B23]">a</span>
              <span className="text-[#F2B50F]">z</span>
              <span className="text-[#1240AB]">g</span>
              <span className="text-[#009E5A]">l</span>
              <span className="text-[#DD1B23]">e</span>
              <span className="text-sm text-gray-500 ml-1 font-sans font-normal">beta</span>
            </div>
            
            <form onSubmit={handleSearch} className="flex flex-col items-center gap-3 w-full max-w-md">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full border-2 border-gray-300 h-8 px-2 font-mono" 
                autoFocus
              />
              <div className="flex gap-2">
                <button type="submit" className="bg-[#dddddd] border border-gray-600 px-3 py-0.5 text-sm font-sans text-black active:bg-[#bbbbbb]">
                  Fazgle Search
                </button>
                <button type="button" className="bg-[#dddddd] border border-gray-600 px-3 py-0.5 text-sm font-sans text-black active:bg-[#bbbbbb]">
                  I'm Feeling Lucky
                </button>
              </div>
            </form>

            <div className="mt-8 text-center text-xs font-sans text-black">
              <p className="mb-2">
                  <span className="text-blue-800 underline cursor-pointer">Advertise with Us</span> - 
                  <span className="text-blue-800 underline cursor-pointer ml-1">Business Solutions</span> - 
                  <span className="text-blue-800 underline cursor-pointer ml-1">Services & Tools</span> - 
                  <span className="text-blue-800 underline cursor-pointer ml-1">Jobs, Jobs, Jobs!</span>
              </p>
              <p>&copy; 2003 Fazbear Entertainment</p>
            </div>
          </div>
        )}

        {view === 'results' && (
          <div className="font-sans min-h-full">
            {/* Header */}
            <div className="bg-[#e5e5e5] border-b border-gray-400 p-2 flex items-center gap-4">
                <div className="text-xl font-bold font-serif cursor-pointer" onClick={navigateHome}>
                    <span className="text-[#1240AB]">F</span>
                    <span className="text-[#DD1B23]">a</span>
                    <span className="text-[#F2B50F]">z</span>
                    <span className="text-[#1240AB]">g</span>
                    <span className="text-[#009E5A]">l</span>
                    <span className="text-[#DD1B23]">e</span>
                </div>
                <form onSubmit={handleSearch} className="flex gap-1">
                    <input 
                        type="text" 
                        value={query} 
                        onChange={(e) => setQuery(e.target.value)}
                        className="border border-gray-500 px-1 w-64 text-sm"
                    />
                    <button type="submit" className="bg-[#dddddd] border border-gray-500 px-2 text-sm">Search</button>
                </form>
            </div>

            {/* Results Body */}
            <div className="p-4 max-w-[800px]">
                <div className="bg-[#e8eefa] border-t border-b border-[#3366cc] p-1 text-xs text-right mb-4">
                    Results 1 - 10 for <b>{query}</b>. (0.23 seconds)
                </div>

                {isSearching ? (
                    <div className="text-sm font-sans">
                        <span className="inline-block animate-pulse">Contacting server...</span>
                        <div className="w-32 h-2 border border-gray-400 mt-1 relative">
                            <div className="absolute top-0 left-0 h-full bg-[#000080] w-1/3 animate-[slide_1s_infinite_linear]"></div>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4 font-serif">
                        {/* Summary */}
                        {searchResults?.summary && (
                            <div className="text-sm mb-2 p-2 border border-yellow-200 bg-[#fff9dd]">
                                <b>Fazbear AI Summary:</b> {searchResults.summary}
                            </div>
                        )}

                        {/* Links */}
                        {searchResults?.links && searchResults.links.length > 0 ? (
                            searchResults.links.map((link, i) => (
                                <div key={i}>
                                    <a href={link.url} target="_blank" rel="noreferrer" className="text-lg text-[#0000CC] underline hover:text-red-600 visited:text-[#551A8B]">
                                        {link.title}
                                    </a>
                                    <div className="text-sm text-black">
                                        Summary text unavailable for this legacy document. Please click the link to view the content.
                                    </div>
                                    <div className="text-xs text-[#008000]">
                                        {link.url} - <span className="text-gray-500 underline cursor-pointer">Cached</span> - <span className="text-gray-500 underline cursor-pointer">Similar pages</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-sm">
                                <p>Your search - <b>{query}</b> - did not match any documents.</p>
                                <p className="mt-2">Suggestions:</p>
                                <ul className="list-disc pl-8">
                                    <li>Check your spelling.</li>
                                    <li>Try different keywords.</li>
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
          </div>
        )}
      </div>
      
      {/* Status Bar */}
      <div className="bg-[#d4d0c8] border-t border-white h-5 flex items-center px-1 text-xs text-black border-l border-gray-400">
         <span className="flex-1">{isSearching ? 'Opening page...' : 'Done'}</span>
         <div className="w-[1px] h-3 bg-gray-500 mx-1"></div>
         <span>Internet</span>
      </div>
    </div>
  );
};

export default BrowserWindow;