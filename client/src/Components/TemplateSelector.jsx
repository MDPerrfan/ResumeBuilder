import { Check, Layout } from 'lucide-react';
import React from 'react'

export default function TemplateSelector({ selectedTemplate, onChange }) {

    const [isOpen, setIsOpen] = React.useState(false);
    const templates = [
        { id: 'classic', name: 'Classic', preview:" A clean and simple design" },
        { id: 'modern', name: 'Modern', preview:" A contemporary look with bold elements" },
        { id: 'minimal-image', name: 'Minimal with Image', preview:" A sleek design that highlights your photo" },
        { id: 'minimal', name: 'Minimal', preview:" A clean and uncluttered layout" }
    ];

  return (
    <div className='relative'>
       <button onClick={()=>setIsOpen(!isOpen)} className='flex items-center justify-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-300 hover:ring transition-all px-3 py-2 rounded-lg'>
        <Layout className='size-5 text-gray-600 hover:text-gray-800 transition-colors' />
       </button>
         {isOpen && (
            <div className='absolute top-full w-xs rounded-md bg-white shadow-lg border border-gray-200 p-3 space-y-3 mt-2 z-10'>
                {templates.map((temp) => (
                    <div  key={temp.id} onClick={() => { onChange(temp.id); setIsOpen(false) }} className={`relative px-4 py-3 cursor-pointer ${selectedTemplate === temp.id ? 'border-purple-500 bg-purple-200' : 'border border-gray-200 hover:border-gray-400 hover:bg-gray-100'}`}>
                      
                        {
                            selectedTemplate === temp.id && (
                                <div className='absolute top-2 right-2'>
                                    <div className='size-5 bg-purple-400 rounded-full flex items-center justify-center'>
                                        <Check className='w-3 h-3 text-white'/>
                                    </div>
                                </div>
                            )
                        }

                        <div>
                            <h4 className='font-medium text-gray-800'>{temp.name}</h4>
                            <div className='mt-2 p-2 bg-purple-50 rounded text-xs text-gray-500 italic'>{temp.preview}</div>
                        </div>

                    </div>
                ))}
            </div>
         )}

    </div>
  )
}
