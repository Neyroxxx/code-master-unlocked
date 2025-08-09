export const ACCESS_KEY_STORAGE = "cm_access_key";
export const PROGRESS_STORAGE = "cm_progress";
export const SETTINGS_STORAGE = "cm_settings";

export type Progress = {
  [lang: string]: {
    chapters: number;
    levelsPerChapter: number;
    currentChapter: number;
    currentLevel: number;
    badges: string[];
  };
};

export function saveAccessKey(key: string) {
  localStorage.setItem(ACCESS_KEY_STORAGE, key);
}

export function getAccessKey() {
  return localStorage.getItem(ACCESS_KEY_STORAGE) || "";
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_STORAGE, JSON.stringify(progress));
}

export function getProgress(): Progress {
  const raw = localStorage.getItem(PROGRESS_STORAGE);
  if (!raw) return {} as Progress;
  try { return JSON.parse(raw) as Progress; } catch { return {} as Progress; }
}

export type Settings = {
  speedrun: boolean;
  musicOn: boolean;
};

export function getSettings(): Settings {
  const raw = localStorage.getItem(SETTINGS_STORAGE);
  if (!raw) return { speedrun: false, musicOn: false };
  try { return JSON.parse(raw) as Settings; } catch { return { speedrun: false, musicOn: false } }
}

export function saveSettings(partial: Partial<Settings>) {
  const current = getSettings();
  const merged = { ...current, ...partial };
  localStorage.setItem(SETTINGS_STORAGE, JSON.stringify(merged));
  return merged;
}
