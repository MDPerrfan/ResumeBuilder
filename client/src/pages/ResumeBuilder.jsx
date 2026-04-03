import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon } from 'lucide-react';

export default function ResumeBuilder() {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = React.useState({
    _id: '',
    title: '',
    personal_info: {},
    experiences: [],
    education: [],
    skills: [],
    template: "classic",
    accent_color: "#000000",
    public: false
  });

  const fetchResumeData = async () => {
    const resume = dummyResumeData.find(r => r._id === resumeId);
    if (resume) {
      setResumeData(resume);
      document.title = resume.title + " - Resume Builder";
    }
  };

  React.useEffect(() => {
    fetchResumeData();
  }, [resumeId]);

  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-5 text-slate-700 hover:bg-slate-200 rounded transition-colors p-1' />
          Back 
        </Link>
      </div>
    </div>
  )
}
