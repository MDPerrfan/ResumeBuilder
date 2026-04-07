import { Lightbulb, Plus, Trash } from 'lucide-react'
import React from 'react'

export default function SkillsForm({ data, onChange }) {
  const addSkill = () => {
    onChange([...(data || []), ''])
  }

  const removeSkill = (index) => {
    onChange((data || []).filter((_, i) => i !== index))
  }

  const updateSkill = (index, value) => {
    const updated = [...(data || [])]
    updated[index] = value
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Skills</h3>
          <p className='text-sm text-gray-500'>Add your core technical and professional skills.</p>
        </div>
        <button onClick={addSkill} className='flex items-center justify-center gap-2 py-2 px-3 bg-purple-50 text-purple-700 text-sm rounded-lg hover:bg-purple-100 transition-colors cursor-pointer'>
          <Plus className='size-4' />
          Add Skill
        </button>
      </div>

      {(data || []).length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <Lightbulb className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
          <p>No skills added yet.</p>
          <p className='text-sm text-gray-500'>Click "Add Skill" to get started</p>
        </div>
      ) : (
        <div className='space-y-3'>
          {(data || []).map((skill, index) => (
            <div key={index} className='flex gap-2'>
              <input
                value={skill || ''}
                onChange={(e) => updateSkill(index, e.target.value)}
                type='text'
                placeholder='Skill name'
                className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full'
              />
              <button onClick={() => removeSkill(index)} className='text-red-400 hover:text-red-600 transition-colors px-2'>
                <Trash className='size-4' />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
