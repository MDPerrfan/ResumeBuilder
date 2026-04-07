import { GraduationCap, Plus, Trash } from 'lucide-react'
import React from 'react'

export default function EducationForm({ data, onChange }) {
  const addEducation = () => {
    onChange([
      ...data,
      {
        institution: '',
        degree: '',
        field: '',
        graduation_date: '',
        gpa: '',
      },
    ])
  }

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateEducation = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Education</h3>
          <p className='text-sm text-gray-500'>Add your academic background.</p>
        </div>
        <button onClick={addEducation} className='flex items-center justify-center gap-2 py-2 px-3 bg-indigo-50 text-indigo-700 text-sm rounded-lg hover:bg-indigo-100 transition-colors cursor-pointer'>
          <Plus className='size-4' />
          Add Education
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <GraduationCap className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
          <p>No education records added yet.</p>
          <p className='text-sm text-gray-500'>Click "Add Education" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((edu, index) => (
            <div key={index} className='p-4 border border-gray-300 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Education #{index + 1}</h4>
                <button onClick={() => removeEducation(index)} className='text-red-400 hover:text-red-600 transition-colors'>
                  <Trash className='size-4' />
                </button>
              </div>

              <div className='grid md:grid-cols-2 gap-3'>
                <input value={edu.institution || ''} onChange={(e) => updateEducation(index, 'institution', e.target.value)} type='text' placeholder='Institution' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />
                <input value={edu.degree || ''} onChange={(e) => updateEducation(index, 'degree', e.target.value)} type='text' placeholder='Degree' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />
                <input value={edu.field || ''} onChange={(e) => updateEducation(index, 'field', e.target.value)} type='text' placeholder='Field of Study' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />
                <input value={edu.graduation_date || ''} onChange={(e) => updateEducation(index, 'graduation_date', e.target.value)} type='month' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />
                <input value={edu.gpa || ''} onChange={(e) => updateEducation(index, 'gpa', e.target.value)} type='text' placeholder='GPA (optional)' className='px-3 py-2 text-sm border border-gray-200 rounded-lg md:col-span-2' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
