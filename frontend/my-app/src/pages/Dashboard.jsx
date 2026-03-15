import { useState, useEffect } from "react";
import "./Dashboard.css";
import Pagination from "@mui/material/Pagination";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 5;


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

  function formatDateTime(dateTimeStr) {
    if (!dateTimeStr) return "N/A";
    try {
      const date = new Date(dateTimeStr);
      return date.toLocaleString();
    } catch (error) {
      return dateTimeStr;
    }
  }

  async function getInventory() {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/inventory`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
      }
    })

    if (res.ok) {
      const data = await res.json();
      setInventory(data);
    }
  }

  useEffect(() => {
    getInventory();

    fetchUserData();

  }, []);

  function daysLeft(start, end) {
    if (!start || !end) return 0;
    return Math.ceil((new Date(end) - new Date(start)) / (1000 * 60 * 60 * 24));
  }

  if (user && inventory) {

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    const sortedInventory = inventory
      ? [...inventory].sort((a, b) => daysLeft(a.date, a.expiryDate) - daysLeft(b.date, b.expiryDate))
      : [];

    const paginatedInventory = sortedInventory.slice(start, end);

    return (
      <>
        <main className="db-main">
          <div className="fade-in">
            <div className="db-page-title">{user.firstName}'s Dashboard</div>
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Label</th>
                  <th>Category</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory && paginatedInventory.map((item) => {

                  const left = daysLeft(item.date, item.expiryDate);
                  return (
                    <tr key={item.id} style={{ backgroundColor: left <= 1 ? "var(--warning)" : "inherit", color: left <= 1 ? "var(--text-primary)" : "inherit" }}>
                      <td><img src={item.photourl} alt={item.label} width={100} /></td>
                      <td>{item.label}</td>
                      <td>{item.category}</td>
                      <td>{formatDateTime(item.expiryDate)}</td>
                      <td>
                        {left}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="pagination">
              <Pagination
                count={Math.ceil(inventory.length / rowsPerPage)}
                page={page}
                onChange={(event, value) => setPage(value)}
                color="primary"
              />

            </div>

          </div>
        </main >
      </>
    );
  }
}
