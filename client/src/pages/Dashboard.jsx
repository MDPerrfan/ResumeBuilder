import React from 'react'
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { useNavigate } from 'react-router-dom';
import { parseResumePdf } from '../utils/parseResumePdf';
import { useAuth, useUser } from '@clerk/react';
import { resumeApi, userApi } from '../utils/apiClient';
import { clearGuestResumes, getGuestId, getGuestResumes, removeGuestResume, upsertGuestResume } from '../utils/resumeStorage';
import InlineNotice from '../Components/InlineNotice';

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

  const { user, isSignedIn } = useUser();
  const { getToken } = useAuth();
  const displayName = user?.fullName || user?.firstName || user?.primaryEmailAddress?.emailAddress || 'User';
  const colors = ['#9333ea', '#d97706', '#dc2626', '#059669', '#2563eb', '#db2777', '#14b8a6', '#eab308', '#4f46e5', '#16a34a'];
  const navigate = useNavigate()

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
        accent_color: '#4F39F6',
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
        accent_color: '#4F39F6',
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
}

const deleteResume = async (id) => {
  const confirmDelete = window.confirm('Are you sure you want to delete this resume?');
  if (confirmDelete){
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
}
  React.useEffect(() => {
    fetchAllResume();
  }, [isSignedIn]);

  React.useEffect(() => {
    migrateGuestResumesIfNeeded();
  }, [migrateGuestResumesIfNeeded]);


  return (
    <div>
      <InlineNotice notice={notice} onClose={() => setNotice({ type: '', message: '' })} />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome, {displayName}!
        </p>

        <div className='flex gap-4'>
          {/* Create Resume */}
          <button onClick={() => setShowCreateModal(true)} className='flex flex-col items-center justify-center gap-2 w-full bg-white sm:max-w-36 h-48 rounded-lg text-slate-600 border border-dashed border-slate-300 group hover:border-indigo-500 transition-all duration-300 cursor-pointer hover:shadow-lg'>
            <PlusIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-indigo-300 to-indigo-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-indigo-600 transition-all duration-300'>
              Create New Resume
            </p>
          </button>

          {/* Upload Resume */}
          <button onClick={() => setShowUploadModal(true)} className='flex flex-col items-center justify-center gap-2 w-full bg-white sm:max-w-36 h-48 rounded-lg text-slate-600 border border-dashed border-slate-300 group-hover:border-purple-500 transition-all duration-300 cursor-pointer hover:shadow-lg'>
            <UploadCloudIcon className='size-11 transition-all duration-300 p-2.5 bg-gradient-to-br from-purple-300 to-purple-500 text-white rounded-full' />
            <p className='text-sm group-hover:text-purple-600 transition-all duration-300'>
              Upload Existing Resume
            </p>
          </button>
        </div>
        <hr className='border-slate-300 my-6 sm:w-[305px]' />

        {/* Recent Resumes Section */}
        <div className='grid grid-cols-2 sm:flex flex-wrap gap-4'>
          {allresume.map((resume, index) => {
            const baseColor = colors[index % colors.length];
            return (
              <button onClick={() => navigate(`/app/builder/${resume._id}`)} key={index} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg cursor-pointer gap-2 border group hover:shadow-lg transition-all duration-300' style={{ background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`, borderColor: baseColor + '40' }}>

                <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{ color: baseColor }} />
                <p className='text-sm group-hover:scale-105 transition-all' style={{ color: baseColor }}>
                  {resume.title}
                </p>
                <p className='text-[11px] text-slate-400 absolute bottom-2  group-hover:text-slate-500 transition-all duration-300 text-center' style={{ color: baseColor + '90' }}>
                  Updated on {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className='absolute bottom-7 text-[10px] font-medium' style={{ color: baseColor + 'AA' }}>
                  {resume.completion || 0}% complete
                </p>
                <div onClick={e=>e.stopPropagation()} className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <TrashIcon onClick={() => deleteResume(resume._id)} className='size-7 p-1.5 text-slate-700 hover:bg-white/50 transition-colors rounded' />
                  <PencilIcon onClick={()=>{setEditResumeId(resume._id); setTitle(resume.title)}} className='size-7 p-1.5 text-slate-700 hover:bg-white/50 transition-colors rounded' />
                </div>
              </button>
            );
          })}
        </div>

        {/* Create Resume Modal */}
        {
          showCreateModal && (
            <form onSubmit={createResume} onClick={() => setShowCreateModal(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>Create New Resume</h2>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  required
                  placeholder="Resume Title"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
                <button disabled={isSaving} className='cursor-pointer w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 transition-colors '>{isSaving ? 'Creating...' : 'Create'}</button>
                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer' onClick={() => { setShowCreateModal(false); setTitle('') }} />
              </div>
            </form>
          )
        }

        {/* Upload Resume Modal */}
        {
          showUploadModal && (
            <form onSubmit={uploadResume} onClick={() => setShowUploadModal(false)} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>Upload Resume</h2>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  required
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
                <div>
                  <label htmlFor="resume-input" className='block text-sm text-slate-700'>
                    Select Resume File
                    <div className='flex flex-col items-center justify-center gap-2 border group text-slate-400 border-slate-400 border-dashed rounded-md p-4 py-10 my-4 hover:border-green-500 hover:text-green-700 cursor-pointer transition-colors'>
                      {resumeFile ? (
                        <p className='text-sm text-green-600'>{resumeFile.name}</p>
                      ) : (
                        <>
                          <FilePenLineIcon className='size-7' />
                          <p className='text-sm'>Click to select a file</p>
                        </>
                      )}
                    </div>
                  </label>
                  <input id="resume-input" type="file" className='hidden' required accept='.pdf,application/pdf' onChange={(e) => setResumeFile(e.target.files[0])} />
                </div>
                {uploadError && <p className='text-sm text-red-500 mb-3'>{uploadError}</p>}
                <button disabled={isUploading} className='cursor-pointer w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors '>{isUploading ? 'Extracting...' : 'Upload'}</button>
                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer' onClick={() => { setShowUploadModal(false); setResumeFile(null) }} />
              </div>
            </form>
          )
        }
        {/* Edit Title Modal */}
           {
          editResumeId && (
            <form onSubmit={editTitle} onClick={() => setEditResumeId('')} className='fixed inset-0 bg-black/70 backdrop-blur bg-opacity-50 z-10 flex items-center justify-center'>
              <div onClick={e => e.stopPropagation()} className='relative bg-slate-50 border shadow-md rounded-lg w-full max-w-sm p-6'>
                <h2 className='text-xl font-bold mb-4'>Edit Resume Title</h2>
                <input
                  onChange={(e) => setTitle(e.target.value)}
                  value={title}
                  type="text"
                  required
                  placeholder="Resume Title"
                  className="w-full px-4 py-2 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:border-green-600 focus:ring-2 focus:ring-green-600"
                />
                <button className='cursor-pointer w-full py-2 bg-green-600 text-white rounded hover:bg-green-700  transition-colors '>Update</button>
                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer' onClick={() => { setEditResumeId(''); setTitle('') }} />
              </div>
            </form>
          )
        }
      </div>
    </div>
  )
}
