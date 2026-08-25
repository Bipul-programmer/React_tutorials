import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "../context/AuthContext";
import MainLayout from "../components/layout/MainLayout";

import Home from "../pages/Home";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/dashboard/Dashboard";

import TrainList from "../pages/trains/TrainList";
import TrainDetails from "../pages/trains/TrainDetails";

import StationList from "../pages/stations/StationList";
import StationDetails from "../pages/stations/StationDetails";

import RouteSearch from "../pages/routes/RouteSearch";
import LiveTracking from "../pages/tracking/LiveTracking";
import Notifications from "../pages/notifications/Notifications";

function AppRoutes() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <MainLayout>
                    <Routes>
                        {/* Public & Core Routes */}
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        
                        {/* Dashboard */}
                        <Route path="/dashboard" element={<Dashboard />} />

                        {/* Train Routes */}
                        <Route path="/trains" element={<TrainList />} />
                        <Route path="/trains/:id" element={<TrainDetails />} />

                        {/* Station Routes */}
                        <Route path="/stations" element={<StationList />} />
                        <Route path="/stations/:id" element={<StationDetails />} />

                        {/* Routes & Live Tracking & Bulletins */}
                        <Route path="/routes" element={<RouteSearch />} />
                        <Route path="/tracking" element={<LiveTracking />} />
                        <Route path="/notifications" element={<Notifications />} />
                    </Routes>
                </MainLayout>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default AppRoutes;