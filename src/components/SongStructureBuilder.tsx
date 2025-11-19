import { useState, useEffect, useRef } from 'react';
import { Music, Save, Download, Trash2, Eye, Maximize2, Printer, Copy, AlertCircle, CheckCircle, X, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  GENRE_CONFIGS,
  SECTION_COLORS,
  SECTION_LABELS,
  SongSection,
  SectionType
} from '../utils/songTemplates';
import { countLineSyllables, analyzeTextSyllables, checkFlowConsistency, suggestTempo } from '../utils/syllableCounter';
import { detectRhymeScheme, countHookMentions } from '../utils/rhymeDetector';
import { parseLineWithChords, formatChordLine } from '../utils/chordNotation';

interface Song {
  id: string;
  title: string;
  genre: string;
  hook: string;
  tempo: number;
  structure: SongSection[];
  dateCreated: number;
  dateModified: number;
}

interface UnsavedChangesModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onDontSave: () => void;
  onSave: () => void;
  songTitle: string;
}

function UnsavedChangesModal({ isOpen, onCancel, onDontSave, onSave, songTitle }: UnsavedChangesModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="w-8 h-8 text-amber-600" />
          <h2 className="text-xl font-bold text-[#E5E5E5]">You Have Unsaved Changes</h2>
        </div>
        <p className="text-[#A3A3A3] mb-6">
          Your song "{songTitle || 'Untitled'}" has unsaved changes. What would you like to do?
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-[#242424] text-[#E5E5E5] rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onDontSave}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all"
          >
            Don't Save
          </button>
          <button
            onClick={onSave}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Save & Continue
          </button>
        </div>
      </div>
    </div>
  );
}

interface NewSongModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function NewSongModal({ isOpen, onCancel, onConfirm }: NewSongModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
        <div className="flex items-center gap-3 mb-4">
          <Music className="w-8 h-8 text-blue-600" />
          <h2 className="text-xl font-bold text-[#E5E5E5]">Start a New Song?</h2>
        </div>
        <p className="text-[#A3A3A3] mb-6">
          Your current work has been auto-saved as a draft. Starting a new song will clear the current editor. You can always save your current song to the library first.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 bg-[#242424] text-[#E5E5E5] rounded-lg hover:bg-gray-300 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all"
          >
            Start New Song
          </button>
        </div>
      </div>
    </div>
  );
}

interface SortableSectionProps {
  section: SongSection;
  isExpanded: boolean;
  sectionLabel: string;
  preview: string;
  sectionAnalysis: {
    lines: number;
    avgSyllables: number;
    rhymeScheme: string;
    consistency: boolean;
    warnings: string[];
  };
  onToggle: () => void;
  onDelete: () => void;
  onUpdateLyrics: (lines: string[]) => void;
}

