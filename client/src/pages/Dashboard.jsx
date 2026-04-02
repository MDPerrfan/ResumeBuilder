import React from 'react'
import { FilePenLineIcon, PencilIcon, PlusIcon, TrashIcon, UploadCloudIcon, XIcon } from 'lucide-react'
import { dummyResumeData } from '../assets/assets';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {

  const [allresume, setAllresume] = React.useState([]);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [showUploadModal, setShowUploadModal] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [resumeFile, setResumeFile] = React.useState(null);
  const [editResumeId, setEditResumeId] = React.useState(null);

  const user = { name: 'Parves' }
  const colors = ['#9333ea', '#d97706', '#dc2626', '#059669', '#2563eb', '#db2777', '#14b8a6', '#eab308', '#4f46e5', '#16a34a'];
  const navigate = useNavigate()

  const fetchAllResume = async () => {
    try {

      setAllresume(dummyResumeData);

    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const createResume = async (e) => {
    e.preventDefault();
    try {
      // Implement API call to create resume here
      setShowCreateModal(false);
      navigate(`/app/builder/title=${'res123'}`);
      // After successful creation, fetch the updated list of resumes
      fetchAllResume();
    } catch (error) {
      console.error('Error creating resume:', error);
    }
  };


  const uploadResume = async (e) => {
    e.preventDefault();
    try {
      // Implement API call to upload resume here
      setShowUploadModal(false);
      navigate(`/app/builder/title=${'res123'}`);
      fetchAllResume();
    } catch (error) {
      console.error('Error uploading resume:', error);
    }
  };


  React.useEffect(() => {
    fetchAllResume();
  }, []);


  return (
    <div>
      <div className='max-w-7xl mx-auto px-4 py-8'>
        <p className='text-2xl font-medium mb-6 bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-transparent sm:hidden'>
          Welcome, {user?.name}!
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
              <button key={index} className='relative w-full sm:max-w-36 h-48 flex flex-col items-center justify-center rounded-lg cursor-pointer gap-2 border group hover:shadow-lg transition-all duration-300' style={{ background: `linear-gradient(135deg,${baseColor}10,${baseColor}40)`, borderColor: baseColor + '40' }}>

                <FilePenLineIcon className='size-7 group-hover:scale-105 transition-all' style={{ color: baseColor }} />
                <p className='text-sm group-hover:scale-105 transition-all' style={{ color: baseColor }}>
                  {resume.title}
                </p>
                <p className='text-[11px] text-slate-400 absolute bottom-2  group-hover:text-slate-500 transition-all duration-300 text-center' style={{ color: baseColor + '90' }}>
                  Updated on {new Date(resume.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <div className='absolute top-1 right-1 group-hover:flex items-center hidden'>
                  <TrashIcon className='size-7 p-1.5 text-slate-700 hover:bg-white/50 transition-colors rounded' />
                  <PencilIcon className='size-7 p-1.5 text-slate-700 hover:bg-white/50 transition-colors rounded' />
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
                <button className='cursor-pointer w-full py-2 bg-green-600 text-white rounded hover:bg-green-700  transition-colors '>Create</button>
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
                  <input id="resume-input" type="file" className='hidden' required accept='pdf' onChange={(e) => setResumeFile(e.target.files[0])} />
                </div>
                <button className='cursor-pointer w-full py-2 bg-green-600 text-white rounded hover:bg-green-700  transition-colors '>Upload</button>
                <XIcon className='absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer' onClick={() => { setShowUploadModal(false); setResumeFile(null) }} />
              </div>
            </form>
          )
        }
      </div>
    </div>
  )
}
