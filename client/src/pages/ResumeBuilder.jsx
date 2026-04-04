import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon, UserIcon, BriefcaseIcon, GraduationCapIcon, LightbulbIcon, FolderIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import PersonalinfoForm from '../Components/PersonalinfoForm';
import ResumePreview from '../Components/ResumePreview';
import TemplateSelector from '../Components/TemplateSelector';

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

  const [activeSection, setActiveSection] = React.useState(0);
  const [removeBg, setRemoveBg] = React.useState(false);


  const sections = [
    { id: 'personal_info', title: 'Personal Info', icon: UserIcon },
    { id: 'experiences', title: 'Experience', icon: BriefcaseIcon },
    { id: 'education', title: 'Education', icon: GraduationCapIcon },
    { id: 'skills', title: 'Skills', icon: LightbulbIcon },
    { id: 'projects', title: 'Projects', icon: FolderIcon }

  ];

  const activeSectionData = resumeData[sections[activeSection].id];

  React.useEffect(() => {
    fetchResumeData();
    console.log(resumeData.template)
  }, [resumeId]);

  return (
    <div>

      <div className='max-w-7xl mx-auto px-4 py-6'>
        <Link to={'/app'} className='inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all'>
          <ArrowLeftIcon className='size-5 text-slate-700 hover:bg-slate-200 rounded transition-colors p-1' />
          Back
        </Link>
      </div>

      <div className='max-w-7xl mx-auto px-4 pb-8'>


        <div className='grid lg:grid-cols-12 gap-8'>
          {/*left side - resume form*/}
          <div className='relative lg:col-span-5 rounded-lg overflow-hidden'>
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1'>
              {/*progress bar using activeSection*/}
              <hr className='absolute top-0 left-0 right-0 border-2 border-gray-200' />
              <hr className='absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-purple-800 border-none transition-all duration-2000' style={{ width: `${activeSection * 100 / (sections.length - 1)}%` }} />
              {/*section navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div className='flex justify-between items-center py-1'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                </div>

                <div className='flex items-center'>
                  {activeSection > 0 && <button onClick={() => setActiveSection(prev => prev - 1)} disabled={activeSection === 0} className='flex items-center gap-1 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all '>
                    <ChevronLeft className='size-4' />
                    Previous
                  </button>
                  }
                  <button onClick={() => setActiveSection(prev => prev + 1)} disabled={activeSection === sections.length - 1} className={`${activeSection === sections.length - 1 ? 'cursor-not-allowed opacity-50' : 'hover:bg-gray-50'} flex items-center gap-1 rounded-lg text-sm font-medium text-gray-600 transition-all ml-2`}>
                    Next
                    <ChevronRight className='size-4' />
                  </button>
                </div>

              </div>
              {/*section content*/}
              <div className='space-y-6'>
                {
                  sections[activeSection].id === 'personal_info' && (
                    <div>
                      <PersonalinfoForm data={resumeData.personal_info} onChange={(field, value) => setResumeData(prev => ({ ...prev, personal_info: { ...prev.personal_info, [field]: value } }))} removeBg={removeBg} setRemoveBg={setRemoveBg} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>


          {/*right side - resume preview*/}
          <div className='lg:col-span-7 max-lg:mt-6'>

                <div>
                  {/*buttons*/}
                </div>

                {/*Resume Preview*/}
                <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes={'mx-auto'} />
          </div>

        </div>
      </div>
    </div>
  )
}
