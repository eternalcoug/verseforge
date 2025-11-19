/**
 * VerseForge Color Palette
 * Centralized color constants for consistent theming
 */

export const VERSEFORGE_COLORS = {
  // Backgrounds
  bgPrimary: '#0F0F0F',      // Main background
  bgSecondary: '#1A1A1A',    // Cards, panels
  bgElevated: '#242424',     // Hover states, active elements
  bgBorder: '#2A2A2A',       // Borders

  // Accents
  accentPrimary: '#3B82F6',   // Blue - primary interactive
  accentSecondary: '#8B5CF6', // Purple - secondary accent
  accentSuccess: '#10B981',   // Green - success states
  accentWarning: '#F59E0B',   // Amber - warnings, genre tags
  accentError: '#EF4444',     // Red - errors, destructive actions

  // Text
  textPrimary: '#E5E5E5',    // High contrast main text
  textSecondary: '#A3A3A3',  // Less emphasis
  textDisabled: '#525252',   // Muted/disabled
  textTertiary: '#707070',   // Very subtle text
  textLink: '#60A5FA',       // Lighter blue for links

  // Special
  white: '#FFFFFF',          // Only on colored backgrounds
  rootNote: '#EF4444',       // Red for root notes
  scaleNote: '#3B82F6',      // Blue for scale notes

  // Fingering Pattern Colors
  finger1: '#3B82F6',        // Index - Blue
  finger2: '#8B5CF6',        // Middle - Purple
  finger3: '#F59E0B',        // Ring - Amber
  finger4: '#EF4444'         // Pinky - Red
} as const;

export type VerseForgeColor = typeof VERSEFORGE_COLORS[keyof typeof VERSEFORGE_COLORS];

/**
 * Get color with opacity
 */
export function withOpacity(color: string, opacity: number): string {
  // Convert hex to rgba
  const r = parseInt(color.slice(1, 3), 16);
  const g = parseInt(color.slice(3, 5), 16);
  const b = parseInt(color.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
}
