import React, { useState } from 'react';

let gid = 0;

export function DeviceArt({ cat, hue = 222, className = '' }) {
  const [artId] = useState(() => 'a' + (++gid));
  const g = `url(#${artId})`;
  const b = `url(#${artId}b)`;
  const sh = `url(#${artId}r)`;
  const dark = '#0b0f19';
  const edge = '#3b4868';

  const defs = (
    <defs>
      <linearGradient id={artId} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={`hsl(${hue} 92% 66%)`} />
        <stop offset="1" stopColor={`hsl(${(hue + 55) % 360} 90% 46%)`} />
      </linearGradient>
      <linearGradient id={`${artId}b`} x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#2f3b5a" />
        <stop offset="1" stopColor="#111726" />
      </linearGradient>
      <radialGradient id={`${artId}r`} cx=".25" cy=".2" r=".95">
        <stop offset="0" stopColor="#fff" stopOpacity=".4" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </radialGradient>
      {cat === 'speakers' && (
        <pattern id={`${artId}p`} width="10" height="10" patternUnits="userSpaceOnUse">
          <circle cx="5" cy="5" r="1.8" fill="#6f7fa3" />
        </pattern>
      )}
    </defs>
  );

  const shadow = <ellipse cx="200" cy="281" rx="124" ry="8" fill="#000" opacity=".38" />;

  let shape = null;
  switch (cat) {
    case 'smartphones':
      shape = (
        <>
          <g transform="rotate(-9 150 160)">
            <rect x="92" y="34" width="108" height="236" rx="25" fill={g} />
            <rect x="92" y="34" width="108" height="236" rx="25" fill={sh} />
            <rect x="104" y="46" width="52" height="52" rx="15" fill="#0b0f19" opacity=".88" />
            <circle cx="121" cy="63" r="9.5" fill="#05080f" stroke={edge} strokeWidth="2.4" />
            <circle cx="140" cy="63" r="9.5" fill="#05080f" stroke={edge} strokeWidth="2.4" />
            <circle cx="130" cy="81" r="9.5" fill="#05080f" stroke={edge} strokeWidth="2.4" />
          </g>
          <g transform="rotate(7 255 160)">
            <rect x="200" y="20" width="112" height="256" rx="27" fill={b} stroke={edge} strokeWidth="2" />
            <rect x="207" y="27" width="98" height="242" rx="21" fill={g} />
            <circle cx="256" cy="168" r="48" fill="#fff" opacity=".13" />
            <circle cx="256" cy="168" r="28" fill="#fff" opacity=".13" />
            <rect x="238" y="37" width="36" height="10" rx="5" fill={dark} />
            <rect x="226" y="232" width="60" height="5" rx="2.5" fill="#fff" opacity=".6" />
          </g>
        </>
      );
      break;
    case 'laptops':
      shape = (
        <>
          <path d="M70 200h260l22 26a8 8 0 0 1-6 13H54a8 8 0 0 1-6-13z" fill={b} stroke={edge} strokeWidth="1.5" />
          <rect x="172" y="200" width="56" height="6" rx="3" fill="#0b0f19" opacity=".7" />
          <rect x="76" y="40" width="248" height="164" rx="12" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="85" y="49" width="230" height="146" rx="5" fill={g} />
          <path d="M85 160c50-34 90 10 150-16 30-13 60-4 80 4v43H85z" fill="#fff" opacity=".14" />
          <circle cx="268" cy="86" r="26" fill="#fff" opacity=".16" />
          <circle cx="200" cy="44" r="2" fill="#000" />
        </>
      );
      break;
    case 'tablets':
      shape = (
        <>
          <rect x="64" y="46" width="262" height="206" rx="22" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="75" y="57" width="240" height="184" rx="12" fill={g} />
          <rect x="75" y="57" width="240" height="184" rx="12" fill={sh} />
          <path d="M96 200c34-52 70-8 104-38s60-46 100-22v80H96z" fill="#fff" opacity=".15" />
          <rect x="336" y="64" width="9" height="160" rx="4.5" fill="#dfe6f5" />
          <rect x="336" y="64" width="9" height="30" rx="4.5" fill={g} />
        </>
      );
      break;
    case 'audio':
      shape = (
        <>
          <path d="M104 176C98 76 150 40 200 40s102 36 96 136" fill="none" stroke="#2a3552" strokeWidth="16" strokeLinecap="round" />
          <path d="M118 150C126 92 160 62 200 62" fill="none" stroke="#fff" strokeOpacity=".12" strokeWidth="5" strokeLinecap="round" />
          <rect x="76" y="140" width="56" height="106" rx="26" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="84" y="150" width="40" height="86" rx="20" fill={g} />
          <circle cx="104" cy="193" r="11" fill={dark} opacity=".5" />
          <rect x="268" y="140" width="56" height="106" rx="26" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="276" y="150" width="40" height="86" rx="20" fill={g} />
          <circle cx="296" cy="193" r="11" fill={dark} opacity=".5" />
        </>
      );
      break;
    case 'wearables':
      shape = (
        <>
          <rect x="164" y="6" width="72" height="288" rx="20" fill={b} stroke={edge} strokeWidth="1.5" />
          <path d="M178 20v52M178 232v46M222 20v52M222 232v46" stroke="#000" strokeOpacity=".25" strokeWidth="2" />
          <rect x="262" y="124" width="10" height="34" rx="4" fill="#4b5878" />
          <rect x="132" y="82" width="136" height="136" rx="40" fill={b} stroke={edge} strokeWidth="2.5" />
          <rect x="142" y="92" width="116" height="116" rx="32" fill={dark} />
          <circle cx="200" cy="150" r="42" fill="none" stroke={g} strokeWidth="9" />
          <path d="M200 150V122M200 150l20 12" stroke="#fff" strokeWidth="5" strokeLinecap="round" />
          <circle cx="200" cy="150" r="5" fill="#fff" />
        </>
      );
      break;
    case 'gaming':
      shape = (
        <>
          <path d="M118 92h164c42 0 62 40 76 96 6 28-6 52-30 52-18 0-28-12-38-28-8-12-14-18-30-18h-98c-16 0-22 6-30 18-10 16-20 28-38 28-24 0-36-24-30-52 14-56 34-96 76-96z" fill={b} stroke={edge} strokeWidth="2.4" />
          <path d="M118 92h164c42 0 62 40 76 96" fill="none" stroke={g} strokeWidth="5" strokeLinecap="round" />
          <path d="M124 128h12v12h12v12h-12v12h-12v-12h-12v-12h12z" fill="#dfe6f5" />
          <circle cx="262" cy="124" r="9" fill={g} />
          <circle cx="286" cy="144" r="9" fill="#dfe6f5" />
          <circle cx="262" cy="164" r="9" fill="#dfe6f5" />
          <circle cx="238" cy="144" r="9" fill="#dfe6f5" />
          <circle cx="160" cy="190" r="22" fill={dark} stroke={edge} strokeWidth="2" />
          <circle cx="160" cy="190" r="12" fill="#1b2336" />
          <circle cx="240" cy="190" r="22" fill={dark} stroke={edge} strokeWidth="2" />
          <circle cx="240" cy="190" r="12" fill="#1b2336" />
          <rect x="186" y="128" width="28" height="9" rx="4.5" fill="#26314b" />
        </>
      );
      break;
    case 'cameras':
      shape = (
        <>
          <rect x="150" y="62" width="86" height="34" rx="9" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="258" y="72" width="40" height="22" rx="6" fill={g} />
          <rect x="68" y="88" width="264" height="150" rx="20" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="68" y="146" width="264" height="92" rx="0 0 20 20" fill="#0f1524" opacity=".7" />
          <circle cx="200" cy="164" r="60" fill="#0a0e18" stroke={edge} strokeWidth="3" />
          <circle cx="200" cy="164" r="46" fill="#121a2e" stroke="#2d3a5a" strokeWidth="3" />
          <circle cx="200" cy="164" r="30" fill={g} opacity=".9" />
          <circle cx="200" cy="164" r="14" fill="#05080f" />
          <circle cx="186" cy="150" r="7" fill="#fff" opacity=".55" />
          <circle cx="106" cy="116" r="7" fill="#1a2238" stroke={edge} strokeWidth="2" />
          <rect x="296" y="106" width="22" height="9" rx="4.5" fill={g} />
        </>
      );
      break;
    case 'monitors':
      shape = (
        <>
          <rect x="190" y="206" width="20" height="46" fill="#222c45" />
          <rect x="132" y="250" width="136" height="12" rx="6" fill={b} stroke={edge} strokeWidth="1.5" />
          <rect x="46" y="28" width="308" height="184" rx="12" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="55" y="37" width="290" height="166" rx="5" fill={g} />
          <rect x="55" y="37" width="290" height="166" rx="5" fill={sh} />
          <path d="M55 170c60-60 100 0 170-36 50-26 80-10 120 6v63H55z" fill="#fff" opacity=".14" />
          <rect x="82" y="58" width="82" height="9" rx="4.5" fill="#fff" opacity=".5" />
          <rect x="82" y="76" width="50" height="9" rx="4.5" fill="#fff" opacity=".3" />
        </>
      );
      break;
    case 'speakers':
      shape = (
        <>
          <rect x="136" y="38" width="128" height="232" rx="62" fill={b} stroke={edge} strokeWidth="2" />
          <rect x="144" y="86" width="112" height="136" fill={`url(#${artId}p)`} opacity=".85" />
          <ellipse cx="200" cy="58" rx="46" ry="12" fill={dark} stroke={edge} strokeWidth="2" />
          <ellipse cx="200" cy="58" rx="30" ry="6" fill={g} />
          <rect x="136" y="236" width="128" height="8" fill={g} opacity=".9" />
          <circle cx="200" cy="154" r="24" fill={g} opacity=".25" />
        </>
      );
      break;
    default:
      shape = null;
  }

  return (
    <svg viewBox="0 0 400 300" aria-hidden="true" focusable="false" className={className}>
      {defs}
      {shadow}
      {shape}
    </svg>
  );
}

export function ProductImage({ product, className = '', alt = '', fallbackHue }) {
  const [hasError, setHasError] = useState(false);
  const hue = fallbackHue ?? product?.colors?.[0]?.h ?? 222;

  return (
    <span className="media-frame">
      {!hasError ? (
        <img
          className={`real-img ${className}`}
          src={product.img}
          alt={alt || product.name}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="art-fallback" style={{ display: 'block', width: '100%', height: '100%' }}>
          <DeviceArt cat={product.cat} hue={hue} />
        </span>
      )}
    </span>
  );
}

export function CategoryImage({ category }) {
  const [hasError, setHasError] = useState(false);

  return (
    <span className="cat-frame">
      {!hasError ? (
        <img
          className="real-cat-img"
          src={category.img}
          alt={category.label}
          loading="lazy"
          onError={() => setHasError(true)}
        />
      ) : (
        <span className="art-fallback" style={{ display: 'block', width: '100%', height: '100%' }}>
          <DeviceArt cat={category.id} hue={222} />
        </span>
      )}
    </span>
  );
}
