import React from 'react'
import { Outlet } from 'react-router-dom'
import DashboardNavbar from '../Components/DashboardNavbar'

export default function Layout() {
  return (
    <div className='min-h-screen bg-slate-50 text-slate-900'>
        <DashboardNavbar />
        <main>
            <Outlet />
        </main>
    </div>
  )
}