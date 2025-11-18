function getLastWord(line: string): string {
  // CRITICAL: Strip chord notation before analyzing
  const lyricsOnly = line.replace(/\[([^\]]+)\]/g, '').trim();

  const words = lyricsOnly.split(/\s+/);
  if (words.length === 0) return '';
  const lastWord = words[words.length - 1].replace(/[^a-zA-Z]/g, '').toLowerCase();
  return lastWord;
}

function getPhoneticEnding(word: string): string {
  if (word.length === 0) return '';

  const vowels = 'aeiou';
  let ending = '';
  let foundVowel = false;

  for (let i = word.length - 1; i >= 0; i--) {
    ending = word[i] + ending;
    if (vowels.includes(word[i])) {
      foundVowel = true;
      if (i > 0) {
        ending = word[i - 1] + ending;
      }
      break;
    }
  }

  return foundVowel ? ending : word.slice(-3);
}

export function detectRhymeScheme(lines: string[]): {
  scheme: string;
  rhymeGroups: Map<string, number[]>;
} {
  if (lines.length === 0) {
    return { scheme: '', rhymeGroups: new Map() };
  }

  const endings = lines.map(line => getPhoneticEnding(getLastWord(line)));
  const rhymeMap = new Map<string, string>();
  const rhymeGroups = new Map<string, number[]>();
  let currentLetter = 'A';

  endings.forEach((ending, index) => {
    if (!ending) {
      rhymeMap.set(index.toString(), 'X');
      return;
    }

    let foundRhyme = false;
    for (const [existingEnding, letter] of rhymeMap.entries()) {
      if (existingEnding === ending) {
        rhymeMap.set(index.toString(), letter);
        const group = rhymeGroups.get(letter) || [];
        group.push(index);
        rhymeGroups.set(letter, group);
        foundRhyme = true;
        break;
      }
    }

    if (!foundRhyme) {
      for (let i = 0; i < index; i++) {
        if (endings[i] && doWordsRhyme(ending, endings[i])) {
          const letter = rhymeMap.get(i.toString()) || 'X';
          rhymeMap.set(index.toString(), letter);
          const group = rhymeGroups.get(letter) || [];
          group.push(index);
          rhymeGroups.set(letter, group);
          foundRhyme = true;
          break;
        }
      }
    }

    if (!foundRhyme) {
      rhymeMap.set(ending, currentLetter);
      rhymeMap.set(index.toString(), currentLetter);
      rhymeGroups.set(currentLetter, [index]);
      currentLetter = String.fromCharCode(currentLetter.charCodeAt(0) + 1);
    }
  });

  const scheme = lines.map((_, index) => rhymeMap.get(index.toString()) || 'X').join('');

  return { scheme, rhymeGroups };
}

function doWordsRhyme(word1: string, word2: string): boolean {
  if (!word1 || !word2 || word1 === word2) return false;

  const ending1 = getPhoneticEnding(word1);
  const ending2 = getPhoneticEnding(word2);

  if (ending1.length < 2 || ending2.length < 2) return false;

  if (ending1 === ending2) return true;

  const similarity = calculateSimilarity(ending1, ending2);
  return similarity > 0.7;
}

function calculateSimilarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) return 1.0;

  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

export function detectInternalRhymes(line: string): string[] {
  // CRITICAL: Strip chord notation before analyzing
  const lyricsOnly = line.replace(/\[([^\]]+)\]/g, '');

  const words = lyricsOnly.toLowerCase().split(/\s+/)
    .map(w => w.replace(/[^a-zA-Z]/g, ''))
    .filter(w => w.length > 2);

  const rhymes: string[] = [];

  for (let i = 0; i < words.length - 1; i++) {
    for (let j = i + 1; j < words.length; j++) {
      if (doWordsRhyme(words[i], words[j])) {
        rhymes.push(`${words[i]} / ${words[j]}`);
      }
    }
  }

  return rhymes;
}

export function countHookMentions(lyrics: string[], hook: string): {
  count: number;
  locations: { section: number; line: number }[];
} {
  if (!hook || hook.trim().length === 0) {
    return { count: 0, locations: [] };
  }

  const hookLower = hook.toLowerCase().trim();
  let count = 0;
  const locations: { section: number; line: number }[] = [];

  lyrics.forEach((line, lineIndex) => {
    // CRITICAL: Strip chord notation before analyzing
    const lyricsOnly = line.replace(/\[([^\]]+)\]/g, '');

    if (lyricsOnly.toLowerCase().includes(hookLower)) {
      count++;
      locations.push({ section: 0, line: lineIndex });
    }
  });

  return { count, locations };
}
