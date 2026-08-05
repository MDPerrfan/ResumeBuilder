import React from 'react'
import { Link } from 'react-router-dom'
import { ChevronDown, Target, FileText } from 'lucide-react'

const items = [
  { to: '/features/ats-check', label: 'ATS Check', desc: 'Score & improve your resume', icon: Target },
  { to: '/features/cover-letter', label: 'Cover Letter', desc: 'AI-tailored letters', icon: FileText },
]

export default function FeaturesDropdown({ className = '' }) {
  const [open, setOpen] = React.useState(false)
  const ref = React.useRef(null)

  React.useEffect(() => {
    const close = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 transition"
      >
        Features
        <ChevronDown className={`size-4 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1.5 w-56 rounded-xl border border-slate-200 bg-white shadow-lg py-1.5 z-50">
          {items.map(({ to, label, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setOpen(false)}
              className="flex items-start gap-3 px-3 py-2.5 hover:bg-violet-50 transition"
            >
              <Icon className="size-4 text-violet-600 mt-0.5 shrink-0" />
              <div>
                <p className="text-sm font-medium text-slate-900">{label}</p>
                <p className="text-xs text-slate-500">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
