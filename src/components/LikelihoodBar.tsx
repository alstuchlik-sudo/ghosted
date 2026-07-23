import { colorClasses, likelihoodColor, type StatusInfo } from '../lib/status'

const BAR_FILL: Record<string, string> = {
  teal: 'bg-teal-500',
  amber: 'bg-amber-500',
  coral: 'bg-rose-500',
}

export function LikelihoodBar({
  value,
  size = 'md',
  colorFn = likelihoodColor,
}: {
  value: number
  size?: 'sm' | 'md'
  colorFn?: (value: number) => StatusInfo['color']
}) {
  const color = colorFn(value)
  const c = colorClasses[color]
  const height = size === 'sm' ? 'h-1.5' : 'h-2'

  return (
    <div className="flex items-center gap-2">
      <div className={`w-16 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800 ${height}`}>
        <div className={`h-full rounded-full ${BAR_FILL[color]}`} style={{ width: `${value}%` }} />
      </div>
      <span className={`text-xs font-medium tabular-nums ${c.text}`}>{value}%</span>
    </div>
  )
}
