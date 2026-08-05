import React, { useState } from 'react';
import Title from './Title';

export default function Features() {
    const [activeIndex, setActiveIndex] = useState(0);

    const featureItems = [
        {
            title: "Real-Time ATS Optimization",
            description: "Get instant keyword analysis and score breakdowns aligned directly with target job postings.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-indigo-400">
                    <path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z" />
                    <circle cx="16.5" cy="7.5" r=".5" fill="currentColor" />
                </svg>
            )
        },
        {
            title: "AI Cover Letter Generator",
            description: "Instantly draft context-aware, hyper-personalized cover letters by pasting any job description.",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-6 stroke-emerald-400">
                    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z" />
                </svg>
            )
        },
        {
            title: "Export & Share Ready",
            description: "Download pristine PDF layouts optimized for recruiter review systems or export structured drafts instantly.",
            icon: (
                <svg className="size-6 stroke-amber-400" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 15V3" /><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><path d="m7 10 5 5 5-5" />
                </svg>
            )
        }
    ];

    return (
        <section id='features' className='py-20 bg-[#07070B] text-slate-100 scroll-mt-16'>
            <div className="max-w-7xl mx-auto px-6">
                <Title 
                    title="Powerful Features to Supercharge Your Resume" 
                    description="Our AI-powered resume builder offers a suite of features designed to help you create a standout resume that gets noticed by employers." 
                />
                
                <div className='flex flex-col lg:flex-row items-center justify-center gap-12 mt-16'>
                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative p-2 rounded-2xl bg-gradient-to-b from-slate-800/80 to-slate-900/50 border border-slate-800 shadow-2xl overflow-hidden max-w-xl w-full">
                            <img 
                                className="rounded-xl w-full object-cover opacity-90 transition-all duration-500 hover:scale-[1.01]" 
                                src="https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/features/group-image-1.png" 
                                alt="Features Preview" 
                            />
                        </div>
                    </div>

                    <div className="w-full lg:w-1/2 flex flex-col gap-4 max-w-md">
                        {featureItems.map((item, index) => (
                            <div 
                                key={index}
                                onMouseEnter={() => setActiveIndex(index)}
                                className={`p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex gap-4 items-start ${
                                    activeIndex === index 
                                        ? 'bg-slate-900/90 border-indigo-500/50 shadow-xl shadow-indigo-950/20' 
                                        : 'bg-slate-900/30 border-slate-800/60 hover:bg-slate-900/60'
                                }`}
                            >
                                <div className={`p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 shrink-0`}>
                                    {item.icon}
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-base font-semibold text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-400 leading-relaxed">{item.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}