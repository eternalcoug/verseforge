const DATAMUSE_API = 'https://api.datamuse.com/words';

export interface RhymeResult {
  word: string;
  score: number;
  numSyllables: number;
  tags?: string[];
}

export interface RhymeResults {
  perfectRhymes: RhymeResult[];
  nearRhymes: RhymeResult[];
}

async function fetchWithTimeout(url: string, timeout: number = 10000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export async function getPerfectRhymes(word: string, maxResults: number = 100): Promise<RhymeResult[]> {
  try {
    const url = `${DATAMUSE_API}?rel_rhy=${encodeURIComponent(word)}&max=${maxResults}&md=s`;

    console.log('Fetching perfect rhymes:', url);

    const response = await fetchWithTimeout(url, 10000);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    console.log('Perfect rhymes response:', data);

    return data.map((item: any) => ({
      word: item.word,
      score: item.score || 0,
      numSyllables: item.numSyllables || 0,
      tags: item.tags || []
    }));
  } catch (error) {
    console.error('Error fetching perfect rhymes:', error);
    throw error;
  }
}

export async function getNearRhymes(word: string, maxResults: number = 100): Promise<RhymeResult[]> {
  try {
    console.log('Fetching near rhymes for:', word);

    const searchWord = word.toLowerCase();
    const allNearRhymes: RhymeResult[] = [];
    const seenWords = new Set<string>();

    try {
      const nryUrl = `${DATAMUSE_API}?rel_nry=${encodeURIComponent(word)}&max=${maxResults * 2}&md=s`;
      console.log('Trying rel_nry (approximate rhymes):', nryUrl);

      const nryResponse = await fetchWithTimeout(nryUrl, 8000);
      if (nryResponse.ok) {
        const nryData = await nryResponse.json();
        console.log('rel_nry returned:', nryData.length, 'results');

        nryData.forEach((item: any) => {
          const itemWord = item.word.toLowerCase();
          if (itemWord !== searchWord && !seenWords.has(itemWord)) {
            seenWords.add(itemWord);
            allNearRhymes.push({
              word: item.word,
              score: item.score || 0,
              numSyllables: item.numSyllables || 0,
              tags: item.tags || []
            });
          }
        });
      }
    } catch (nryError) {
      console.warn('rel_nry failed, continuing with other methods:', nryError);
    }

    if (allNearRhymes.length < maxResults / 2) {
      try {
        const slUrl = `${DATAMUSE_API}?sl=${encodeURIComponent(word)}&max=${maxResults * 2}&md=s`;
        console.log('Trying sl (sounds-like):', slUrl);

        const slResponse = await fetchWithTimeout(slUrl, 8000);
        if (slResponse.ok) {
          const slData = await slResponse.json();
          console.log('sl returned:', slData.length, 'results');

          slData
            .filter((item: any) => {
              const itemWord = item.word.toLowerCase();
              return itemWord !== searchWord &&
                     item.score < 100 &&
                     !seenWords.has(itemWord);
            })
            .forEach((item: any) => {
              seenWords.add(item.word.toLowerCase());
              allNearRhymes.push({
                word: item.word,
                score: item.score || 0,
                numSyllables: item.numSyllables || 0,
                tags: item.tags || []
              });
            });
        }
      } catch (slError) {
        console.warn('sl failed:', slError);
      }
    }

    allNearRhymes.sort((a, b) => b.score - a.score);

    const finalResults = allNearRhymes.slice(0, maxResults);
    console.log('Near rhymes final count:', finalResults.length);

    return finalResults;
  } catch (error) {
    console.error('Error fetching near rhymes:', error);
    throw error;
  }
}

export async function getAllRhymes(word: string): Promise<RhymeResults> {
  try {
    console.log('🔄 getAllRhymes called with word:', word);

    const [perfectRhymes, nearRhymes] = await Promise.all([
      getPerfectRhymes(word, 100),
      getNearRhymes(word, 100)
    ]);

    console.log(`✅ Found ${perfectRhymes.length} perfect rhymes and ${nearRhymes.length} near rhymes for "${word}"`);

    return {
      perfectRhymes,
      nearRhymes
    };
  } catch (error) {
    console.error('Error in getAllRhymes:', error);
    return {
      perfectRhymes: [],
      nearRhymes: []
    };
  }
}

export function filterBySyllables(rhymes: RhymeResult[], syllableCount: number): RhymeResult[] {
  return rhymes.filter(rhyme => rhyme.numSyllables === syllableCount);
}

export async function getRhymesBySyllables(
  word: string,
  syllableCount: number,
  type: 'perfect' | 'near' | 'both' = 'both'
): Promise<RhymeResults> {

  const results: RhymeResults = {
    perfectRhymes: [],
    nearRhymes: []
  };

  if (type === 'perfect' || type === 'both') {
    const perfect = await getPerfectRhymes(word);
    results.perfectRhymes = filterBySyllables(perfect, syllableCount);
  }

  if (type === 'near' || type === 'both') {
    const near = await getNearRhymes(word);
    results.nearRhymes = filterBySyllables(near, syllableCount);
  }

  return results;
}

export async function testRhymingAPI(): Promise<void> {
  console.log('Testing Datamuse API...');

  try {
    const perfectTest = await getPerfectRhymes('love', 5);
    console.log('Perfect rhymes for "love":', perfectTest);

    const nearTest = await getNearRhymes('love', 5);
    console.log('Near rhymes for "love":', nearTest);

    if (perfectTest.length === 0 && nearTest.length === 0) {
      console.warn('WARNING: No results returned from API. This might be a CORS or network issue.');
    } else {
      console.log('✅ API is working correctly!');
    }
  } catch (error) {
    console.error('❌ API test failed:', error);
  }
}
