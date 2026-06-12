import { useState } from "react";
import { supabase } from "../supabase";

interface LoginProps {
  onComplete: (email: string) => void;
}

function Login({ onComplete }: LoginProps) {
  const [email, setEmail] = useState("");
  const [isAdult, setIsAdult] = useState(false);
  const [oauthError, setOauthError] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue = emailValid && isAdult;

  const signInWithGoogle = async () => {
    if (!supabase) return;
    setOauthError(false);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) setOauthError(true);
  };

  return (
    <div className="login">
      <div className="login-card">
        <span className="login-emoji" aria-hidden="true">
          {"\u{1F4DA}"}
        </span>
        <h1>Little Hero Stories</h1>
        <p className="login-sub">
          Personalized illustrated stories where your kids are the heroes. A grown-up sets things
          up first.
        </p>

        <label className="login-check">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(event) => setIsAdult(event.target.checked)}
          />
          <span>I confirm I am over 18 and setting this up for my family.</span>
        </label>

        {supabase && (
          <>
            <button
              type="button"
              className="nav-button google-button"
              onClick={signInWithGoogle}
              disabled={!isAdult}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.9-.1-1.5-.3-2.2H12v4.1h6.5c-.1 1.1-.8 2.7-2.4 3.8l3.7 2.9c2.2-2.1 3.7-5.1 3.7-8.6z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 5.9-1.1 7.9-2.9l-3.7-2.9c-1 .7-2.4 1.2-4.2 1.2-3.2 0-5.9-2.1-6.9-5.1l-3.9 3C3.2 21.3 7.3 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.1 14.3c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3l-3.9-3C.4 8.3 0 10.1 0 12s.4 3.7 1.2 5.3l3.9-3z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.7c1.8 0 3 .8 3.7 1.4l3.3-3.2C17.9 1.1 15.2 0 12 0 7.3 0 3.2 2.7 1.2 6.7l3.9 3c1-3 3.7-5 6.9-5z"
                />
              </svg>
              Continue with Google
            </button>
            {oauthError && (
              <p className="login-note">Google sign-in had a hiccup. Please try again.</p>
            )}
            <p className="login-divider">or</p>
          </>
        )}

        <input
          className="hero-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          autoComplete="email"
        />

        <button
          type="button"
          className="nav-button primary"
          onClick={() => onComplete(email.trim())}
          disabled={!canContinue}
        >
          Continue with email
        </button>

        <p className="login-note">
          {supabase
            ? "Google accounts are saved to the cloud. Email-only sessions stay on this device."
            : "Profiles and stories are saved on this device. Cloud accounts are coming soon."}
        </p>
      </div>
    </div>
  );
}

export default Login;
