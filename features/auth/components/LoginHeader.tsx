export function LoginHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-default-200 bg-white px-4 sm:px-8">
      <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
        AT
      </span>
      <div>
        <p className="text-sm font-bold leading-tight text-default-900">ArreTech</p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Gestión operativa</p>
      </div>
    </header>
  );
}
