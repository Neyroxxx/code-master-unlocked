import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveLangKey } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";
import { languagesMeta } from "@/lib/learning";

const UNIVERSAL_PASSWORD = "argent123";

function makeKey() {
  const rand = Math.random().toString(36).slice(2, 10).toUpperCase();
  const ts = Date.now().toString(36).toUpperCase();
  return `CM-${rand}-${ts}`;
}

export function KeyGeneratorDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [pwd, setPwd] = useState("");
  const [ready, setReady] = useState(false);
  const [lastKey, setLastKey] = useState<string>("");

  const onSubmitPwd = () => {
    if (pwd !== UNIVERSAL_PASSWORD) {
      toast({ title: t("access_denied"), description: "Wrong password", variant: "destructive" as any });
      return;
    }
    setReady(true);
  };

  const onGenerateFor = (lang: string) => {
    const key = makeKey();
    saveLangKey(lang, key);
    setLastKey(`${lang.toUpperCase()}: ${key}`);
    toast({ title: t("saved") });
  };

  const langList = Object.keys(languagesMeta).concat(["java"]).map(l => l as string);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="neon-title">{t("key_generator")}</DialogTitle>
        </DialogHeader>
        {!ready ? (
          <div className="grid gap-3">
            <Input value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder={t("password_placeholder")} type="password" />
            <Button variant="hero" size="xl" onClick={onSubmitPwd}>{t("confirm")}</Button>
          </div>
        ) : (
          <div className="grid gap-3">
            <div className="text-sm text-muted-foreground">Choisissez un langage pour générer une clé unique (1 clé = 1 langage).</div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {langList.map((lang) => (
                <Button key={lang} onClick={() => onGenerateFor(lang)}>{lang.toUpperCase()}</Button>
              ))}
            </div>
            {lastKey && <div className="rounded-md border p-3 text-xs bg-secondary/60">{lastKey}</div>}
          </div>
        )}
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
