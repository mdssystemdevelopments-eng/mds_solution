type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  queryPlaceholder: string;
  onReload: () => void;
  onCreate: () => void;
  createLabel?: string;
};

export function AdminListToolbar({
  query,
  onQueryChange,
  queryPlaceholder,
  onReload,
  onCreate,
  createLabel = "Novo",
}: Props) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between sm:flex-1">
        <input
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder={queryPlaceholder}
          className="w-full rounded-xl border border-zinc-700 bg-ink-muted px-4 py-3 text-sm text-white outline-none focus:border-neon-blue sm:max-w-md"
        />
        <button
          type="button"
          onClick={onReload}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-900/40"
        >
          Recarregar
        </button>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="rounded-xl bg-neon-blue px-4 py-2 text-sm font-bold text-ink hover:brightness-110"
      >
        {createLabel}
      </button>
    </div>
  );
}
