
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      return;
    }

    navigate("/admin");
  }

  return (
    <div className="admin-login-page" dir="rtl">
      <div className="admin-login-card">
        <div className="admin-login-brand">
          <strong>WAAD</strong>
          <span>EVENTS</span>
        </div>

        <h1>لوحة الإدارة</h1>

        <p>
          سجّل الدخول لإدارة التصنيفات والصور الخاصة بموقع وعد إيفنتس.
        </p>

        <form className="admin-login-form" onSubmit={handleLogin}>
          <label>
            البريد الإلكتروني

            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
          </label>

          <label>
            كلمة المرور

            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </label>

          {error && (
            <div className="admin-login-error">
              {error}
            </div>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
          </button>
        </form>

        <div className="admin-login-back">
          <Link to="/">
            العودة إلى الموقع
          </Link>
        </div>
      </div>
    </div>
  );
}

