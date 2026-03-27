import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function CreatePost() {
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(postStatus) {
        setLoading(true);
        try {
            await api.post("/api/posts/", { title, content, status: postStatus });
            navigate("/");
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
                <form onSubmit={e => e.preventDefault()}>
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
                    <button type="button" onClick={() => handleSubmit("PUBLISHED")} disabled={loading}>
                        {loading ? "Creating..." : "Create Post"}
                    </button>
                    <button type="button" onClick={() => handleSubmit("DRAFT")} disabled={loading}>
                        {loading ? "Saving..." : "Save as Draft"}
                    </button>
                    <button type="button" onClick={() => navigate(-1)}>Cancel</button>
                </form>
            </div>
        </section>
    );
}