import { useState } from "react";

interface LoginProps {
  onComplete: (email: string) => void;
}

function Login({ onComplete }: LoginProps) {
  const [email, setEmail] = useState("");
  const [isAdult, setIsAdult] = useState(false);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const canContinue = emailValid && isAdult;

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

        <input
          className="hero-input"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Your email"
          autoComplete="email"
        />

        <label className="login-check">
          <input
            type="checkbox"
            checked={isAdult}
            onChange={(event) => setIsAdult(event.target.checked)}
          />
          <span>I confirm I am over 18 and setting this up for my family.</span>
        </label>

        <button
          type="button"
          className="nav-button primary"
          onClick={() => onComplete(email.trim())}
          disabled={!canContinue}
        >
          Get started
        </button>

        <p className="login-note">
          Profiles and stories are saved on this device. Cloud accounts and syncing are coming
          soon.
        </p>
      </div>
    </div>
  );
}

export default Login;
