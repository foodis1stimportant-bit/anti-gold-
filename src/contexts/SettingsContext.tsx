import * as React from 'react';
import { supabase, isSupabaseConfigured } from '@/db/supabase';

export interface PlatformSettings {
  [key: string]: string;
}

interface SettingsContextType {
  settings: PlatformSettings;
  loading: boolean;
  error: Error | null;
  refreshSettings: () => Promise<void>;
}

const SettingsContext = React.createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = React.useState<PlatformSettings>({});
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<Error | null>(null);

  const loadSettings = async () => {
    console.log('[v0] SettingsContext: Starting to load settings, isSupabaseConfigured:', isSupabaseConfigured);
    
    // Skip loading if Supabase is not configured
    if (!isSupabaseConfigured) {
      console.warn('[v0] Skipping settings load - Supabase not configured');
      setLoading(false);
      return;
    }

    try {
      setError(null);
      const { data, error: fetchError } = await supabase.from('settings').select('key, value');
      
      if (fetchError) {
        console.warn('[v0] Settings fetch warning:', fetchError.message);
        // Don't throw - just use empty settings
      }
      
      const settingsObj: Record<string, string> = {};
      data?.forEach((s: { key: string; value: string }) => {
        settingsObj[s.key] = s.value;
      });
      setSettings(settingsObj);
      
      // Apply theme colors globally
      if (settingsObj.primary_color) {
        document.documentElement.style.setProperty('--primary', settingsObj.primary_color);
      }
      
      // Apply favicon
      if (settingsObj.favicon_url) {
        let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.head.appendChild(link);
        }
        link.href = settingsObj.favicon_url;
      }
    } catch (err) {
      console.error('[v0] Settings load error:', err);
      setError(err instanceof Error ? err : new Error('Failed to load settings'));
      // Don't re-throw - allow app to continue with default settings
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading, error, refreshSettings: loadSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = React.useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
