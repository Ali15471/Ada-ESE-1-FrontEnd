import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios.js";

export default function PasswordResetConfirm() {
    const { uidb64, token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await api.post(`/api/auth/password-reset/confirm/${uidb64}/${token}/`, {
                new_password: newPassword
            });
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.detail || "Failed to reset password. The link may be invalid or expired.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section id="password-reset-confirm">
            <div className="container">
                <h2>Reset Your Password</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="newPassword">New Password:</label>
                    <input 
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        autoComplete="new-password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Resetting..." : "Reset Password"}
                    </button>
                    {error && <p className="error" role="alert">{error}</p>}
                </form>
            </div>
        </section>
    );
}