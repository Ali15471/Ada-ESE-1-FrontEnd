import { Link, useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

export default function PostDetail() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPost() {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    api.get(`/api/posts/${id}/`),
                    api.get(`/api/posts/${id}/comments/`)
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                setError("Failed to load post. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchPost();
    }, [id]);

    async function handleCommentSubmit(e) {
        e.preventDefault();
        if (!newComment.trim()) return;
        try {
            const response = await api.post(`/api/posts/${id}/comments/`, { content: newComment });
            setComments([...comments, response.data]);
            setNewComment("");
        } catch (err) {
            setError("Failed to submit comment. Please try again.");
        }
    }

    async function handlePostDelete() {
        if (!window.confirm("Are you sure you want to delete this post?")) return;
        try {
            await api.delete(`/api/posts/${id}/`);
            navigate("/");
        } catch (err) {
            setError("Failed to delete post. Please try again.");
        }
    }

    async function handleCommentDelete(commentId) {
        if (!window.confirm("Are you sure you want to delete this comment?")) return;
        try {
            await api.delete(`/api/posts/${id}/comments/${commentId}/`);
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (err) {
            setError("Failed to delete comment. Please try again.");
        }
    }

    if (loading) return <p>Loading post...</p>;
    if (error) return <p role="alert">{error}</p>;
    if (!post) return <p>Post not found.</p>;

    return (
    <section id="post-detail">
        <div className="container">
            <button type="button" onClick={() => navigate(-1)}>Go Back</button>
            <h2>{post.title}</h2>
            <p>By {post.author_username} on {new Date(post.updated_at).toLocaleDateString()}</p>
            <p>{post.content}</p>
            {user?.username === post.author_username && (
                <>
                    <button onClick={handlePostDelete} className="delete-btn">Delete Post</button>
                    <Link to={`/posts/${id}/edit`}>Edit Post</Link>
                </>
            )}

            <hr />
            <h3>Comments ({comments.length})</h3>
            {user ? (
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        required
                    />
                    <button type="submit">Submit Comment</button>
                </form>
            ) : (
                <p><Link to="/login">Log in</Link> to post a comment.</p>
            )}
            <ul>
                {comments.length === 0 && <p>No comments yet. Be the first!</p>}
                {comments.map(comment => (
                    <li key={comment.id}>
                        <p>{comment.content}</p>
                        <p>By {comment.author_username} on {new Date(comment.created_at).toLocaleDateString()}</p>
                        {user?.username === comment.author_username && (
                            <button onClick={() => handleCommentDelete(comment.id)} className="delete-btn">Delete Comment</button>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </section>
    );
}