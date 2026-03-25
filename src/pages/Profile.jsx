import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios.js";

export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [draftPosts, setDraftPosts] = useState([]);
    const [displayName, setDisplayName] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const [profileRes, postsRes] = await Promise.all([
                    api.get("/api/profile/"),
                    api.get("/api/posts/")
                ]);
                setUserInfo(profileRes.data);
                setDisplayName(profileRes.data.display_name);
                setBio(profileRes.data.bio);
                setProfilePicture(profileRes.data.profile_picture);
                setDraftPosts(postsRes.data.filter(p => p.status === "DRAFT"));
            } catch (err) {
                setError("Failed to load profile. Please try again later.");
            } finally {
                setLoading(false);
            }
        }
        fetchProfile();
    }, []);

    async function handleSave(e) {
        e.preventDefault();
        setSaving(true);
        try {
            const formData = new FormData();
            formData.append("display_name", displayName);
            formData.append("bio", bio);
            if (profilePicture instanceof File) {
                formData.append("profile_picture", profilePicture);
            }
            await api.patch("/api/profile/", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <p>Loading profile...</p>;

    return (
        <section id="profile">
            <div className="container">
                <h2>My Profile</h2>
                {error && <p role="alert">{error}</p>}
                {successMessage && <p role="alert">{successMessage}</p>}
                <form onSubmit={handleSave}>
                    <div>
                        <label htmlFor="displayName">Display Name:</label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={e => setDisplayName(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={e => setBio(e.target.value)}
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="profilePicture">Profile Picture:</label>
                        <input
                            type="file"
                            id="profilePicture"
                            accept="image/*"
                            onChange={e => setProfilePicture(e.target.files[0])}
                        />
                    </div>
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                </form>

                <hr />
                <h3>My Draft Posts</h3>
                {draftPosts.length === 0 ? (
                    <p>You have no draft posts.</p>
                ) : (
                    <ul>
                        {draftPosts.map(post => (
                            <li key={post.id}>
                                <Link to={`/posts/${post.id}`}>{post.title}</Link>
                                <p>Created on {new Date(post.created_at).toLocaleDateString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </section>
    );
}