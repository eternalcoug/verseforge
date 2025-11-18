# Rhyming Dictionary Testing Guide

## How to Test the Bug Fix

### Quick Test (Browser Console)

1. Open the application in your browser
2. Navigate to the "Rhyming Dictionary" tab
3. Click the **"Test API (check console)"** button
4. Open Browser DevTools (F12) and check the Console tab

**Expected Console Output:**
```
Testing Datamuse API...
Fetching perfect rhymes: https://api.datamuse.com/words?rel_rhy=love&max=5&md=s
Perfect rhymes response: [Array of 5 items]
Perfect rhymes for "love": [...]
Fetching near rhymes: https://api.datamuse.com/words?sl=love&v=enwiki&max=10&md=s
Near rhymes raw response: [Array of items]
Near rhymes filtered: [Array of items]
Near rhymes for "love": [...]
✅ API is working correctly!
```

### Manual Testing Scenarios

#### Test 1: Near Rhymes Button
**Steps:**
1. Type "love" in the search box
2. Click "Find Rhymes"
3. Click the **"Near Rhymes"** button

**Expected Result:**
- ✅ Should show words like: "luv", "lev", "liv", "live", "lav", "lave", "leave"
- ✅ Should NOT show perfect rhymes like "dove", "shove", "above"
- ✅ Words should have similarity scores < 100

**Before Fix:** Empty list or "No near rhymes found"
**After Fix:** List of near rhymes displayed

---

#### Test 2: Both Types Button
**Steps:**
1. Type "love" in the search box
2. Click "Find Rhymes"
3. Click the **"Both Types"** button

**Expected Result:**
- ✅ Should show TWO sections:
  - **Perfect Rhymes** (green header) - "shove", "dove", "above", "glove"
  - **Near Rhymes (Slant Rhymes)** (purple header) - "luv", "live", "leave", "lev"
- ✅ Both sections should have items
- ✅ Total count should show in section headers

**Before Fix:** Only perfect rhymes section appeared
**After Fix:** Both sections appear with results

---

#### Test 3: Perfect Rhymes Button
**Steps:**
1. Type "love" in the search box
2. Click "Find Rhymes"
3. Click the **"Perfect Rhymes"** button

**Expected Result:**
- ✅ Should show only perfect rhymes: "shove", "dove", "above", "glove"
- ✅ Should NOT show near rhymes section
- ✅ All words should rhyme perfectly with "love"

**Status:** This was already working correctly

---

#### Test 4: Difficult Word (Few Perfect Rhymes)
**Steps:**
1. Type "orange" in the search box
2. Click "Find Rhymes"
3. Click the **"Both Types"** button

**Expected Result:**
- ✅ Perfect rhymes section may be empty or very small
- ✅ Near rhymes section should show multiple results
- ✅ Demonstrates the value of near rhymes for difficult words

---

#### Test 5: Syllable Filtering
**Steps:**
1. Type "love" in the search box
2. Click "Find Rhymes"
3. Click "Both Types"
4. Click the **"2"** button under "Filter by syllables"

**Expected Result:**
- ✅ Perfect rhymes: Only 2-syllable words (e.g., "above")
- ✅ Near rhymes: Only 2-syllable words
- ✅ Count updates to show filtered totals

---

#### Test 6: Interactive Word Search
**Steps:**
1. Type "love" and search
2. Click "Both Types"
3. Click on any word in the results (e.g., click "dove")
4. Observe the search box updates to "dove"
5. Search for rhymes of "dove"

**Expected Result:**
- ✅ Clicking a word should populate search box
- ✅ New search should show rhymes for the clicked word
- ✅ Both perfect and near rhymes should work

---

### Multiple Word Testing

Test with these words to verify consistency:

| Word | Expected Perfect Rhymes | Expected Near Rhymes |
|------|------------------------|---------------------|
| **home** | dome, chrome, roam | hone, bone, tone, loan |
| **heart** | part, start, chart | hurt, cart, art, hard |
| **day** | way, say, play | die, dye, bay, gay |
| **night** | light, right, sight | knight, might, fight |
| **fire** | hire, wire, tire | far, fear, fur |

---

## Verification Checklist

### Before Fix
- [ ] Near Rhymes button returned empty results
- [ ] Both Types button only showed perfect rhymes
- [ ] Console showed empty array `[]` for near rhymes
- [ ] API call used incorrect parameter `rel_nry`

### After Fix
- [x] Near Rhymes button returns sound-alike words
- [x] Both Types button shows BOTH sections
- [x] Console shows populated arrays for both types
- [x] API call uses correct parameter `sl` (sounds-like)
- [x] Filtering excludes exact matches and perfect rhymes
- [x] Syllable filtering works for both types
- [x] All three buttons function correctly

---

## Debugging Commands

If you encounter issues, run these in the browser console:

### Test Perfect Rhymes API
```javascript
fetch('https://api.datamuse.com/words?rel_rhy=love&max=5&md=s')
  .then(r => r.json())
  .then(data => console.log('Perfect rhymes:', data));
```

Expected: Array of words like "shove", "dove", "above"

### Test Near Rhymes API (NEW)
```javascript
fetch('https://api.datamuse.com/words?sl=love&v=enwiki&max=20&md=s')
  .then(r => r.json())
  .then(data => {
    console.log('All sounds-like:', data);
    const filtered = data.filter(item =>
      item.word.toLowerCase() !== 'love' && item.score < 100
    );
    console.log('Filtered near rhymes:', filtered);
  });
```

Expected: Array with words like "luv", "lev", "liv", "live", "leave"

### Test Old (Broken) Parameter
```javascript
fetch('https://api.datamuse.com/words?rel_nry=love&max=10')
  .then(r => r.json())
  .then(data => console.log('Old parameter result:', data));
```

Expected: Empty array `[]` (this is why it was broken!)

---

## Performance Testing

1. **Load Time:** Search should complete in < 2 seconds
2. **Parallel Calls:** Both APIs called simultaneously (check Network tab)
3. **Result Count:** Should get up to 100 of each type
4. **Filtering Speed:** Syllable filtering should be instant

---

## Known Limitations

1. **Near Rhymes Definition:** Uses phonetic similarity rather than strict linguistic near-rhyme rules
2. **Score Threshold:** Words with score < 100 are considered near rhymes
3. **API Dependency:** Relies on Datamuse API's `sl` parameter
4. **Exact Match Filtering:** Filters out words with score = 100 or exact word match

---

## Success Criteria

✅ All three buttons return results for common words
✅ Near rhymes are different from perfect rhymes
✅ Both Types shows both sections simultaneously
✅ Syllable filtering works across both types
✅ No console errors during normal operation
✅ API test button passes in console

---

## Reporting Issues

If you find a word that doesn't return near rhymes:

1. Click "Test API (check console)" button
2. Search for the problematic word
3. Check browser console for API responses
4. Note the word, button clicked, and console output
5. Check if the word has known pronunciation in English

Some words (especially very uncommon words) may have limited results due to API limitations.
