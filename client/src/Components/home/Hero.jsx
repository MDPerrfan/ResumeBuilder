import React from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

export default function Hero() {
    const { isSignedIn } = useUser();

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <div className="relative min-h-screen bg-[#0A0A0F] text-slate-100 overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
            {/* Ambient background lighting */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-tr from-indigo-600/20 via-violet-500/10 to-transparent blur-[120px] pointer-events-none rounded-full" />

            {/* Hero Main Content */}
            <section className="relative flex flex-col items-center pt-44 pb-20 px-4 max-w-5xl mx-auto text-center">
                
                {/* Social Proof Pill */}
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-950/50 border border-indigo-800/40 shadow-inner mb-8">
                    <div className="relative flex size-2 items-center justify-center">
                        <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping"></span>
                        <span className="relative inline-flex size-1.5 rounded-full bg-emerald-500"></span>
                    </div>
                    <span className="text-xs sm:text-sm font-medium text-indigo-200">Join 12,450+ professionals landing interviews</span>
                </div>

                {/* Main Heading */}
                <h1 className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight text-white max-w-3xl leading-[1.15]">
                    Build Your Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-300 to-indigo-200">Smartly With AI</span>
                </h1>

                {/* Subtitle */}
                <p className="mt-6 text-sm sm:text-base text-slate-400 max-w-xl leading-relaxed">
                    Create a professional resume in minutes with our AI-powered builder. Get personalized suggestions and templates to make your job application stand out.
                </p>

                {/* Call to Actions */}
                <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                    {!isSignedIn ? (
                        <Link to="/app" className="group relative px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5">
                            Get Started Now
                        </Link>
                    ) : (
                        <Link to="/app" className="px-7 py-3.5 rounded-xl bg-indigo-600 text-white font-medium text-sm transition shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 hover:-translate-y-0.5">
                            Go to Dashboard
                        </Link>
                    )}
                    <button onClick={() => scrollToSection('features')} className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-800 text-slate-300 text-sm font-medium transition hover:-translate-y-0.5 cursor-pointer">
                        Explore Features
                    </button>
                </div>

                {/* Divider Rule */}
                <div className='w-full max-w-2xl h-[1px] mt-16 bg-gradient-to-r from-transparent via-slate-800 to-transparent'></div>

                {/* Trusted Companies Grid */}
                <div className="mt-14 w-full">
                    <p className="text-xs uppercase tracking-widest text-slate-500 mb-8 font-medium">Trusted by candidates from top tier companies</p>
                    <div className="flex items-center justify-center gap-8 sm:gap-14 flex-wrap opacity-50 grayscale hover:grayscale-0 transition duration-500">
                        <div className="text-slate-400 font-bold tracking-tighter text-lg">GOOGLE</div>
                        <div className="text-slate-400 font-semibold text-lg">MICROSOFT</div>
                        <div className="text-slate-400 font-bold tracking-wider text-lg">AMAZON</div>
                        <div className="text-slate-400 font-mono text-lg">NETFLIX</div>
                        <div className="text-slate-400 font-serif text-lg">SPOTIFY</div>
                    </div>
                </div>
            </section>
        </div>
    );
}