import React, { createContext, useContext, useMemo, useState } from "react";

export type Locale = "en" | "fr";

type Dictionary = Record<string, { en: string; fr: string }>;

const dict: Dictionary = {
  app_title: { en: "Code Master", fr: "Code Master" },
  key_generator: { en: "Key Generator", fr: "Générateur de clé" },
  universal_password: { en: "Enter password", fr: "Entrez le mot de passe" },
  password_placeholder: { en: "Password", fr: "Mot de passe" },
  generate_key: { en: "Generate Key", fr: "Générer la clé" },
  copy_key: { en: "Copy Key", fr: "Copier la clé" },
  saved: { en: "Saved", fr: "Enregistré" },
  enter_access_key: { en: "Enter access key", fr: "Entrez la clé d'accès" },
  access_key_placeholder: { en: "Access key", fr: "Clé d'accès" },
  confirm: { en: "Confirm", fr: "Confirmer" },
  cancel: { en: "Cancel", fr: "Annuler" },
  access_granted: { en: "Access granted", fr: "Accès autorisé" },
  access_denied: { en: "Access denied", fr: "Accès refusé" },
  select_language: { en: "Choose your language", fr: "Choisissez votre langage" },
  luau_generator: { en: "Luau Generator", fr: "Générateur Luau" },
  lua_generator: { en: "Lua Generator", fr: "Générateur Lua" },
  python_generator: { en: "Python Generator", fr: "Générateur Python" },
  cpp_generator: { en: "C++ Generator", fr: "Générateur C++" },
  csharp_generator: { en: "C# Generator", fr: "Générateur C#" },
  java_generator: { en: "Java Generator", fr: "Générateur Java" },
  difficulty: { en: "Difficulty", fr: "Difficulté" },
  easy: { en: "Easy", fr: "Facile" },
  normal: { en: "Normal", fr: "Normal" },
  tryhard: { en: "Tryhard", fr: "Tryhard" },
  timer: { en: "Timer", fr: "Timer" },
  validate: { en: "Validate", fr: "Valider" },
  next: { en: "Next", fr: "Suivant" },
  try_again: { en: "Try again", fr: "Recommencer" },
  speedrun_mode: { en: "Speedrun", fr: "Speedrun" },
  badges: { en: "Badges", fr: "Badges" },
  music: { en: "Music", fr: "Musique" },
  chat_help: { en: "AI Help", fr: "Aide IA" },
  progress: { en: "Progress", fr: "Progression" },
  start_learning: { en: "Start learning now", fr: "Commencez maintenant" },
  disclaimer_ai: { en: "Local helper: no internet required", fr: "Assistant local : sans internet" },
  open: { en: "Open", fr: "Ouvrir" },
  login: { en: "Login", fr: "Connexion" },
  logout: { en: "Logout", fr: "Déconnexion" },
  username: { en: "Username", fr: "Nom d'utilisateur" },
  password: { en: "Password", fr: "Mot de passe" },
  sign_in: { en: "Sign in", fr: "Se connecter" },
  sign_up: { en: "Sign up", fr: "Créer un compte" },
};

const I18nContext = createContext<{ locale: Locale; setLocale: (l: Locale) => void; t: (k: keyof typeof dict) => string } | null>(null);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocale] = useState<Locale>("en");
  const t = useMemo(() => (k: keyof typeof dict) => dict[k]?.[locale] ?? String(k), [locale]);
  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>{children}</I18nContext.Provider>
  );
};

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
