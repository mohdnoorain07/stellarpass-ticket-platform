import { type FormEvent } from 'react';

export interface EventFormData {
  title: string;
  organizer: string;
  price: string;
  totalSupply: string;
  createOnChain: boolean;
  creatorShareBps: string;
  platformShareBps: string;
}

interface EventFormProps {
  form: EventFormData;
  onChange: (field: keyof EventFormData, value: string | boolean) => void;
  isSubmitting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, placeholder, type, min }: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  min?: string;
}) {
  return (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded border border-[var(--color-border)] bg-[var(--color-bg)] px-4 py-2.5 text-sm text-[var(--color-text)] outline-none transition-all duration-200 placeholder:text-[var(--color-text-tertiary)] focus:border-[var(--color-brand)] focus:ring-1 focus:ring-[var(--color-brand)]"
      placeholder={placeholder}
      type={type || 'text'}
      min={min}
    />
  );
}

export function EventForm({ form, onChange, isSubmitting, onSubmit }: EventFormProps) {
  return (
    <section className="max-w-xl mx-auto animate-slide-up">
      <div className="card-altius">
        <h2 className="text-xl font-semibold text-[var(--color-text)] tracking-tight">Host New Event</h2>
        <p className="mt-1.5 text-sm text-[var(--color-text-secondary)] leading-relaxed">
          Create a local draft or publish on-chain to Stellar testnet.
        </p>

        <form onSubmit={onSubmit} className="mt-7 space-y-5">
          <Field label="Event Title">
            <Input value={form.title} onChange={(v) => onChange('title', v)} placeholder="Midnight Jazz Club" />
          </Field>

          <Field label="Organizer Name">
            <Input value={form.organizer} onChange={(v) => onChange('organizer', v)} placeholder="Apex Promotions" />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="Price (XLM)">
              <Input value={form.price} onChange={(v) => onChange('price', v)} type="number" min="1" />
            </Field>
            <Field label="Total Supply">
              <Input value={form.totalSupply} onChange={(v) => onChange('totalSupply', v)} type="number" min="1" />
            </Field>
          </div>

          <label className="flex items-start gap-3 pt-2 cursor-pointer group">
            <input
              type="checkbox"
              checked={form.createOnChain}
              onChange={(e) => onChange('createOnChain', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-brand)] focus:ring-[var(--color-brand)]"
            />
            <div>
              <span className="text-sm font-medium text-[var(--color-text)] group-hover:text-[var(--color-brand)] transition-colors">
                Publish on-chain via Soroban
              </span>
              <p className="text-xs text-[var(--color-text-tertiary)] mt-0.5">Requires Freighter signature and testnet gas fee.</p>
            </div>
          </label>

          {form.createOnChain && (
            <div className="rounded border border-[var(--color-border)] bg-[var(--color-brand-subtle)]/20 p-4 grid grid-cols-2 gap-4 animate-slide-down">
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Creator Royalty (bps)</label>
                <Input value={form.creatorShareBps} onChange={(v) => onChange('creatorShareBps', v)} type="number" />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--color-text-tertiary)] mb-1.5">Platform Share (bps)</label>
                <Input value={form.platformShareBps} onChange={(v) => onChange('platformShareBps', v)} type="number" />
              </div>
              <p className="col-span-2 text-[10px] text-[var(--color-text-tertiary)]">
                10,000 bps = 100%. Royalties split automatically on resale.
              </p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full !text-sm !py-3"
          >
            {isSubmitting ? 'Publishing...' : form.createOnChain ? 'Publish Event' : 'Create Local Draft'}
          </button>
        </form>
      </div>
    </section>
  );
}
