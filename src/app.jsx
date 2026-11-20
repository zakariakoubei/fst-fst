import React from 'react';
import { useApp } from './context/AppContext';
import Navbar from './components/Navbar';
import LoginModal from './components/loginmodal';
import HomeSection from './components/HomeSection';
import GradesSection from './components/GradesSection';
import SessionsSection from './components/SessionsSection';
import TimetableSection from './components/TimetableSection';
import NewsSection from './components/NewsSection';
import ClubsSection from './components/clubssection';
import PhotosSection from './components/photossection';
import AccountSection from './components/accountsection';
import WorkspaceSection from './components/workspacesection';

export default function App() {
  const { activeView, isRTL, siteConfig, language } = useApp();

  function renderView() {
    switch (activeView) {
      case 'grades':
        return <GradesSection />;
      case 'td':
        return <SessionsSection sessionType="TD" />;
      case 'tp':
        return <SessionsSection sessionType="TP" />;
      case 'timetable':
        return <TimetableSection />;
      case 'news':
        return <NewsSection />;
      case 'clubs':
        return <ClubsSection />;
      case 'photos':
        return <PhotosSection />;
      case 'account':
        return <AccountSection />;
      case 'workspace':
        return <WorkspaceSection />;
      case 'home':
      default:
        return <HomeSection />;
    }
  }

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-slate-50 text-slate-900 flex flex-col"
    >
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6 sm:py-8">
        {renderView()}
      </main>
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        {siteConfig.universityName[language] || siteConfig.universityName.en} •{' '}
        {siteConfig.academicYear}
      </footer>
      <LoginModal />
    </div>
  );
}