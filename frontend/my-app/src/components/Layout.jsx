import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';

export default function Layout() {
  function getYear() {
    const year = new Date().getFullYear();
    return year;
  }
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer>
        FreshCheck &copy; {getYear()}
      </footer>
    </>

  )
}