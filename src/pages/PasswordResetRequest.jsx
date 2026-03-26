import { useState } from 'react';
import api from '../api/axios.js';

export default function PasswordResetRequest() {
    const [email, setEmail] = useState("");
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    
    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await api.post("/api/auth/password-reset/", { email });
            setSuccess("If an account with that email exists, a password reset link has been sent.");
        } catch (err) {
            setError("Failed to send password reset email. Please try again.");
        }
        finally {
            setLoading(false);
        }
    }

    return (
        <section id="password-reset-request">
            <h2>Request Password Reset</h2>
            {success ? (
                <p className="success">{success}</p>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email:</label>
                    <input 
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit" disabled={loading}>
                        {loading ? "Sending..." : "Send Reset Link"}
                    </button>
                    {error && <p className="error" role="alert">{error}</p>}
                </form>
            )}
        </section>
    );
}