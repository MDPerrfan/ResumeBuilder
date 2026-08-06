import React from 'react';
import { Outlet } from 'react-router-dom';
import DashboardNavbar from '../Components/DashboardNavbar'; // Or your main Navbar component

export default function FeatureLayout() {
    return (
        <div className="min-h-screen bg-[#0A0A0F] text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
            <DashboardNavbar />
            <main>
                <Outlet />
            </main>
        </div>
    );
}