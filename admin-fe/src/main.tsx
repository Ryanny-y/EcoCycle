import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Protected from "./components/Protected.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./contexts/AuthContext.tsx";
import Login from "./pages/Login.tsx";
import Dashboard from "./Dashboard.tsx";
import DashboardHome from "./pages/DashboardHome.tsx";
import ResidentRecords from "./pages/ResidentRecords.tsx";
import { Toaster } from "sonner";
import NonResidentRecords from "./pages/NonResidentRecords.tsx";
import EarnPoints from "./pages/EarnPoints.tsx";
import RedeemRewards from "./pages/RedeemRewards.tsx";
import RewardItems from "./pages/RewardItems.tsx";
import { RewardItemsProvider } from "./contexts/RewardItemsContext.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Toaster
        position="bottom-right"
        richColors
        // theme="system"
      />

      <AuthProvider>
        <RewardItemsProvider>
          <Routes>
            {/* Public route */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route path="/" element={<Protected />}>
              <Route element={<Dashboard />}>
                <Route index element={<DashboardHome />} />
                
                {/* Records */}
                <Route path="records">
                  <Route path="residents" element={<ResidentRecords />} />
                  <Route path="non-residents" element={<NonResidentRecords />} />
                </Route>

                {/* Rewards & Redeem */}
                <Route path="rewards">
                  <Route path="earn-points" element={<EarnPoints />} />
                  <Route path="redeem" element={<RedeemRewards />} />
                </Route>

                {/* Inventory */}
                <Route path="inventory">
                  <Route path="reward-items" element={<RewardItems />}/>
                </Route>

              </Route>

            {/* Fallback: Navigate to login if path doesn't exist */}
            {/* <Route path="*" element={<Navigate to="/login" replace/>}/> */}
            </Route>

            {/* Optional fallback: Not Found Page for public */}
            {/* <Route path="*" element={<NotFound />} /> */}
          </Routes>

        </RewardItemsProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
