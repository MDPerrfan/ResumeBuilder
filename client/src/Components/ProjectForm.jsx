import { FolderOpen, Plus, Trash } from 'lucide-react'
import React from 'react'

export default function ProjectForm({ data, onChange }) {
  const addProject = () => {
    onChange([
      ...data,
      {
        title: '',
        description: '',
        live_url: '',
        github_repo: '',
      },
    ])
  }

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index))
  }

  const updateProject = (index, field, value) => {
    const updated = [...data]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  return (
    <div className='space-y-4'>
      <div className='flex items-center justify-between'>
        <div>
          <h3 className='text-lg font-semibold text-gray-900'>Projects</h3>
          <p className='text-sm text-gray-500'>Add your impactful project work.</p>
        </div>
        <button onClick={addProject} className='flex items-center justify-center gap-2 py-2 px-3 bg-violet-50 text-violet-700 text-sm rounded-lg hover:bg-violet-100 transition-colors cursor-pointer'>
          <Plus className='size-4' />
          Add Project
        </button>
      </div>

      {data.length === 0 ? (
        <div className='text-center py-8 text-gray-500'>
          <FolderOpen className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
          <p>No projects added yet.</p>
          <p className='text-sm text-gray-500'>Click "Add Project" to get started</p>
        </div>
      ) : (
        <div className='space-y-4'>
          {data.map((project, index) => (
            <div key={index} className='p-4 border border-gray-300 rounded-lg space-y-3'>
              <div className='flex justify-between items-start'>
                <h4>Project #{index + 1}</h4>
                <button onClick={() => removeProject(index)} className='text-red-400 hover:text-red-600 transition-colors'>
                  <Trash className='size-4' />
                </button>
              </div>

              <div className='space-y-3'>
                <input value={project.title || project.name || ''} onChange={(e) => updateProject(index, 'title', e.target.value)} type='text' placeholder='Project title' className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full' />
                <textarea value={project.description || ''} onChange={(e) => updateProject(index, 'description', e.target.value)} placeholder='Project description' rows={4} className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full resize-none' />
                <input value={project.live_url || ''} onChange={(e) => updateProject(index, 'live_url', e.target.value)} type='url' placeholder='Live URL (optional)' className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full' />
                <input value={project.github_repo || ''} onChange={(e) => updateProject(index, 'github_repo', e.target.value)} type='url' placeholder='GitHub Repo URL (optional)' className='px-3 py-2 text-sm border border-gray-200 rounded-lg w-full' />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
