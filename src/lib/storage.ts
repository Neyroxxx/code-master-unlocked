export const ACCESS_KEYS_STORAGE = "cm_lang_keys";
export const PROGRESS_PREFIX = "cm_progress_"; // per-user
export const SETTINGS_PREFIX = "cm_settings_"; // per-user
export const USERS_DB = "cm_users"; // { [username]: { password: string(hash) } }
export const CURRENT_USER = "cm_current_user";

export type Progress = {
  [lang: string]: {
    chapters: number;
    levelsPerChapter: number;
    currentChapter: number;
    currentLevel: number;
    badges: string[];
  };
};

function hash(pwd: string) {
  try { return "cm:" + btoa(pwd + "::cm"); } catch { return "cm:" + pwd; }
}

export function getCurrentUser(): string | null {
  return localStorage.getItem(CURRENT_USER);
}

export function signUpLocal(username: string, password: string): { ok: boolean; error?: string } {
  const raw = localStorage.getItem(USERS_DB);
  const db = raw ? (JSON.parse(raw) as Record<string, { password: string }>) : {};
  if (db[username]) return { ok: false, error: "User exists" };
  db[username] = { password: hash(password) };
  localStorage.setItem(USERS_DB, JSON.stringify(db));
  localStorage.setItem(CURRENT_USER, username);
  return { ok: true };
}

export function signInLocal(username: string, password: string): { ok: boolean; error?: string } {
  const raw = localStorage.getItem(USERS_DB);
  const db = raw ? (JSON.parse(raw) as Record<string, { password: string }>) : {};
  const user = db[username];
  if (!user) return { ok: false, error: "No such user" };
  if (user.password !== hash(password)) return { ok: false, error: "Wrong password" };
  localStorage.setItem(CURRENT_USER, username);
  return { ok: true };
}

export function signOutLocal() {
  localStorage.removeItem(CURRENT_USER);
}

function currentUserId(): string {
  return getCurrentUser() || "guest";
}

export function saveLangKey(lang: string, key: string) {
  const raw = localStorage.getItem(ACCESS_KEYS_STORAGE);
  const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
  map[lang] = key;
  localStorage.setItem(ACCESS_KEYS_STORAGE, JSON.stringify(map));
}

export function getLangKey(lang: string): string | undefined {
  const raw = localStorage.getItem(ACCESS_KEYS_STORAGE);
  const map = raw ? (JSON.parse(raw) as Record<string, string>) : {};
  return map[lang];
}

export function saveProgress(progress: Progress) {
  localStorage.setItem(PROGRESS_PREFIX + currentUserId(), JSON.stringify(progress));
}

export function getProgress(): Progress {
  const raw = localStorage.getItem(PROGRESS_PREFIX + currentUserId());
  if (!raw) return {} as Progress;
  try { return JSON.parse(raw) as Progress; } catch { return {} as Progress; }
}

export type Settings = {
  speedrun: boolean;
  musicOn: boolean;
};

export function getSettings(): Settings {
  const raw = localStorage.getItem(SETTINGS_PREFIX + currentUserId());
  if (!raw) return { speedrun: false, musicOn: false };
  try { return JSON.parse(raw) as Settings; } catch { return { speedrun: false, musicOn: false } }
}

export function saveSettings(partial: Partial<Settings>) {
  const current = getSettings();
  const merged = { ...current, ...partial };
  localStorage.setItem(SETTINGS_PREFIX + currentUserId(), JSON.stringify(merged));
  return merged;
}
