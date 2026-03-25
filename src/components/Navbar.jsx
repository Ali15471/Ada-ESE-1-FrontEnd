import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Navbar() {
  const { authUser, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout () {
    logout();
    navigate("/login");
  }

  return(
    <nav>
      <Link to="/">Home</Link>
      {authUser ? (
        <>
        <Link to="/profile">Profile</Link>
        <Link to="/create-post">Create Post</Link>
        <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        </>
      )}
    </nav>
  );
}
