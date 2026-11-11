import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './routes/ProtectedRoute';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import AdminLayout from './layouts/AdminLayout';
import TrainerLayout from './layouts/TrainerLayout';
import MemberLayout from './layouts/MemberLayout';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Plans from './pages/public/Plans';
import Trainers from './pages/public/Trainers';
import Facilities from './pages/public/Facilities';
import Contact from './pages/public/Contact';
import Login from './pages/public/Login';
import Register from './pages/public/Register';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMembers from './pages/admin/AdminMembers';
import AdminTrainers from './pages/admin/AdminTrainers';
import AdminPlans from './pages/admin/AdminPlans';
import AdminMemberships from './pages/admin/AdminMemberships';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSalaries from './pages/admin/AdminSalaries';
import AdminExercises from './pages/admin/AdminExercises';
import AdminWorkouts from './pages/admin/AdminWorkouts';
import AdminSessions from './pages/admin/AdminSessions';
import AdminAttendance from './pages/admin/AdminAttendance';
import AdminProgress from './pages/admin/AdminProgress';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminNotifications from './pages/admin/AdminNotifications';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminContact from './pages/admin/AdminContact';
import AdminSettings from './pages/admin/AdminSettings';

// Trainer Pages
import TrainerDashboard from './pages/trainer/TrainerDashboard';
import TrainerMembers from './pages/trainer/TrainerMembers';
import TrainerWorkouts from './pages/trainer/TrainerWorkouts';
import TrainerSchedule from './pages/trainer/TrainerSchedule';
import TrainerSalaries from './pages/trainer/TrainerSalaries';
import TrainerProfile from './pages/trainer/TrainerProfile';

// Member Pages
import MemberDashboard from './pages/member/MemberDashboard';
import MemberMembership from './pages/member/MemberMembership';
import MemberPayments from './pages/member/MemberPayments';
import MemberWorkouts from './pages/member/MemberWorkouts';
import MemberCalendar from './pages/member/MemberCalendar';
import MemberProgress from './pages/member/MemberProgress';
import MemberAttendance from './pages/member/MemberAttendance';
import MemberNotifications from './pages/member/MemberNotifications';
import MemberProfile from './pages/member/MemberProfile';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<PublicLayout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="plans" element={<Plans />} />
            <Route path="trainers" element={<Trainers />} />
            <Route path="facilities" element={<Facilities />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Protected Admin Portal */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="members" element={<AdminMembers />} />
            <Route path="trainers" element={<AdminTrainers />} />
            <Route path="plans" element={<AdminPlans />} />
            <Route path="memberships" element={<AdminMemberships />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="salaries" element={<AdminSalaries />} />
            <Route path="exercises" element={<AdminExercises />} />
            <Route path="workouts" element={<AdminWorkouts />} />
            <Route path="sessions" element={<AdminSessions />} />
            <Route path="attendance" element={<AdminAttendance />} />
            <Route path="progress" element={<AdminProgress />} />
            <Route path="announcements" element={<AdminAnnouncements />} />
            <Route path="notifications" element={<AdminNotifications />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Protected Trainer Portal */}
          <Route
            path="/trainer"
            element={
              <ProtectedRoute allowedRoles={['trainer']}>
                <TrainerLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<TrainerDashboard />} />
            <Route path="members" element={<TrainerMembers />} />
            <Route path="workouts" element={<TrainerWorkouts />} />
            <Route path="schedule" element={<TrainerSchedule />} />
            <Route path="salaries" element={<TrainerSalaries />} />
            <Route path="exercises" element={<AdminExercises />} />
            <Route path="profile" element={<TrainerProfile />} />
          </Route>

          {/* Protected Member Portal */}
          <Route
            path="/member"
            element={
              <ProtectedRoute allowedRoles={['member']}>
                <MemberLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<MemberDashboard />} />
            <Route path="membership" element={<MemberMembership />} />
            <Route path="payments" element={<MemberPayments />} />
            <Route path="workouts" element={<MemberWorkouts />} />
            <Route path="calendar" element={<MemberCalendar />} />
            <Route path="progress" element={<MemberProgress />} />
            <Route path="attendance" element={<MemberAttendance />} />
            <Route path="notifications" element={<MemberNotifications />} />
            <Route path="profile" element={<MemberProfile />} />
          </Route>

          {/* Fallback Catch-All */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
