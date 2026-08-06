import React from 'react'
import AtsChecker from '../Components/AtsChecker'
import InlineNotice from '../Components/InlineNotice'

export default function AtsCheckPage() {
  const [notice, setNotice] = React.useState({ type: '', message: '' })

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />

      <AtsChecker
        onError={(message) => setNotice({ type: 'error', message })}
      />
    </div>
  )
}
