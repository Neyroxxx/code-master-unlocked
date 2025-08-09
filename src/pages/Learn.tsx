import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { cpp } from "@codemirror/lang-cpp";
import { StreamLanguage } from "@codemirror/language";
// @ts-ignore - legacy mode
import { lua as luaLegacy } from "@codemirror/legacy-modes/mode/lua";
import { csharp as csharpLang } from "@replit/codemirror-lang-csharp";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { useI18n } from "@/lib/i18n";
import { CodeLang, Difficulty, getDurationMs, getSampleLevels, languagesMeta } from "@/lib/learning";
import { getProgress, saveProgress, getSettings, saveSettings } from "@/lib/storage";

function useLangExt(lang: CodeLang) {
  return useMemo(() => {
    if (lang === "python") return [python()];
    if (lang === "cpp") return [cpp()];
    if (lang === "csharp") return [csharpLang()];
    return [StreamLanguage.define(luaLegacy)]; // lua/luau
  }, [lang]);
}

export default function Learn() {
  const { lang: langParam } = useParams();
  const navigate = useNavigate();
  const { t } = useI18n();
  const { toast } = useToast();

  const lang = (langParam as CodeLang) || "python";
  const meta = languagesMeta[lang];
  const levels = getSampleLevels(lang);

  const stored = getProgress();
  const base = stored[lang] || { chapters: meta.chapters, levelsPerChapter: meta.levelsPerChapter, currentChapter: 1, currentLevel: 1, badges: [] as string[] };

  const [chapter, setChapter] = useState<number>(base.currentChapter);
  const [levelIdx, setLevelIdx] = useState<number>(Math.max(1, base.currentLevel));
  const [difficulty, setDifficulty] = useState<Difficulty>(getSettings().speedrun ? "tryhard" : "normal");
  const [timeLeft, setTimeLeft] = useState<number>(getDurationMs(difficulty));
  const [showExplanation, setShowExplanation] = useState(true);
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState(0);
  const [aiTip, setAiTip] = useState<string>("");

  const ext = useLangExt(lang);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    // new timer for each difficulty/level change
    setTimeLeft(getDurationMs(difficulty));
    setShowExplanation(true);
    if (timerRef.current) window.clearInterval(timerRef.current);
    timerRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1000) {
          window.clearInterval(timerRef.current!);
          timerRef.current = null;
          setShowExplanation(false);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => { if (timerRef.current) window.clearInterval(timerRef.current); };
  }, [difficulty, levelIdx]);

  const level = levels[(levelIdx - 1) % levels.length];

  function validate() {
    const res = level.validate(code);
    if (res.ok) {
      // success
      const newIdx = levelIdx + 1;
      const updated = { ...stored, [lang]: { ...base, currentChapter: chapter, currentLevel: newIdx, badges: base.badges.includes("first-clear") ? base.badges : [...base.badges, "first-clear"] } };
      saveProgress(updated);
      setErrors(0); setAiTip("");
      toast({ title: "✔", description: t("access_granted") });
      setLevelIdx(newIdx);
      setCode("");
      setShowExplanation(true);
      setTimeLeft(getDurationMs(difficulty));
    } else {
      setErrors(e => e + 1);
      toast({ title: t("try_again"), description: res.message, variant: "destructive" as any });
      if (errors + 1 >= 2) {
        setAiTip(generateTip(lang, code, res.message));
      }
    }
  }

  function generateTip(language: CodeLang, src: string, msg?: string) {
    const lc = src.toLowerCase();
    const base = language === "python" ? "Rappels: print(\"text\") et variables simples."
      : language === "cpp" ? "Rappels: #include <iostream> puis std::cout << \"text\";"
      : language === "csharp" ? "Rappels: Console.WriteLine(\"text\");"
      : "Rappels: print(\"text\");";
    if (lc.includes("prin") === false) return base + " Commence par afficher le texte demandé.";
    if (msg) return base + " " + msg;
    return base;
  }

  const speedrun = getSettings().speedrun;
  const toggleSpeedrun = () => {
    const s = saveSettings({ speedrun: !speedrun });
    setDifficulty(s.speedrun ? "tryhard" : "normal");
  };

  return (
    <main className="min-h-screen">
      <div className="max-w-[1200px] mx-auto px-4 py-6 grid gap-4">
        <div className="flex items-center justify-between">
          <div className="text-xl font-display neon-title">{languagesMeta[lang].display} · {t("progress")} — Ch {chapter} · Lv {levelIdx}</div>
          <div className="flex items-center gap-2">
            <Button variant={speedrun ? "hero" : "neon"} size="sm" onClick={toggleSpeedrun}>{t("speedrun_mode")}</Button>
            <Button variant="neon" size="sm" onClick={() => navigate("/")}>Home</Button>
          </div>
        </div>

        {(() => { const total = meta.chapters * meta.levelsPerChapter; const curr = (chapter - 1) * meta.levelsPerChapter + (levelIdx - 1); const pct = Math.max(0, Math.min(100, Math.round((curr / total) * 100))); return <Progress value={pct} />; })()}

        <div className="grid md:grid-cols-2 gap-4">
          <Card className="bg-secondary/40">
            <CardHeader>
              <CardTitle className="font-display text-lg neon-title">{level.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground">
                {showExplanation ? level.explanation : null}
                {!showExplanation && (
                  <div className="animate-fade-in">
                    <div className="font-medium">Instruction</div>
                    <div className="mt-1">{errors >= 2 ? `${level.instruction} (variant wording)` : level.instruction}</div>
                  </div>
                )}
              </div>
              <div className="flex items-center justify-between text-xs opacity-80">
                <div>{t("difficulty")}: <strong className="text-brand">{difficulty}</strong></div>
                <div>{t("timer")}: <strong>{Math.floor(timeLeft/1000)}s</strong></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary/40">
            <CardHeader>
              <CardTitle className="font-display text-lg neon-title">Editor</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <CodeMirror value={code} height="300px" extensions={ext} onChange={setCode as any} theme="dark" />
              <div className="flex gap-2">
                <Button variant="hero" onClick={validate}>{t("validate")}</Button>
                <Button variant="neon" onClick={() => { setCode(""); setErrors(0); }}>{t("try_again")}</Button>
              </div>
              {aiTip && (
                <div className="rounded-md border p-3 text-xs bg-secondary/60">
                  <div className="font-semibold mb-1">{t("chat_help")} (FR/EN)</div>
                  <div className="mb-2">{aiTip}</div>
                  <div>Need more? Join our Discord: <a className="story-link" href="https://discord.gg/BSxeKTsX5V" target="_blank" rel="noreferrer">discord.gg/BSxeKTsX5V</a></div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
