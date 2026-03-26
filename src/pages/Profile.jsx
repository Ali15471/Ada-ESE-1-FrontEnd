import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import api from "../api/axios.js";

async function resizeImage(file, maxWidth = 300, maxHeight = 300) {
    return new Promise((resolve) => {
        const img = document.createElement("img");
        const canvas = document.createElement("canvas");
        img.onload = () => {
            let { width, height } = img;
            if (width > height) {
                if (width > maxWidth) { height *= maxWidth / width; width = maxWidth; }
            } else {
                if (height > maxHeight) { width *= maxHeight / height; height = maxHeight; }
            }
            canvas.width = width;
            canvas.height = height;
            canvas.getContext("2d").drawImage(img, 0, 0, width, height);
            canvas.toBlob(resolve, "image/jpeg", 1);
        };
        img.src = URL.createObjectURL(file);
    });
}

export default function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const [draftPosts, setDraftPosts] = useState([]);
    const [username, setUsername] = useState("");
    const [bio, setBio] = useState("");
    const [profilePicture, setProfilePicture] = useState(null);
    const [savedUsername, setSavedUsername] = useState("");
    const [savedBio, setSavedBio] = useState("");
    const [savedProfilePicture, setSavedProfilePicture] = useState(null);
    const [successMessage, setSuccessMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { updateUser } = useAuth();
    const fileInputRef = useRef(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const [profileRes, postsRes] = await Promise.all([
                    api.get("/api/profile/"),
                    api.get("/api/posts/")
                ]);
                setUserInfo(profileRes.data);
                setUsername(profileRes.data.username);
                setBio(profileRes.data.bio);
                setProfilePicture(profileRes.data.profile_picture);
                setDraftPosts(postsRes.data.filter(p => p.status === "DRAFT"));
                setSavedUsername(profileRes.data.username);
                setSavedBio(profileRes.data.bio);
                setSavedProfilePicture(profileRes.data.profile_picture);
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
            formData.append("username", username);
            formData.append("bio", bio);
            if (profilePicture instanceof Blob) {
                formData.append("profile_picture", profilePicture);
            }
            const res = await api.patch(
                "/api/profile/", formData, {
                headers: { "Content-Type": "multipart/form-data"
                }
            });
            const newPfpUrl = res.data.profile_picture;
            setProfilePicture(newPfpUrl); // To be replaced with url
            setSavedUsername(username);
            setSavedBio(bio);
            setSavedProfilePicture(newPfpUrl);
            localStorage.setItem('profile_picture', newPfpUrl || '');
            localStorage.setItem('username', username);
            updateUser({ username, profile_picture: newPfpUrl });
            setSuccessMessage("Profile updated successfully!");
        } catch (err) {
            setError("Failed to update profile. Please try again.");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setUsername(savedUsername);
        setBio(savedBio);
        setProfilePicture(savedProfilePicture);
        if (fileInputRef.current) fileInputRef.current.value = "";
        setSuccessMessage("Changes cancelled.");
        setError(null);
    }

    if (loading) return <p>Loading profile...</p>;

    const previewUrl = profilePicture instanceof Blob
    ? URL.createObjectURL(profilePicture)
    : profilePicture || null;

    // In JSX:
    

    return (
        <section id="profile">
            <div className="container">
                <h2>My Profile</h2>
                {previewUrl
                ? <img src={previewUrl} alt="Profile picture" />
                : <div>No photo</div>  // swap for a real placeholder later
                }
                {error && <p role="alert">{error}</p>}
                {successMessage && <p role="alert">{successMessage}</p>}
                <form onSubmit={handleSave}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={e => setUsername(e.target.value)}
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
                        <label htmlFor="profilePicture">Update Profile Picture:</label>
                        <input
                            type="file"
                            id="profilePicture"
                            ref={fileInputRef}
                            accept="image/*"
                            onChange={async e => {
                            const file = e.target.files[0];
                            if (!file) return;
                            const resized = await resizeImage(file);
                            setProfilePicture(resized);
                        }}
                        />
                    </div>
                    <button type="submit" disabled={saving}>
                        {saving ? "Saving..." : "Save Changes"}
                    </button>
                    <button type="button" onClick={handleCancel} disabled={saving}>
                        Cancel
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