import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

export default function DashboardNavbar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user, isSignedIn, isLoaded } = useUser();
    const [mobileOpen, setMobileOpen] = useState(false);
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
            setMobileOpen(false);
        }
    };

    return (
        <>
            <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
                    
                    {/* Brand / Home Link */}
                    <Link to="/" className="flex items-center gap-2.5 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center transition group-hover:border-indigo-500">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 16L16.0001 12L10.0001 8V16Z" fill="#4F39F6"/>
                            </svg>
                        </div>
                        <span className="font-semibold text-base tracking-tight text-slate-900">AiRESUME</span>
                    </Link>

                    {/* Desktop Right Side Controls */}
                    <div className="hidden sm:flex items-center gap-4">
                        <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                            Home
                        </Link>

                        <div className="h-4 w-[1px] bg-slate-200"></div>

                        {isLoaded && (
                            <div>
                                {isSignedIn ? (
                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60">
                                            {user?.imageUrl ? (
                                                <img src={user.imageUrl} alt={displayName} className='w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/30'/>
                                            ) : (
                                                <div className='w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-700 font-semibold text-xs'>
                                                    {displayName[0].toUpperCase()}
                                                </div>
                                            )}
                                            <span className='text-xs text-slate-700 font-medium max-w-[120px] truncate'>{displayName}</span>
                                        </div>

                                        <button
                                            onClick={logoutUser}
                                            disabled={loggingOut}
                                            className='p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer'
                                            title="Sign out"
                                        >
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/>
                                            </svg>
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <Link to='/login' className='px-4 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition'>
                                            Sign in
                                        </Link>
                                        <Link to='/login' className='px-4 py-1.5 text-sm font-medium bg-violet-600 text-white rounded-full hover:bg-violet-700 transition shadow-sm'>
                                            Get started
                                        </Link>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Hamburger Button */}
                    <button 
                        onClick={() => setMobileOpen(true)} 
                        className="sm:hidden text-slate-700 p-2 rounded-lg bg-slate-100 border border-slate-200 cursor-pointer"
                        aria-label="Open Menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
                        </svg>
                    </button>

                </div>
            </header>

            {/* Mobile Drawer Menu for Dashboard */}
            <div className={`fixed inset-0 bg-slate-950/90 backdrop-blur-xl z-50 flex flex-col justify-center items-center gap-6 transition-all duration-300 sm:hidden px-6 text-center ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                
                <button 
                    onClick={() => setMobileOpen(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-white p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
                    aria-label="Close Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>

                <Link to="/" onClick={() => setMobileOpen(false)} className="text-xl font-medium text-slate-200 hover:text-indigo-400 transition">Home</Link>

                <div className="w-16 h-[1px] bg-slate-800 my-2"></div>

                {isLoaded && (
                    <>
                        {isSignedIn ? (
                            <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 w-full justify-center">
                                    {user?.imageUrl && <img src={user.imageUrl} alt={displayName} className='w-7 h-7 rounded-full object-cover'/>}
                                    <span className='text-sm text-slate-200 font-medium'>{displayName}</span>
                                </div>
                                <button onClick={logoutUser} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition">
                                    Sign Out
                                </button>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                               
                                <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 rounded-xl bg-violet-600 text-white font-medium text-sm text-center shadow-md">
                                   Sign In
                                </Link>
                            </div>
                        )}
                    </>
                )}
            </div>
        </>
    );
}