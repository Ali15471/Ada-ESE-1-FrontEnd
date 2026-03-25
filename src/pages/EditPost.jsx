import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios.js";

export default function EditPost() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const response = await api.get(`/api/posts/${id}/`);
                setTitle(response.data.title);
                setContent(response.data.content);
            } catch (err) {
                setError("Failed to load post. Please try again.");
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    async function handleSubmit(postStatus) {
        setLoading(true);
        try {
            await api.patch(`/api/posts/${id}/`, { title, content, status: postStatus });
            navigate(`/posts/${id}`);
        } catch (err) {
            setError("Failed to update post. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p>Loading post...</p>;

    return (
        <section id="edit-post">
            <div className="container">
                <h2>Edit Post</h2>
                {error && <p role="alert">{error}</p>}
                <form>
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
                        {loading ? "Publishing..." : "Publish Changes"}
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
