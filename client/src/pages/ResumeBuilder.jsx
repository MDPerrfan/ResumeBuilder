import React from 'react'
import { useParams, Link } from 'react-router-dom';
import { dummyResumeData } from '../assets/assets';
import {
  ArrowLeftIcon, UserIcon, BriefcaseIcon, GraduationCapIcon,
  LightbulbIcon, FolderIcon, ChevronLeft, ChevronRight, Share2Icon,
  EyeIcon,
  EyeOffIcon,
  DownloadIcon
} from 'lucide-react';
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

const INITIAL_RESUME_DATA = {
  _id: '',
  title: '',
  personal_info: {},
  professional_summary: '',
  experience: [],
  education: [],
  languages: [],
  custom_sections: [],
  skills: [],
  project: [],
  section_order: DEFAULT_CV_SECTION_ORDER,
  template: 'classic',
  accent_color: '#000000',
  public: false,
};

const sections = [
  { id: 'personal_info', title: 'Personal Info', icon: UserIcon },
  { id: 'summary', title: 'Professional Summary', icon: UserIcon },
  { id: 'experiences', title: 'Experience', icon: BriefcaseIcon },
  { id: 'education', title: 'Education', icon: GraduationCapIcon },
  { id: 'projects', title: 'Projects', icon: FolderIcon },
  { id: 'skills', title: 'Skills', icon: LightbulbIcon },
  { id: 'languages', title: 'Languages', icon: LightbulbIcon },
  { id: 'custom', title: 'Other', icon: FolderIcon },
];

// Maps UI section ids → resume data keys used for reordering
const REORDERABLE_SECTIONS_MAP = {
  experiences: 'experience',
  education: 'education',
  projects: 'project',
  skills: 'skills',
  languages: 'languages',
  custom: 'custom_sections',
};

