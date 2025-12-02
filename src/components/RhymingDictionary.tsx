import React, { useState } from 'react';
import { BookType } from 'lucide-react';
import { getAllRhymes, filterBySyllables, RhymeResult, RhymeResults } from '../utils/rhymingService';

type RhymeDisplayMode = 'both' | 'perfect' | 'near';

const RhymingDictionary: React.FC = () => {
  const [searchWord, setSearchWord] = useState<string>('');
  const [results, setResults] = useState<RhymeResults | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [syllableFilter, setSyllableFilter] = useState<number | null>(null);
  const [displayMode, setDisplayMode] = useState<RhymeDisplayMode>('both');

  const handleSearch = async () => {
    if (!searchWord.trim()) {
      setError('Please enter a word to find rhymes');
      return;
    }

    const searchTerm = searchWord.trim().toLowerCase();

    console.log('🔍 Search triggered');
    console.log('📝 Search term:', searchTerm);

    // CRITICAL: Clear previous state FIRST
    setResults(null);
    setError(null);
    setIsLoading(true);
    setSyllableFilter(null);

    try {
      console.log('🔗 Fetching rhymes for:', searchTerm);
      const rhymes = await getAllRhymes(searchTerm);

      console.log('📊 Results received:');
      console.log('  - Perfect rhymes:', rhymes.perfectRhymes.length);
      console.log('  - Near rhymes:', rhymes.nearRhymes.length);

      setResults(rhymes);

      if (rhymes.perfectRhymes.length === 0 && rhymes.nearRhymes.length === 0) {
        console.log('⚠️ No rhymes found for:', searchTerm);
        setError(`No rhymes found for "${searchTerm}"`);
      } else {
        console.log('✅ Rhymes found successfully');
      }
    } catch (err) {
      console.error('❌ Rhyme search error:', err);
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          setError('Request timed out. The rhyming API may be temporarily unavailable. Please try again.');
        } else if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the rhyming API. Please check your internet connection or try again later.');
        } else {
          setError(`Error: ${err.message}. Please try again.`);
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getFilteredRhymes = (rhymes: RhymeResult[]): RhymeResult[] => {
    if (syllableFilter === null) return rhymes;
    return filterBySyllables(rhymes, syllableFilter);
  };

  const RhymeList = ({ rhymes, title, color }: { rhymes: RhymeResult[], title: string, color: string }) => {
    const filteredRhymes = getFilteredRhymes(rhymes);

    if (filteredRhymes.length === 0) {
      return (
        <div className="text-center py-8 text-[#A3A3A3]">
          No {title.toLowerCase()} found{syllableFilter ? ` with ${syllableFilter} syllable${syllableFilter !== 1 ? 's' : ''}` : ''}
        </div>
      );
    }

    return (
      <div className="rhyme-section mb-6">
        <h3 className={`text-xl font-bold mb-3 ${color}`}>
          {title} ({filteredRhymes.length})
        </h3>
        <div className="rhyme-grid grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {filteredRhymes.map((rhyme, index) => (
            <div
              key={index}
              className="rhyme-word p-2 bg-[#1A1A1A] border-2 border-[#2A2A2A] rounded hover:border-blue-400 hover:bg-[#242424] hover:shadow-md transition-all cursor-pointer"
              onClick={() => {
                console.log('🖱️ Clicked rhyme word:', rhyme.word);
                setSearchWord(rhyme.word);
              }}
              title="Click to search rhymes for this word"
            >
              <div className="font-semibold text-[#E5E5E5]">{rhyme.word}</div>
              {rhyme.numSyllables > 0 && (
                <div className="text-xs text-[#A3A3A3]">
                  {rhyme.numSyllables} syllable{rhyme.numSyllables !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const shouldShowPerfect = displayMode === 'both' || displayMode === 'perfect';
  const shouldShowNear = displayMode === 'both' || displayMode === 'near';

  return (
    <div className="rhyming-dictionary max-w-6xl mx-auto p-6">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <BookType className="w-10 h-10 text-blue-600" />
          <h1 className="text-3xl font-bold text-[#E5E5E5]">Rhyming Dictionary</h1>
        </div>
        <p className="text-[#A3A3A3]">Find perfect rhymes and slant rhymes for songwriting</p>
      </div>

      <div className="search-section bg-[#1A1A1A] border border-[#2A2A2A] p-6 rounded-xl shadow-md mb-8">
        <div className="flex gap-3">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => {
              console.log('📝 Input changed to:', e.target.value);
              setSearchWord(e.target.value);
            }}
            onKeyPress={handleKeyPress}
            placeholder="Enter a word (e.g., love, heart, home)"
            className="flex-1 px-4 py-3 bg-[#0F0F0F] text-[#E5E5E5] placeholder:text-[#525252] border-2 border-[#2A2A2A] rounded-lg focus:border-blue-500 focus:outline-none text-lg"
          />
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 transition-all"
          >
            {isLoading ? 'Searching...' : 'Find Rhymes'}
          </button>
        </div>

        {results && (
          <div className="mt-4">
            <label className="block font-semibold text-[#E5E5E5] mb-2">Show:</label>
            <div className="flex gap-3">
              <button
                onClick={() => setDisplayMode('both')}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold transition-all
                  ${displayMode === 'both'
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-[#242424] text-[#E5E5E5] border-2 border-[#2A2A2A] hover:border-blue-400'
                  }
                `}
              >
                <div className="text-base">Both Types</div>
                <div className="text-xs mt-1 opacity-80">Perfect + Near Rhymes</div>
              </button>

              <button
                onClick={() => setDisplayMode('perfect')}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold transition-all
                  ${displayMode === 'perfect'
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-[#242424] text-[#E5E5E5] border-2 border-[#2A2A2A] hover:border-green-400'
                  }
                `}
              >
                <div className="text-base">Perfect Rhymes</div>
                <div className="text-xs mt-1 opacity-80">Exact sound matches</div>
              </button>

              <button
                onClick={() => setDisplayMode('near')}
                className={`
                  flex-1 px-4 py-3 rounded-lg font-semibold transition-all
                  ${displayMode === 'near'
                    ? 'bg-purple-600 text-white shadow-lg'
                    : 'bg-[#242424] text-[#E5E5E5] border-2 border-[#2A2A2A] hover:border-purple-400'
                  }
                `}
              >
                <div className="text-base">Near Rhymes</div>
                <div className="text-xs mt-1 opacity-80">Slant/creative rhymes</div>
              </button>
            </div>
          </div>
        )}

        {results && (
          <div className="mt-4 flex items-center gap-3">
            <label className="font-semibold text-[#E5E5E5]">Filter by syllables:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setSyllableFilter(null)}
                className={`px-3 py-1 rounded border-2 transition-all font-semibold ${
                  syllableFilter === null
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-[#242424] text-[#E5E5E5] border-[#2A2A2A] hover:border-blue-400 hover:bg-[#2A2A2A]'
                }`}
              >
                All
              </button>
              {[1, 2, 3, 4].map(num => (
                <button
                  key={num}
                  onClick={() => setSyllableFilter(num)}
                  className={`px-3 py-1 rounded border-2 transition-all font-semibold ${
                    syllableFilter === num
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-[#242424] text-[#E5E5E5] border-[#2A2A2A] hover:border-blue-400 hover:bg-[#2A2A2A]'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="info-box bg-[#1A1A1A] border-2 border-yellow-600 rounded-lg p-4 mb-6">
        <h3 className="font-bold text-yellow-400 mb-2 flex items-center gap-2">
          <span>
            {displayMode === 'both' && 'What are Perfect vs. Near Rhymes?'}
            {displayMode === 'perfect' && 'About Perfect Rhymes'}
            {displayMode === 'near' && 'About Near Rhymes (Slant Rhymes)'}
          </span>
        </h3>

        {displayMode === 'both' && (
          <ul className="text-sm text-[#E5E5E5] space-y-1">
            <li>
              <strong>Perfect Rhymes:</strong> Words where the vowel sound and ending consonants match exactly
              <br />
              <span className="text-[#A3A3A3] ml-4">Example: "love" / "dove" / "above"</span>
            </li>
            <li>
              <strong>Near/Slant Rhymes:</strong> Words with similar but not identical sounds (great for creative songwriting!)
              <br />
              <span className="text-[#A3A3A3] ml-4">Example: "love" / "move" / "rough"</span>
            </li>
          </ul>
        )}

        {displayMode === 'perfect' && (
          <div className="text-sm text-[#E5E5E5]">
            <p className="mb-2">Perfect rhymes have identical vowel sounds and ending consonants.</p>
            <p className="text-[#A3A3A3]">
              <strong>Example:</strong> "home" perfectly rhymes with "dome," "chrome," "roam"
              <br />
              <strong>Best for:</strong> Choruses, hooks, and memorable lines
            </p>
          </div>
        )}

        {displayMode === 'near' && (
          <div className="text-sm text-[#E5E5E5]">
            <p className="mb-2">Near rhymes (slant rhymes) have similar but not identical sounds. They give you more creative freedom and can sound more natural.</p>
            <p className="text-[#A3A3A3]">
              <strong>Example:</strong> "home" near-rhymes with "bone," "stone," "alone"
              <br />
              <strong>Best for:</strong> Verses, conversational lyrics, and avoiding forced rhymes
            </p>
          </div>
        )}
      </div>

      {error && (
        <div className="error-message bg-red-50 border-2 border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {results && !error && (
        <div className="results-section">
          {shouldShowPerfect && (
            <RhymeList
              rhymes={results.perfectRhymes}
              title="Perfect Rhymes"
              color="text-green-700"
            />
          )}

          {shouldShowNear && (
            <RhymeList
              rhymes={results.nearRhymes}
              title="Near Rhymes (Slant Rhymes)"
              color="text-purple-700"
            />
          )}
        </div>
      )}

      <div className="tips-section mt-8 bg-[#1A1A1A] border border-[#2A2A2A] rounded-lg p-6">
        <h3 className="text-xl font-bold text-[#E5E5E5] mb-4">Songwriting Tips:</h3>
        <ul className="space-y-2 text-[#E5E5E5]">
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Click any word</strong> to search for its rhymes</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Use syllable filters</strong> to find words that fit your melody</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Toggle between rhyme types</strong> to explore different options</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Near rhymes</strong> give you more creative freedom and can sound more natural</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span><strong>Perfect rhymes</strong> are great for choruses and hooks</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-blue-500 font-bold">•</span>
            <span>Country music often uses <strong>simple, conversational rhymes</strong></span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default RhymingDictionary;
