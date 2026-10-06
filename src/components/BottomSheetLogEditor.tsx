import { useEffect, useRef, useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Sheet } from './ui/Sheet';
import { Chip } from './ui/Chip';
import { MoodFace } from './MoodFace';
import { SymptomIcon } from './SymptomIcon';
import { db, type FlowIntensity } from '../db/schema';
import { syncCyclesTable } from '../lib/cycleSync';
import { withSync } from '../lib/syncStatus';
import { getFlowOptions, getMoodOptions, getSymptomOptions } from '../data/phases';
import { useI18n } from '../lib/i18n';

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

const FLOW_ACTIVE_CLASS = 'bg-[#FF8A80] text-[#181818]';

export function BottomSheetLogEditor({ dateStr, onClose }: BottomSheetLogEditorProps) {
  const { t, dateFnsLocale } = useI18n();
  const [flowIntensity, setFlowIntensity] = useState<FlowIntensity>('n');
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [moods, setMoods] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [saved, setSaved] = useState(false);

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
        flowIntensity: pending.fields.flowIntensity === 'n' ? undefined : pending.fields.flowIntensity,
        symptoms: pending.fields.symptoms,
        moods: pending.fields.moods,
        notes: pending.fields.notes || undefined,
        updatedAt: Date.now(),
      }),
    );

    if (pending.flowChanged) {
      withSync(() => syncCyclesTable()).catch((err) => console.error('Gagal menyinkronkan siklus', err));
    }
  };

  useEffect(() => {
    if (!dateStr) return;
    let cancelled = false;
    commitPending();
    (async () => {
      const existing = await db.dailyLogs.get(dateStr);
      if (cancelled) return;
      setFlowIntensity(existing?.flowIntensity ?? 'n');
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

  const title = format(parseISO(dateStr), "EEEE, d MMMM yyyy", { locale: dateFnsLocale });

  return (
    <Sheet open={!!dateStr} onClose={handleClose} title={title}>
      <div className="space-y-6 pb-4">
        <section>
          <h3 className="mb-2 text-sm font-bold">{t.logEditor.flowLabel}</h3>
          <div className="flex flex-wrap gap-2">
            {getFlowOptions(t).map((opt) => (
              <button
                key={opt.key}
                onClick={() => {
                  const next = flowIntensity === opt.key ? 'n' : opt.key;
                  setFlowIntensity(next);
                  persist({ flowIntensity: next, symptoms, moods, notes }, true);
                }}
                className={`min-h-11 rounded-full px-4 py-2 text-sm font-semibold transition active:scale-95 ${
                  flowIntensity === opt.key
                    ? FLOW_ACTIVE_CLASS
                    : 'bg-[var(--surface)] text-[var(--ink)]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold">{t.logEditor.signalsLabel}</h3>
          <div className="flex flex-wrap gap-2">
            {getSymptomOptions(t).map((opt) => (
              <Chip
                key={opt.key}
                label={opt.label}
                icon={<SymptomIcon symptom={opt.key} />}
                active={symptoms.includes(opt.key)}
                activeClassName={opt.key === 'sp' ? 'bg-red-600 text-white' : undefined}
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
          <h3 className="mb-2 text-sm font-bold">{t.logEditor.moodLabel}</h3>
          <div className="flex flex-wrap gap-2">
            {getMoodOptions(t).map((opt) => (
              <button
                key={opt.key}
                type="button"
                aria-pressed={moods.includes(opt.key)}
                onClick={() => {
                  const next = toggle(moods, opt.key);
                  setMoods(next);
                  persist({ flowIntensity, symptoms, moods: next, notes });
                }}
                className={`flex min-h-11 items-center gap-2 rounded-full py-1.5 pl-1.5 pr-4 text-sm font-semibold transition active:scale-95 ${
                  moods.includes(opt.key) ? 'bg-[var(--ink)] text-white dark:text-[#181818]' : 'bg-[var(--surface)] text-[var(--ink)]'
                }`}
              >
                <MoodFace mood={opt.key} size={30} />
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-2 text-sm font-bold">{t.logEditor.notesLabel}</h3>
          <textarea
            value={notes}
            onChange={(e) => {
              setNotes(e.target.value);
              persist({ flowIntensity, symptoms, moods, notes: e.target.value });
            }}
            placeholder={t.logEditor.notesPlaceholder}
            rows={3}
            className="w-full rounded-2xl bg-[var(--surface)] p-3 text-sm text-[var(--ink)] placeholder:text-[var(--muted)] focus:outline-none focus:ring-2 focus:ring-[var(--ink)]"
          />
        </section>

        <p className={`text-center text-xs text-emerald-600 transition-opacity dark:text-emerald-400 ${saved ? 'opacity-100' : 'opacity-0'}`}>
          {t.logEditor.savedAutomatically}
        </p>
      </div>
    </Sheet>
  );
}

