import { Link, useNavigate , useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout () {
    logout();
    navigate("/login");
  }

  function handleNavClick(path) {
    if (location.pathname === path) {
      navigate(0);
    }
  }

  return(
    <nav>
      <Link to="/" onClick={() => handleNavClick("/")}>Home</Link>
      {user ? (
        <>
        <Link to="/create-post" onClick={() => handleNavClick("/create-post")}>Create Post</Link>
        <Link to="/my-posts" onClick={() => handleNavClick("/my-posts")}>My Posts</Link>
        <Link to="/profile" onClick={() => handleNavClick("/profile")}>Profile</Link>
        <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
        <Link to="/login" onClick={() => handleNavClick("/login")}>Login</Link>
        <Link to="/register" onClick={() => handleNavClick("/register")}>Register</Link>
        </>
      )}
    </nav>
  );
}
