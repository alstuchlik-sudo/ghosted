export function Ghost({ className = 'h-6 w-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path
        d="M32 6C18.75 6 8 16.75 8 30v22a2 2 0 0 0 3.28 1.54L16 49.6l5.72 4.5a2 2 0 0 0 2.48 0L30 49.6l2.28 4.5a2 2 0 0 0 2.48 0L40 49.6l4.72 4.5A2 2 0 0 0 48 52.5V30C56 16.75 45.25 6 32 6Z"
        className="fill-current"
      />
      <circle cx="24" cy="28" r="3.2" className="fill-white dark:fill-slate-900" />
      <circle cx="40" cy="28" r="3.2" className="fill-white dark:fill-slate-900" />
    </svg>
  )
}
