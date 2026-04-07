import { Languages, Plus, Trash } from 'lucide-react'
import React from 'react'

const PROFICIENCY_LEVELS = ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic']

export default function LanguageForm({ data, onChange }) {
  const addLanguage = () => {
    onChange([...data, { name: '', proficiency: 'Fluent' }])
  }

  const removeLanguage = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateLanguage = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Languages</h3>
          <p className='text-sm text-gray-500'>Show your language proficiency.</p>
        </div>
        <button onClick={addLanguage} className='flex items-center justify-center gap-2 py-2 px-3 bg-cyan-50 text-cyan-700 text-sm rounded-lg hover:bg-cyan-100 transition-colors cursor-pointer'>
          <Plus className='size-4' />
          Add Language
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Languages className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
          <p>No languages added yet.</p>
          <p className='text-sm text-gray-500'>Click "Add Language" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((language, index) => (
            <div key={index} className='p-4 border border-gray-300 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Language #{index + 1}</h4>
                <button onClick={() => removeLanguage(index)} className='text-red-400 hover:text-red-600 transition-colors'>
                  <Trash className='size-4' />
                </button>
              </div>
              <div className='grid md:grid-cols-2 gap-3'>
                <input value={language.name || ''} onChange={(e) => updateLanguage(index, 'name', e.target.value)} type='text' placeholder='Language' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />
                <select value={language.proficiency || 'Fluent'} onChange={(e) => updateLanguage(index, 'proficiency', e.target.value)} className='px-3 py-2 text-sm border border-gray-200 rounded-lg'>
                  {PROFICIENCY_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
