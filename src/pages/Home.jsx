import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/axios.js";

export default function Home() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await api.get("/api/posts/");
                setPosts(response.data);
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
        <section id="home">
            <div className="container">
                <h2>Recent Posts</h2>
                {posts.length === 0 ? (
                    <p>No posts available.</p>
                ) : (
                    <ul>
                        {posts.map(post => (
                            <li key={post.id}>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                                <p>By {post.author} · {new Date(post.created_at).toLocaleDateString()}</p>
                                <p>{post.content.substring(0, 150)}{post.content.length > 150 ? "..." : ""}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}
