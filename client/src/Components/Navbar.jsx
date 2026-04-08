import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/react'

export default function Navbar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user } = useUser();
    const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User';

    const logoutUser = async () => {
        await signOut();
        navigate('/login');
    }

    return (
        <div className='shadow bg-white'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-4 py-3.5 text-slate-800 transition-all'>
                <Link to='/' className='text-2xl text-slate-900 flex items-center gap-2 mx-5'>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10.0001 16L16.0001 12L10.0001 8V16Z" fill="#4F39F6" ></path>
                    </svg>
                    <span className="font-semibold">AiRESUME</span>       
                </Link>
                <div className='flex items-center justify-center'>
                    <p className='max-sm:hidden'>Welcome, {displayName}!</p>
                    <button onClick={()=>logoutUser()} className='mx-5 px-3 py-1.5 bg-slate-100 rounded-full border border-slate-300 text-sm text-slate-700 hover:bg-slate-200 transition cursor-pointer'>Logout</button>
                </div>
            </nav>
        </div>
    )
}
