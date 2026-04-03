import { DeleteIcon, Trash2Icon, UserIcon } from 'lucide-react'
import React, { useEffect } from 'react'

export default function PersonalinfoForm({ data, onChange, removeBg, setRemoveBg }) {

    const handleChange = (field, value) => {
        onChange(field, value);
    }

    useEffect(() => {
        console.log(data.image);
    }, [data.image]);

    return (
        <div className=''>
            <h3 className='text-lg font-semibold text-gray-900'>Personal Information</h3>
            <p className='text-sm text-gray-600'>Fill in your details.</p>

            <div className='inline-flex items-center gap-4'>

                {/* Image upload and preview */}
                <div>
                    <label htmlFor="imageUpload" className='cursor-pointer'>
                        {data.image ? (
                            <img
                                src={typeof data.image === 'string'
                                    ? data.image
                                    : URL.createObjectURL(data.image)}
                                alt="profile"
                                className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300'
                            />
                        ) : (

                            <div className='inline-flex items-center gap-2 mt-5 text-slate-600 hover:text-slate-700 cursor-pointer'>
                                <UserIcon className='size-10 p-2.5 border rounded-full' />
                                upload photo
                            </div>
                        )}

                        <input
                            id="imageUpload"
                            type="file"
                            accept='image/*'
                            className='hidden'
                            onChange={(e) => handleChange('image', e.target.files[0])}
                        />
                    </label>
                </div>

                {/* Delete button and toggle switch for background removal */}
                <div>
                    {data.image && (
                        <div className='flex flex-col items-start gap-3 mt-2'>
                            {/* Delete button */}
                            <button onClick={() => handleChange('image', null)}>
                                <Trash2Icon className='size-5 text-red-600 hover:bg-red-100 rounded transition-colors p-1' />
                            </button>

                            {/* Toggle switch */}
                            <label className="flex items-center cursor-pointer gap-2">

                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={removeBg}
                                        onChange={() => setRemoveBg(prev => !prev)}
                                        className="sr-only"
                                    />

                                    {/* Background track */}
                                    <div className={`w-10 h-5 rounded-full transition-colors ${removeBg ? 'bg-green-600' : 'bg-gray-300'}`}></div>
                                    
                                    {/* Toggle knob */}
                                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transform transition-transform ${removeBg ? 'translate-x-5' : ''}`}></div>                  
                                </div>

                                <span className="text-sm text-gray-600">Remove Background</span>
                            
                            </label>

                        </div>
                    )}
                </div>
            </div>


        </div>
    );
}