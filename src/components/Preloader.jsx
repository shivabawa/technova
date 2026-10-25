import React, { useState, useEffect } from 'react';

const PHASES = [
  { p: 0.18, text: 'INITIALIZING HARDWARE ENCLAVE...', clock: '3.60 GHz' },
  { p: 0.40, text: 'CALIBRATING QUANTUM DISPLAY BUS...', clock: '4.20 GHz' },
  { p: 0.65, text: 'MOUNTING TECHNOVA INVENTORY (27/27)...', clock: '4.85 GHz' },
  { p: 0.88, text: 'ENCRYPTING UPI & INR PAYMENT MESH...', clock: '5.10 GHz' },
  { p: 1.00, text: 'TECHNOVA READY // ENTERING SYSTEM', clock: '5.20 GHz' }
];

const DURATION = 2800; // 2.8 seconds boot

export function Preloader({ onComplete }) {
  const [percent, setPercent] = useState(0);
  const [statusText, setStatusText] = useState(PHASES[0].text);
  const [clockSpeed, setClockSpeed] = useState(PHASES[0].clock);
  const [elapsedTime, setElapsedTime] = useState('0.00s');
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    document.body.classList.add('preloading');
    const startTime = performance.now();
    let frameId;

    const tick = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(1, elapsed / DURATION);
      const pct = Math.floor(progress * 100);

      setPercent(pct);
      setElapsedTime(`${(Math.min(DURATION, elapsed) / 1000).toFixed(2)}s`);

      const phase = PHASES.find(ph => progress <= ph.p) || PHASES[PHASES.length - 1];
      setStatusText(phase.text);
      setClockSpeed(phase.clock);

      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      } else {
        setStatusText('TECHNOVA ONLINE // WELCOME');
        setPercent(100);
        setTimeout(() => {
          setIsFading(true);
          document.body.classList.remove('preloading');
          setTimeout(() => {
            onComplete?.();
          }, 650);
        }, 180);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frameId);
      document.body.classList.remove('preloading');
    };
  }, [onComplete]);

  const handleSkip = () => {
    setIsFading(true);
    document.body.classList.remove('preloading');
    setTimeout(() => {
      onComplete?.();
    }, 300);
  };

  return (
    <div
      id="preloader"
      className={`preloader ${isFading ? 'fade-out' : ''}`}
      role="progressbar"
      aria-valuenow={percent}
      aria-valuemin="0"
      aria-valuemax="100"
      aria-label="Loading TechNova"
    >
      <div className="loader-backdrop" aria-hidden="true"></div>
      <div className="loader-grid-lines" aria-hidden="true"></div>
      <div className="loader-glow-orb" aria-hidden="true"></div>

      <div className="loader-core">
        {/* Top System Readout */}
        <div className="loader-top-bar">
          <span className="hud-tag">
            <span className="hud-dot"></span>TECHNOVA_OS // KERNEL v2.6
          </span>
          <span className="hud-tag hud-right">REACT 19 SUITE · 256-BIT BUS</span>
        </div>

        {/* Center Brand Emblem */}
        <div className="loader-brand-box">
          <div className="loader-emblem">
            <svg viewBox="0 0 32 32" aria-hidden="true">
              <rect width="32" height="32" rx="9" fill="url(#preloadG)" />
              <path
                d="M8 10h16M16 10v14"
                fill="none"
                stroke="#070A12"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <defs>
                <linearGradient id="preloadG" x1="0" y1="0" x2="1" y2="1">
                  <stop stopColor="var(--c1, #2D68FF)" />
                  <stop offset="1" stopColor="var(--c2, #F59E0B)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="emblem-ping"></div>
          </div>
          <div className="loader-brand-name">
            Tech<span>Nova</span>
          </div>
          <div className="loader-brand-sub">NEXT-GEN ELECTRONICS PLATFORM</div>
        </div>

        {/* Digital HUD Console */}
        <div className="loader-console">
          <div className="console-corner tl"></div>
          <div className="console-corner tr"></div>
          <div className="console-corner bl"></div>
          <div className="console-corner br"></div>

          <div className="console-header">
            <div className="status-indicator">
              <span className="pulse-indicator"></span>
              <span className="status-text">{statusText}</span>
            </div>
            <div className="percent-counter">
              {percent < 10 ? '0' : ''}
              {percent}%
            </div>
          </div>

          {/* Digital Progress Track */}
          <div className="progress-frame">
            <div className="progress-fill" style={{ width: `${percent}%` }}></div>
            <div className="progress-laser"></div>
            <div className="progress-ticks" aria-hidden="true">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>

          {/* Telemetry Readouts */}
          <div className="console-telemetry">
            <div className="tel-item">
              <span className="tel-label">CORE CLOCK</span>
              <span className="tel-val">{clockSpeed}</span>
            </div>
            <div className="tel-item">
              <span className="tel-label">DEVICE MESH</span>
              <span className="tel-val">ONLINE (27/27)</span>
            </div>
            <div className="tel-item">
              <span className="tel-label">PAYMENT BUS</span>
              <span className="tel-val">UPI / INR READY</span>
            </div>
            <div className="tel-item">
              <span className="tel-label">SECURITY</span>
              <span className="tel-val ok">VERIFIED</span>
            </div>
          </div>
        </div>

        {/* Bottom Audio/Security Notice + Skip Button */}
        <div className="loader-footer-note" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="scan-chip">DIAGNOSTIC ACTIVE</span>
          <span className="scan-time">{elapsedTime} / 2.80s</span>
          <button
            onClick={handleSkip}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: 'var(--text2)',
              fontSize: '11px',
              padding: '3px 9px',
              borderRadius: '6px',
              cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            SKIP [ESC]
          </button>
        </div>
      </div>
    </div>
  );
}
