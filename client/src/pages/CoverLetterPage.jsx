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
    <div className="max-w-6xl mx-auto px-4 py-8" >
      <div className="w-full mx-auto space-y-4">
        <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />
        <AIGateModal open={showAiGate} onClose={() => setShowAiGate(false)} />
        
        <CoverLetterGenerator
          isSignedIn={isSignedIn}
          getToken={getToken}
          onRequireAuth={() => setShowAiGate(true)}
          onError={(message) => setNotice({ type: 'error', message })}
          allowUpload
        />
      </div>
    </div>
  )
}