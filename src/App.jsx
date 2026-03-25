import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Navbar from './components/Navbar.jsx';
import Profile from './pages/Profile.jsx';
import PasswordResetRequest from './pages/PasswordResetRequest.jsx';
import PasswordResetConfirm from './pages/PasswordReset.jsx';
import PostDetail from './pages/PostDetail.jsx';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';
import MyPosts from './pages/MyPosts.jsx';

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password-reset-request" element={<PasswordResetRequest />} />
        <Route path="/password-reset/:uidb64/:token" element={<PasswordResetConfirm />} />
        <Route path="/posts/:id" element={<PostDetail />} />
        <Route path="/create-post" element={
          <ProtectedRoute>
            <CreatePost />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
          
        } />
        <Route path="/posts/:id/edit" element={
          <ProtectedRoute>
            <EditPost />
          </ProtectedRoute>
        } />
        <Route path="/my-posts" element={
          <ProtectedRoute>
            <MyPosts />
          </ProtectedRoute>
        } />
      </Routes>

      <footer>
        <section id="socials">
          <div className="container">
            <h2>Connect with us on social media!</h2>
            <p>Follow us for the latest updates and news.</p>
            <ul className="social-links">
              <li><a href="https://github.com/Ali15471" target="_blank">GitHub</a></li>
              <li><a href="https://instagram.com/ali.raza20405" target="_blank">Instagram</a></li>
            </ul>
          </div>
        </section>
      </footer> 
    </>
  );
}