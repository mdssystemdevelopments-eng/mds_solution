"use client";

import type { ReactNode } from "react";

export function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="cms-field">
      <span className="cms-field__label">{label}</span>
      {hint && <span className="cms-field__hint">{hint}</span>}
      {children}
    </label>
  );
}

export function Input({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="cms-input"
    />
  );
}

export function Textarea({
  value,
  onChange,
  rows = 4,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      rows={rows}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="cms-input cms-input--area"
    />
  );
}

export function CardBox({
  title,
  index,
  onRemove,
  children,
}: {
  title: string;
  index: number;
  onRemove?: () => void;
  children: ReactNode;
}) {
  return (
    <div className="cms-card">
      <div className="cms-card__head">
        <span className="cms-card__title">
          {title} #{index + 1}
        </span>
        {onRemove && (
          <button type="button" onClick={onRemove} className="cms-card__remove">
            Remover
          </button>
        )}
      </div>
      <div className="cms-card__body">{children}</div>
    </div>
  );
}

export function AddButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="cms-add-btn">
      + {label}
    </button>
  );
}

export function SectionBlock({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="cms-block">
      <h3 className="cms-block__title">{title}</h3>
      <div className="cms-block__grid">{children}</div>
    </div>
  );
}
