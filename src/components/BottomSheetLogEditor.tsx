import { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Sheet } from './ui/Sheet';
import { Chip } from './ui/Chip';
import { db, type FlowIntensity } from '../db/schema';
import { syncCyclesTable } from '../lib/cycleSync';
import { withSync } from '../lib/syncStatus';
import { FLOW_OPTIONS, MOOD_OPTIONS, SYMPTOM_OPTIONS } from '../data/phases';

interface BottomSheetLogEditorProps {
  dateStr: string | null;
  onClose: () => void;
}

interface LogFields {
  flowIntensity: FlowIntensity;
  symptoms: string[];
  moods: string[];
  notes: string;
}

const SAVE_DEBOUNCE_MS = 350;

const FLOW_ACTIVE_CLASS = 'border-rose-400 bg-rose-400 text-white';

export function BottomSheetLogEditor({ dateStr, onClose }: BottomSheetLogEditorProps) {
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('none');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

  // Rapid taps (several symptom/mood chips in a row) should feel instant in the UI but
  // shouldn't each cause their own IndexedDB round-trip. Pending writes are coalesced here
  // and committed once the user pauses, or immediately when the sheet closes / date changes.
  const pendingRef = useRef<{ dateStr: string; fields: LogFields; flowChanged: boolean } | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const commitPending = async () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    const pending = pendingRef.current;
    if (!pending) return;
    pendingRef.current = null;

    await withSync(() =>
      db.dailyLogs.put({
        date: pending.dateStr,
        flowIntensity: pending.fields.flowIntensity === 'none' ? undefined : pending.fields.flowIntensity,
        symptoms: pending.fields.symptoms,
        moods: pending.fields.moods,
        notes: pending.fields.notes || undefined,
        updatedAt: Date.now(),
      }),
    );

    // Cycle stats are a derived cache rebuilt from the *entire* log history, which is real
    // I/O (full table read + clear + bulk write) — running it in the background instead of
    // blocking on it here is what keeps a single flow tap from feeling slow to save.
    if (pending.flowChanged) {
      withSync(() => syncCyclesTable()).catch((err) => console.error('Gagal menyinkronkan siklus', err));
    }
  };

  useEffect(() => {
    if (!dateStr) return;
    let cancelled = false;
    // Switching to a different day (or closing) must flush whatever was pending for the
    // previous day first, otherwise a fast tap-then-swipe could drop the last edit.
    commitPending();
    (async () => {
      const existing = await db.dailyLogs.get(dateStr);
      if (cancelled) return;
      setFlowIntensity(existing?.flowIntensity ?? 'none');
      setSymptoms(existing?.symptoms ?? []);
      setMoods(existing?.moods ?? []);
      setNotes(existing?.notes ?? '');
    })();
    return () => {
      cancelled = true;
      commitPending();
    };
  }, [dateStr]);

  const persist = (fields: LogFields, flowChanged = false) => {
    if (!dateStr) return;
    pendingRef.current = {
      dateStr,
      fields,
      flowChanged: flowChanged || pendingRef.current?.flowChanged || false,
    };
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(async () => {
      await commitPending();
      setSaved(true);
      setTimeout(() => setSaved(false), 1200);
    }, SAVE_DEBOUNCE_MS);
  };

  const handleClose = () => {
    commitPending();
    onClose();
  };

  const toggle = (list: string[], key: string) => (list.includes(key) ? list.filter((k) => k !== key) : [...list, key]);

  if (!dateStr) return null;

  const title = format(parseISO(dateStr), "EEEE, d MMMM yyyy", { locale: localeId });

  return (
    <Sheet open={!!dateStr} onClose={handleClose} title={title}>
      <div className="space-y-6 pb-4">
        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">Flow / Menstruasi</h3>
          <div className="flex flex-wrap gap-2">
            {FLOW_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  const next = flowIntensity === opt.key ? 'none' : opt.key;
                  setFlowIntensity(next);
                  persist({ flowIntensity: next, symptoms, moods, notes }, true);
                }}
                className={`min-h-11 rounded-full border px-4 py-2 text-sm font-medium transition active:scale-95 ${
                  flowIntensity === opt.key
                    ? FLOW_ACTIVE_CLASS
                    : 'border-rose-200 bg-white text-rose-900 hover:bg-rose-50 dark:border-stone-700 dark:bg-stone-800 dark:text-rose-100 dark:hover:bg-stone-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">Gejala</h3>
          <div className="flex flex-wrap gap-2">
            {SYMPTOM_OPTIONS.map((opt) => (
              <Chip
                key={opt.key}
                label={opt.label}
                emoji={opt.emoji}
                active={symptoms.includes(opt.key)}
                activeClassName={opt.key === 'severe_pain' ? 'border-red-600 bg-red-600 text-white' : undefined}
                onClick={() => {
                  const next = toggle(symptoms, opt.key);
                  setSymptoms(next);
                  persist({ flowIntensity, symptoms: next, moods, notes });
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">Mood</h3>
          <div className="flex flex-wrap gap-2">
            {MOOD_OPTIONS.map((opt) => (
              <Chip
                key={opt.key}
                label={opt.label}
                emoji={opt.emoji}
                active={moods.includes(opt.key)}
                onClick={() => {
                  const next = toggle(moods, opt.key);
                  setMoods(next);
                  persist({ flowIntensity, symptoms, moods: next, notes });
                }}
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-semibold text-rose-950 dark:text-rose-50">Catatan</h3>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              persist({ flowIntensity, symptoms, moods, notes: e.target.value });
            }}
            placeholder="Tulis catatan tambahan di sini..."
            rows={3}
            className="w-full rounded-2xl border border-rose-200 p-3 text-sm text-rose-950 placeholder:text-rose-300 focus:border-rose-400 focus:outline-none dark:border-stone-700 dark:bg-stone-800 dark:text-rose-50 dark:placeholder:text-stone-500"
          />
        </section>

        <p className={`text-center text-xs text-emerald-600 transition-opacity dark:text-emerald-400 ${saved ? 'opacity-100' : 'opacity-0'}`}>
          Tersimpan otomatis ✓
        </p>
      </div>
    </Sheet>
  );
}
