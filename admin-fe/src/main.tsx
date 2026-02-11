import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Protected from "./components/Protected.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import { Navigate } from "react-router";
import Dashboard from "./Dashboard.tsx";
import DashboardHome from "./pages/DashboardHome.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public route */}
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route path="/" element={<Protected />}>
            <Route element={<Dashboard />} >
              <Route index element={<DashboardHome />}></Route>
            </Route>

            {/* Fallback: Navigate to login if path doesn't exist */}
            {/* <Route path="*" element={<Navigate to="/login" replace/>}/> */}
          </Route>

          {/* Optional fallback: Not Found Page for public */}
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
