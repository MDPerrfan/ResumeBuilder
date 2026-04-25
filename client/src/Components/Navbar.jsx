import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useClerk, useUser } from '@clerk/clerk-react'

export default function Navbar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user, isSignedIn, isLoaded } = useUser();
    const [loggingOut, setLoggingOut] = useState(false);
    const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User';

    const logoutUser = async () => {
        setLoggingOut(true);
        try {
            await signOut();
            navigate('/login');
        } catch (err) {
            console.error(err);
        } finally {
            setLoggingOut(false);
        }
    }

    return (
        <div className='sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 shadow-sm'>
            <nav className='flex items-center justify-between max-w-7xl mx-auto px-6 py-3.5'>
                
                <Link to='/' className='flex items-center gap-2 group'>
                    <div className='w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center group-hover:bg-violet-700 transition'>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 16L16.0001 12L10.0001 8V16Z" fill="white"/>
                        </svg>
                    </div>
                    <span className="font-bold text-slate-900 text-lg tracking-tight">AiResume</span>
                </Link>

                {/* show nothing until Clerk has loaded */}
                {isLoaded && (
                    <div className='flex items-center gap-3'>
                        {isSignedIn ? (
                            <>
                                <div className='hidden sm:flex items-center gap-2.5'>
                                    {user?.imageUrl ? (
                                        <img src={user.imageUrl} alt={displayName} className='w-8 h-8 rounded-full object-cover ring-2 ring-violet-100'/>
                                    ) : (
                                        <div className='w-8 h-8 rounded-full bg-violet-100 flex items-center justify-center text-violet-700 font-semibold text-sm'>
                                            {displayName[0].toUpperCase()}
                                        </div>
                                    )}
                                    <span className='text-sm text-slate-600 font-medium'>{displayName}</span>
                                </div>

                                <button
                                    onClick={logoutUser}
                                    disabled={loggingOut}
                                    className='flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition disabled:opacity-50 disabled:cursor-not-allowed'
                                >
                                    {loggingOut ? (
                                        <>
                                            <svg className='animate-spin w-3.5 h-3.5' viewBox='0 0 24 24' fill='none'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'/>
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z'/>
                                            </svg>
                                            Signing out...
                                        </>
                                    ) : (
                                        <>
                                            <svg className='w-3.5 h-3.5' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/>
                                            </svg>
                                            Sign out
                                        </>
                                    )}
                                </button>
                            </>
                        ) : (
                            <div className='flex items-center gap-2'>
                                <Link to='/login' className='px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition'>
                                    Sign in
                                </Link>
                                <Link to='/login' className='px-4 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-full hover:bg-violet-700 transition'>
                                    Get started
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </nav>
        </div>
    )
}