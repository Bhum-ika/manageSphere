import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query'; // Import QueryClient and QueryClientProvider
import Home from './components/Home.js';
import AdminConsole from './components/AdminConsole.js';
import CreateAdmin from './components/CreateAdmin.js';
import LoginUser from './components/LoginUser.js';
import AllUsers from './components/AllUsers.js';
import UserDashBoard from './components/UserDashBoard.js';
import AdminUserCreation from './components/AdminUserCreation.js';
import EditUser from './components/EditUser.js';
import PageManager from './components/admin/PageManager.js';
import PermissionsManagement from './components/admin/PermissionsManagement.js';
import PageList from './components/admin/PageList.js';
import { LoadingProvider } from './utils/LoadingProvider.js';
import PrivateRoute from './utils/PrivateRoute.js';
import UserPages from './components/UserPages.js';
import ForgotPassword from './components/ForgotPassword.js';
import UserAccount from './components/UserAccount.js';
import PagesPermissions from './components/admin/PagesPermissions.js';
import ServicesPage from './components/admin/ServicesPage.js';
import UserServices from './components/UserServices.js';
import ServicesPermission from './components/admin/ServicesPermission.js';
import ToastComponent from './utils/ToastComponent.js';

// Create a QueryClient instance
const queryClient = new QueryClient();

function App() {
  return (
    <LoadingProvider>
      <QueryClientProvider client={queryClient}> {/* Add QueryClientProvider here */}
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<AdminConsole />} />
              <Route path="/allUsers" element={<AllUsers />} />
              <Route path="/adminUserCreation" element={<AdminUserCreation />} />
              <Route path="/editUser" element={<EditUser />} />
              <Route path="/pageManager" element={<PageManager />} />
              <Route path="/permissions" element={<PermissionsManagement />} />
              <Route path="/pageList" element={<PageList />} />
              <Route path="/createAdmin" element={<CreateAdmin />} />
              <Route path="/pagePermissions" element={<PagesPermissions />} />
              <Route path="/servicesPage" element={<ServicesPage />} />
              <Route path="/userDashboard" element={<UserDashBoard />} />
              <Route path="/userPages" element={<UserPages />} />
              <Route path="/userAccount" element={<UserAccount />} />
              <Route path="/servicesPermission" element={<ServicesPermission />} />
              <Route path="/userServices" element={<UserServices />} />
            </Route>
            <Route path="/loginUser" element={<LoginUser />} />
            <Route path="/forgotPassword" element={<ForgotPassword />} />

          </Routes>
        </BrowserRouter>
        <ToastComponent />
      </QueryClientProvider> {/* Close QueryClientProvider here */}
    </LoadingProvider>
  );
}

export default App;
