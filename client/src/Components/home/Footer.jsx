import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer id="contact" className="w-full bg-[#07070B] text-slate-400 border-t border-slate-800/60 scroll-mt-12 relative overflow-hidden font-sans">
            {/* Ambient background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-indigo-600/5 blur-[100px] pointer-events-none rounded-full" />

            <div className="max-w-7xl mx-auto px-6 pt-16 pb-12 grid grid-cols-1 md:grid-cols-4 gap-10 relative z-10">
                
                {/* Brand Column */}
                <div className="md:col-span-1 space-y-4">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center shadow-inner">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" clipRule="evenodd" d="M10.0001 16L16.0001 12L10.0001 8V16Z" fill="#818cf8"/>
                            </svg>
                        </div>
                        <span className="text-base font-semibold text-white tracking-tight">AiRESUME</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-normal">
                        Empowering professionals to craft standout, ATS-optimized resumes and cover letters in minutes using advanced AI.
                    </p>
                </div>

                {/* Quick Links Column */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Product</h4>
                    <ul className="space-y-2.5 text-sm">
                        <li><a href="#features" className="hover:text-white transition">Features</a></li>
                        <li><Link to="/app" className="hover:text-white transition">Resume Builder</Link></li>
                        <li><a href="#testimonials" className="hover:text-white transition">Testimonials</a></li>
                    </ul>
                </div>

                {/* Resources Column */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Resources</h4>
                    <ul className="space-y-2.5 text-sm">
                        <li><span className="hover:text-white transition cursor-pointer">ATS Checker</span></li>
                        <li><span className="hover:text-white transition cursor-pointer">Cover Letter AI</span></li>
                        <li><span className="hover:text-white transition cursor-pointer">Career Guide</span></li>
                    </ul>
                </div>

                {/* Legal / Social Column */}
                <div className="space-y-3">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Connect</h4>
                    <div className="flex items-center gap-3">
                        <a href="https://github.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
                        </a>
                        <a href="https://x.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-700 transition">
                            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        </a>
                    </div>
                </div>

            </div>

            {/* Bottom Bar */}
            <div className="border-t border-slate-800/60 relative z-10">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
                    <p>©2026 AiRESUME. All rights reserved.</p>
                    <p>Designed & Developed with precision by <a className="text-indigo-400 hover:text-indigo-300 font-medium transition" href="https://parves.net" target="_blank" rel="noreferrer">Parves</a></p>
                </div>
            </div>
        </footer>
    );
}