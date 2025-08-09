import hero from "@/assets/hero-code-master.jpg";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { KeyAccessModal } from "@/components/KeyAccessModal";

const Index = () => {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [open, setOpen] = useState<false | string>(false);

  const openGuard = (lang: string) => setOpen(lang);
  const onValid = () => { if (typeof open === "string") navigate(`/learn/${open}`); };

  return (
    <div className="min-h-screen bg-grid relative">
      <section className="max-w-[1200px] mx-auto px-4 py-16 grid gap-10">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold font-display leading-tight neon-title">{t("app_title")}</h1>
            <p className="mt-4 text-muted-foreground max-w-prose">Dark neon coding journeys. 100% local. Timers. Integrated editor. Progress & badges. Bilingual AI helper.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="xl" onClick={() => openGuard("python")}>{t("python_generator")}</Button>
              <Button onClick={() => openGuard("lua")}>{t("lua_generator")}</Button>
              <Button onClick={() => openGuard("luau")}>{t("luau_generator")}</Button>
              <Button onClick={() => openGuard("cpp")}>{t("cpp_generator")}</Button>
              <Button onClick={() => openGuard("csharp")}>{t("csharp_generator")}</Button>
              <Button onClick={() => openGuard("java")}>{t("java_generator")}</Button>
            </div>
          </div>
          <div className="relative">
            <img src={hero} alt="Code Master hero neon purple" className="rounded-xl border shadow-2xl" loading="lazy" />
            <div className="absolute -inset-2 -z-10 rounded-2xl blur-2xl opacity-40" style={{ background: "var(--gradient-primary)" }} />
          </div>
        </div>

        <div className="rounded-xl border bg-secondary/30 p-6">
          <div className="text-2xl font-display neon-title mb-2">Rejoignez le serveur pour les clés</div>
          <a className="story-link" href="https://discord.gg/BSxeKTsX5V" target="_blank" rel="noreferrer">discord.gg/BSxeKTsX5V</a>
          <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 gap-3 text-sm">
            <div className="rounded-md border p-3">Lua & Python — <strong>5€</strong></div>
            <div className="rounded-md border p-3">Luau — <strong>8€</strong></div>
            <div className="rounded-md border p-3">Java — <strong>15€</strong></div>
            <div className="rounded-md border p-3">C++ — <strong>30€</strong></div>
            <div className="rounded-md border p-3">C# — <strong>30€</strong></div>
          </div>
        </div>
      </section>

      <footer className="max-w-[1200px] mx-auto px-4 pb-12 text-sm text-muted-foreground">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>Crédits : Neyroxx2.o · <a className="story-link" href="https://discord.gg/BSxeKTsX5V" target="_blank" rel="noreferrer">Discord</a></div>
          <div>© {new Date().getFullYear()} Code Master</div>
        </div>
      </footer>

      <KeyAccessModal open={!!open} onOpenChange={() => setOpen(false)} onValid={onValid} lang={typeof open === "string" ? open : "python"} />
    </div>
  );
};

export default Index;
