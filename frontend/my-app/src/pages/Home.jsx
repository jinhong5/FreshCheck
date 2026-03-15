import "./Home.css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from '../contexts/UserContext';

export default function HomePage() {

  const [user, setUser] = useState(null);
  const { loggedIn } = useContext(UserContext);

  async function fetchUserData() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/user/me`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (res.ok) {
      const data = await res.json();
      setUser(data);
    }

  }

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    if (loggedIn) {
      fetchUserData();
    }
  }, [loggedIn]);

  return (
    <div className="home-page">
      {loggedIn && user && < h3 > Welcome back, {user.firstName}!</h3>}
      {!loggedIn && <h3>Log in to save your inventory</h3>}
      <main className="home-main">

        <section className="hero fade-in">
          <h1 className="home-page-title">FreshCheck</h1>
          <p className="home-page-sub">
            An AI-powered food freshness scanner that helps you waste less and use food more responsibly.
          </p>
        </section>

        <section className="pitch-grid fade-in">
          <article className="pitch-card">
            <h2>What it is</h2>
            <p>
              FreshCheck lets you quickly scan produce with your phone. Our AI analyzes the image and estimates how fresh
              the food is and how long it likely has before it spoils.
            </p>
          </article>

          <article className="pitch-card">
            <h2>What it does</h2>
            <p>
              Using computer vision, FreshCheck detects visual freshness indicators like discoloration, bruising, or mold.
              Based on those signals, it generates a freshness score and an estimate of days remaining.
            </p>
          </article>

          <article className="pitch-card">
            <h2>Why we built it</h2>
            <p>
              50% of the world's fruits and vegetables are lost before reaching consumers. FreshCheck helps households, small businesses and cafeterias reduce food waste.
            </p>
            <p>
              Our goal is to address the global food security issue.
            </p>
          </article>
        </section>
      </main >
    </div>
  );


}
