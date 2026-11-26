export function LoginHeader() {
  return (
    <header className="flex h-[72px] shrink-0 items-center gap-3 border-b border-default-200 bg-white px-4 sm:px-12">
      <span className="flex size-9 items-center justify-center rounded-lg bg-primary text-base font-bold text-primary-foreground">
        AT
      </span>
      <div>
        <p className="text-base font-bold leading-tight text-default-900">ArreTech</p>
        <p className="text-[11px] font-semibold uppercase tracking-wider text-primary">Gestión operativa</p>
      </div>
    </header>
  );
}
