import { Briefcase, Plus, Sparkles, Trash } from 'lucide-react'
import React from 'react'
type Experience = {
  company: string;
  position: string;
  start_date: string;
  end_date: string;
  description: string;
  is_current: boolean;
};
type Props = {
  data: Experience[];
  onChange: (value: Experience[]) => void;
  onEnhanceExperience?: (index: number, description: string) => void;
  enhancingIndex?: number | null;
};
export default function ExperienceForm({ data, onChange, onEnhanceExperience, enhancingIndex = null }: Props) {

  const addExperience = () => {
    const newExperience: Experience = {
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      is_current: false
    };

    onChange([...data, newExperience]);
  };

  const removeExperience = (index: number) => {
    const updated = data.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateExperience = (
    index: number,
    field: keyof Experience,
    value: string | boolean
  ) => {
    const updated = [...data];

    updated[index] = {
      ...updated[index],
      [field]: value
    };

    onChange(updated);
  };

    return (
        <div className='space-y-4 '>
            <div className='flex items-center justify-between'>

                <div>
                    <h3 className='flex items-center gap-2 text-lg font-semibold text-gray-900'>Work Experience</h3>
                    <p className='text-sm text-gray-500'>Add your job experience.</p>

                </div>

                <button onClick={addExperience} className='flex items-center justify-center gap-2 py-2 px-3 bg-green-50 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors cursor-pointer'>
                    <Plus className='size-4' />
                    Add Experience
                </button>

            </div>
            {
                data.length === 0 ? (

                    <div className='text-center py-8 text-gray-500'>
                        <Briefcase className='w-12 h-12 mx-auto mb-3 text-gray-300 ' />
                        <p>No work experience added yet.</p>
                        <p className='text-sm text-gray-500'>Click "Add Experience" to get started</p>
                    </div>

                ) : (

                    <div className='space-y-4'>
                        {data.map((exp, index) => (

                            <div key={index} className='p-4 border border-gray-300 rounded-lg space-y-3'>
                                <div className='flex justify-between items-start'>
                                    <h4>
                                        Experience #{index + 1}
                                    </h4>

                                    <button onClick={() => removeExperience(index)} className='text-red-400 hover:text-red-600 transition-colors'>
                                        <Trash className='size-4' />
                                    </button>
                                </div>

                                <div className='grid  md:grid-cols-2 gap-3'>
                                    <input value={exp.company || ""} onChange={(e) => updateExperience(index, "company", e.target.value)} type="text" placeholder='Comparny Name' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />

                                    <input value={exp.position || ""} onChange={(e) => updateExperience(index, "position", e.target.value)} type="text" placeholder='Job Title' className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />

                                    <input value={exp.start_date || ""} onChange={(e) => updateExperience(index, "start_date", e.target.value)} type="month" className='px-3 py-2 text-sm border border-gray-200 rounded-lg' />

                                    <input value={exp.end_date || ""} onChange={(e) => updateExperience(index, "end_date", e.target.value)} type="month" disabled={exp.is_current} className='px-3 py-2 text-sm border border-gray-100 rounded-lg disabled:bg-gray-100' />

                                    <label htmlFor="" className='flex items-center gap-2'>
                                        <input type="checkbox" checked={exp.is_current || false} onChange={(e) => updateExperience(index, "is_current", e.target.checked)} className='rounded border-gray-300 text-purple-500 focus:ring-purple-600' />
                                        <span className='text-sm text-gray-700'>Currently working here</span>
                                    </label>
                                </div>
                      

                                <div className='space-y-2'>

                                    <div className='flex items-center justify-between'>
                                        <label className='text-sm font-medium text-gray-800'>Job Description</label>
                                        <button onClick={() => onEnhanceExperience?.(index, exp.description || "")} className='flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200 transition-colors disabled:opacity-50'>
                                            <Sparkles className='w-3 h-3' />
                                            {enhancingIndex === index ? "Enhancing..." : "Enhance with AI"}
                                        </button>
                                    </div>

                                    <textarea value={exp.description || ""} onChange={(e) => updateExperience(index, "description", e.target.value)} className='w-full text-sm px-3 py-2 rounded-lg resize-none' name="" id="" placeholder='Describe your key responsibilities and achievements...' />


                                    <div>

                                    </div>

                                </div>

                            </div>

                        ))}
                    </div>
                )
            }
        </div>
    )
}
