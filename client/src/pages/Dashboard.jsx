import React from 'react'
import { FilePenLineIcon, Loader, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { parseResumePdf } from '../utils/parseResumePdf';
import { useAuth, useUser } from '@clerk/clerk-react';
import { resumeApi, userApi } from '../utils/apiClient';
import { clearGuestResumes, getGuestId, getGuestResumes, removeGuestResume, upsertGuestResume } from '../utils/resumeStorage';
import InlineNotice from '../Components/InlineNotice';
import Loading from '../Components/Loader';

export default function Dashboard() {

  const [allresume, setAllresume] = React.useState([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState(null);
  const [editResumeId, setEditResumeId] = React.useState(null);
  const [uploadError, setUploadError] = React.useState('');
  const [isUploading, setIsUploading] = React.useState(false);
  const [isSaving, setIsSaving] = React.useState(false);
  const [notice, setNotice] = React.useState({ type: '', message: '' });
  const [isLoading, setIsLoading] = React.useState(true);

  const { user, isSignedIn, isLoaded } = useUser();
  const { getToken } = useAuth();
  const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User';
  const colors = ['#818cf8', '#a78bfa', '#f43f5e', '#34d399', '#38bdf8', '#fb7185', '#2dd4bf', '#facc15', '#6366f1', '#4ade80'];
  const navigate = useNavigate();

  const notify = (message, type = 'success') => {
    setNotice({ message, type });
  };

  const calcCompletion = (resume) => {
    const checks = [
      Boolean(resume?.title),
      Boolean(resume?.personal_info?.full_name),
      Boolean(resume?.professional_summary),
      (resume?.experience || []).length > 0,
      (resume?.education || []).length > 0,
      (resume?.skills || []).length > 0,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
  };

  const normalizeResume = (resume) => ({
    ...resume,
    completion: calcCompletion(resume),
  });

  const fetchAllResume = async () => {
    setIsLoading(true);
    try {
      if (isSignedIn) {
        const token = await getToken();
        const result = await resumeApi.list(token);
        setAllresume((result.data || []).map(normalizeResume));
        return;
      }
      setAllresume(getGuestResumes().map(normalizeResume));
    } catch (error) {
      notify(error.message || 'Failed to fetch resumes', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const migrateGuestResumesIfNeeded = React.useCallback(async () => {
    if (!isSignedIn) return;
    const guestResumes = getGuestResumes();
    if (!guestResumes.length) return;

    try {
      const token = await getToken();
      await userApi.sync(
        {
          email: user?.primaryEmailAddress?.emailAddress || "",
          name: user?.fullName || user?.firstName || "User",
          imageUrl: user?.imageUrl || "",
        },
        token
      );

      for (const guestResume of guestResumes) {
        const { _id, userId, completion, createdAt, updatedAt, ...payload } = guestResume;
        await resumeApi.create(payload, token);
      }

      await resumeApi.migrateGuest(getGuestId(), token);
      clearGuestResumes();
      notify('Guest resumes moved to your account');
      fetchAllResume();
    } catch (error) {
      notify(error.message || 'Failed to migrate guest resumes', 'error');
    }
  }, [getToken, isSignedIn, user]);

  const createResume = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title,
        personal_info: {},
        professional_summary: '',
        experience: [],
        education: [],
        languages: [],
        custom_sections: [],
        skills: [],
        project: [],
        template: 'classic',
        accent_color: '#6366f1',
        public: false,
      };

      if (isSignedIn) {
        const token = await getToken();
        const response = await resumeApi.create(payload, token);
        const resumeId = response.data?._id;
        setShowCreateModal(false);
        setTitle('');
        fetchAllResume();
        navigate(`/app/builder/${resumeId}`);
        return;
      }

      const guestResume = {
        ...payload,
        _id: `guest-${Date.now()}`,
        userId: getGuestId(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      upsertGuestResume(guestResume);
      setShowCreateModal(false);
      setTitle('');
      fetchAllResume();
      navigate(`/app/builder/${guestResume._id}`);
    } catch (error) {
      notify(error.message || 'Failed to create resume', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const uploadResume = async (e) => {
    e.preventDefault();
    try {
      if (!resumeFile) {
        setUploadError('Please select a PDF resume first.');
        return;
      }

      setIsUploading(true);
      setUploadError('');
      const extractedData = await parseResumePdf(resumeFile);
      const generatedId = `upload-${Date.now()}`;

      const mappedResume = {
        _id: isSignedIn ? undefined : generatedId,
        userId: isSignedIn ? undefined : getGuestId(),
        title: title.trim() || extractedData.title || 'Uploaded Resume',
        personal_info: extractedData.personal_info || {},
        professional_summary: extractedData.professional_summary || '',
        experience: extractedData.experience || [],
        education: extractedData.education || [],
        skills: extractedData.skills || [],
        template: 'classic',
        accent_color: '#6366f1',
        public: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isSignedIn) {
        const token = await getToken();
        const response = await resumeApi.create(mappedResume, token);
        const createdId = response.data?._id;
        setShowUploadModal(false);
        setResumeFile(null);
        setTitle('');
        fetchAllResume();
        navigate(`/app/builder/${createdId}`);
      } else {
        upsertGuestResume(mappedResume);
        setShowUploadModal(false);
        setResumeFile(null);
        setTitle('');
        fetchAllResume();
        navigate(`/app/builder/${generatedId}`);
      }
    } catch (error) {
      setUploadError('Could not extract resume data from this PDF. Try another file format or clearer PDF.');
    } finally {
      setIsUploading(false);
    }
  };

  const editTitle = async (e) => {
    e.preventDefault();
    try {
      if (!editResumeId) return;
      if (isSignedIn) {
        const token = await getToken();
        await resumeApi.update(editResumeId, { title }, token);
      } else {
        const guestResume = (allresume || []).find((item) => item._id === editResumeId);
        if (guestResume) {
          upsertGuestResume({ ...guestResume, title, updatedAt: new Date().toISOString() });
        }
      }
      setEditResumeId(null);
      setTitle('');
      fetchAllResume();
    } catch (error) {
      notify(error.message || 'Failed to update title', 'error');
    }
  };

  const deleteResume = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
    if (confirmDelete) {
      try {
        if (isSignedIn) {
          const token = await getToken();
          await resumeApi.remove(id, token);
        } else {
          removeGuestResume(id);
        }
        fetchAllResume();
      } catch (error) {
        notify(error.message || 'Failed to delete resume', 'error');
      }
    }
  };

  React.useEffect(() => {
    if (!isLoaded) return;
    fetchAllResume();
  }, [isSignedIn, isLoaded]);

  React.useEffect(() => {
    migrateGuestResumesIfNeeded();
  }, [migrateGuestResumesIfNeeded]);

  return (
    <div className="min-h-screen bg-[#0A0A0F] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        
        <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Welcome back, <span className="text-indigo-400 font-medium">{displayName}</span>
            </p>
          </div>
        </div>

        {/* Action Cards: Create & Upload */}
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8'>
          
          {/* Create Resume Button */}
          <button 
            onClick={() => setShowCreateModal(true)} 
            className='flex flex-col items-center justify-center gap-3 w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-indigo-500/50 h-48 rounded-2xl text-slate-300 group transition-all duration-300 cursor-pointer shadow-xl shadow-indigo-950/10 hover:-translate-y-0.5'
          >
            <div className='p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300'>
              <PlusIcon className='size-6' />
            </div>
            <p className='text-sm font-medium group-hover:text-white transition-colors'>
              Create New Resume
            </p>
          </button>

          {/* Upload Resume Button */}
          <button 
            onClick={() => setShowUploadModal(true)} 
            className='flex flex-col items-center justify-center gap-3 w-full bg-slate-900/60 hover:bg-slate-900 border border-slate-800 hover:border-purple-500/50 h-48 rounded-2xl text-slate-300 group transition-all duration-300 cursor-pointer shadow-xl shadow-purple-950/10 hover:-translate-y-0.5'
          >
            <div className='p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 text-purple-400 group-hover:bg-purple-600 group-hover:text-white transition-all duration-300'>
              <UploadCloudIcon className='size-6' />
            </div>
            <p className='text-sm font-medium group-hover:text-white transition-colors'>
              Upload Existing Resume
            </p>
          </button>
        </div>

        <div className='w-full h-[1px] bg-slate-800 my-8'></div>

        <h2 className='text-lg font-medium text-slate-200 mb-6'>Your Resumes</h2>

        {/* Recent Resumes Section */}
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loading />
          </div>
        ) : allresume.length === 0 ? (
          <div className="p-12 rounded-2xl bg-slate-900/40 border border-slate-800 text-center max-w-md">
            <p className='text-sm text-slate-400'>No resumes found. Create your first one to get started!</p>
          </div>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
            {allresume.map((resume, index) => {
              const baseColor = colors[index % colors.length];
              return (
                <div 
                  onClick={() => navigate(`/app/builder/${resume._id}`)} 
                  key={index} 
                  className='relative w-full h-48 flex flex-col justify-between p-5 rounded-2xl cursor-pointer border border-slate-800 bg-slate-900/70 hover:bg-slate-900 hover:border-slate-700 group transition-all duration-300 shadow-xl shadow-black/20 hover:-translate-y-1'
                >
                  <div className='flex items-start justify-between'>
                    <div className='p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50' style={{ color: baseColor }}>
                      <FilePenLineIcon className='size-5' />
                    </div>
                    
                    {/* Action icons on hover */}
                    <div onClick={e => e.stopPropagation()} className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                      <button 
                        onClick={() => { setEditResumeId(resume._id); setTitle(resume.title); }} 
                        className='p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors'
                        title="Edit Title"
                      >
                        <PencilIcon className='size-4' />
                      </button>
                      <button 
                        onClick={() => deleteResume(resume._id)} 
                        className='p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-lg transition-colors'
                        title="Delete Resume"
                      >
                        <TrashIcon className='size-4' />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className='text-sm font-semibold text-white truncate mb-1'>
                      {resume.title}
                    </h3>
                    <p className='text-[11px] text-slate-400'>
                      Updated {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>

                  <div className='flex items-center justify-between text-[11px] pt-3 border-t border-slate-800/80'>
                    <span className='text-slate-400 font-medium'>Completion</span>
                    <span className='px-2 py-0.5 rounded-full bg-indigo-950 border border-indigo-800/60 text-indigo-300 font-semibold'>
                      {resume.completion || 0}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Create Resume Modal */}
        {showCreateModal && (
          <form onSubmit={createResume} onClick={() => setShowCreateModal(false)} className='fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-sm p-6 text-slate-100'>
              <h2 className='text-lg font-semibold mb-4 text-white'>Create New Resume</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                required
                placeholder="Resume Title (e.g. Software Engineer)"
                className="w-full px-4 py-2.5 mb-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button disabled={isSaving} className='cursor-pointer w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm rounded-xl hover:opacity-90 disabled:opacity-60 transition-all shadow-lg shadow-indigo-600/30'>
                {isSaving ? 'Creating...' : 'Create Resume'}
              </button>
              <button type="button" className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1' onClick={() => { setShowCreateModal(false); setTitle('') }}>
                <XIcon className='size-5' />
              </button>
            </div>
          </form>
        )}

        {/* Upload Resume Modal */}
        {showUploadModal && (
          <form onSubmit={uploadResume} onClick={() => setShowUploadModal(false)} className='fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-sm p-6 text-slate-100'>
              <h2 className='text-lg font-semibold mb-4 text-white'>Upload Resume PDF</h2>
              
              <div className="mb-4">
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Resume Title</label>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  placeholder="Optional Title"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label htmlFor="resume-input" className='block text-xs font-medium text-slate-400 mb-1.5'>
                  Select PDF File
                </label>
                <div className='flex flex-col items-center justify-center gap-2 border border-slate-800 border-dashed rounded-xl p-6 my-2 bg-slate-950 hover:border-indigo-500 text-slate-400 hover:text-indigo-300 cursor-pointer transition-colors'>
                  {resumeFile ? (
                    <p className='text-sm text-indigo-400 font-medium truncate max-w-[240px]'>{resumeFile.name}</p>
                  ) : (
                    <>
                      <UploadCloudIcon className='size-6 text-indigo-400' />
                      <p className='text-xs'>Click to select or drag PDF here</p>
                    </>
                  )}
                </div>
                <input id="resume-input" type="file" className='hidden' required accept='.pdf,application/pdf' onChange={(e) => setResumeFile(e.target.files[0])} />
              </div>

              {uploadError && <p className='text-xs text-rose-400 mt-2 mb-3'>{uploadError}</p>}
              
              <button disabled={isUploading} className='cursor-pointer w-full mt-2 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm rounded-xl hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/30'>
                {isUploading ? 'Extracting with AI...' : 'Upload & Parse'}
              </button>

              <button type="button" className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1' onClick={() => { setShowUploadModal(false); setResumeFile(null); setUploadError(''); }}>
                <XIcon className='size-5' />
              </button>
            </div>
          </form>
        )}

        {/* Edit Title Modal */}
        {editResumeId && (
          <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4'>
            <div onClick={e => e.stopPropagation()} className='relative bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl w-full max-w-sm p-6 text-slate-100'>
              <h2 className='text-lg font-semibold mb-4 text-white'>Edit Resume Title</h2>
              <input
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                type="text"
                required
                placeholder="Resume Title"
                className="w-full px-4 py-2.5 mb-4 bg-slate-950 border border-slate-800 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
              <button className='cursor-pointer w-full py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium text-sm rounded-xl hover:opacity-90 transition-all shadow-lg shadow-indigo-600/30'>
                Update Title
              </button>
              <button type="button" className='absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer p-1' onClick={() => { setEditResumeId(''); setTitle(''); }}>
                <XIcon className='size-5' />
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}