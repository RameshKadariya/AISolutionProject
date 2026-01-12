import React, { useState, useEffect } from 'react';

// Enhanced Admin Security Component
export const useAdminSecurity = () => {
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(null);
  const [sessionTimeout, setSessionTimeout] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  // Check for existing lockout on mount
  useEffect(() => {
    const lockoutData = localStorage.getItem('admin-lockout');
    if (lockoutData) {
      const { attempts, lockTime } = JSON.parse(lockoutData);
      const now = Date.now();

      if (now - lockTime < 15 * 60 * 1000) { // 15 minutes lockout
        setIsLocked(true);
        setLockoutTime(lockTime);
        setLoginAttempts(attempts);
      } else {
        localStorage.removeItem('admin-lockout');
      }
    }
  }, []);

  const validateCredentials = (username, password) => {
    const validCredentials = [
      { user: 'Ramesh', pass: 'rameshji' },
      { user: 'admin', pass: 'admin123' },
      { user: 'test', pass: 'test123' }
    ];

    return validCredentials.some(
      cred => cred.user === username && cred.pass === password
    );
  };

  const handleFailedLogin = () => {
    const newAttempts = loginAttempts + 1;
    setLoginAttempts(newAttempts);

    if (newAttempts >= 3) {
      const lockTime = Date.now();
      setIsLocked(true);
      setLockoutTime(lockTime);

      localStorage.setItem('admin-lockout', JSON.stringify({
        attempts: newAttempts,
        lockTime: lockTime
      }));

      return 'Account locked for 15 minutes due to multiple failed attempts.';
    }

    return `Invalid credentials. ${3 - newAttempts} attempts remaining.`;
  };

  const handleSuccessfulLogin = (username) => {
    setLoginAttempts(0);
    setLastActivity(Date.now());
    localStorage.removeItem('admin-lockout');

    localStorage.setItem('admin-session', JSON.stringify({
      user: username,
      loginTime: Date.now(),
      lastActivity: Date.now()
    }));
  };

  const clearSession = () => {
    if (sessionTimeout) {
      clearTimeout(sessionTimeout);
    }
    localStorage.removeItem('admin-session');
    setLoginAttempts(0);
    setLastActivity(Date.now());
  };

  const getRemainingLockoutTime = () => {
    if (!isLocked || !lockoutTime) return 0;
    const now = Date.now();
    const remaining = 15 * 60 * 1000 - (now - lockoutTime);
    return Math.max(0, Math.ceil(remaining / 1000 / 60));
  };

  return {
    loginAttempts,
    isLocked,
    lockoutTime,
    sessionTimeout,
    lastActivity,
    validateCredentials,
    handleFailedLogin,
    handleSuccessfulLogin,
    clearSession,
    getRemainingLockoutTime,
    setSessionTimeout
  };
};

// Security Status Component
export const SecurityStatus = ({ isLocked, loginAttempts, lockoutTime }) => {
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isLocked && lockoutTime) {
      const interval = setInterval(() => {
        const now = Date.now();
        const remaining = 15 * 60 * 1000 - (now - lockoutTime);
        setCountdown(Math.max(0, Math.ceil(remaining / 1000 / 60)));

        if (remaining <= 0) {
          clearInterval(interval);
          window.location.reload(); // Refresh to clear lockout
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isLocked, lockoutTime]);

  if (isLocked) {
    return (
      <div className="lockout-timer">
        <h4>🔒 Account Locked</h4>
        <div className="lockout-countdown">
          {countdown} minutes remaining
        </div>
        <p style={{ fontSize: '0.8rem', marginTop: '0.5rem', color: 'var(--text-muted)' }}>
          Too many failed login attempts. Please wait before trying again.
        </p>
      </div>
    );
  }

  if (loginAttempts > 0) {
    return (
      <div className={`security-status ${loginAttempts >= 2 ? 'warning' : 'info'}`}>
        <span>⚠️</span>
        <span>
          {loginAttempts} failed attempt{loginAttempts > 1 ? 's' : ''}.
          {3 - loginAttempts} remaining before lockout.
        </span>
      </div>
    );
  }

  return null;
};

// Password Input with Toggle
export const PasswordInput = ({ value, onChange, placeholder = "Password", className = "" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-input-container">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        autoComplete="current-password"
      />
      <button
        type="button"
        className="password-toggle"
        onClick={() => setShowPassword(!showPassword)}
        title={showPassword ? "Hide password" : "Show password"}
      >
        {showPassword ? '🙈' : '👁️'}
      </button>
    </div>
  );
};

// Session Timer Component
export const SessionTimer = ({ isAuthenticated, onTimeout }) => {
  const [timeLeft, setTimeLeft] = useState(4 * 60 * 60); // 4 hours - practical for admin work

  useEffect(() => {
    if (!isAuthenticated) return;

    const interval = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          onTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isAuthenticated, onTimeout]);

  if (!isAuthenticated) return null;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="session-info">
      <div>Session expires in:</div>
      <div className="session-timer">
        {minutes}:{seconds.toString().padStart(2, '0')}
      </div>
    </div>
  );
};

// Security Tips Component
export const SecurityTips = () => (
  <div className="security-tips">
    <h4>🔐 Security Information</h4>
    <ul>
      <li>Use strong, unique passwords</li>
      <li>Sessions expire after 4 hours (practical for admin work)</li>
      <li>Account locks after 3 failed attempts (15 min lockout)</li>
      <li>Session extends automatically with activity</li>
      <li>Always logout when finished for security</li>
    </ul>
  </div>
);

export default {
  useAdminSecurity,
  SecurityStatus,
  PasswordInput,
  SessionTimer,
  SecurityTips
};