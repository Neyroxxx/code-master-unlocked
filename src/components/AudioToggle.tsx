import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { getSettings, saveSettings } from "@/lib/storage";

export function AudioToggle() {
  const { t } = useI18n();
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const [on, setOn] = useState(getSettings().musicOn);

  useEffect(() => {
    return () => { ctxRef.current?.close().catch(()=>{}); };
  }, []);

  const start = async () => {
    if (!ctxRef.current) {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gain = ctx.createGain();
      gain.gain.value = 0.05; // very subtle
      gain.connect(ctx.destination);

      // Two detuned pads
      const osc1 = ctx.createOscillator(); osc1.type = "sine"; osc1.frequency.value = 220; osc1.detune.value = -8; osc1.connect(gain); osc1.start();
      const osc2 = ctx.createOscillator(); osc2.type = "sine"; osc2.frequency.value = 221.5; osc2.detune.value = 6; osc2.connect(gain); osc2.start();

      // Slow filter sweep for texture
      const filter = ctx.createBiquadFilter(); filter.type = "lowpass"; filter.frequency.value = 1200;
      gain.disconnect(); gain.connect(filter); filter.connect(ctx.destination);
      const lfo = ctx.createOscillator(); lfo.type = "sine"; lfo.frequency.value = 0.03; // super slow
      const lfoGain = ctx.createGain(); lfoGain.gain.value = 600; lfo.connect(lfoGain); lfoGain.connect(filter.frequency); lfo.start();

      ctxRef.current = ctx; gainRef.current = gain;
    }
    setOn(true); saveSettings({ musicOn: true });
  };

  const stop = () => {
    ctxRef.current?.close().catch(()=>{});
    ctxRef.current = null; gainRef.current = null;
    setOn(false); saveSettings({ musicOn: false });
  };

  return (
    <Button variant={on ? "hero" : "neon"} size="sm" onClick={on ? stop : start} aria-pressed={on}>
      {t("music")} {on ? "●" : "○"}
    </Button>
  );
}
