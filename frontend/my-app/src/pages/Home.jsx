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
  const [user, setUser] = useState(null);

  async function fetchUserData() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })

    console.log(res);

    if (res.ok) {
      const data = await res.json();
      console.log(data);
      setUser(data);
    }

  }

  if (user) {
    return (
      <>
        <main className="home-main">
          <div className="fade-in">
            <div className="home-page-title">Welcome to FreshCheck</div>
            <div className="home-page-sub">Description of our application</div>
          </div>
        </main>
      </>
    );
  }
  else {
    return (
      <>
        <main className="home-main">
          <div className="fade-in">
            <div className="home-page-title">Welcome to FreshCheck</div>
            <div className="home-page-sub">Description of our application</div>
          </div>

          <h2>Login to see your food inventory!</h2>
        </main>
      </>
    );
  }
}
