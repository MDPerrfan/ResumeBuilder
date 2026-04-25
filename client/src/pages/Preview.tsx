import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Loading from '../Components/Loader'
import ResumePreview from '../Components/ResumePreview'
import { ArrowLeftIcon } from 'lucide-react'
import { resumeApi } from '../utils/apiClient'

type Resume = {
  _id: string,
  template: string,
  accent_color: string
}

export default function Preview() {
  const { resumeId } = useParams<{ resumeId: string }>()

  const [resumeData, setResumeData] = React.useState<Resume | null>(null)
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [error, setError] = React.useState<string>("")
  const loadResume = async () => {
    try {
      const response = await resumeApi.getPublic(resumeId || "")
      setResumeData((response.data || null) as Resume | null)
    } catch (err: any) {
      setError(err?.message || "Resume not found")
      setResumeData(null)
    } finally {
      setIsLoading(false)
    }
  }
  useEffect(() => {
    loadResume()
  }, [])
  return resumeData ? (
    <div className='bg-slate-100'>
      <div className='max-w-3xl mx-auto py-10'>
        <ResumePreview data={resumeData} template={resumeData.template} accentColor={resumeData.accent_color} classes={'py-4 bg-white'} />
      </div>
    </div>
  ) : (
    <div className='flex items-center justify-center min-h-screen bg-transparent'>
      {isLoading? <Loading />:(
        <div className='flex flex-col items-center justify-center h-screen'>
          <p className='text-center text-6xl text-slate-400 font-medium'>{error || "Resume not found"}</p>
          <a href="/" className='mt-6 bg-purple-400 hover:bg-purple-700 text-white rounded-full px-6 h-9 ring-offset-1 ring-1 ring-purple-400 flex items-center transition-colors'>
              <ArrowLeftIcon className='size-4 mr-2'/>
              go to home 
          </a>
        </div>
      )}
    </div>
  )
}
