// React import not required with new JSX transform
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { RecordsPage } from './pages/RecordsPage';
import { AddEditRecordPage } from './pages/AddEditRecordPage';
import { ViewRecordPage } from './pages/ViewRecordPage';
import { CategoryListPage } from './pages/CategoryListPage';
import { AddEditCategoryPage } from './pages/AddEditCategoryPage';
import { DepartmentListPage } from './pages/DepartmentListPage';
import { AddEditDepartmentPage } from './pages/AddEditDepartmentPage';
import { ExportPage } from './pages/ExportPage';
import { TecStaffPage } from './pages/TecStaffPage';
import { AddEditStaffPage } from './pages/AddEditStaffPage';
import { BidderListPage } from './pages/BidderListPage';
import { AddEditBidderPage } from './pages/AddEditBidderPage';
import { BidOpeningCommitteePage } from './pages/BidOpeningCommitteePage';
import { AddEditCommitteePage } from './pages/AddEditCommitteePage';
import { UserManagementPage } from './pages/UserManagementPage';
import { AddEditUserPage } from './pages/AddEditUserPage';
import { AuditLogPage } from './pages/AuditLogPage';
// Protected Route Wrapper
const ProtectedRoute = () => {
  const isAuthenticated = sessionStorage.getItem('mock-auth-token');
  return isAuthenticated ? <MainLayout>
      <Outlet />
    </MainLayout> : <Navigate to="/login" replace />;
};
export function App() {
  return <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route path="/records" element={<RecordsPage />} />
          <Route path="/records/add" element={<AddEditRecordPage />} />
          <Route path="/records/edit/:id" element={<AddEditRecordPage />} />
          <Route path="/records/view/:id" element={<ViewRecordPage />} />

          <Route path="/categories" element={<CategoryListPage />} />
          <Route path="/categories/add" element={<AddEditCategoryPage />} />
          <Route path="/categories/edit/:id" element={<AddEditCategoryPage />} />

          <Route path="/departments" element={<DepartmentListPage />} />
          <Route path="/departments/add" element={<AddEditDepartmentPage />} />
          <Route path="/departments/edit/:id" element={<AddEditDepartmentPage />} />

          <Route path="/tec-staff" element={<TecStaffPage />} />
          <Route path="/tec-staff/add" element={<AddEditStaffPage />} />
          <Route path="/tec-staff/edit/:id" element={<AddEditStaffPage />} />

          <Route path="/bidders" element={<BidderListPage />} />
          <Route path="/bidders/add" element={<AddEditBidderPage />} />
          <Route path="/bidders/edit/:id" element={<AddEditBidderPage />} />

          <Route path="/bid-opening" element={<BidOpeningCommitteePage />} />
          <Route path="/bid-opening/add" element={<AddEditCommitteePage />} />
          <Route path="/bid-opening/edit/:id" element={<AddEditCommitteePage />} />

          <Route path="/users" element={<UserManagementPage />} />
          <Route path="/users/add" element={<AddEditUserPage />} />
          <Route path="/users/edit/:id" element={<AddEditUserPage />} />

          <Route path="/audit-log" element={<AuditLogPage />} />

          <Route path="/export" element={<ExportPage />} />
        </Route>
      </Routes>
    </Router>;
}