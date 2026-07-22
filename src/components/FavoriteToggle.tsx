export function FavoriteToggle({
  favorite,
  onToggle,
  size = 'md',
}: {
  favorite: boolean
  onToggle: () => void
  size?: 'sm' | 'md'
}) {
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onToggle()
      }}
      aria-label={favorite ? 'Remove from favorites' : 'Mark as favorite'}
      aria-pressed={favorite}
      className={`leading-none transition-colors ${size === 'sm' ? 'text-lg' : 'text-2xl'} ${
        favorite ? 'text-amber-400 hover:text-amber-500' : 'text-slate-300 hover:text-amber-400 dark:text-slate-600'
      }`}
    >
      {favorite ? '★' : '☆'}
    </button>
  )
}
