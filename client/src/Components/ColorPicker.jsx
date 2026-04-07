import { Check, Palette } from 'lucide-react';
import React from 'react'

export default function colorPicker({ onChange, accentColor }) {

    const colors = [
        { name: "Black", value: "#000000" },
        { name: "Dark Gray", value: "#333333" },
        { name: "Gray", value: "#666666" },
        { name: "Light Gray", value: "#999999" },
        { name: "Red", value: "#b40202" },
        { name: "Army Green", value: "#454B1B" },
        { name: "Cadmium Green", value: "#097969" },
        { name: "Blue", value: "#0000FF" },
        { name: "Purple", value: "#800080" },
        { name: "Orange", value: "#FFA500" },
        { name: "Pink", value: "#FFC0CB" },
        { name: "Brown", value: "#A52A2A" },
        { name: "Teal", value: "#14B8A6" },
        { name: "Indigo", value: "#4F46E5" },
        { name: "Cyan", value: "#00FFFF" },
        { name: "Lime", value: "#00FF00" },

    ];

    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <div className='relative'>

            <button onClick={() => setIsOpen(!isOpen)} className='flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-300 hover:ring transition-all px-3 py-2 rounded-lg mx-2'>

                <Palette size={16} /><span className='max-sm:hidden'>Accent</span>

            </button>

            {isOpen && (
                <div className='absolute top-full left-0 right-0 w-60 rounded-md bg-white shadow-lg border border-gray-200 p-3 mt-2 z-10 grid grid-cols-4 gap-1'>
                    {colors.map((color) => (
                        <div className='relative cursor-pointer group flex flex-col' key={color.value} onClick={() => { onChange(color.value); setIsOpen(false) }}>

                            <div className='w-12 h-12 rounded-full border-2 border-transparent group-hover:border-black/25 transition-colors' style={{ backgroundColor: color.value }}>

                                {accentColor === color.value && (
                                    <div className={'absolute inset-0 flex items-center justify-center rounded-full bg-black/20'} >
                                        <Check className='size-4 text-white' />
                                    </div>
                                )}
                            </div>

                            {/* Color name */}
                            <p className='text-[10px] mt-1 text-gray-600 text-center'>
                                {color.name}
                            </p>
                        </div>


                    ))}
                </div>
            )}

        </div>
    )
}
