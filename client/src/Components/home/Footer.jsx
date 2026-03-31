export default function Footer() {
    return (
        <footer className="w-full bg-gradient-to-b from-[#F1EAFF] to-[#FFFFFF] text-gray-800">
            <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col items-center">
                <div className="flex items-center space-x-3 mb-6">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" >
                        <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10.0001 16L16.0001 12L10.0001 8V16Z" fill="#4F39F6" ></path>
                    </svg>
                    <span className="text-lg font-semibold">AiRESUME</span>
                </div>
                <p className="text-center max-w-xl text-sm font-normal leading-relaxed">
                    Our AI-powered resume builder offers a suite of features designed to help you create a standout resume that gets noticed by employers. Create a professional resume in minutes with our AI-powered builder. Get personalized suggestions and templates to make your job application stand out.
                </p>
            </div>
            <div className="border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm font-normal">
                    <a className="text-indigo-700 font-semibold" href="https://parves.net">Parves</a> ©2026. All rights reserved.
                </div>
            </div>
        </footer>
    );
};