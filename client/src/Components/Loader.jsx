import React from 'react'
import { Loader, Placeholder } from 'rsuite';

export default function Loading() {
    return (
        <div className='flex items-center justify-center h-screen bg-black/20 w-full'>
            <div className='size-12 border-3 border-gray-500 border-t-transparent rounded-full animate-spin'></div>
        </div>
    )
}
