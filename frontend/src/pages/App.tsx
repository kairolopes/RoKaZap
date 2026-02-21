import { Route, Routes } from "react-router-dom";
import { ChatLayout } from "./ChatLayout";
import { Login } from "./Login";
import { AdminDashboard } from "./AdminDashboard";
import { Customers } from "./Customers";
import { useEffect } from "react";
import { initFcm } from "../fcm";

function App() {
  useEffect(() => {
    initFcm().catch(() => undefined);
  }, []);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/customers" element={<Customers />} />
      <Route path="/*" element={<ChatLayout />} />
    </Routes>
  );
}

export default App;
