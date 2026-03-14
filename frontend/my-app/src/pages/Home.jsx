import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

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

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <>
      <main className="home-main">
        <div className="fade-in">
          <div className="home-page-title">Your Home Page</div>
          <div className="home-page-sub">Blah</div>
        </div>
      </main>
    </>
  );
}
