import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';
import FeaturesDropdown from './FeaturesDropdown';

export default function Navbar() {
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

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        setMobileOpen(false);
    };

    return (
        <>
            <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
                <nav className="max-w-7xl mx-auto flex items-center justify-between bg-slate-900/80 backdrop-blur-xl border border-slate-800/80 rounded-full px-5 py-3 shadow-2xl shadow-indigo-950/20">
                    
                    {/* Left: Logo & Desktop Links */}
                    <div className="flex items-center gap-6">
                        <Link to="/" className="flex items-center gap-2.5 group">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center transition group-hover:border-indigo-500">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 16L16.0001 12L10.0001 8V16Z" fill="#818cf8"/>
                                </svg>
                            </div>
                            <span className="font-semibold text-base tracking-tight text-white">AiRESUME</span>
                        </Link>

                        <div className="hidden md:flex items-center gap-6">
                            <FeaturesDropdown />
                            <button onClick={() => scrollToSection('features')} className="text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer">
                                About
                            </button>
                            <button onClick={() => scrollToSection('testimonials')} className="text-sm font-medium text-slate-400 hover:text-white transition cursor-pointer">
                                Testimonials
                            </button>
                        </div>
                    </div>

                    {/* Right: Desktop Actions & Mobile Toggle */}
                    {isLoaded && (
                        <div className="flex items-center gap-3">
                            {/* Desktop Auth / User State */}
                            {isSignedIn ? (
                                <div className="hidden md:flex items-center gap-3">
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/50 border border-slate-700/50">
                                        {user?.imageUrl ? (
                                            <img src={user.imageUrl} alt={displayName} className='w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/50'/>
                                        ) : (
                                            <div className='w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 font-semibold text-xs'>
                                                {displayName[0].toUpperCase()}
                                            </div>
                                        )}
                                        <span className='text-xs text-slate-300 font-medium max-w-[100px] truncate'>{displayName}</span>
                                    </div>
                                    <Link to="/app" className="px-4 py-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white text-xs md:text-sm font-medium transition shadow-lg shadow-indigo-600/20">
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={logoutUser}
                                        disabled={loggingOut}
                                        className='p-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer'
                                        title="Sign out"
                                    >
                                        <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                                            <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1'/>
                                        </svg>
                                    </button>
                                </div>
                            ) : (
                                <div className='hidden md:flex items-center gap-2'>
                        
                                    <Link to='/login' className='px-4.5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full hover:opacity-90 transition shadow-lg shadow-indigo-600/20'>
                                        Sign in
                                    </Link>
                                </div>
                            )}

                            {/* Mobile Hamburger Button */}
                            <button 
                                onClick={() => setMobileOpen(true)} 
                                className="md:hidden text-slate-300 hover:text-white p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 cursor-pointer"
                                aria-label="Open Menu"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M4 12h16" /><path d="M4 18h16" /><path d="M4 6h16" />
                                </svg>
                            </button>
                        </div>
                    )}
                </nav>
            </header>

            {/* Mobile Fullscreen Overlay Drawer */}
            <div className={`fixed inset-0 bg-slate-950/95 backdrop-blur-xl z-50 flex flex-col justify-center items-center gap-6 transition-all duration-300 md:hidden px-6 text-center ${mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
                
                {/* Close Button */}
                <button 
                    onClick={() => setMobileOpen(false)} 
                    className="absolute top-6 right-6 text-slate-400 hover:text-white p-2.5 rounded-xl bg-slate-900 border border-slate-800 cursor-pointer"
                    aria-label="Close Menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" /><path d="m6 6 12 12" />
                    </svg>
                </button>

                {/* Mobile Navigation Links */}
                <button onClick={() => { window.scrollTo({ top: 0, behavior: 'smooth' }); setMobileOpen(false); }} className="text-xl font-medium text-slate-200 hover:text-indigo-400 transition">Home</button>
                <button onClick={() => scrollToSection('features')} className="text-xl font-medium text-slate-200 hover:text-indigo-400 transition">About</button>
                <button onClick={() => scrollToSection('testimonials')} className="text-xl font-medium text-slate-200 hover:text-indigo-400 transition">Testimonials</button>

                <div className="w-16 h-[1px] bg-slate-800 my-2"></div>

                {/* Mobile Auth Actions */}
                {isSignedIn ? (
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                        <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 w-full justify-center">
                            {user?.imageUrl && <img src={user.imageUrl} alt={displayName} className='w-7 h-7 rounded-full object-cover'/>}
                            <span className='text-sm text-slate-200 font-medium'>{displayName}</span>
                        </div>
                        <Link to="/app" onClick={() => setMobileOpen(false)} className="w-full py-3 rounded-xl bg-indigo-600 text-white font-medium text-sm text-center shadow-lg shadow-indigo-600/30">
                            Dashboard
                        </Link>
                        <button onClick={logoutUser} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-medium text-sm transition">
                            Sign Out
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center gap-3 w-full max-w-xs">
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-200 font-medium text-sm text-center transition">
                            Sign In
                        </Link>
                        <Link to="/login" onClick={() => setMobileOpen(false)} className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm text-center shadow-lg shadow-indigo-600/30">
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}