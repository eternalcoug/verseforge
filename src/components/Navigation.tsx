import React from 'react';
import { Music, RefreshCw, BookOpen, Guitar, Volume2, Home } from 'lucide-react';

type ActiveTab = 'home' | 'generator' | 'reference' | 'positions' | 'scales' | 'tuner' | 'rhymes' | 'songbuilder';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

export function Navigation({ activeTab, setActiveTab }: NavigationProps) {
  return (
    <div className="sticky top-0 z-50 bg-black border-b border-[#2A2A2A] shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-3">
            <img
              src="/VerseForge_final.png"
              alt="VerseForge"
              className="h-10 w-auto object-contain"
            />
          </div>
        </div>

        <div className="pb-3">
          <div className="bg-[#1A1A1A] rounded-lg p-2 border border-[#2A2A2A]">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setActiveTab('home')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'home'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <Home size={18} />
                Home
              </button>
              <button
                onClick={() => setActiveTab('reference')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'reference'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <BookOpen size={18} />
                Reference
              </button>
              <button
                onClick={() => setActiveTab('positions')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'positions'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <Guitar size={18} />
                Chord Finder
              </button>
              <button
                onClick={() => setActiveTab('generator')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'generator'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <RefreshCw size={18} />
                Generator
              </button>
              <button
                onClick={() => setActiveTab('songbuilder')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'songbuilder'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <Music size={18} />
                Song Builder
              </button>
              <button
                onClick={() => setActiveTab('rhymes')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'rhymes'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <BookOpen size={18} />
                Rhymes
              </button>
              <button
                onClick={() => setActiveTab('scales')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'scales'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <Music size={18} />
                Scale Visualizer
              </button>
              <button
                onClick={() => setActiveTab('tuner')}
                className={`
                  flex-1 py-2 px-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 min-w-[120px]
                  ${activeTab === 'tuner'
                    ? 'bg-blue-500 text-white shadow-glow-blue'
                    : 'bg-[#242424] text-[#A3A3A3] hover:bg-[#2A2A2A] hover:text-[#E5E5E5]'
                  }
                `}
              >
                <Volume2 size={18} />
                Tuner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
