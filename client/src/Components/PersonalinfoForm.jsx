import { BriefcaseBusinessIcon, DeleteIcon, FolderGitIcon, GlobeIcon, Link2, MailboxIcon, MapPin, Phone, Trash2Icon, UserIcon, User2Icon } from 'lucide-react'
import React, { useRef } from 'react'

export default function PersonalinfoForm({ data, onChange, removeBg, setRemoveBg }) {
    const fileInputRef = useRef(null);

    const handleChange = (field, value) => {
        onChange(field, value);
    }

    const handleRemoveImage = () => {
        handleChange('image', null);
        if (fileInputRef.current) fileInputRef.current.value = null; // reset file input
    };

    const fields = [
        { key: "full_name", label: 'Full Name', type: 'text', icon: UserIcon, required: true },
        { key: "email", label: 'Email', type: 'email', icon: MailboxIcon, required: true },
        { key: "phone", label: 'Phone', type: 'tel', icon: Phone },
        { key: "address", label: 'Address', type: 'text', icon: MapPin },
        { key: "profession", label: 'Profession', type: 'text', icon: BriefcaseBusinessIcon },
        { key: "website", label: 'Website', type: 'url', icon: GlobeIcon },
        { key: "linkedin", label: 'LinkedIn', type: 'url', icon: User2Icon },
        { key: "github", label: 'GitHub', type: 'url', icon: FolderGitIcon },
    ]


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
                                className='w-16 h-16 rounded-full object-cover mt-5 ring ring-slate-300 hover:opacity-50'
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
                            <button onClick={handleRemoveImage}>
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

            <div>
                {fields.map(({ key, label, type, icon: Icon, required }) => (
                    <div key={key} className='space-y-2 mt-5'>
                        <label className='flex items-center text-sm font-medium text-gray-600 mb-1'>
                            <Icon className='inline-block mr-2 size-4' />
                            {label}
                            {required && <span className='text-red-500 ml-1'>*</span>}
                        </label>
                        <input
                            type={type}
                            value={data[key] || ''}
                            onChange={(e) => handleChange(key, e.target.value)}
                            className='block w-full border border-gray-300 text-md py-1 px-3 outline-none rounded-md shadow-sm focus:ring-purple-500 focus:border-purple-600 focus:border-2'
                            required={required}
                            placeholder={`Enter your ${label.toLowerCase()}`}
                        />
                    </div>
                ))}

            </div>

        </div>
    );
}