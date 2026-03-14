import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import Pagination from "@mui/material/Pagination";

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
  const [user, setUser] = useState(null);
  const [inventory, setInventory] = useState([]);

  const [page, setPage] = useState(1);
  const rowsPerPage = 10;


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

  if (user && inventory) {

    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    const paginatedInventory = inventory.slice(start, end);

    return (
      <>
        <main className="db-main">
          <div className="fade-in">
            <div className="db-page-title">{user.firstName}'s Dashboard</div>
            <table>
              <thead>
                <tr>
                  <th>Label</th>
                  <th>Category</th>
                  <th>Expiry Date</th>
                  <th>Days Left</th>
                </tr>
              </thead>
              <tbody>
                {paginatedInventory && paginatedInventory.map((item) => (
                  <tr key={item.id}>
                    <td>{item.label}</td>
                    <td>{item.category}</td>
                    <td>{formatDateTime(item.expiryDate)}</td>
                    <td>{Math.ceil((new Date(item.expiryDate) - new Date(item.date)) / (1000 * 60 * 60 * 24))}</td>
                  </tr>
                ))}
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
        </main>
      </>
    );
  }
}
