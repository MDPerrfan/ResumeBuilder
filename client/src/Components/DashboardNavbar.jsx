import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClerk, useUser } from '@clerk/clerk-react';

export default function DashboardNavbar() {
    const navigate = useNavigate();
    const { signOut } = useClerk();
    const { user, isSignedIn, isLoaded } = useUser();
    const [loggingOut, setLoggingOut] = React.useState(false);

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
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
            <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

                {/* Brand / Home Link */}
                <Link to="/" className="flex items-center gap-2.5 group">
                    <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center transition group-hover:border-indigo-500">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 16L16.0001 12L10.0001 8V16Z" fill="#4F39F6" />
                        </svg>
                    </div>
                    <span className="font-semibold text-base tracking-tight text-slate-900">AiRESUME</span>
                </Link>

                {/* Right Side Controls */}
                <div className="flex items-center gap-4">
                    <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 transition">
                        Home
                    </Link>

                    <div className="h-4 w-[1px] bg-slate-200"></div>

                    {isLoaded && (
                        <div>
                            {isSignedIn ? (
                                <div className="flex items-center gap-3">
                                    {/* User Profile Pill */}
                                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 border border-slate-200/60">
                                        {user?.imageUrl ? (
                                            <img src={user.imageUrl} alt={displayName} className='w-6 h-6 rounded-full object-cover ring-1 ring-indigo-500/30' />
                                        ) : (
                                            <div className='w-6 h-6 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-700 font-semibold text-xs'>
                                                {displayName[0].toUpperCase()}
                                            </div>
                                        )}
                                        <span className='text-xs text-slate-700 font-medium max-w-[120px] truncate'>{displayName}</span>
                                    </div>

                                    {/* Sign Out Button */}
                                    <button
                                        onClick={logoutUser}
                                        disabled={loggingOut}
                                        className='p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition disabled:opacity-50 cursor-pointer'
                                        title="Sign out"
                                    >
                                        {loggingOut ? (
                                            <svg className='animate-spin w-4 h-4' viewBox='0 0 24 24' fill='none'>
                                                <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
                                                <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
                                            </svg>
                                        ) : (
                                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24' strokeWidth={2}>
                                                <path strokeLinecap='round' strokeLinejoin='round' d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                            ) : (
                                /* Sign In / Get Started Options when logged out */
                                <div className="flex items-center gap-2">
                                    <Link to='/login' className='px-4.5 py-2 text-sm font-medium bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-full hover:opacity-90 transition shadow-lg shadow-indigo-600/20'>
                                        Sign in
                                    </Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </header>
    );
}