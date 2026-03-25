import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [status, setStatus] = useState("DRAFT");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post("/api/posts/", { title, content, status });
            navigate("/posts");
        } catch (err) {
            setError("Failed to create post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <section id="create-post">
            <div className="container">
                <h2>Create New Post</h2>
                {error && <p role="alert">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="title">Title:</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="content">Content:</label>
                        <textarea
                            id="content"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={status}
                            onChange={e => setStatus(e.target.value)}
                        >
                            <option value="DRAFT">Draft</option>
                            <option value="PUBLISHED">Published</option>
                        </select>
                    </div>
                    <button type="submit" disabled={loading}>
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                </form>
            </div>
        </section>
    );
}