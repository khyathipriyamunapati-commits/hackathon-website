import React, { useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { DemoBanner } from './components/common/DemoBanner';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';

// Pages
import { HomePage } from './pages/HomePage';
import { DestinationsPage } from './pages/DestinationsPage';
import { DestinationDetailPage } from './pages/DestinationDetailPage';
import { GuidesPage } from './pages/GuidesPage';
import { GuideProfilePage } from './pages/GuideProfilePage';
import { BookGuidePage } from './pages/BookGuidePage';
import { BudgetPlannerPage } from './pages/BudgetPlannerPage';
import { RecommendationsPage } from './pages/RecommendationsPage';
import { MessagesPage } from './pages/MessagesPage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { AuthPage } from './pages/AuthPage';

// Dashboards
import { TouristDashboard } from './pages/dashboards/TouristDashboard';
import { GuideDashboard } from './pages/dashboards/GuideDashboard';
import { AdminDashboard } from './pages/dashboards/AdminDashboard';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

export const App: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans">
      <ScrollToTop />
      
      {/* Demo Banner */}
      <DemoBanner />

      {/* Main Navbar */}
      <Navbar />

      {/* Page Viewports */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
          <Route path="/guides" element={<GuidesPage />} />
          <Route path="/guides/:id" element={<GuideProfilePage />} />
          <Route path="/book/:guideId" element={<BookGuidePage />} />
          <Route path="/budget" element={<BudgetPlannerPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/messages" element={<MessagesPage />} />
          <Route path="/how-it-works" element={<HowItWorksPage />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Dashboards */}
          <Route path="/dashboard/tourist" element={<TouristDashboard />} />
          <Route path="/dashboard/guide" element={<GuideDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Site Footer */}
      <Footer />
    </div>
  );
};

export default App;
