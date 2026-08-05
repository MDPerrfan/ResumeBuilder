import React from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import CoverLetterGenerator from '../Components/CoverLetterGenerator'
import InlineNotice from '../Components/InlineNotice'
import AIGateModal from '../Components/AIGateModal'

export default function CoverLetterPage() {
  const { getToken } = useAuth()
  const { isSignedIn } = useUser()
  const [notice, setNotice] = React.useState({ type: '', message: '' })
  const [showAiGate, setShowAiGate] = React.useState(false)

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />
      <AIGateModal open={showAiGate} onClose={() => setShowAiGate(false)} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Cover Letter Generator</h1>
        <p className="text-sm text-slate-500 mt-1">
          Upload your resume and describe the role to generate a tailored cover letter.
        </p>
      </div>
      <CoverLetterGenerator
        isSignedIn={isSignedIn}
        getToken={getToken}
        onRequireAuth={() => setShowAiGate(true)}
        onError={(message) => setNotice({ type: 'error', message })}
        allowUpload
      />
    </div>
  )
}