export default function ResumeBuilder() {
  const { resumeId } = useParams();

  const [resumeData, setResumeData] = React.useState(INITIAL_RESUME_DATA);
  const [activeSection, setActiveSection] = React.useState(0);
  const [removeBg, setRemoveBg] = React.useState(false);

  // FIX 1: fetchResumeData wrapped in useCallback so it's stable and can safely
  //         be listed in the useEffect dependency array without causing loops.
  const fetchResumeData = React.useCallback(() => {
    // Try dummy data first
    const resume = dummyResumeData.find(r => r._id === resumeId);
    if (resume) {
      setResumeData({
        ...INITIAL_RESUME_DATA,
        ...resume,
        section_order: resume.section_order || DEFAULT_CV_SECTION_ORDER,
      });
      document.title = `${resume.title} - Resume Builder`;
      return;
    }

    // Fall back to session storage
    const uploadedRaw = sessionStorage.getItem(`uploaded-resume-${resumeId}`);
    if (uploadedRaw) {
      try {
        const uploadedResume = JSON.parse(uploadedRaw);
        setResumeData({
          ...INITIAL_RESUME_DATA,
          ...uploadedResume,
          section_order: uploadedResume.section_order || DEFAULT_CV_SECTION_ORDER,
        });
        document.title = `${uploadedResume.title || 'Resume'} - Resume Builder`;
      } catch (e) {
        console.error('Failed to parse uploaded resume from session storage:', e);
      }
    }
  }, [resumeId]);

  // FIX 2: Effect depends only on fetchResumeData (stable ref), not on resumeData
  //         (which would cause an infinite loop).
  React.useEffect(() => {
    fetchResumeData();
  }, [fetchResumeData]);


  // --- Reorder helpers ---
  const activeReorderKey = REORDERABLE_SECTIONS_MAP[sections[activeSection].id];
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

  const handleShare = async () => {

    const frontendUrl = window.location.href.split('/app')[0]
    const resumeUrl = frontendUrl + '/view/' + resumeId

    if(navigator.share){
      navigator.share({url:resumeUrl, text:"My Resume."})
    }else{
      alert("This browser does not support sharing!")
    }
  };

const changeVisibility =async()=>{
  setResumeData({...resumeData, public: !resumeData.public})
}

const handleDownload=()=>{
  window.print()
}

  const updateField = (field) => (value) =>
    setResumeData((prev) => ({ ...prev, [field]: value }));

  const updatePersonalInfo = (field, value) =>
    setResumeData((prev) => ({
      ...prev,
      personal_info: { ...prev.personal_info, [field]: value },
    }));

  const progressPct = sections.length > 1
    ? (activeSection / (sections.length - 1)) * 100
    : 0;

  return (
    <div>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <Link
          to="/app"
          className="inline-flex gap-2 items-center text-slate-500 hover:text-slate-700 transition-all"
        >
          <ArrowLeftIcon className="size-5 text-slate-700 hover:bg-slate-200 rounded transition-colors p-1" />
          Back
        </Link>
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-8">
        <div className="grid lg:grid-cols-12 gap-8">

          {/* Left side — form */}
          <div className="relative lg:col-span-5 rounded-lg overflow-hidden">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 pt-1">

              {/* Progress bar */}
              {/* FIX 6: bg-gradient-to-r (was bg-linear-to-r) */}
              {/* FIX 7: duration-[2000ms] (was non-existent duration-2000) */}
              <hr className="absolute top-0 left-0 right-0 border-2 border-gray-200" />
              <hr
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-purple-600 to-purple-800 border-none transition-all duration-[2000ms]"
                style={{ width: `${progressPct}%` }}
              />

              {/* Section navigation */}
              <div className="flex justify-between items-center mb-6 border-b border-gray-300 py-1">
                <div className="flex justify-between items-center py-1">
                  <TemplateSelector
                    selectedTemplate={resumeData.template}
                    onChange={(template) => setResumeData((prev) => ({ ...prev, template }))}
                  />
                  <ColorPicker
                    onChange={(color) => setResumeData((prev) => ({ ...prev, accent_color: color }))}
                    accentColor={resumeData.accent_color}
                  />
                </div>

                <div className="flex items-center">
                  {/* Move Up / Move Down only for reorderable sections */}
                  {activeReorderKey && (
                    <div className="flex items-center gap-1 mr-2 border-r border-gray-300 pr-2">
                      <button
                        onClick={() => moveActiveSection('up')}
                        disabled={!canMoveUp}
                        className={`text-xs px-2 py-1 rounded ${canMoveUp
                            ? 'hover:bg-gray-100 text-gray-700'
                            : 'text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Move Up
                      </button>
                      <button
                        onClick={() => moveActiveSection('down')}
                        disabled={!canMoveDown}
                        className={`text-xs px-2 py-1 rounded ${canMoveDown
                            ? 'hover:bg-gray-100 text-gray-700'
                            : 'text-gray-400 cursor-not-allowed'
                          }`}
                      >
                        Move Down
                      </button>
                    </div>
                  )}

                  {activeSection > 0 && (
                    <button
                      onClick={() => setActiveSection((prev) => prev - 1)}
                      className="flex items-center gap-1 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all px-2 py-0.5"
                    >
                      <ChevronLeft className="size-4" />
                      Previous
                    </button>
                  )}

                  <button
                    onClick={() => setActiveSection((prev) => prev + 1)}
                    disabled={activeSection === sections.length - 1}
                    className={`${activeSection === sections.length - 1
                        ? 'cursor-not-allowed opacity-50'
                        : 'hover:bg-gray-50'
                      } flex items-center gap-1 px-2 py-0.5 rounded-lg text-sm font-medium text-gray-600 transition-all ml-2`}
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Section content */}
              <div className="space-y-6">
                {sections[activeSection].id === 'personal_info' && (
                  <PersonalinfoForm
                    data={resumeData.personal_info}
                    onChange={updatePersonalInfo}
                    removeBg={removeBg}
                    setRemoveBg={setRemoveBg}
                  />
                )}

                {sections[activeSection].id === 'summary' && (
                  <ProfessionalSummaryForm
                    data={resumeData.professional_summary}
                    onChange={updateField('professional_summary')}
                    setResumeData={setResumeData}
                  />
                )}

                {sections[activeSection].id === 'experiences' && (
                  <ExperienceForm
                    data={resumeData.experience}
                    onChange={updateField('experience')}
                  />
                )}

                {sections[activeSection].id === 'education' && (
                  <EducationForm
                    data={resumeData.education || []}
                    onChange={updateField('education')}
                  />
                )}

                {sections[activeSection].id === 'projects' && (
                  <ProjectForm
                    data={resumeData.project || []}
                    onChange={updateField('project')}
                  />
                )}

                {sections[activeSection].id === 'skills' && (
                  <SkillsForm
                    data={resumeData.skills || []}
                    onChange={updateField('skills')}
                  />
                )}

                {sections[activeSection].id === 'languages' && (
                  <LanguageForm
                    data={resumeData.languages || []}
                    onChange={updateField('languages')}
                  />
                )}

                {sections[activeSection].id === 'custom' && (
                  <CustomSectionForm
                    data={resumeData.custom_sections || []}
                    onChange={updateField('custom_sections')}
                  />
                )}
              </div>
            </div>
          </div>

          {/* Right side — preview */}
          <div className="lg:col-span-7 max-lg:mt-6">
            <div className="relative w-full">
              {/* FIX 8: Share button now has onClick handler + aria-label */}
             
                <div className="absolute bottom-3 left-0 right-0 flex items-center justify-end gap-2 z-10">
                {
                  resumeData.public &&(
                    <button
                    onClick={handleShare}
                    aria-label="Share resume"
                    className="flex items-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-blue-100 to-blue-200 text-blue-600 rounded-lg ring-blue-300 hover:ring transition-colors"
                  >
                    <Share2Icon className="size-4 text-gray-600" />
                  </button>
                  )
                }
            
                  <button onClick={changeVisibility} className='flex items-center justify-center gap-2 px-3 py-2 bg-gradient-to-br from-purple-100 to-purple-200 rounded-lg ring-purple-600 hover:ring transition-colors text-purple-600 text-xs'>
                    {
                      resumeData.public ? <EyeIcon className='size-4' /> : <EyeOffIcon className='size-4' />
                    }
                    {resumeData.public ? "Public" : "Private"}

                  </button>
                    <button onClick={handleDownload}
                    aria-label="Share resume"
                    className="flex items-center justify-center p-2 px-4 gap-2 text-xs bg-gradient-to-br from-green-100 to-green-200 text-green-600 rounded-lg ring-green-300 hover:ring transition-colors"
                  >
                    <DownloadIcon className="size-4 text-gray-600" />
                    Download
                  </button>
                </div>
              
            </div>

            <ResumePreview
              data={resumeData}
              template={resumeData.template}
              accentColor={resumeData.accent_color}
              classes="mx-auto"
            />
          </div>

        </div>
      </div>
    </div>
  );
}