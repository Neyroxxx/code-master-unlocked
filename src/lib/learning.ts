export type CodeLang = "python" | "lua" | "luau" | "cpp" | "csharp" | "java";

export const languagesMeta: Record<CodeLang, { chapters: number; levelsPerChapter: number; display: string } > = {
  python: { chapters: 9, levelsPerChapter: 15, display: "Python" },
  lua:    { chapters: 9, levelsPerChapter: 15, display: "Lua" },
  luau:   { chapters: 9, levelsPerChapter: 15, display: "Luau" },
  cpp:    { chapters: 10, levelsPerChapter: 20, display: "C++" },
  csharp: { chapters: 10, levelsPerChapter: 20, display: "C#" },
  java:   { chapters: 10, levelsPerChapter: 20, display: "Java" },
};

export type Difficulty = "easy" | "normal" | "tryhard";

export function getDurationMs(d: Difficulty): number {
  if (d === "easy") return 5 * 60 * 1000;
  if (d === "normal") return 2 * 60 * 1000;
  return 30 * 1000; // tryhard
}

export type LevelSpec = {
  id: string;
  title: string;
  explanation: string; // ~30 lines recommended (shortened sample)
  instruction: string; // what remains after timer
  validate: (code: string) => { ok: boolean; message?: string };
};

function includesAll(code: string, parts: string[]) {
  const c = code.replace(/\s+/g, " ").toLowerCase();
  return parts.every(p => c.includes(p.toLowerCase()));
}

export function getSampleLevels(lang: CodeLang): LevelSpec[] {
  switch (lang) {
    case "python":
      return [
        {
          id: "py-1",
          title: "Hello, Python!",
          explanation: `Welcome to Python. In this first level, you'll print a greeting to the console.\n\nprint() is a built-in function that outputs text.\nUse single or double quotes for strings.\nYou can run your code as many times as you want.\nFocus on correctness first, speed later.\nThis course is 100% local.\nGood luck!`,
          instruction: "Print: Hello Code Master",
          validate: (code) => ({ ok: /print\((['\"])Hello Code Master\1\)/.test(code), message: "Use print(\"Hello Code Master\")" }),
        },
        {
          id: "py-2",
          title: "Variables",
          explanation: `Create a variable and print its value. Variables are names bound to values.`,
          instruction: "Create a variable name with value 'Neyroxx' and print it",
          validate: (code) => ({ ok: includesAll(code, ["name =", "'Neyroxx'", "print(name)"]), message: "Define name='Neyroxx' then print(name)" }),
        },
      ];
    case "lua":
    case "luau":
      return [
        {
          id: "lua-1",
          title: "Hello, Lua!",
          explanation: `In Lua, print() outputs text. Strings use quotes.`,
          instruction: "Print: Hello Code Master",
          validate: (code) => ({ ok: /print\((['\"])Hello Code Master\1\)/.test(code), message: "Use print(\"Hello Code Master\")" }),
        },
      ];
    case "cpp":
      return [
        {
          id: "cpp-1",
          title: "Hello, C++!",
          explanation: `Use iostream and cout to print text. Remember std::.`,
          instruction: "Print: Hello Code Master",
          validate: (code) => ({ ok: /#include\s*<iostream>[\s\S]*std::cout\s*<<\s*"Hello Code Master"\s*;/.test(code), message: "Include <iostream> and use std::cout << \"Hello Code Master\";" }),
        },
      ];
    case "csharp":
      return [
        {
          id: "cs-1",
          title: "Hello, C#!",
          explanation: `Use Console.WriteLine to output text.`,
          instruction: "Print: Hello Code Master",
          validate: (code) => ({ ok: /Console\.WriteLine\s*\(\s*"Hello Code Master"\s*\)\s*;/.test(code), message: "Use Console.WriteLine(\"Hello Code Master\");" }),
        },
      ];
    case "java":
      return [
        {
          id: "java-1",
          title: "Hello, Java!",
          explanation: `Use System.out.println to output text.`,
          instruction: "Print: Hello Code Master",
          validate: (code) => ({ ok: /System\.out\.println\s*\(\s*"Hello Code Master"\s*\)\s*;/.test(code), message: "Use System.out.println(\"Hello Code Master\");" }),
        },
      ];
  }
}
