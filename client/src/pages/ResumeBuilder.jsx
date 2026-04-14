import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import { ArrowLeftIcon, UserIcon, BriefcaseIcon, GraduationCapIcon, LightbulbIcon, FolderIcon, ChevronLeft, ChevronRight, Share2Icon } from 'lucide-react';
import PersonalinfoForm from '../Components/PersonalinfoForm';
import ResumePreview from '../Components/ResumePreview';
import TemplateSelector from '../Components/TemplateSelector';
import ColorPicker from '../Components/ColorPicker';
import ProfessionalSummaryForm from '../Components/ProfessionalSummaryForm';
import ExperienceForm from '../Components/ExperienceForm.tsx';
import EducationForm from '../Components/EducationForm';
import LanguageForm from '../Components/LanguageForm';
import CustomSectionForm from '../Components/CustomSectionForm';
import ProjectForm from '../Components/ProjectForm';
import SkillsForm from '../Components/SkillsForm';

const DEFAULT_CV_SECTION_ORDER = ['experience', 'education', 'project', 'skills', 'languages', 'custom_sections'];
export default function ResumeBuilder() {
  const { resumeId } = useParams();
  const [resumeData, setResumeData] = React.useState({
    _id: '',
    title: '',
    personal_info: {},
    experience: [],
    education: [],
    languages: [],
    custom_sections: [],
    skills: [],
    project: [],
    section_order: DEFAULT_CV_SECTION_ORDER,
    template: "classic",
    accent_color: "#000000",
    public: false
  });

  const fetchResumeData = async () => {
    const resume = dummyResumeData.find(r => r._id === resumeId);
    if (resume) {
      setResumeData({ ...resume, section_order: resume.section_order || DEFAULT_CV_SECTION_ORDER });
      document.title = resume.title + " - Resume Builder";
      return;
    }

    const uploadedRaw = sessionStorage.getItem(`uploaded-resume-${resumeId}`);
    if (uploadedRaw) {
      const uploadedResume = JSON.parse(uploadedRaw);
      setResumeData((prev) => ({ ...prev, ...uploadedResume, section_order: uploadedResume.section_order || DEFAULT_CV_SECTION_ORDER }));
      document.title = (uploadedResume.title || "Resume") + " - Resume Builder";
    }
  };

  const [activeSection, setActiveSection] = React.useState(0);
  const [removeBg, setRemoveBg] = React.useState(false);


  const sections = [
    { id: 'personal_info', title: 'Personal Info', icon: UserIcon },
    { id: 'summary', title: 'Professional Summary', icon: UserIcon },
    { id: 'experiences', title: 'Experience', icon: BriefcaseIcon },
    { id: 'education', title: 'Education', icon: GraduationCapIcon },
    { id: 'projects', title: 'Projects', icon: FolderIcon },
    { id: 'skills', title: 'Skills', icon: LightbulbIcon },
    { id: 'languages', title: 'Languages', icon: LightbulbIcon },
    { id: 'custom', title: 'Other', icon: FolderIcon }

  ];

  const reorderableSectionsMap = {
    experiences: 'experience',
    education: 'education',
    projects: 'project',
    skills: 'skills',
    languages: 'languages',
    custom: 'custom_sections',
  };

  const activeReorderKey = reorderableSectionsMap[sections[activeSection].id];
  const currentOrder = resumeData.section_order || DEFAULT_CV_SECTION_ORDER;
  const activeOrderIndex = activeReorderKey ? currentOrder.indexOf(activeReorderKey) : -1;
  const canMoveUp = activeOrderIndex > 0;
  const canMoveDown = activeOrderIndex >= 0 && activeOrderIndex < currentOrder.length - 1;

  const moveActiveSection = (direction) => {
    if (!activeReorderKey) return;
    setResumeData((prev) => {
      const order = [...(prev.section_order || DEFAULT_CV_SECTION_ORDER)];
      const index = order.indexOf(activeReorderKey);
      if (index < 0) return prev;
      const target = direction === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= order.length) return prev;
      [order[index], order[target]] = [order[target], order[index]];
      return { ...prev, section_order: order };
    });
  };

  React.useEffect(() => {
    fetchResumeData();
    console.log(resumeData)
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
              <hr className='absolute top-0 left-0 h-1 bg-linear-to-r from-purple-600 to-purple-800 border-none transition-all duration-2000' style={{ width: `${activeSection * 100 / (sections.length - 1)}%` }} />
              {/*section navigation */}
              <div className='flex justify-between items-center mb-6 border-b border-gray-300 py-1'>
                <div className='flex justify-between items-center py-1'>
                  <TemplateSelector selectedTemplate={resumeData.template} onChange={(template) => setResumeData(prev => ({ ...prev, template }))} />
                  <ColorPicker onChange={(color) => setResumeData(prev => ({ ...prev, accent_color: color }))} accentColor={resumeData.accent_color} />
                </div>

                <div className='flex items-center'>
                  {activeReorderKey && (
                    <div className='flex items-center gap-1 mr-2 border-r border-gray-300 pr-2'>
                      <button onClick={() => moveActiveSection('up')} disabled={!canMoveUp} className={`text-xs px-2 py-1 rounded ${canMoveUp ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}>
                        Move Up
                      </button>
                      <button onClick={() => moveActiveSection('down')} disabled={!canMoveDown} className={`text-xs px-2 py-1 rounded ${canMoveDown ? 'hover:bg-gray-100 text-gray-700' : 'text-gray-400 cursor-not-allowed'}`}>
                        Move Down
                      </button>
                    </div>
                  )}
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
                {
                  sections[activeSection].id === 'summary' && (
                    <div>
                      <ProfessionalSummaryForm data={resumeData.professional_summary} onChange={(data) => setResumeData(prev => ({ ...prev, professional_summary: data }))} setResumeData={setResumeData} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'experiences' && (
                    <div>
                    <ExperienceForm data={resumeData.experience} onChange={(data)=>setResumeData(prev=>({...prev,experience:data}))} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'education' && (
                    <div>
                      <EducationForm data={resumeData.education || []} onChange={(data) => setResumeData(prev => ({ ...prev, education: data }))} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'projects' && (
                    <div>
                      <ProjectForm data={resumeData.project || []} onChange={(data) => setResumeData(prev => ({ ...prev, project: data }))} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'skills' && (
                    <div>
                      <SkillsForm data={resumeData.skills || []} onChange={(data) => setResumeData(prev => ({ ...prev, skills: data }))} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'languages' && (
                    <div>
                      <LanguageForm data={resumeData.languages || []} onChange={(data) => setResumeData(prev => ({ ...prev, languages: data }))} />
                    </div>
                  )
                }
                {
                  sections[activeSection].id === 'custom' && (
                    <div>
                      <CustomSectionForm data={resumeData.custom_sections || []} onChange={(data) => setResumeData(prev => ({ ...prev, custom_sections: data }))} />
                    </div>
                  )
                }
              </div>
            </div>
          </div>


          {/*right side - resume preview*/}
          <div className='lg:col-span-7 max-lg:mt-6'>

            <div className='relative w-full'>
              {/*buttons*/}
                <div className='absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2'>

                  {
                    resumeData.public &&(
                      <button>
                        <Share2Icon className='size-4'/>
                      </button>
                    )
                  }
                </div>
            </div>

            {/*Resume Preview*/}
            <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes={'mx-auto'} />
          </div>

        </div>
      </div>
    </div>
  )
}
