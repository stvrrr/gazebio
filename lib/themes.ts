import { Theme } from '@/types';

export const THEME_PRESETS: Record<string, Theme> = {
  'minimal-light': {
    name: 'minimal-light',
    primaryColor: '#000000',
    secondaryColor: '#f5f5f5',
    accentColor: '#e0e0e0',
    backgroundColor: '#ffffff',
    textColor: '#000000',
    buttonStyle: 'rounded',
  },
  'dark-modern': {
    name: 'dark-modern',
    primaryColor: '#a78bfa',
    secondaryColor: '#1e293b',
    accentColor: '#ec4899',
    backgroundColor: '#0f172a',
    textColor: '#f1f5f9',
    buttonStyle: 'rounded',
  },
  'neon-gamer': {
    name: 'neon-gamer',
    primaryColor: '#ff006e',
    secondaryColor: '#1a1a2e',
    accentColor: '#00f5ff',
    backgroundColor: '#0f0f1e',
    textColor: '#ffffff',
    buttonStyle: 'glow',
  },
  'cyberpunk-glow': {
    name: 'cyberpunk-glow',
    primaryColor: '#b537f2',
    secondaryColor: '#1a0033',
    accentColor: '#00f5ff',
    backgroundColor: '#0a0a15',
    textColor: '#00f5ff',
    buttonStyle: 'glow',
  },
  'soft-aesthetic': {
    name: 'soft-aesthetic',
    primaryColor: '#f9a8d4',
    secondaryColor: '#f3d5ca',
    accentColor: '#ffe5d9',
    backgroundColor: '#fff5f0',
    textColor: '#6b5653',
    buttonStyle: 'pill',
  },
  'gradient-glass': {
    name: 'gradient-glass',
    primaryColor: '#06b6d4',
    secondaryColor: '#06d6a0',
    accentColor: '#22d3ee',
    backgroundColor: '#083344',
    textColor: '#ecf0f1',
    buttonStyle: 'glass',
  },
};

export const getThemePreset = (themeName: string): Theme => {
  return THEME_PRESETS[themeName] || THEME_PRESETS['dark-modern'];
};

export const getAllThemes = (): Theme[] => {
  return Object.values(THEME_PRESETS);
};
