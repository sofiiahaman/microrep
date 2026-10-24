const TONES = {
  amber: 'bg-amber-500/10 text-amber-400 ring-amber-500/20',
  orange: 'bg-orange-500/10 text-orange-400 ring-orange-500/20',
  emerald: 'bg-emerald-500/10 text-emerald-400 ring-emerald-500/20',
  indigo: 'bg-indigo-500/10 text-indigo-400 ring-indigo-500/20',
};

function StatCard({ title, value, subtitle, icon: Icon, tone = 'indigo' }) {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-800 bg-[#0b1020] p-5 shadow-lg shadow-black/20 transition-colors duration-200 hover:border-slate-700">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium text-slate-400">{title}</span>
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ${TONES[tone]}`}
        >
          {Icon && <Icon className="h-5 w-5" />}
        </span>
      </div>

      <div>
        <div className="text-3xl font-bold tabular-nums tracking-tight text-white">
          {value}
        </div>
        <p className="mt-1 text-xs text-slate-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default StatCard;
