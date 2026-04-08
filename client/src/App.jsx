import React from 'react'
import { Route, Routes } from 'react-router-dom'
import { AuthenticateWithRedirectCallback } from '@clerk/react'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import ResumeBuilder from './pages/ResumeBuilder'
import Preview from './pages/Preview'
import Layout from './pages/Layout'
export default function App() {
  return (
    <>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/app' element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path='builder/:resumeId' element={<ResumeBuilder />} />
        </Route>
        <Route path='view/:resumeId' element={<Preview />} />
        <Route path='/login' element={<Login />} />
        <Route path='/login/sso-callback' element={<AuthenticateWithRedirectCallback />} />
        <Route path='/sso-callback' element={<AuthenticateWithRedirectCallback />} />
      </Routes>
    </>
  )
}
