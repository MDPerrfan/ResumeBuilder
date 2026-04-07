import { ListPlus, Plus, Trash } from 'lucide-react'
import React from 'react'

export default function CustomSectionForm({ data, onChange }) {
  const addSection = () => {
    onChange([...data, { title: '', items: [''] }])
  }

  const removeSection = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateSection = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const addItem = (sectionIndex) => {
    const updated = [...data]
    const items = updated[sectionIndex].items || []
    updated[sectionIndex] = { ...updated[sectionIndex], items: [...items, ''] }
    onChange(updated)
  }

  const updateItem = (sectionIndex, itemIndex, value) => {
    const updated = [...data]
    const items = [...(updated[sectionIndex].items || [])]
    items[itemIndex] = value
    updated[sectionIndex] = { ...updated[sectionIndex], items }
    onChange(updated)
  }

  const removeItem = (sectionIndex, itemIndex) => {
    const updated = [...data]
    const items = [...(updated[sectionIndex].items || [])].filter((_, i) => i !== itemIndex)
    updated[sectionIndex] = { ...updated[sectionIndex], items: items.length ? items : [''] }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Other (Custom Section)</h3>
          <p className='text-sm text-gray-500'>Add certifications, achievements, interests, or anything else.</p>
        </div>
        <button onClick={addSection} className='flex items-center justify-center gap-2 py-2 px-3 bg-amber-50 text-amber-700 text-sm rounded-lg hover:bg-amber-100 transition-colors cursor-pointer'>
          <Plus className='size-4' />
          Add Section
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <ListPlus className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
          <p>No custom sections added yet.</p>
          <p className='text-sm text-gray-500'>Click "Add Section" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((section, sectionIndex) => (
            <div key={sectionIndex} className='p-4 border border-gray-300 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Section #{sectionIndex + 1}</h4>
                <button onClick={() => removeSection(sectionIndex)} className='text-red-400 hover:text-red-600 transition-colors'>
                  <Trash className='size-4' />
                </button>
              </div>

              <input value={section.title || ''} onChange={(e) => updateSection(sectionIndex, 'title', e.target.value)} type='text' placeholder='Section title (e.g. Certifications)' className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full' />

              <div className='space-y-2'>
                {(section.items || []).map((item, itemIndex) => (
                  <div key={itemIndex} className='flex gap-2'>
                    <input value={item || ''} onChange={(e) => updateItem(sectionIndex, itemIndex, e.target.value)} type='text' placeholder='Section item' className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full' />
                    <button onClick={() => removeItem(sectionIndex, itemIndex)} className='text-red-400 hover:text-red-600 transition-colors px-2'>
                      <Trash className='size-4' />
                    </button>
                  </div>
                ))}
              </div>

              <button onClick={() => addItem(sectionIndex)} className='text-sm text-amber-700 hover:text-amber-800 transition-colors cursor-pointer'>
                + Add item
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
