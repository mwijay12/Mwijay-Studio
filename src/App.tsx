import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import WorkPage from './pages/WorkPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import StudioPage from './pages/StudioPage';
import ServicesPage from './pages/ServicesPage';
import JournalPage from './pages/JournalPage';
import JournalDetailPage from './pages/JournalDetailPage';
import ContactPage from './pages/ContactPage';
import SavedPage from './pages/SavedPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import StartProjectPage from './pages/StartProjectPage';
import NotFoundPage from './pages/NotFoundPage';
import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminHome from './pages/admin/AdminHome';
import AdminProjects from './pages/admin/AdminProjects';
import AdminServices from './pages/admin/AdminServices';
import AdminInquiries from './pages/admin/AdminInquiries';
import AdminVisitors from './pages/admin/AdminVisitors';
import AdminInvoices from './pages/admin/AdminInvoices';
import AdminAgreements from './pages/admin/AdminAgreements';
import ToolsPage from './pages/ToolsPage';
import ToolDetailPage from './pages/ToolDetailPage';

export default function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site */}
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="work" element={<WorkPage />} />
              <Route path="work/:slug" element={<ProjectDetailPage />} />
              <Route path="studio" element={<StudioPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="journal" element={<JournalPage />} />
              <Route path="journal/:slug" element={<JournalDetailPage />} />
              <Route path="contact" element={<ContactPage />} />
              <Route path="saved" element={<SavedPage />} />
              <Route path="privacy" element={<PrivacyPage />} />
              <Route path="terms" element={<TermsPage />} />
              <Route path="start" element={<StartProjectPage />} />
              <Route path="tools" element={<ToolsPage />} />
              <Route path="tools/:toolId" element={<ToolDetailPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Route>

            {/* Admin — accessible directly for now */}
            <Route path="admin/login" element={<AdminLoginPage />} />
            <Route path="admin" element={<AdminDashboardPage />}>
              <Route index element={<AdminHome />} />
              <Route path="projects" element={<AdminProjects />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="inquiries" element={<AdminInquiries />} />
              <Route path="visitors" element={<AdminVisitors />} />
              <Route path="invoices" element={<AdminInvoices />} />
              <Route path="agreements" element={<AdminAgreements />} />
            </Route>
          </Routes>
        </BrowserRouter>
        </ToastProvider>
      </AuthProvider>
    </AppProvider>
  );
}
