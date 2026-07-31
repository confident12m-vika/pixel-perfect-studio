import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import PortfolioManager from "./PortfolioManager";
import MessagesManager from "./MessagesManager";
import "./Admin.css";

export default function AdminDashboard() {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("portfolio");

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  return (
    <div className="admin-shell">
      <header className="admin-shell__header">
        <div className="admin-auth__brand">
          <img src="/assets/logo-monogram.png" alt="" />
          <span>Pixel Perfect Studio — Admin</span>
        </div>
        <div className="admin-shell__user">
          <span>{admin?.email}</span>
          <button className="btn btn-outline admin-btn-sm" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <nav className="admin-shell__tabs">
        <button
          className={tab === "portfolio" ? "is-active" : ""}
          onClick={() => setTab("portfolio")}
        >
          Portfolio
        </button>
        <button
          className={tab === "messages" ? "is-active" : ""}
          onClick={() => setTab("messages")}
        >
          Messages
        </button>
      </nav>

      <main className="admin-shell__main">
        {tab === "portfolio" ? <PortfolioManager /> : <MessagesManager />}
      </main>
    </div>
  );
}
