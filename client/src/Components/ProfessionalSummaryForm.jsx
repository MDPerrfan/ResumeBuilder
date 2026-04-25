import {  Sparkles } from 'lucide-react'
import React from 'react'

export default function ProfessionalSummaryForm({data, onChange, onEnhanceSummary, isEnhancing}) {
  return (
    <div className='space-y-4 '>
        <div className='flex items-center justify-between'>

            <div>
                <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Professional Summary</h3>
                <p className='text-sm text-gray-500 '>Add your about your role.</p>

            </div>

            <button onClick={onEnhanceSummary} className='flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 text-purple-500 text-sm rounded-md'>
                <Sparkles className='size-4'/>
                {isEnhancing ? 'Enhancing...' : 'AI Inhance'}
            </button>

        </div>
        <div className='mt-6'>
            <textarea value={data||""} onChange={(e)=>onChange(e.target.value)} rows={7} className='w-full p-3 mt-2 border text-sm border-gray-300 rounded-lg focus:ring focus:ring-purple-600 focus:border-purple-600 outline-none transition-colors resize-none'  placeholder='Write a compelling highlights your key strengths and career objectives...'/>
        </div>
    </div>
  )
}
