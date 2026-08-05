import React from 'react'
import AtsChecker from '../Components/AtsChecker'
import InlineNotice from '../Components/InlineNotice'

export default function AtsCheckPage() {
  const [notice, setNotice] = React.useState({ type: '', message: '' })

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">ATS Compatibility Check</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume and paste a job description to get an instant score and improvement tips.
        </p>
      </div>
      <AtsChecker
        onError={(message) => setNotice({ type: 'error', message })}
      />
    </div>
  )
}
