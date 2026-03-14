import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

function toTitleCase(str) {
  if (!str) return str;
  return str.charAt(0) + str.slice(1).toLowerCase();
}

function formatStatus(status) {
  if (!status) return "Pending";
  return status
    .toLowerCase()
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <>
      <main className="db-main">
        <div className="fade-in">
          <div className="db-page-title">Your Dashboard</div>
          <div className="db-page-sub">Blah</div>
        </div>
      </main>
    </>
  );
}
