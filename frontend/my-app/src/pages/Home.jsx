import "./Home.css";
import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../components/userContext";

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

    console.log(res);

    if (res.ok) {
      const data = await res.json();
      console.log(data);
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

    <main className="home-main">

      {loggedIn && user && < h3 > Welcome back, {user.firstName}!</h3>}
      {!loggedIn && <h3>Log in to save your inventory</h3>}

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
            Based on those signals, it generates a freshness score, an estimate of days remaining, and storage tips to
            extend shelf life.
          </p>
          <p className="pitch-note">
            Users can also report how long the food actually lasted, feeding back into the system to improve future
            predictions.
          </p>
        </article>

        <article className="pitch-card">
          <h2>Why we built it</h2>
          <p>
            Food waste is a major global issue, and many people throw away food simply because they are unsure if it is
            still safe to eat. FreshCheck helps households make more informed decisions, reducing waste, saving money,
            and enabling more food to be donated instead of discarded.
          </p>
          <p>
            Our goal is to use AI not just as a tech demo, but as a practical tool that helps people use food more
            thoughtfully.
          </p>
        </article>
      </section>
    </main >
  );


}
