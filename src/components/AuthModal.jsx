import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';

export function AuthModal() {
  const { authModalTab, setAuthModalTab, login, loginDemo, toast } = useStore();

  const [activeTab, setActiveTab] = useState('login'); // 'login' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Login inputs
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPass, setLoginPass] = useState('');

  // Signup inputs
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPass, setRegPass] = useState('');
  const [regTerms, setRegTerms] = useState(true);

  // Sync state if modal opens with specific tab
  React.useEffect(() => {
    if (authModalTab) {
      setActiveTab(authModalTab);
      setErrorMessage('');
    }
  }, [authModalTab]);

  if (!authModalTab) return null;

  const handleClose = () => {
    setAuthModalTab(null);
    setErrorMessage('');
  };

  const calculateStrength = (val) => {
    let score = 0;
    if (val.length >= 6) score++;
    if (val.length >= 10) score++;
    if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
    if (/[^A-Za-z0-9]/.test(val)) score++;
    return score;
  };

  const pwScore = calculateStrength(regPass);
  const pwStrengthClass = (() => {
    if (!regPass) return '';
    if (pwScore <= 1) return 'weak';
    if (pwScore === 2) return 'medium';
    if (pwScore === 3) return 'good';
    return 'strong';
  })();

  const pwStrengthLabel = (() => {
    if (!regPass) return 'Password strength';
    if (pwScore <= 1) return 'Weak password';
    if (pwScore === 2) return 'Fair password';
    if (pwScore === 3) return 'Good password';
    return 'Strong password';
  })();

  const handleGoogleLogin = () => {
    login({
      name: 'Shiva Sharma',
      email: 'shiva.sharma@gmail.com',
      phone: '9876543210',
      role: 'Verified Member'
    });
  };

  const handleForgotPass = () => {
    const email = loginEmail.trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      toast(`Password reset instructions sent to ${email}`);
    } else {
      toast('Enter your email address above to receive reset instructions');
    }
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (loginPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }

    const username = email
      .split('@')[0]
      .replace(/[._-]/g, ' ')
      .replace(/\b\w/g, (l) => l.toUpperCase());

    login({
      name: username,
      email: email,
      phone: '9876543210',
      role: 'Verified Member'
    });
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    const name = regName.trim();
    const email = regEmail.trim();
    const phone = regPhone.trim();

    if (name.length < 2) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }
    if (regPass.length < 6) {
      setErrorMessage('Password must be at least 6 characters.');
      return;
    }
    if (!regTerms) {
      setErrorMessage("You must agree to TechNova's Terms & Privacy Policy.");
      return;
    }

    login({
      name,
      email,
      phone: phone || '9876543210',
      role: 'Verified Member'
    });
  };

  const isLogin = activeTab === 'login';

  return (
    <div
      className="modal show"
      id="authModal"
      role="dialog"
      aria-modal="true"
      aria-labelledby="authTitle"
      onClick={(e) => {
        if (e.target.id === 'authModal') handleClose();
      }}
    >
      <div className="modal-card auth-card">
        <button
          className="icon-btn modal-close"
          type="button"
          aria-label="Close dialog"
          onClick={handleClose}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        {/* Telemetry Header */}
        <div className="auth-top-readout">
          <span className="auth-tag">
            <span className="auth-tag-dot"></span>TECHNOVA_AUTH // SHA-256
          </span>
          <span>SECURE GATEWAY</span>
        </div>

        <div className="auth-header">
          <h2 id="authTitle">{isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
          <p>
            {isLogin
              ? 'Access your orders, wishlist, and personalized tech feeds.'
              : 'Join TechNova to unlock member pricing and priority shipping.'}
          </p>
        </div>

        {/* Auth Mode Tabs */}
        <div className="auth-tabs" role="tablist">
          <button
            className={`auth-tab ${isLogin ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={isLogin}
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
            }}
          >
            Log In
          </button>
          <button
            className={`auth-tab ${!isLogin ? 'active' : ''}`}
            type="button"
            role="tab"
            aria-selected={!isLogin}
            onClick={() => {
              setActiveTab('signup');
              setErrorMessage('');
            }}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Instant Demo Login */}
        <button className="auth-demo-btn" type="button" onClick={loginDemo}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
          </svg>
          <span>Instant Demo Login (Shiva)</span>
        </button>

        {/* Google Social Login */}
        <button className="auth-google-btn" type="button" onClick={handleGoogleLogin}>
          <svg viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>Continue with Google</span>
        </button>

        <div className="auth-divider">
          <span>or with email</span>
        </div>

        {/* Error Notification */}
        {errorMessage && (
          <div className="auth-error-msg show">
            <svg viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        {isLogin ? (
          /* Log In Form */
          <form className="auth-form" onSubmit={handleLoginSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="authEmail">Email address</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className="auth-input"
                  id="authEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="authPass">Password</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="auth-input"
                  id="authPass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={loginPass}
                  onChange={(e) => setLoginPass(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  className="toggle-pw-btn"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-checkbox-label">
                <input type="checkbox" defaultChecked />
                <span>Remember me</span>
              </label>
              <button
                className="auth-forgot-link"
                type="button"
                onClick={handleForgotPass}
              >
                Forgot password?
              </button>
            </div>

            <button className="auth-submit-btn" type="submit">
              Sign In to TechNova
            </button>

            <div className="auth-foot-note">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('signup');
                  setErrorMessage('');
                }}
              >
                Create one free
              </button>
            </div>
          </form>
        ) : (
          /* Sign Up Form */
          <form className="auth-form" onSubmit={handleSignupSubmit} noValidate>
            <div className="auth-field">
              <label htmlFor="regName">Full name</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
                <input
                  className="auth-input"
                  id="regName"
                  type="text"
                  placeholder="e.g. Shiva Sharma"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="regEmail">Email address</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
                <input
                  className="auth-input"
                  id="regEmail"
                  type="email"
                  placeholder="you@example.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="regPhone">Mobile number (optional)</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                </svg>
                <input
                  className="auth-input"
                  id="regPhone"
                  type="tel"
                  placeholder="10-digit mobile"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                  autoComplete="tel"
                />
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="regPass">Create password</label>
              <div className="auth-input-wrap">
                <svg className="field-icon" viewBox="0 0 24 24">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
                <input
                  className="auth-input"
                  id="regPass"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="At least 6 characters"
                  value={regPass}
                  onChange={(e) => setRegPass(e.target.value)}
                  autoComplete="new-password"
                  required
                />
                <button
                  className="toggle-pw-btn"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <svg viewBox="0 0 24 24">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Password strength indicator */}
              <div className="pw-strength">
                <div className="pw-strength-bars">
                  <span className={`pw-strength-bar ${pwScore >= 1 ? pwStrengthClass : ''}`}></span>
                  <span className={`pw-strength-bar ${pwScore >= 2 ? pwStrengthClass : ''}`}></span>
                  <span className={`pw-strength-bar ${pwScore >= 3 ? pwStrengthClass : ''}`}></span>
                  <span className={`pw-strength-bar ${pwScore >= 4 ? pwStrengthClass : ''}`}></span>
                </div>
                <span className="pw-strength-label">{pwStrengthLabel}</span>
              </div>
            </div>

            <div className="auth-row">
              <label className="auth-checkbox-label">
                <input
                  type="checkbox"
                  checked={regTerms}
                  onChange={(e) => setRegTerms(e.target.checked)}
                  required
                />
                <span>I agree to TechNova's Terms & Privacy Policy</span>
              </label>
            </div>

            <button className="auth-submit-btn" type="submit">
              Create TechNova Account
            </button>

            <div className="auth-foot-note">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setActiveTab('login');
                  setErrorMessage('');
                }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
