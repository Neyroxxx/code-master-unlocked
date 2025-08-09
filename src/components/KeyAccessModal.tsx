import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getAccessKey } from "@/lib/storage";
import { useI18n } from "@/lib/i18n";

export function KeyAccessModal({ open, onOpenChange, onValid }: { open: boolean; onOpenChange: (v: boolean) => void; onValid: () => void }) {
  const { t } = useI18n();
  const { toast } = useToast();
  const [inputKey, setInputKey] = useState("");

  const confirm = () => {
    const saved = getAccessKey();
    if (saved && inputKey.trim() === saved) {
      toast({ title: t("access_granted") });
      onOpenChange(false);
      onValid();
    } else {
      toast({ title: t("access_denied"), variant: "destructive" as any });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="neon-title">{t("enter_access_key")}</DialogTitle>
          <DialogDescription>CM-XXXXXXXX-XXXX</DialogDescription>
        </DialogHeader>
        <div className="grid gap-3">
          <Input value={inputKey} onChange={(e) => setInputKey(e.target.value)} placeholder={t("access_key_placeholder")} />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>{t("cancel")}</Button>
          <Button onClick={confirm}>{t("confirm")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
