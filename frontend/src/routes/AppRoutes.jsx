import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/auth/Login";
import RegisterGuest from "../pages/auth/RegisterGuest";
import RegisterCompany from "../pages/auth/RegisterCompany";
import RegisterStaff from "../pages/auth/RegisterStaff";
import AdminDashboard from "../pages/dashboard/admin/AdminDashboard";
import CompanyDashboard from "../pages/dashboard/company/CompanyDashboard";
import GuestDashboard from "../pages/dashboard/guest/GuestDashboard";
import StaffDashboard from "../pages/dashboard/staff/StaffDashboard";
import PendingApproval from "../pages/PendingApproval";
import UserLayout from "../layouts/UserLayout";
import AdminLayout from "../layouts/AdminLayout";
import RegisterAdmin from "../pages/auth/RegisterAdmin";
import CompanyManagement from "../pages/dashboard/admin/CompanyManagement";
import StaffManagement from "../pages/dashboard/admin/StaffManagement";
import GuestManagement from "../pages/dashboard/admin/GuestManagement";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Default Route */}
            <Route path="/" element={<Login />} />


            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register/guest" element={<RegisterGuest />} />
            <Route path="/register/company" element={<RegisterCompany />} />
            <Route path="/register/staff" element={<RegisterStaff />} />
            <Route path="/self-register" element={<RegisterAdmin />} />

            {/* Admin Routes */}
            <Route
                path="/admin/*"
                element={
                    <ProtectedRoute>
                        <AdminLayout>
                            <Routes>
                                <Route path="company" element={<CompanyManagement />} />
                                <Route path="staff" element={<StaffManagement />} />
                                <Route path="guest" element={<GuestManagement />} />
                                <Route path="dashboard" element={<AdminDashboard />} />
                            </Routes>
                        </AdminLayout>
                    </ProtectedRoute>
                }
            />

            {/* Company Routes */}
            <Route
                path="/company/*"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Routes>
                                <Route path="dashboard" element={<CompanyDashboard />} />
                            </Routes>
                        </UserLayout>
                    </ProtectedRoute>
                }
            />

            {/* Guest Routes */}
            <Route
                path="/guest/*"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Routes>
                                <Route path="dashboard" element={<GuestDashboard />} />
                            </Routes>
                        </UserLayout>
                    </ProtectedRoute>
                }
            />

            {/* Staff Routes */}
            <Route
                path="/staff/*"
                element={
                    <ProtectedRoute>
                        <UserLayout>
                            <Routes>
                                <Route path="dashboard" element={<StaffDashboard />} />
                            </Routes>
                        </UserLayout>
                    </ProtectedRoute>
                }
            />

            <Route path="/pending-approval" element={<PendingApproval />} />
        </Routes>
    );
};

export default AppRoutes;
