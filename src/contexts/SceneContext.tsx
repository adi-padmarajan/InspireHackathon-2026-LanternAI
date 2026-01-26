/**
 * Scene Context
 * Manages ambient scenes, widgets, and focus mode state
 */

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode, useMemo } from 'react';
import {
  AmbientScene,
  SceneSettings,
  WidgetConfig,
  SceneMood,
  defaultSceneSettings,
  getSceneById,
  prebuiltScenes,
  getDailyQuote,
  inspirationalQuotes,
} from '@/lib/scenes';

// ============================================================================
// TYPES
// ============================================================================

export interface SceneContextType {
  // State
  settings: SceneSettings;
  activeScene: AmbientScene | null;
  isSceneEnabled: boolean;
  isFocusMode: boolean;
  dailyInspiration: {
    quote: string;
    author: string;
    mood: SceneMood;
  };

  // Scene Actions
  setActiveScene: (sceneId: string | null) => void;
  toggleSceneEnabled: (enabled?: boolean) => void;
  addCustomScene: (scene: AmbientScene) => void;
  removeCustomScene: (sceneId: string) => void;
  updateCustomScene: (sceneId: string, updates: Partial<AmbientScene>) => void;

  // Widget Actions
  updateWidget: (widgetId: string, updates: Partial<WidgetConfig>) => void;
  addWidget: (widget: WidgetConfig) => void;
  removeWidget: (widgetId: string) => void;
  toggleWidgetVisibility: (widgetId: string) => void;

  // Focus Mode
  toggleFocusMode: (enabled?: boolean) => void;
  setShowDailyInspiration: (show: boolean) => void;

  // Utilities
  getAvailableScenes: (mood?: SceneMood) => AmbientScene[];
  resetToDefaults: () => void;
}

// ============================================================================
// STORAGE
// ============================================================================

const SCENE_STORAGE_KEY = 'lantern_scene_settings';

const loadSettings = (): SceneSettings => {
  try {
    const stored = localStorage.getItem(SCENE_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultSceneSettings, ...parsed };
    }
  } catch (e) {
    console.warn('Failed to load scene settings:', e);
  }
  return defaultSceneSettings;
};

const saveSettings = (settings: SceneSettings) => {
  try {
    localStorage.setItem(SCENE_STORAGE_KEY, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save scene settings:', e);
  }
};

// ============================================================================
// CONTEXT
// ============================================================================

const SceneContext = createContext<SceneContextType | undefined>(undefined);

// ============================================================================
// PROVIDER
// ============================================================================

interface SceneProviderProps {
  children: ReactNode;
}

export function SceneProvider({ children }: SceneProviderProps) {
  const [settings, setSettings] = useState<SceneSettings>(defaultSceneSettings);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const loadedSettings = loadSettings();
    setSettings(loadedSettings);
    setIsInitialized(true);
  }, []);

  // Save settings when they change
  useEffect(() => {
    if (isInitialized) {
      saveSettings(settings);
    }
  }, [settings, isInitialized]);

  // Compute active scene
  const activeScene = useMemo(() => {
    if (!settings.enabled || !settings.activeSceneId) return null;
    return getSceneById(settings.activeSceneId, settings.customScenes) || null;
  }, [settings.enabled, settings.activeSceneId, settings.customScenes]);

  // Get daily inspiration
  const dailyInspiration = useMemo(() => getDailyQuote(), []);

  // ============================================================================
  // SCENE ACTIONS
  // ============================================================================

  const setActiveScene = useCallback((sceneId: string | null) => {
    setSettings(prev => ({
      ...prev,
      activeSceneId: sceneId,
      enabled: sceneId !== null,
    }));
  }, []);

  const toggleSceneEnabled = useCallback((enabled?: boolean) => {
    setSettings(prev => ({
      ...prev,
      enabled: enabled !== undefined ? enabled : !prev.enabled,
    }));
  }, []);

  const addCustomScene = useCallback((scene: AmbientScene) => {
    setSettings(prev => ({
      ...prev,
      customScenes: [...prev.customScenes, { ...scene, isCustom: true }],
    }));
  }, []);

  const removeCustomScene = useCallback((sceneId: string) => {
    setSettings(prev => ({
      ...prev,
      customScenes: prev.customScenes.filter(s => s.id !== sceneId),
      // Clear active scene if it was the one removed
      activeSceneId: prev.activeSceneId === sceneId ? null : prev.activeSceneId,
    }));
  }, []);

  const updateCustomScene = useCallback((sceneId: string, updates: Partial<AmbientScene>) => {
    setSettings(prev => ({
      ...prev,
      customScenes: prev.customScenes.map(s =>
        s.id === sceneId ? { ...s, ...updates } : s
      ),
    }));
  }, []);

  // ============================================================================
  // WIDGET ACTIONS
  // ============================================================================

  const updateWidget = useCallback((widgetId: string, updates: Partial<WidgetConfig>) => {
    setSettings(prev => ({
      ...prev,
      widgetLayout: prev.widgetLayout.map(w =>
        w.id === widgetId ? { ...w, ...updates } : w
      ),
    }));
  }, []);

  const addWidget = useCallback((widget: WidgetConfig) => {
    setSettings(prev => ({
      ...prev,
      widgetLayout: [...prev.widgetLayout, widget],
    }));
  }, []);

  const removeWidget = useCallback((widgetId: string) => {
    setSettings(prev => ({
      ...prev,
      widgetLayout: prev.widgetLayout.filter(w => w.id !== widgetId),
    }));
  }, []);

  const toggleWidgetVisibility = useCallback((widgetId: string) => {
    setSettings(prev => ({
      ...prev,
      widgetLayout: prev.widgetLayout.map(w =>
        w.id === widgetId ? { ...w, visible: !w.visible } : w
      ),
    }));
  }, []);

  // ============================================================================
  // FOCUS MODE
  // ============================================================================

  const toggleFocusMode = useCallback((enabled?: boolean) => {
    setSettings(prev => ({
      ...prev,
      focusModeEnabled: enabled !== undefined ? enabled : !prev.focusModeEnabled,
    }));
  }, []);

  const setShowDailyInspiration = useCallback((show: boolean) => {
    setSettings(prev => ({
      ...prev,
      showDailyInspiration: show,
    }));
  }, []);

  // ============================================================================
  // UTILITIES
  // ============================================================================

  const getAvailableScenes = useCallback((mood?: SceneMood) => {
    const allScenes = [...prebuiltScenes, ...settings.customScenes];
    if (mood) {
      return allScenes.filter(scene => scene.mood === mood);
    }
    return allScenes;
  }, [settings.customScenes]);

  const resetToDefaults = useCallback(() => {
    setSettings(defaultSceneSettings);
  }, []);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value: SceneContextType = {
    settings,
    activeScene,
    isSceneEnabled: settings.enabled,
    isFocusMode: settings.focusModeEnabled,
    dailyInspiration,
    setActiveScene,
    toggleSceneEnabled,
    addCustomScene,
    removeCustomScene,
    updateCustomScene,
    updateWidget,
    addWidget,
    removeWidget,
    toggleWidgetVisibility,
    toggleFocusMode,
    setShowDailyInspiration,
    getAvailableScenes,
    resetToDefaults,
  };

  return (
    <SceneContext.Provider value={value}>
      {children}
    </SceneContext.Provider>
  );
}

// ============================================================================
// HOOK
// ============================================================================

export function useScene(): SceneContextType {
  const context = useContext(SceneContext);
  if (context === undefined) {
    throw new Error('useScene must be used within a SceneProvider');
  }
  return context;
}

export default SceneContext;
