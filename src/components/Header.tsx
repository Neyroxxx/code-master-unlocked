import { useState } from "react";
import { Button } from "@/components/ui/button";
import { KeyGeneratorDialog } from "@/components/KeyGeneratorDialog";
import { AudioToggle } from "@/components/AudioToggle";
import { useI18n } from "@/lib/i18n";

export function Header() {
  const { t, locale, setLocale } = useI18n();
  const [openKG, setOpenKG] = useState(false);

  return (
    <header className="w-full sticky top-0 z-40 backdrop-blur bg-background/60 border-b">
      <div className="max-w-[1280px] mx-auto px-4 py-3 flex items-center gap-3">
        <div className="flex items-center gap-2">
          <Button variant="neon" size="sm" onClick={() => setOpenKG(true)}>{t("key_generator")}</Button>
        </div>
        <div className="ml-3 text-lg font-bold font-display neon-title">Code Master</div>
        <div className="ml-auto flex items-center gap-2">
          <AudioToggle />
          <Button variant="neon" size="sm" onClick={() => setLocale(locale === "en" ? "fr" : "en")}>
            {locale.toUpperCase()}
          </Button>
        </div>
      </div>
      <KeyGeneratorDialog open={openKG} onOpenChange={setOpenKG} />
    </header>
  );
}