function SortableSection({
  section,
  isExpanded,
  sectionLabel,
  preview,
  sectionAnalysis,
  onToggle,
  onDelete,
  onUpdateLyrics
}: SortableSectionProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`border-2 rounded-lg ${SECTION_COLORS[section.type]} ${
        isDragging ? 'shadow-2xl ring-2 ring-blue-500 scale-105' : ''
      } transition-all duration-200`}
    >
      <div
        className="p-4 cursor-pointer hover:bg-opacity-70 transition-all flex items-center justify-between"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 flex-1">
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing hover:text-blue-500 transition-colors p-1"
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="w-5 h-5" />
          </div>
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          <div className="flex-1">
            <span className="font-bold">{sectionLabel}</span>
            {!isExpanded && section.lyrics.length > 0 && (
              <span className="ml-3 text-sm opacity-70">[{preview}]</span>
            )}
            {section.lyrics.length > 0 && (
              <span className="ml-3 text-sm">
                {section.lyrics.length} lines • {sectionAnalysis.avgSyllables} syl/line • {sectionAnalysis.rhymeScheme || 'N/A'}
              </span>
            )}
            {section.bars && (
              <span className="ml-3 text-sm font-semibold">[{section.bars} bars]</span>
            )}
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1 hover:bg-red-200 rounded ml-2"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t-2 bg-[#1A1A1A]">
          <div className="mb-2 p-2 bg-blue-900/20 border border-blue-500/30 rounded text-xs text-blue-300">
            <strong>💡 Chord Notation:</strong> Add chords in brackets like <code className="bg-blue-900/40 px-1 rounded">[G]</code> or <code className="bg-blue-900/40 px-1 rounded">[Cmaj7]</code>.
            They'll appear above lyrics in preview but won't affect syllable/rhyme analysis.
            Example: <code className="bg-blue-900/40 px-1 rounded">[G] I left my heart in [D]Tennessee</code>
          </div>
          <textarea
            value={section.lyrics.join('\n')}
            onChange={(e) => {
              const lines = e.target.value.split('\n');
              onUpdateLyrics(lines);
            }}
            placeholder={`Enter lyrics for ${sectionLabel} (one line per row)\nExample: [G] Your lyrics here [D] more lyrics`}
            className="w-full h-48 p-3 border-2 border-[#2A2A2A] rounded-lg focus:border-blue-500 focus:outline-none font-mono text-sm"
          />
          {section.lyrics.length > 0 && (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {section.lyrics.map((line, lineIndex) => {
                const syllables = countLineSyllables(line);
                const { hasChords, chords } = parseLineWithChords(line);
                return (
                  <div key={lineIndex} className="flex justify-between text-[#A3A3A3] bg-[#1A1A1A] border border-[#2A2A2A] px-2 py-1 rounded">
                    <span>
                      Line {lineIndex + 1}
                      {hasChords && <span className="ml-1 text-blue-400 text-xs">♪{chords.length}</span>}
                    </span>
                    <span className="font-semibold">{syllables} syl</span>
                  </div>
                );
              })}
            </div>
          )}
          {sectionAnalysis.warnings.length > 0 && (
            <div className="mt-3 p-3 bg-yellow-50 border-2 border-yellow-300 rounded-lg">
              <p className="font-semibold text-yellow-800 mb-1">⚠️ Flow Warnings:</p>
              {sectionAnalysis.warnings.map((warning, i) => (
                <p key={i} className="text-sm text-yellow-700">• {warning}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function SongStructureBuilder() {
  console.log('🎵 SongStructureBuilder mounting...');

  const [genre, setGenre] = useState<string>('pop');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('modern');
  const [song, setSong] = useState<Song>({
    id: generateId(),
    title: '',
    genre: 'pop',
    hook: '',
    tempo: 105,
    structure: [],
    dateCreated: Date.now(),
    dateModified: Date.now()
  });
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());
  const [savedSongs, setSavedSongs] = useState<Song[]>([]);
  const [showSavedSongs, setShowSavedSongs] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<number>(Date.now());
  const [lastAutoSaveTime, setLastAutoSaveTime] = useState<number>(Date.now());
  const [showSaveToast, setShowSaveToast] = useState(false);
  const [showAutoSaveToast, setShowAutoSaveToast] = useState(false);
  const [showUnsavedModal, setShowUnsavedModal] = useState(false);
  const [showNewSongModal, setShowNewSongModal] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState<(() => void) | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [showVerseComparison, setShowVerseComparison] = useState(false);
  const [showDragToast, setShowDragToast] = useState(false);
  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);
  const timestampUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    console.log('🎵 Component mounted, loading current draft and saved songs...');
    try {
      loadCurrentDraft();
      loadSavedSongs();
      console.log('✅ Songs loaded successfully');
    } catch (error) {
      console.error('❌ Error loading songs:', error);
    }

    return () => {
      if (timestampUpdateIntervalRef.current) {
        clearInterval(timestampUpdateIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    timestampUpdateIntervalRef.current = setInterval(() => {
      setSong(prev => ({ ...prev }));
    }, 60000);

    return () => {
      if (timestampUpdateIntervalRef.current) {
        clearInterval(timestampUpdateIntervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      saveDraftToLocalStorage();
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [song]);

  useEffect(() => {
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveDraftToLocalStorage();
      setShowAutoSaveToast(true);
      setTimeout(() => setShowAutoSaveToast(false), 2000);
    }, 1000);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [song]);

  function generateId(): string {
    return `song_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  function loadCurrentDraft() {
    try {
      const draft = localStorage.getItem('songwriter-current-song');
      if (draft) {
        const parsed = JSON.parse(draft);
        console.log('📝 Loaded current draft:', parsed.title || 'Untitled');
        setSong(parsed);
        setGenre(parsed.genre || 'pop');
        setLastAutoSaveTime(parsed.dateModified || Date.now());
      } else {
        console.log('📝 No draft found, starting fresh');
      }
    } catch (error) {
      console.error('❌ Error loading draft:', error);
    }
  }

  function saveDraftToLocalStorage() {
    try {
      const updated = { ...song, dateModified: Date.now() };
      localStorage.setItem('songwriter-current-song', JSON.stringify(updated));
      setLastAutoSaveTime(Date.now());
      console.log('💾 Auto-saved draft to localStorage');
    } catch (error) {
      console.error('❌ Error saving draft:', error);
    }
  }

  function loadSavedSongs() {
    try {
      const saved = localStorage.getItem('songwriter_songs');
      if (saved) {
        const parsed = JSON.parse(saved);
        console.log('📚 Loaded songs:', parsed.length);
        setSavedSongs(parsed);
      } else {
        console.log('📚 No saved songs found');
      }
    } catch (error) {
      console.error('❌ Error parsing saved songs:', error);
      setSavedSongs([]);
    }
  }

  function startNewSong() {
    try {
      const newSong: Song = {
        id: generateId(),
        title: '',
        genre: 'pop',
        hook: '',
        tempo: 105,
        structure: [],
        dateCreated: Date.now(),
        dateModified: Date.now()
      };
      setSong(newSong);
      setGenre('pop');
      setExpandedSections(new Set());
      setHasUnsavedChanges(false);
      localStorage.removeItem('songwriter-current-song');
      setLastAutoSaveTime(Date.now());
      console.log('📄 Started new song');
    } catch (error) {
      console.error('❌ Error starting new song:', error);
    }
  }

  function saveToLibrary() {
    if (!song.title) {
      alert('Please enter a song title before saving to library');
      return;
    }

    try {
      const updated = { ...song, dateModified: Date.now() };
      setSong(updated);

      const existingIndex = savedSongs.findIndex(s => s.id === updated.id);
      let newSaved;
      if (existingIndex >= 0) {
        newSaved = [...savedSongs];
        newSaved[existingIndex] = updated;
      } else {
        newSaved = [...savedSongs, updated];
      }

      setSavedSongs(newSaved);
      localStorage.setItem('songwriter_songs', JSON.stringify(newSaved));
      setHasUnsavedChanges(false);
      setLastSavedTime(Date.now());
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
      console.log('💾 Saved song to library:', song.title);
    } catch (error) {
      console.error('❌ Error saving song to library:', error);
    }
  }

  function getTimeSinceAutoSave(): string {
    const seconds = Math.floor((Date.now() - lastAutoSaveTime) / 1000);
    if (seconds < 10) return 'just now';
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes === 1) return '1m ago';
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours === 1) return '1h ago';
    return `${hours}h ago`;
  }

  function handleSongUpdate(updates: Partial<Song>) {
    setSong({ ...song, ...updates });
    setHasUnsavedChanges(true);
  }

  function loadTemplate() {
    try {
      const genreConfig = GENRE_CONFIGS[genre];
      const template = genreConfig.templates[selectedTemplate];

      const newStructure: SongSection[] = template.structure.map((section, index) => ({
        id: `section_${index}_${Date.now()}`,
        type: section.type,
        number: section.number,
        lyrics: [],
        bars: section.bars
      }));

      handleSongUpdate({ genre, structure: newStructure });
      console.log('📋 Loaded template:', template.name);
    } catch (error) {
      console.error('❌ Error loading template:', error);
    }
  }

  function updateSectionLyrics(sectionId: string, lyrics: string[]) {
    const newStructure = song.structure.map(section =>
      section.id === sectionId ? { ...section, lyrics } : section
    );
    handleSongUpdate({ structure: newStructure });
  }

  function addSection(type: SectionType) {
    const newSection: SongSection = {
      id: `section_${song.structure.length}_${Date.now()}`,
      type,
      lyrics: [],
      bars: genre === 'hiphop' ? 16 : undefined
    };
    handleSongUpdate({ structure: [...song.structure, newSection] });
  }

  function deleteSection(sectionId: string) {
    const newStructure = song.structure.filter(s => s.id !== sectionId);
    handleSongUpdate({ structure: newStructure });
  }

  function clearAllSections() {
    if (song.structure.length === 0) return;

    const confirmClear = window.confirm(
      'Are you sure you want to clear all sections? This will remove all verses, choruses, and bridges with their lyrics. This action cannot be undone.'
    );

    if (confirmClear) {
      handleSongUpdate({ structure: [] });
    }
  }

  function renumberSections(structure: SongSection[]): SongSection[] {
    const typeCounts: Record<string, number> = {};

    return structure.map(section => {
      if (section.type === 'verse' || section.type === 'chorus' || section.type === 'prechorus') {
        if (!typeCounts[section.type]) {
          typeCounts[section.type] = 0;
        }
        typeCounts[section.type]++;
        return { ...section, number: typeCounts[section.type] };
      }
      return section;
    });
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = song.structure.findIndex(s => s.id === active.id);
      const newIndex = song.structure.findIndex(s => s.id === over.id);

      const newStructure = arrayMove(song.structure, oldIndex, newIndex);
      const renumberedStructure = renumberSections(newStructure);

      handleSongUpdate({ structure: renumberedStructure });

      setShowDragToast(true);
      setTimeout(() => setShowDragToast(false), 2000);
    }
  }

  function expandAll() {
    const allIds = new Set(song.structure.map(s => s.id));
    setExpandedSections(allIds);
  }

  function collapseAll() {
    setExpandedSections(new Set());
  }

  function toggleSection(sectionId: string) {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  }

  function getSectionAnalysis(section: SongSection) {
    try {
      const syllables = analyzeTextSyllables(section.lyrics);
      const rhymeScheme = detectRhymeScheme(section.lyrics);
      const consistency = checkFlowConsistency(syllables.lines);

      return {
        lines: section.lyrics.length,
        avgSyllables: syllables.average,
        rhymeScheme: rhymeScheme.scheme,
        consistency: consistency.isConsistent,
        warnings: consistency.warnings
      };
    } catch (error) {
      console.error('❌ Error analyzing section:', error);
      return {
        lines: 0,
        avgSyllables: 0,
        rhymeScheme: '',
        consistency: true,
        warnings: []
      };
    }
  }

  function calculateVerseConsistency(): number {
    try {
      const verses = song.structure.filter(s => s.type === 'verse');
      if (verses.length < 2) return 100;

      const verse1Syllables = verses[0].lyrics.map(l => countLineSyllables(l));
      let totalMatches = 0;
      let totalComparisons = 0;

      for (let i = 1; i < verses.length; i++) {
        const verseSyllables = verses[i].lyrics.map(l => countLineSyllables(l));
        const minLength = Math.min(verse1Syllables.length, verseSyllables.length);

        for (let j = 0; j < minLength; j++) {
          totalComparisons++;
          const diff = Math.abs(verse1Syllables[j] - verseSyllables[j]);
          if (diff === 0) totalMatches++;
          else if (diff === 1) totalMatches += 0.5;
        }
      }

      return totalComparisons > 0 ? Math.round((totalMatches / totalComparisons) * 100) : 100;
    } catch (error) {
      console.error('❌ Error calculating verse consistency:', error);
      return 100;
    }
  }

  function calculateProfessionalRating(analysis: any): number {
    try {
      let score = 0;
      let maxScore = 0;

      if (analysis.hasChorus) { score += 20; }
      maxScore += 20;

      if (analysis.hasBridge) { score += 15; }
      maxScore += 15;

      if (analysis.hookOptimal) { score += 25; }
      maxScore += 25;

      const consistencyScore = (analysis.verseConsistency / 100) * 20;
      score += consistencyScore;
      maxScore += 20;

      if (analysis.totalLines >= 24 && analysis.totalLines <= 48) { score += 20; }
      maxScore += 20;

      return Math.round((score / maxScore) * 100);
    } catch (error) {
      console.error('❌ Error calculating professional rating:', error);
      return 0;
    }
  }

  function getSongAnalysis() {
    try {
      const allLyrics = song.structure.flatMap(s => s.lyrics);
      const syllables = analyzeTextSyllables(allLyrics);
      const hookCount = countHookMentions(allLyrics, song.hook);
      const genreConfig = GENRE_CONFIGS[genre];
      const tempo = suggestTempo(syllables.average, genre);

      const hasChorus = song.structure.some(s => s.type === 'chorus' || s.type === 'hook');
      const hasBridge = song.structure.some(s => s.type === 'bridge');

      const hookInRange = hookCount.count >= genreConfig.standards.hookOptimalMin &&
                          hookCount.count <= genreConfig.standards.hookOptimalMax;

      const verseConsistency = calculateVerseConsistency();

      const baseAnalysis = {
        totalLines: allLyrics.length,
        hookCount: hookCount.count,
        hookOptimal: hookInRange,
        avgSyllables: syllables.average,
        tempo: tempo,
        hasChorus,
        hasBridge,
        verseConsistency,
        genreConfig
      };

      const professionalRating = calculateProfessionalRating(baseAnalysis);

      return {
        ...baseAnalysis,
        professionalRating
      };
    } catch (error) {
      console.error('❌ Error getting song analysis:', error);
      return {
        totalLines: 0,
        hookCount: 0,
        hookOptimal: false,
        avgSyllables: 0,
        tempo: { category: 'Mid-tempo', bpm: 105, description: 'Standard tempo' },
        hasChorus: false,
        hasBridge: false,
        verseConsistency: 100,
        professionalRating: 0,
        genreConfig: GENRE_CONFIGS[genre]
      };
    }
  }

  function getVerseComparison() {
    try {
      const verses = song.structure.filter(s => s.type === 'verse');
      if (verses.length < 2) return null;

      const comparisons = [];
      for (let i = 1; i < verses.length; i++) {
        const verse1Syllables = verses[0].lyrics.map(l => countLineSyllables(l));
        const verseSyllables = verses[i].lyrics.map(l => countLineSyllables(l));

        const lineComparisons = verse1Syllables.map((syl1, lineIndex) => {
          const syl2 = verseSyllables[lineIndex] || 0;
          const diff = syl2 - syl1;
          return {
            line1: verses[0].lyrics[lineIndex] || '',
            line2: verses[i].lyrics[lineIndex] || '',
            syl1,
            syl2,
            diff,
            match: diff === 0
          };
        });

        comparisons.push({
          verse1Num: 1,
          verse2Num: i + 1,
          lines: lineComparisons
        });
      }

      return comparisons;
    } catch (error) {
      console.error('❌ Error getting verse comparison:', error);
      return null;
    }
  }

  function exportAsText() {
    try {
      let text = `${song.title.toUpperCase()}\n`;
      text += `${GENRE_CONFIGS[genre].name} • ${song.tempo} BPM\n\n`;

      song.structure.forEach((section) => {
        const label = `${SECTION_LABELS[section.type]}${section.number ? ` ${section.number}` : ''}`;
        text += `${label.toUpperCase()}:\n`;
        section.lyrics.forEach(line => {
          text += `${line}\n`;
        });
        text += '\n';
      });

      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${song.title || 'song'}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      console.log('📄 Exported song as text');
    } catch (error) {
      console.error('❌ Error exporting as text:', error);
    }
  }

  function copyToClipboard() {
    try {
      let text = `${song.title.toUpperCase()}\n`;
      text += `${GENRE_CONFIGS[genre].name} • ${song.tempo} BPM\n\n`;

      song.structure.forEach((section) => {
        const label = `${SECTION_LABELS[section.type]}${section.number ? ` ${section.number}` : ''}`;
        text += `${label.toUpperCase()}:\n`;
        section.lyrics.forEach(line => {
          text += `${line}\n`;
        });
        text += '\n';
      });

      navigator.clipboard.writeText(text);
      setShowSaveToast(true);
      setTimeout(() => setShowSaveToast(false), 2000);
      console.log('📋 Copied to clipboard');
    } catch (error) {
      console.error('❌ Error copying to clipboard:', error);
    }
  }

  function handlePrint() {
    window.print();
  }

  console.log('🎵 Rendering component...');

  let analysis;
  let genreConfig;

  try {
    analysis = getSongAnalysis();
    genreConfig = GENRE_CONFIGS[genre];
    console.log('✅ Analysis complete:', analysis);
  } catch (error) {
    console.error('❌ Error in analysis:', error);
    genreConfig = GENRE_CONFIGS['pop'];
    analysis = {
      totalLines: 0,
      hookCount: 0,
      hookOptimal: false,
      avgSyllables: 0,
      tempo: { category: 'Mid-tempo', bpm: 105, description: 'Standard tempo' },
      hasChorus: false,
      hasBridge: false,
      verseConsistency: 100,
      professionalRating: 0,
      genreConfig: genreConfig
    };
  }

  if (isPreviewMode) {
    return (
      <div className="preview-mode max-w-4xl mx-auto p-8 bg-[#0F0F0F]">
        <style>{`
          @media print {
            .no-print { display: none !important; }
            body { background: white; }
            .preview-mode {
              font-family: 'Times New Roman', serif;
              color: black;
            }
            .song-title-preview {
              font-size: 18pt;
              margin-bottom: 0.5in;
            }
            .song-metadata-preview {
              font-size: 10pt;
              margin-bottom: 0.3in;
            }
            .section-header-preview {
              font-size: 12pt;
              margin-top: 0.25in;
              margin-bottom: 0.1in;
            }
            .lyrics-line-preview {
              font-size: 11pt;
              line-height: 1.8;
            }
          }
        `}</style>

        <div className="no-print mb-6 flex gap-3">
          <button
            onClick={() => setIsPreviewMode(false)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all"
          >
            ← Back to Editor
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print / Save as PDF
          </button>
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center gap-2"
          >
            <Copy className="w-4 h-4" />
            Copy All
          </button>
          <button
            onClick={exportAsText}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export .txt
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="song-title-preview text-4xl font-bold text-[#E5E5E5] mb-2">{song.title.toUpperCase() || 'UNTITLED'}</h1>
          <p className="song-metadata-preview text-[#A3A3A3] italic">{genreConfig.name} • {song.tempo} BPM • {new Date(song.dateCreated).toLocaleDateString()}</p>
        </div>

        <div className="space-y-6">
          {song.structure.map((section) => {
            const label = `${SECTION_LABELS[section.type]}${section.number ? ` ${section.number}` : ''}`;
            return (
              <div key={section.id} className="song-section">
                <h3 className="section-header-preview font-bold text-[#E5E5E5] mb-2">{label.toUpperCase()}:</h3>
                <div className="ml-8">
                  {section.lyrics.map((line, lineIndex) => {
                    const { chords, lyrics, hasChords } = parseLineWithChords(line);

                    return (
                      <div key={lineIndex} className="lyric-line-container mb-3">
                        {hasChords && (
                          <div className="chord-line text-blue-400 font-mono text-xs font-bold mb-1" style={{ whiteSpace: 'pre' }}>
                            {formatChordLine(chords, lyrics)}
                          </div>
                        )}
                        <p className="lyrics-line-preview text-[#E5E5E5]">{lyrics || '\u00A0'}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        <div className="no-print mt-12 pt-6 border-t-2 border-[#2A2A2A]">
          <h3 className="font-bold text-lg mb-4 text-[#E5E5E5]">SONG STATISTICS:</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-[#E5E5E5]">
            <div>Total Lines: {analysis.totalLines}</div>
            <div>Hook Repetitions: {analysis.hookCount}</div>
            <div>Avg Syllables/Line: {analysis.avgSyllables}</div>
            <div>Verse Consistency: {analysis.verseConsistency}%</div>
            <div>Professional Rating: {analysis.professionalRating}%</div>
            <div>Suggested Tempo: {analysis.tempo.bpm} BPM</div>
          </div>
        </div>
      </div>
    );
  }

  console.log('✅ Returning main UI...');

  return (
    <div className="song-builder max-w-7xl mx-auto p-6">
      <UnsavedChangesModal
        isOpen={showUnsavedModal}
        onCancel={() => {
          setShowUnsavedModal(false);
          setPendingNavigation(null);
        }}
        onDontSave={() => {
          setShowUnsavedModal(false);
          setHasUnsavedChanges(false);
          if (pendingNavigation) {
            pendingNavigation();
          }
          setPendingNavigation(null);
        }}
        onSave={() => {
          saveToLibrary();
          setShowUnsavedModal(false);
          if (pendingNavigation) {
            pendingNavigation();
          }
          setPendingNavigation(null);
        }}
        songTitle={song.title}
      />

      <NewSongModal
        isOpen={showNewSongModal}
        onCancel={() => setShowNewSongModal(false)}
        onConfirm={() => {
          startNewSong();
          setShowNewSongModal(false);
        }}
      />

      {showSaveToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Saved to library!</span>
        </div>
      )}

      {showAutoSaveToast && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Saved ✓</span>
        </div>
      )}

      {showDragToast && (
        <div className="fixed top-6 right-6 z-50 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-5 h-5" />
          <span>Section moved ✓</span>
        </div>
      )}

      <div className="flex items-center justify-between mb-6">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Music className="w-10 h-10 text-blue-600" />
            <h1 className="text-3xl font-bold text-[#E5E5E5]">Song Structure Builder</h1>
          </div>
          <p className="text-[#A3A3A3]">Create and organize your song's structure with lyrics</p>
          <p className="text-sm text-[#A3A3A3] mt-2">Auto-saved {getTimeSinceAutoSave()}</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowNewSongModal(true)}
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-all flex items-center gap-2"
          >
            <Music className="w-4 h-4" />
            New Song
          </button>
          <button
            onClick={() => setShowSavedSongs(!showSavedSongs)}
            className="px-4 py-2 bg-[#242424] text-[#E5E5E5] rounded-lg hover:bg-gray-300 transition-all flex items-center gap-2"
          >
            <Eye className="w-4 h-4" />
            Library ({savedSongs.length})
          </button>
          <button
            onClick={saveToLibrary}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={!song.title}
          >
            <Save className="w-4 h-4" />
            Save to Library
          </button>
          <button
            onClick={() => setIsPreviewMode(true)}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center gap-2"
          >
            <Maximize2 className="w-4 h-4" />
            Preview
          </button>
        </div>
      </div>

      {showSavedSongs && (
        <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">Saved Songs</h2>
          {savedSongs.length === 0 ? (
            <p className="text-[#A3A3A3] text-center py-8">No saved songs yet. Create your first song!</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savedSongs.map(savedSong => {
                const genreIcon = GENRE_CONFIGS[savedSong.genre]?.icon || '🎵';
                const songAnalysis = {
                  totalLines: savedSong.structure.flatMap(s => s.lyrics).length,
                  hookCount: countHookMentions(savedSong.structure.flatMap(s => s.lyrics), savedSong.hook).count
                };

                return (
                  <div key={savedSong.id} className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-400 transition-all">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{genreIcon}</span>
                      <h3 className="font-bold text-[#E5E5E5]">{savedSong.title || 'Untitled'}</h3>
                    </div>
                    <div className="text-sm text-[#A3A3A3] space-y-1">
                      <div>Genre: {GENRE_CONFIGS[savedSong.genre]?.name}</div>
                      <div>Sections: {savedSong.structure.length} | Lines: {songAnalysis.totalLines}</div>
                      <div>Hook: {songAnalysis.hookCount}x | Tempo: {savedSong.tempo} BPM</div>
                      <div>Modified: {new Date(savedSong.dateModified).toLocaleDateString()}</div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => {
                          if (hasUnsavedChanges) {
                            setPendingNavigation(() => () => {
                              setSong(savedSong);
                              setGenre(savedSong.genre);
                              setShowSavedSongs(false);
                              setHasUnsavedChanges(false);
                            });
                            setShowUnsavedModal(true);
                          } else {
                            setSong(savedSong);
                            setGenre(savedSong.genre);
                            setShowSavedSongs(false);
                          }
                        }}
                        className="flex-1 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                      >
                        Load
                      </button>
                      <button
                        onClick={() => {
                          const newSaved = savedSongs.filter(s => s.id !== savedSong.id);
                          setSavedSongs(newSaved);
                          localStorage.setItem('songwriter_songs', JSON.stringify(newSaved));
                        }}
                        className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="bg-gradient-to-r from-[#1A1A1A] to-[#242424] rounded-xl shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">Song Title *</label>
            <input
              type="text"
              value={song.title}
              onChange={(e) => handleSongUpdate({ title: e.target.value })}
              placeholder="Enter song title"
              className="dark-select w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">Main Hook/Title Line</label>
            <input
              type="text"
              value={song.hook}
              onChange={(e) => handleSongUpdate({ hook: e.target.value })}
              placeholder="Main hook or repeated phrase"
              className="dark-select w-full"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">Genre</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="dark-select w-full"
            >
              {Object.entries(GENRE_CONFIGS).map(([key, config]) => (
                <option key={key} value={key}>
                  {config.icon} {config.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">Template</label>
            <select
              value={selectedTemplate}
              onChange={(e) => setSelectedTemplate(e.target.value)}
              className="dark-select w-full"
            >
              {Object.entries(genreConfig.templates).map(([key, template]) => (
                <option key={key} value={key}>
                  {template.name} - {template.description}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={loadTemplate}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-semibold"
          >
            Load Template
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold">Song Structure</h2>
              <div className="flex gap-2 flex-wrap">
                <button
                  onClick={expandAll}
                  className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded hover:bg-blue-200 transition-all"
                >
                  Expand All
                </button>
                <button
                  onClick={collapseAll}
                  className="px-3 py-1 bg-gray-100 text-[#A3A3A3] text-sm rounded hover:bg-[#242424] transition-all"
                >
                  Collapse All
                </button>
                {song.structure.length > 0 && (
                  <button
                    onClick={clearAllSections}
                    className="px-3 py-1 bg-red-50 text-red-600 text-sm rounded hover:bg-red-100 transition-all border border-red-200"
                  >
                    Clear All
                  </button>
                )}
                {(['verse', 'chorus', 'bridge'] as SectionType[]).map(type => (
                  <button
                    key={type}
                    onClick={() => addSection(type)}
                    className="px-3 py-1 bg-[#242424] text-sm rounded hover:bg-gray-300 transition-all"
                  >
                    + {SECTION_LABELS[type]}
                  </button>
                ))}
              </div>
            </div>

            {song.structure.length === 0 ? (
              <div className="text-center py-12 text-[#A3A3A3] bg-[#1A1A1A] rounded-lg border-2 border-dashed border-[#2A2A2A]">
                <Music className="w-16 h-16 mx-auto mb-4 text-[#525252]" />
                <p className="text-lg font-semibold mb-2">No sections yet</p>
                <p className="text-sm">Load a template or add sections manually to get started</p>
              </div>
            ) : (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={song.structure.map(s => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {song.structure.map((section) => {
                      const sectionAnalysis = getSectionAnalysis(section);
                      const isExpanded = expandedSections.has(section.id);
                      const sectionLabel = `${SECTION_LABELS[section.type]}${section.number ? ` ${section.number}` : ''}`;
                      const preview = section.lyrics[0] ? section.lyrics[0].substring(0, 30) + (section.lyrics[0].length > 30 ? '...' : '') : '';

                      return (
                        <SortableSection
                          key={section.id}
                          section={section}
                          isExpanded={isExpanded}
                          sectionLabel={sectionLabel}
                          preview={preview}
                          sectionAnalysis={sectionAnalysis}
                          onToggle={() => toggleSection(section.id)}
                          onDelete={() => deleteSection(section.id)}
                          onUpdateLyrics={(lines) => updateSectionLyrics(section.id, lines)}
                        />
                      );
                    })}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>

          {showVerseComparison && getVerseComparison() && (
            <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold">📊 Verse Consistency Analyzer</h3>
                <button
                  onClick={() => setShowVerseComparison(false)}
                  className="p-1 hover:bg-[#242424] rounded"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {getVerseComparison()?.map((comparison, idx) => (
                <div key={idx} className="mb-6">
                  <h4 className="font-semibold mb-3">Verse {comparison.verse1Num} vs Verse {comparison.verse2Num}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 className="text-sm font-semibold text-[#A3A3A3] mb-2">Verse {comparison.verse1Num}</h5>
                      {comparison.lines.map((lineComp, lineIdx) => (
                        <div key={lineIdx} className="mb-2 p-2 bg-[#1A1A1A] rounded">
                          <div className="text-xs text-[#A3A3A3]">Line {lineIdx + 1}: {lineComp.syl1} syl</div>
                          <div className="text-sm">{lineComp.line1}</div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold text-[#A3A3A3] mb-2">Verse {comparison.verse2Num}</h5>
                      {comparison.lines.map((lineComp, lineIdx) => (
                        <div key={lineIdx} className={`mb-2 p-2 rounded ${lineComp.match ? 'bg-green-50' : 'bg-red-50'}`}>
                          <div className={`text-xs ${lineComp.match ? 'text-green-600' : 'text-red-600'}`}>
                            Line {lineIdx + 1}: {lineComp.syl2} syl {!lineComp.match && `(${lineComp.diff > 0 ? '+' : ''}${lineComp.diff})`}
                          </div>
                          <div className="text-sm">{lineComp.line2}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div className="bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md p-6">
            <h3 className="text-lg font-bold mb-4">📊 Analysis</h3>

            <div className="mb-4">
              <label className="block text-sm font-semibold text-[#A3A3A3] mb-2">Tempo (BPM)</label>
              <input
                type="range"
                min="60"
                max="180"
                value={song.tempo}
                onChange={(e) => handleSongUpdate({ tempo: parseInt(e.target.value) })}
                className="w-full"
              />
              <div className="text-center text-lg font-bold text-blue-600">{song.tempo} BPM</div>
              <div className="text-xs text-center text-[#A3A3A3]">{analysis.tempo.category}</div>
            </div>

            <div className="space-y-3 text-sm">
              <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                <div className="font-semibold text-[#A3A3A3]">Professional Rating</div>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.professionalRating}%
                  {analysis.professionalRating >= 80 && ' ⭐⭐⭐⭐⭐'}
                  {analysis.professionalRating >= 60 && analysis.professionalRating < 80 && ' ⭐⭐⭐⭐'}
                  {analysis.professionalRating < 60 && ' ⭐⭐⭐'}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold text-[#A3A3A3]">Total Lines</div>
                <div className="text-2xl font-bold text-blue-600">{analysis.totalLines}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold text-[#A3A3A3]">Hook Repetitions</div>
                <div className="text-2xl font-bold text-blue-600">
                  {analysis.hookCount} {analysis.hookOptimal ? '✅' : '⚠️'}
                </div>
                <div className="text-xs text-[#A3A3A3]">
                  Optimal: {genreConfig.standards.hookOptimalMin}-{genreConfig.standards.hookOptimalMax}
                </div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold text-[#A3A3A3]">Avg Syllables/Line</div>
                <div className="text-2xl font-bold text-blue-600">{analysis.avgSyllables}</div>
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold text-[#A3A3A3]">Verse Consistency</div>
                <div className="text-2xl font-bold text-blue-600">{analysis.verseConsistency}%</div>
                {analysis.verseConsistency < 80 && song.structure.filter(s => s.type === 'verse').length >= 2 && (
                  <button
                    onClick={() => setShowVerseComparison(true)}
                    className="mt-2 text-xs text-blue-600 hover:underline"
                  >
                    View Comparison
                  </button>
                )}
              </div>

              <div className="p-3 bg-gray-50 rounded">
                <div className="font-semibold text-[#A3A3A3] mb-2">Structure Check</div>
                <div className="space-y-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span>{analysis.hasChorus ? '✅' : '❌'}</span>
                    <span>Has Chorus/Hook</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>{analysis.hasBridge ? '✅' : '❌'}</span>
                    <span>Has Bridge</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <button
                onClick={copyToClipboard}
                className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all flex items-center justify-center gap-2"
                disabled={song.structure.length === 0}
              >
                <Copy className="w-4 h-4" />
                Copy to Clipboard
              </button>
              <button
                onClick={exportAsText}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all flex items-center justify-center gap-2"
                disabled={song.structure.length === 0}
              >
                <Download className="w-4 h-4" />
                Export as .txt
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl shadow-md p-6 border-2 border-yellow-200">
            <h3 className="text-lg font-bold mb-3 text-yellow-900">💡 {genreConfig.name} Tips</h3>
            <ul className="space-y-2 text-sm text-[#A3A3A3]">
              {genreConfig.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-yellow-600 font-bold">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {song.structure.length > 0 && (
        <div className="mt-6 bg-[#1A1A1A] border border-[#2A2A2A] rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold mb-4">🎵 Song Timeline</h3>
          <div className="flex flex-wrap gap-2">
            {song.structure.map((section) => {
              const label = `${SECTION_LABELS[section.type]}${section.number ? ` ${section.number}` : ''}`;
              const hasHook = section.lyrics.some(line =>
                song.hook && line.toLowerCase().includes(song.hook.toLowerCase())
              );

              return (
                <button
                  key={section.id}
                  className={`px-4 py-2 rounded-lg border-2 ${SECTION_COLORS[section.type]} cursor-pointer hover:scale-105 transition-all`}
                  onClick={() => {
                    if (!expandedSections.has(section.id)) {
                      toggleSection(section.id);
                    }
                    setTimeout(() => {
                      const element = document.querySelector(`[data-section-id="${section.id}"]`);
                      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, 100);
                  }}
                >
                  <div className="text-sm font-semibold">{label}</div>
                  <div className="text-xs">{section.lyrics.length} lines</div>
                  {hasHook && <span className="text-xs">⭐</span>}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
