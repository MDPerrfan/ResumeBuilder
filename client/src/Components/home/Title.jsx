import React from 'react'

export default function Title({ title, description }) {
    return (
        <div className="flex items-center justify-center gap-6 w-5/6 lg:w-1/2 mx-auto mt-1">
            <div className=' text-center mt-6 '>
                <h2 className="text-3xl sm:text-4xl font-medium ">{title}</h2>
                <p className="max-sm hidden md:block  mt-4 text-slate-600">{description}</p>
            </div>
        </div>

    )
}
