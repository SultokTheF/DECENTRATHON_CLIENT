import { Route, Routes, Navigate } from "react-router-dom";
import {
  Login,
  Register
} from './components';

import {
  Profile,
  Centers,
  Center,
  Users,
  Sections as AdminSections,
  Subscriptions,
  Schedules,
  PageNotFound,
  Dashboard,
  Records,
} from './modules/admin';  // Make sure Subscriptions is exported from your admin module

import {
  ManagerSections,
  CommonPageNotFound
} from './modules/common';

import { 
  Sections as StaffSections,
  Center as StaffCenter
} from './modules/staff';  // Import the Sections component for staff

const Router = ({ userRole }) => {
  const isAuthenticated = Boolean(userRole);  // Проверка аутентификации на основе userRole

  return (
    <Routes>
      {/* Если пользователь не аутентифицирован */}
      {!isAuthenticated && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<Navigate to="/login" />} /> {/* Перенаправление всех путей на логин */}
        </>
      )}

      {/* Если пользователь аутентифицирован */}
      {isAuthenticated && (
        <>
          {/* Общие маршруты для всех ролей */}
          {/* <Route path="/" element={<CentersMap />} />
          <Route path="/categories" element={<CommonCategories />} />
          <Route path="/categories/:id" element={<CommonSectionsByCategory />} />
          <Route path="/centers/:id" element={<CommonCenter />} /> */}
          <Route path="/section/:id" element={<ManagerSections />} />
          <Route path="/center/:id" element={<Center />} />
          <Route path="*" element={<CommonPageNotFound />} />

          {/* Админские маршруты */}
          {userRole && (
            <>
              <Route path="/profile" element={<Profile />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/centers" element={<Centers />} />
              <Route path="/centers/:id" element={<Center />} />
              <Route path="/sections" element={<AdminSections />} />
              <Route path="/users" element={<Users />} />
              <Route path="/subscriptions" element={<Subscriptions />} />
              <Route path="/schedules" element={<Schedules />} />
              <Route path="/records" element={<Records />} />
              <Route path="*" element={<PageNotFound />} />
            </>
          )}
        </>
      )}
    </Routes>
  );
};

export default Router;
