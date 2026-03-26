import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function MyPosts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get("/api/posts/");
                console.log("user.username:", user?.username);
                console.log("post author_usernames:", response.data.map(p => p.author_username));

                setPosts(response.data.filter(p => p.author_username === user?.username));
            } catch (err) {
                setError("Failed to load posts. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchPosts();
    }, []);

    if (loading) return <p>Loading posts...</p>;
    if (error) return <p role="alert">{error}</p>;
    
    return (
        <section id="my posts">
            <div className="container">
                <h2>My Posts</h2>
                {posts.length === 0 ? (
                    <p>You have no posts yet.</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li key={post.id}>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                                <p>By {post.author_username} · {new Date(post.created_at).toLocaleDateString()}</p>
                                <p>{post.content.substring(0, 150)}{post.content.length > 150 ? "..." : ""}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
