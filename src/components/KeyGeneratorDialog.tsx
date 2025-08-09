import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { saveAccessKey } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";

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
  const [generated, setGenerated] = useState("");
  const [visibleKey, setVisibleKey] = useState("");

  const onGenerate = () => {
    if (pwd !== UNIVERSAL_PASSWORD) {
      toast({ title: t("access_denied"), description: "Wrong password", variant: "destructive" as any });
      return;
    }
    const key = makeKey();
    saveAccessKey(key);
    setGenerated(key);
    setVisibleKey(key);
    toast({ title: t("saved"), description: t("access_granted") });
  };

  const copy = async () => {
    try { await navigator.clipboard.writeText(generated); } catch {}
    toast({ title: t("copy_key"), description: generated });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="neon-title">{t("key_generator")}</DialogTitle>
          <DialogDescription>{t("universal_password")}: <span className="text-brand">argent123</span></DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input value={pwd} onChange={(e) => setPwd(e.target.value)} placeholder={t("password_placeholder")} type="password" />
          <Button variant="hero" size="xl" onClick={onGenerate}>{t("generate_key")}</Button>
          {visibleKey && (
            <div className="rounded-md border p-3 text-sm bg-secondary/50">
              <div className="mb-2">{visibleKey}</div>
              <div className="flex gap-2">
                <Button onClick={copy} className="flex-1">{t("copy_key")}</Button>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
