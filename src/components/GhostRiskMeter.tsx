import { LikelihoodBar } from './LikelihoodBar'
import { ghostRiskColor, type GhostRiskResult } from '../lib/ghostRisk'

export function GhostRiskMeter({ risk, size = 'md' }: { risk: GhostRiskResult; size?: 'sm' | 'md' }) {
  if (!risk.applicable) {
    return <span className="text-sm text-slate-400">Resolved — n/a</span>
  }

  return (
    <div>
      <LikelihoodBar value={risk.score} size={size} colorFn={ghostRiskColor} />
      {risk.reasons.length > 0 && (
        <p className="mt-1 text-xs text-slate-400">{risk.reasons.join(' · ')}</p>
      )}
    </div>
  )
}
