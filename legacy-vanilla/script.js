/* ============================================================
   TechNova — storefront logic (vanilla JS)
   Sections: data · art · helpers · state · render · layers · cart · checkout · init
   ============================================================ */
(() => {
'use strict';

/* ---------------- Data ---------------- */
const FREE_SHIP = 4999, SHIP_FEE = 199, MAX_QTY = 5;
const PROMOS = { TECHNOVA10: 0.10, NEXORA10: 0.10, STUDENT5: 0.05 };

const CATS = [
  { id: 'smartphones', label: 'Smartphones', tab: 'Phone',      img: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=400&q=80' },
  { id: 'laptops',     label: 'Laptops',     tab: 'Laptop',     img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80' },
  { id: 'tablets',     label: 'Tablets',     tab: 'Tablet',     img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=400&q=80' },
  { id: 'audio',       label: 'Headphones',  tab: 'Headphones', img: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=400&q=80' },
  { id: 'wearables',   label: 'Wearables',   tab: 'Watch',      img: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=400&q=80' },
  { id: 'gaming',      label: 'Gaming',      tab: 'Gaming',     img: 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=400&q=80' },
  { id: 'cameras',     label: 'Cameras',     tab: 'Camera',     img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=400&q=80' },
  { id: 'monitors',    label: 'Monitors',    tab: 'Monitor',    img: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=400&q=80' },
  { id: 'speakers',    label: 'Speakers',    tab: 'Speaker',    img: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=400&q=80' }
];
const PALETTE = [
  { n: 'Sapphire', h: 222 }, { n: 'Champagne Gold', h: 38 }, { n: 'Platinum', h: 212 },
  { n: 'Obsidian', h: 240 }, { n: 'Imperial Amber', h: 32 }
];

const P = (id, name, brand, cat, price, old, rating, reviews, badge, hue, specs, desc, stock, img) => ({
  id, name, brand, cat, price, old, rating, reviews, badge, hue, desc, stock, img,
  specs: specs.split('|').map(s => s.split(/:(.+)/).slice(0, 2)),
  colors: [0, 1, 2].map(i => PALETTE[(PALETTE.findIndex(p => p.h === hue) + i * 2 + 5) % 5])
});

const PRODUCTS = [
  P(1, 'Lava Agni 3 Pro 5G', 'Lava', 'smartphones', 49999, 54999, 4.8, 2140, 'New', 222, 'Display:6.78" 1.5K 3D Curved AMOLED, 120 Hz|Chip:Dimensity 7300X Octa-Core|Camera:50 MP Sony IMX766 OIS triple, 3x telephoto|Battery:5,000 mAh, 66 W Flash Charge', 'India\'s premier flagship smartphone with secondary rear AMOLED display, pristine clean bloatware-free Android, and lightning 66W charging.', 14, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?auto=format&fit=crop&w=800&q=80'),
  P(2, 'Micromax In Note 3 5G', 'Micromax', 'smartphones', 17999, 21999, 4.5, 3180, 'Best seller', 196, 'Display:6.67" FHD+ AMOLED, 120 Hz|Chip:MediaTek Dimensity 7050|Camera:64 MP AI Quad camera|Battery:5,000 mAh, 33 W Dart Charge', 'Engineered for India: vibrant 120Hz display, all-day 5,000 mAh battery life, and powerful gaming performance.', 40, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80'),
  P(3, 'Lava Yuva Fold 5G', 'Lava', 'smartphones', 89999, 104999, 4.6, 640, 'Foldable', 290, 'Display:7.8" Foldable Ultra-Thin Glass OLED|Chip:Snapdragon 8 Gen 2|Camera:50 MP Triple OIS|Hinge:Titanium Alloy rated 400,000 folds', 'A flagship phone that opens into an expansive tablet. Crafted with ultra-durable aerospace-grade titanium alloy hinge.', 6, 'https://images.unsplash.com/photo-1580910051074-3eb694886505?auto=format&fit=crop&w=800&q=80'),
  P(4, 'Tata Titan Book 14 OLED', 'Tata', 'laptops', 64999, 72999, 4.8, 1520, 'Top rated', 222, 'Display:14" 2.8K Lumina OLED, 120 Hz|Processor:Intel Core Ultra 7, 16-core|RAM & Storage:16 GB LPDDR5X, 1 TB Gen4 SSD|Battery:Up to 18 hours, 65 W USB-C Fast Charge', 'Designed for Indian creators & software engineers: ultra-light aluminum unibody, anti-glare OLED display, and silent cooling.', 18, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80'),
  P(5, 'Tata Garuda Forge 16', 'Tata', 'laptops', 114999, 129999, 4.7, 870, '', 16, 'Display:16" QHD+ IPS, 240 Hz, 100% sRGB|Processor:AMD Ryzen 9 8945HS|Graphics:NVIDIA GeForce RTX 4070 8 GB GDDR6|Memory:32 GB DDR5, 2 TB SSD', 'High-octane workstation & gaming laptop built for heavy 3D rendering, coding compilation, and AAA esports.', 7, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?auto=format&fit=crop&w=800&q=80'),
  P(6, 'JioBook Ultra 13', 'Jio', 'laptops', 26999, 31999, 4.6, 1310, 'Value pick', 196, 'Display:13.3" FHD Anti-Glare Retina|Processor:Octa-Core Octane processor|Connectivity:Built-in 4G/5G SIM & Wi-Fi 6|Weight:990 grams ultra-portable', 'Under 1 kg featherlight laptop with all-day battery life and seamless nationwide connectivity for Indian students and remote workers.', 25, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80'),
  P(7, 'Tata Pad Pro 12 Stylus', 'Tata', 'tablets', 42999, 48999, 4.7, 960, 'New', 160, 'Display:12.6" 2.8K PaperDisplay, 120 Hz|Processor:Dimensity 9000 Flagship|Stylus:Tata Active Pen included with 4096 pressure levels|Battery:10,050 mAh, 45 W Fast Charge', 'A creative powerhouse tablet for architectural drawings, UPSC exam preparation, digital sketches, and entertainment.', 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80'),
  P(8, 'Lava Tab Slate 11', 'Lava', 'tablets', 18999, 22999, 4.5, 1840, '', 222, 'Display:11" 2K Eye-Care IPS, 90 Hz|Processor:Helio G99 Octa-Core|Speakers:Quad Stereo with Dolby Atmos|Storage:128 GB expandable to 1 TB', 'Perfect for streaming hotstar, family binge-watching, video calls, and digital textbooks with quad Dolby stereo speakers.', 33, 'https://images.unsplash.com/photo-1561154464-82e9adf32764?auto=format&fit=crop&w=800&q=80'),
  P(9, 'Micromax Canvas Tab 10', 'Micromax', 'tablets', 12999, 15999, 4.4, 520, 'Sale', 290, 'Display:10.4" Paper-Feel Matte Display|Chip:Octa-Core T616|Stylus:Magnetic Smart Stylus in the box|Battery:7,500 mAh', 'Gentle on your eyes with matte paper-texture glass and an active pen included in the box for effortless note taking.', 20, 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9?auto=format&fit=crop&w=800&q=80'),
  P(10, 'boAt Nirvana ANC Studio', 'boAt', 'audio', 12999, 16999, 4.8, 4210, 'Today\'s deal', 196, 'Drivers:40 mm Beryllium Acoustic Drivers|ANC:Hybrid Active Noise Cancellation up to 35 dB|Playback:60 Hours total playtime|Audio:Signature Indian Bass + LDAC Hi-Res', 'Studio-quality over-ear wireless headphones with hybrid ANC to silence metro trains and flights, tuned with deep Indian bass.', 22, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80'),
  P(11, 'boAt Airdopes Supreme Pro', 'boAt', 'audio', 2999, 4499, 4.6, 3320, 'Best seller', 222, 'Drivers:11 mm Titanium Dynamic Drivers|Calling:Quad Mic ENx AI Noise Cancellation|Playback:50 Hours playtime with ASAP Charge|Water Resistance:IPX5 Sweatproof', 'True wireless earbuds with crystal-clear calling even in busy Indian street traffic and 50 hours of long-lasting backup.', 60, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80'),
  P(12, 'Boult Audio Curve Sport Open', 'Boult', 'audio', 1999, 2999, 4.4, 1180, '', 160, 'Design:Open-Ear Air Conduction|Drivers:16 mm BoomDrivers|Battery:18 Hours non-stop music|Rating:IPX6 Splash and sweat resistant', 'Hear your music while remaining safely aware of traffic during morning jogs and cycling on Indian roads.', 45, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80'),
  P(13, 'Noise ColorFit Ultra 3', 'Noise', 'wearables', 4999, 7999, 4.7, 1450, 'New', 16, 'Display:1.96" TruView AMOLED, Always-On|Chassis:Premium Brushed Metallic Alloy|Calling:Bluetooth Calling with dial pad|Sensors:Noise Health Suite: 24/7 SpO2, Heart Rate, Stress', 'A regal smartwatch with metallic unibody finish, functional crown, and comprehensive Indian wellness tracking.', 15, 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'),
  P(14, 'Fire-Boltt Invincible Pro', 'Fire-Boltt', 'wearables', 3499, 5999, 4.5, 6210, 'Best seller', 160, 'Display:1.43" Round AMOLED, 700 nits brightness|Storage:4 GB Inbuilt storage for 1,000+ songs|Sports:110+ Workout Modes with cricket tracking|Battery:Up to 7 days normal use', 'Rugged circular smartwatch packed with 4GB offline music storage, TWS pairing, and dedicated cricket tracking mode.', 120, 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'),
  P(15, 'Noise Pulse Buzz 2', 'Noise', 'wearables', 2199, 3499, 4.3, 740, '', 290, 'Display:1.85" Curved Glass TFT|Calling:Tru Sync Bluetooth Calling|Battery:10 days battery life|Health:Sleep stage monitoring and step tracking', 'Sleek, lightweight daily fitness watch with quick Bluetooth calling and over a week of charge on a single plug.', 8, 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'),
  P(16, 'Ant Esports Quantum Pro Wireless', 'Ant Esports', 'gaming', 2499, 3499, 4.7, 2890, 'Best seller', 222, 'Connectivity:Tri-Mode: Bluetooth, 2.4 GHz Dongle, USB-C|Triggers:Magnetic Hall-Effect triggers|Battery:40 Hours continuous gaming|Compatibility:PC, Android, Switch, iOS', 'Drift-free Hall-effect magnetic sticks and ergonomic contoured grips designed for competitive BGMI and PC gaming.', 55, 'https://images.unsplash.com/photo-1600080972464-8e5f35f63d08?auto=format&fit=crop&w=800&q=80'),
  P(17, 'Cosmic Byte Ares Elite Pro', 'Cosmic Byte', 'gaming', 3999, 5499, 4.8, 960, '', 16, 'Paddles:4 Rear Remappable Mechanical Paddles|Latency:Ultra-low 1 ms 2.4 GHz wireless|Motors:Dual asymmetric haptic motors|Extras:Hard shell carry case included', 'Esports-grade wireless gamepad with tactile mechanical microswitches and hair-trigger locks for tournament gaming.', 9, 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80'),
  P(18, 'Ant Esports Hydra RGB Gamepad', 'Ant Esports', 'gaming', 1799, 2499, 4.4, 710, 'Sale', 196, 'Lighting:Customizable RGB LED light ring|Haptics:Dual HD Rumble Vibration motors|Battery:30 Hours battery life|Design:Semi-transparent cyber body', 'Illuminated transparent cyber-chassis with intense haptics and responsive d-pad at an unbeatable price point.', 28, 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'),
  P(19, 'DigiTek D-Cam Pro 4K', 'DigiTek', 'cameras', 44999, 52999, 4.8, 410, 'Pro pick', 222, 'Sensor:24.2 MP APS-C CMOS Sensor|Video:4K 60p HDR uncropped, 1080p 120p|Autofocus:Eye & Face tracking AI Autofocus|Stabilization:5-Axis In-Body Image Stabilization', 'A versatile mirrorless camera perfect for Indian weddings, YouTube creators, documentary filmmakers, and street photography.', 5, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'),
  P(20, 'DigiTek InstaSnap Z Pocket', 'DigiTek', 'cameras', 19999, 24999, 4.5, 880, '', 160, 'Sensor:1-inch 20.1 MP High Sensitivity Sensor|Lens:24-70 mm f/1.8-2.8 Zeiss Optical Zoom|Display:180° Flip-up Selfie LCD screen|Weight:280 grams pocket-size', 'Fits easily inside your kurta or jacket pocket, capturing DSLR-quality portraits and 4K vlogs on the go.', 16, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'),
  P(21, 'Noise Play Action 4K Ultra', 'Noise', 'cameras', 9999, 13999, 4.6, 1760, '', 16, 'Video:4K 60 fps SmoothEIS 3.0 stabilization|Waterproof:Up to 30 m with included waterproof housing|Dual Screen:Front selfie screen + rear touch screen|Accessories:Mounts for helmet, bike, and chest strap', 'Built for Leh-Ladakh bike expeditions, Goa surfing, and monsoon trekking with crystal-clear 4K horizon-level stabilization.', 24, 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'),
  P(22, 'Zebronics Curved Arc 27 4K', 'Zebronics', 'monitors', 19999, 24999, 4.7, 1120, 'Top rated', 222, 'Panel:27" 4K UHD IPS, 100% sRGB color gamut|Connectivity:USB-C 65 W laptop charging, HDMI 2.1, DisplayPort|Stand:Ergonomic height, swivel, and tilt adjustable|Eye Care:TUV Rheinland Low Blue Light certified', 'Pixel-sharp 4K display with single-cable USB-C connectivity to power and mirror your laptop simultaneously.', 19, 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=800&q=80'),
  P(23, 'Zebronics Horizon Ultrawide 34', 'Zebronics', 'monitors', 32999, 38999, 4.6, 690, '', 196, 'Panel:34" 3440 x 1440 WQHD 1500R Curved|Refresh Rate:165 Hz, 1 ms MPRT response time|Color:99% sRGB, HDR400 support|Speakers:Built-in 10 W stereo speakers', 'Expansive 21:9 curved ultrawide screen for trading charts, multi-window coding, and cinematic gaming.', 11, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=800&q=80'),
  P(24, 'Ant Esports View 24 Speed', 'Ant Esports', 'monitors', 11999, 14999, 4.5, 1890, 'Sale', 16, 'Panel:24" FHD IPS, 240 Hz refresh rate|Latency:0.5 ms ultra-low response time|Sync:AMD FreeSync Premium & G-Sync compatible|Stand:Height adjustable pivot stand', 'Lightning-fast 240Hz competitive esports gaming monitor with zero ghosting and vibrant IPS viewing angles.', 30, 'https://images.unsplash.com/photo-1585792180666-f7347c490ee2?auto=format&fit=crop&w=800&q=80'),
  P(25, 'boAt Stone 1500 Pro Party', 'boAt', 'speakers', 6999, 9999, 4.6, 1240, '', 222, 'Audio:50 W High-Power Indian Bass Drivers|Lighting:Dynamic Beat-synced RGB LED lights|Battery:15 Hours continuous playtime|Water Resistance:IPX6 Splashproof', 'Thunderous 50W sound tuned with boAt Signature Bass, dual passive radiators, and beat-synced RGB lights for Diwali and house parties.', 26, 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=800&q=80'),
  P(26, 'boAt Rugby Mini Bass', 'boAt', 'speakers', 1499, 2499, 4.4, 5310, 'Best seller', 16, 'Audio:10 W punchy stereo sound|Portability:Ultra-compact with carabiner clip|Battery:12 Hours battery life|Rating:IPX7 submersible waterproof', 'Pocket-sized powerhouse. Clip it to your backpack for college or treks with IPX7 waterproof durability.', 90, 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?auto=format&fit=crop&w=800&q=80'),
  P(27, 'Tata Sound Sphere 360', 'Tata', 'speakers', 14999, 18999, 4.7, 530, 'New', 160, 'Acoustics:360° Omnidirectional Room-Filling 60 W Sound|Connectivity:Wi-Fi, AirPlay 2, Bluetooth 5.3, Optical IN|Assistant:Built-in voice assistant with Indian accent recognition|Finish:Premium woven acoustic fabric & brushed metal', 'Luxury architectural home audio speaker that automatically calibrates sound to your living room acoustics.', 4, 'https://images.unsplash.com/photo-1543512214-318c7553f230?auto=format&fit=crop&w=800&q=80')
];
const BY_ID = Object.fromEntries(PRODUCTS.map(p => [p.id, p]));
const BRANDS = [...new Set(PRODUCTS.map(p => p.brand))].sort();
const HERO_IDS = [1, 4, 10, 13];
const DEAL_ID = 10;
const MAX_PRICE = Math.ceil(Math.max(...PRODUCTS.map(p => p.price)) / 5000) * 5000;

/* ---------------- Product artwork (original inline SVG) ---------------- */
let gid = 0;
function art(cat, hue) {
  const id = 'a' + (++gid), g = `url(#${id})`, b = `url(#${id}b)`, sh = `url(#${id}r)`;
  const defs = `<defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${hue} 92% 66%)"/><stop offset="1" stop-color="hsl(${(hue + 55) % 360} 90% 46%)"/></linearGradient>
    <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f3b5a"/><stop offset="1" stop-color="#111726"/></linearGradient>
    <radialGradient id="${id}r" cx=".25" cy=".2" r=".95"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="200" cy="281" rx="124" ry="8" fill="#000" opacity=".38"/>`;
  const dark = '#0b0f19', edge = '#3b4868';
  let s = '';
  switch (cat) {
    case 'smartphones':
      s = `<g transform="rotate(-9 150 160)"><rect x="92" y="34" width="108" height="236" rx="25" fill="${g}"/><rect x="92" y="34" width="108" height="236" rx="25" fill="${sh}"/>
        <rect x="104" y="46" width="52" height="52" rx="15" fill="#0b0f19" opacity=".88"/><circle cx="121" cy="63" r="9.5" fill="#05080f" stroke="${edge}" stroke-width="2.4"/><circle cx="140" cy="63" r="9.5" fill="#05080f" stroke="${edge}" stroke-width="2.4"/><circle cx="130" cy="81" r="9.5" fill="#05080f" stroke="${edge}" stroke-width="2.4"/></g>
        <g transform="rotate(7 255 160)"><rect x="200" y="20" width="112" height="256" rx="27" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="207" y="27" width="98" height="242" rx="21" fill="${g}"/>
        <circle cx="256" cy="168" r="48" fill="#fff" opacity=".13"/><circle cx="256" cy="168" r="28" fill="#fff" opacity=".13"/><rect x="238" y="37" width="36" height="10" rx="5" fill="${dark}"/><rect x="226" y="232" width="60" height="5" rx="2.5" fill="#fff" opacity=".6"/></g>`;
      break;
    case 'laptops':
      s = `<path d="M70 200h260l22 26a8 8 0 0 1-6 13H54a8 8 0 0 1-6-13z" fill="${b}" stroke="${edge}" stroke-width="1.5"/><rect x="172" y="200" width="56" height="6" rx="3" fill="#0b0f19" opacity=".7"/>
        <rect x="76" y="40" width="248" height="164" rx="12" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="85" y="49" width="230" height="146" rx="5" fill="${g}"/>
        <path d="M85 160c50-34 90 10 150-16 30-13 60-4 80 4v43H85z" fill="#fff" opacity=".14"/><circle cx="268" cy="86" r="26" fill="#fff" opacity=".16"/><circle cx="200" cy="44" r="2" fill="#000"/>`;
      break;
    case 'tablets':
      s = `<rect x="64" y="46" width="262" height="206" rx="22" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="75" y="57" width="240" height="184" rx="12" fill="${g}"/>
        <rect x="75" y="57" width="240" height="184" rx="12" fill="${sh}"/><path d="M96 200c34-52 70-8 104-38s60-46 100-22v80H96z" fill="#fff" opacity=".15"/>
        <rect x="336" y="64" width="9" height="160" rx="4.5" fill="#dfe6f5"/><rect x="336" y="64" width="9" height="30" rx="4.5" fill="${g}"/>`;
      break;
    case 'audio':
      s = `<path d="M104 176C98 76 150 40 200 40s102 36 96 136" fill="none" stroke="#2a3552" stroke-width="16" stroke-linecap="round"/><path d="M118 150C126 92 160 62 200 62" fill="none" stroke="#fff" stroke-opacity=".12" stroke-width="5" stroke-linecap="round"/>
        <rect x="76" y="140" width="56" height="106" rx="26" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="84" y="150" width="40" height="86" rx="20" fill="${g}"/><circle cx="104" cy="193" r="11" fill="${dark}" opacity=".5"/>
        <rect x="268" y="140" width="56" height="106" rx="26" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="276" y="150" width="40" height="86" rx="20" fill="${g}"/><circle cx="296" cy="193" r="11" fill="${dark}" opacity=".5"/>`;
      break;
    case 'wearables':
      s = `<rect x="164" y="6" width="72" height="288" rx="20" fill="${b}" stroke="${edge}" stroke-width="1.5"/><path d="M178 20v52M178 232v46M222 20v52M222 232v46" stroke="#000" stroke-opacity=".25" stroke-width="2"/>
        <rect x="262" y="124" width="10" height="34" rx="4" fill="#4b5878"/><rect x="132" y="82" width="136" height="136" rx="40" fill="${b}" stroke="${edge}" stroke-width="2.5"/><rect x="142" y="92" width="116" height="116" rx="32" fill="${dark}"/>
        <circle cx="200" cy="150" r="42" fill="none" stroke="${g}" stroke-width="9"/><path d="M200 150V122M200 150l20 12" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="200" cy="150" r="5" fill="#fff"/>`;
      break;
    case 'gaming':
      s = `<path d="M118 92h164c42 0 62 40 76 96 6 28-6 52-30 52-18 0-28-12-38-28-8-12-14-18-30-18h-98c-16 0-22 6-30 18-10 16-20 28-38 28-24 0-36-24-30-52 14-56 34-96 76-96z" fill="${b}" stroke="${edge}" stroke-width="2.4"/>
        <path d="M118 92h164c42 0 62 40 76 96" fill="none" stroke="${g}" stroke-width="5" stroke-linecap="round"/>
        <path d="M124 128h12v12h12v12h-12v12h-12v-12h-12v-12h12z" fill="#dfe6f5"/>
        <circle cx="262" cy="124" r="9" fill="${g}"/><circle cx="286" cy="144" r="9" fill="#dfe6f5"/><circle cx="262" cy="164" r="9" fill="#dfe6f5"/><circle cx="238" cy="144" r="9" fill="#dfe6f5"/>
        <circle cx="160" cy="190" r="22" fill="${dark}" stroke="${edge}" stroke-width="2"/><circle cx="160" cy="190" r="12" fill="#1b2336"/>
        <circle cx="240" cy="190" r="22" fill="${dark}" stroke="${edge}" stroke-width="2"/><circle cx="240" cy="190" r="12" fill="#1b2336"/><rect x="186" y="128" width="28" height="9" rx="4.5" fill="#26314b"/>`;
      break;
    case 'cameras':
      s = `<rect x="150" y="62" width="86" height="34" rx="9" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="258" y="72" width="40" height="22" rx="6" fill="${g}"/>
        <rect x="68" y="88" width="264" height="150" rx="20" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="68" y="146" width="264" height="92" rx="0 0 20 20" fill="#0f1524" opacity=".7"/>
        <circle cx="200" cy="164" r="60" fill="#0a0e18" stroke="${edge}" stroke-width="3"/><circle cx="200" cy="164" r="46" fill="#121a2e" stroke="#2d3a5a" stroke-width="3"/><circle cx="200" cy="164" r="30" fill="${g}" opacity=".9"/><circle cx="200" cy="164" r="14" fill="#05080f"/><circle cx="186" cy="150" r="7" fill="#fff" opacity=".55"/>
        <circle cx="106" cy="116" r="7" fill="#1a2238" stroke="${edge}" stroke-width="2"/><rect x="296" y="106" width="22" height="9" rx="4.5" fill="${g}"/>`;
      break;
    case 'monitors':
      s = `<rect x="190" y="206" width="20" height="46" fill="#222c45"/><rect x="132" y="250" width="136" height="12" rx="6" fill="${b}" stroke="${edge}" stroke-width="1.5"/>
        <rect x="46" y="28" width="308" height="184" rx="12" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="55" y="37" width="290" height="166" rx="5" fill="${g}"/><rect x="55" y="37" width="290" height="166" rx="5" fill="${sh}"/>
        <path d="M55 170c60-60 100 0 170-36 50-26 80-10 120 6v63H55z" fill="#fff" opacity=".14"/><rect x="82" y="58" width="82" height="9" rx="4.5" fill="#fff" opacity=".5"/><rect x="82" y="76" width="50" height="9" rx="4.5" fill="#fff" opacity=".3"/>`;
      break;
    case 'speakers':
      s = `<defs><pattern id="${id}p" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="5" cy="5" r="1.8" fill="#6f7fa3"/></pattern></defs>
        <rect x="136" y="38" width="128" height="232" rx="62" fill="${b}" stroke="${edge}" stroke-width="2"/><rect x="144" y="86" width="112" height="136" fill="url(#${id}p)" opacity=".85"/>
        <ellipse cx="200" cy="58" rx="46" ry="12" fill="${dark}" stroke="${edge}" stroke-width="2"/><ellipse cx="200" cy="58" rx="30" ry="6" fill="${g}"/>
        <rect x="136" y="236" width="128" height="8" fill="${g}" opacity=".9"/><circle cx="200" cy="154" r="24" fill="${g}" opacity=".25"/>`;
      break;
  }
  return `<svg viewBox="0 0 400 300" aria-hidden="true" focusable="false">${defs}${s}</svg>`;
}

function productMedia(p, extraClass = '', alt = '') {
  const altText = alt || p.name;
  return `<span class="media-frame"><img class="real-img ${extraClass}" src="${p.img}" alt="${altText}" loading="lazy" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block'"><span class="art-fallback" style="display:none;width:100%;height:100%">${art(p.cat, p.colors[0].h)}</span></span>`;
}

function catMedia(c) {
  return `<span class="cat-frame"><img class="real-cat-img" src="${c.img}" alt="${c.label}" loading="lazy" onerror="this.style.display='none';if(this.nextElementSibling)this.nextElementSibling.style.display='block'"><span class="art-fallback" style="display:none;width:100%;height:100%">${art(c.id, 222)}</span></span>`;
}

/* ---------------- Helpers ---------------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = n => '₹' + Math.round(n).toLocaleString('en-IN');
const stars = r => '★'.repeat(Math.round(r)) + '☆'.repeat(5 - Math.round(r));
const off = p => p.old > p.price ? Math.round((1 - p.price / p.old) * 100) : 0;
const catLabel = id => CATS.find(c => c.id === id).label;
const store = {
  get(k, d) { try { const v = localStorage.getItem('technova.' + k) || localStorage.getItem('nexora.' + k); return v ? JSON.parse(v) : d; } catch { return d; } },
  set(k, v) { try { localStorage.setItem('technova.' + k, JSON.stringify(v)); } catch { /* storage unavailable */ } }
};
const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

/* ---------------- State ---------------- */
const state = {
  cat: 'all', brands: new Set(), max: MAX_PRICE, rating: 0, sale: false, q: '', sort: 'featured',
  cart: store.get('cart', []).filter(l => BY_ID[l.id]),   // [{id, c (color idx), q}]
  wish: store.get('wish', []).filter(id => BY_ID[id]),
  promo: store.get('promo', ''),
  user: store.get('user', null)
};
const saveCart = () => { store.set('cart', state.cart); store.set('promo', state.promo); };
const saveWish = () => store.set('wish', state.wish);
const saveUser = () => store.set('user', state.user);

/* ---------------- Toasts ---------------- */
function toast(msg, actionLabel, action) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg><span></span>`;
  el.querySelector('span').textContent = msg;
  if (actionLabel) {
    const b = document.createElement('button');
    b.textContent = actionLabel;
    b.addEventListener('click', () => { action(); dismiss(); });
    el.append(b);
  }
  $('#toasts').append(el);
  const dismiss = () => { el.classList.add('out'); setTimeout(() => el.remove(), 300); };
  setTimeout(dismiss, 3600);
  while ($('#toasts').children.length > 3) $('#toasts').firstChild.remove();
}

/* ---------------- Layers (drawers & modals) ---------------- */
const overlay = $('#overlay');
let layer = null, lastFocus = null;
function openLayer(el) {
  if (layer) closeLayer(true);
  lastFocus = document.activeElement;
  layer = el; el.hidden = false; overlay.hidden = false;
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('show'); overlay.classList.add('show'); }));
  document.body.classList.add('locked');
  setTimeout(() => { const f = el.querySelector('[data-autofocus]') || el.querySelector('button, input, a[href]'); if (f) f.focus(); }, 60);
}
function closeLayer(instant) {
  if (!layer) return;
  const el = layer; layer = null;
  el.classList.remove('show'); overlay.classList.remove('show');
  document.body.classList.remove('locked');
  const done = () => { if (!el.classList.contains('show')) el.hidden = true; if (!layer) overlay.hidden = true; };
  if (instant) done(); else { setTimeout(done, 380); if (lastFocus && lastFocus.focus) lastFocus.focus(); }
}
overlay.addEventListener('click', () => closeLayer());
$$('[data-close]').forEach(b => b.addEventListener('click', () => closeLayer()));
['quickModal', 'checkoutModal', 'authModal'].forEach(id => { const el = $('#' + id); if (el) el.addEventListener('mousedown', e => { if (e.target.id === id) closeLayer(); }); });
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { if (layer) closeLayer(); closeMobileUI(); hideSuggest(); }
  if (e.key === 'Tab' && layer) {                      // keep focus inside the open layer
    const f = $$('button:not([disabled]), input:not([disabled]), a[href], select, [tabindex="0"]', layer).filter(x => x.offsetParent !== null);
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  }
  if (e.key === '/' && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName) && !layer) { e.preventDefault(); openSearch(); }
});

/* ---------------- Product cards & grid ---------------- */
const heartSVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg>';
function cardHTML(p) {
  const d = off(p), wished = state.wish.includes(p.id);
  const badge = d >= 15 && p.badge === 'Sale' ? `<span class="badge sale">-${d}%</span>` : p.badge ? `<span class="badge${/sale|deal/i.test(p.badge) ? ' sale' : ''}">${p.badge}</span>` : '';
  return `<article class="card" data-id="${p.id}">
    <div class="media">${badge}
      <button class="wish" data-act="wish" aria-pressed="${wished}" aria-label="${wished ? 'Remove' : 'Add'} ${p.name} ${wished ? 'from' : 'to'} wishlist">${heartSVG}</button>
      <a href="#" data-act="quick" aria-label="Quick view ${p.name}" style="display:block;height:100%">${productMedia(p, 'card-img')}</a>
    </div>
    <div class="body">
      <span class="brand">${p.brand} · ${catLabel(p.cat)}</span>
      <h3><button data-act="quick">${p.name}</button></h3>
      <div class="rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span><span>${p.rating} (${p.reviews.toLocaleString('en-IN')})</span></div>
      <div class="price-row"><span class="price">${money(p.price)}</span>${d ? `<span class="was">${money(p.old)}</span><span class="off">${d}% off</span>` : ''}</div>
      <button class="add" data-act="add">Add to cart</button>
    </div></article>`;
}

function filtered() {
  const q = state.q.trim().toLowerCase();
  let list = PRODUCTS.filter(p =>
    (state.cat === 'all' || p.cat === state.cat) &&
    (!state.brands.size || state.brands.has(p.brand)) &&
    p.price <= state.max && p.rating >= state.rating &&
    (!state.sale || off(p) >= 12) &&
    (!q || `${p.name} ${p.brand} ${catLabel(p.cat)} ${p.desc}`.toLowerCase().includes(q)));
  const s = state.sort;
  if (s === 'price-asc') list.sort((a, b) => a.price - b.price);
  else if (s === 'price-desc') list.sort((a, b) => b.price - a.price);
  else if (s === 'rating') list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
  else if (s === 'discount') list.sort((a, b) => off(b) - off(a));
  return list;
}

function renderGrid() {
  const list = filtered();
  $('#grid').innerHTML = list.map(cardHTML).join('');
  $('#empty').hidden = list.length > 0;
  $('#grid').hidden = list.length === 0;
  const catName = state.cat === 'all' ? 'all categories' : catLabel(state.cat);
  $('#resultCount').textContent = `${list.length} ${list.length === 1 ? 'product' : 'products'} in ${catName}${state.q ? ` matching "${state.q.trim()}"` : ''}`;
  $$('#chips .chip').forEach(c => c.setAttribute('aria-pressed', String(c.dataset.cat === state.cat)));
}

function renderChips() {
  $('#chips').innerHTML = [{ id: 'all', label: 'All' }, ...CATS].map(c => `<button class="chip" data-cat="${c.id}" aria-pressed="${c.id === state.cat}">${c.label}</button>`).join('');
}
function renderRail() {
  $('#catRail').innerHTML = CATS.map(c => {
    const items = PRODUCTS.filter(p => p.cat === c.id);
    return `<button class="cat" data-cat="${c.id}"><div class="art">${catMedia(c)}</div><strong>${c.label}</strong><span>${items.length} products</span></button>`;
  }).join('');
  $('#footCats').innerHTML = CATS.map(c => `<li><button data-cat="${c.id}">${c.label}</button></li>`).join('');
}
function renderFilters() {
  $('#brandList').innerHTML = BRANDS.map(b => {
    const n = PRODUCTS.filter(p => p.brand === b).length;
    return `<label><input type="checkbox" value="${b}"><span>${b}</span><em>${n}</em></label>`;
  }).join('');
  const r = $('#priceRange');
  r.min = 5000; r.max = MAX_PRICE; r.step = 5000; r.value = state.max;
  $('#priceVal').textContent = money(state.max);
}
function goCategory(id) {
  state.cat = id; state.q = ''; $('#searchInput').value = '';
  renderGrid();
  $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
}
function resetFilters() {
  Object.assign(state, { cat: 'all', brands: new Set(), max: MAX_PRICE, rating: 0, sale: false, q: '', sort: 'featured' });
  $('#searchInput').value = ''; $('#sort').value = 'featured'; $('#saleOnly').checked = false;
  $$('#brandList input').forEach(i => i.checked = false);
  $('input[name=rating][value="0"]').checked = true;
  $('#priceRange').value = MAX_PRICE; $('#priceVal').textContent = money(MAX_PRICE);
  renderGrid();
}

/* ---------------- Hero stage ---------------- */
let stageIdx = 0, stageTimer = null;
function renderStage(i, animate = true) {
  stageIdx = i;
  const p = BY_ID[HERO_IDS[i]], d = off(p);
  const artEl = $('#stageArt'), info = $('#stageInfo');
  artEl.innerHTML = productMedia(p, 'stage-img');
  info.innerHTML = `<div><h3>${p.name}</h3><div class="specs">${p.specs.slice(0, 3).map(s => `<span>${s[1]}</span>`).join('')}</div></div>
    <div><div class="price">${money(p.price)}${d ? `<small>${money(p.old)}</small>` : ''}</div><button class="btn btn-ghost" data-stage-view>View details</button></div>`;
  if (animate && !reduceMotion) {
    [artEl, info].forEach(el => { el.classList.remove('swap'); void el.offsetWidth; el.classList.add('swap'); });
  }
  $$('#stageTabs button').forEach((b, n) => { b.setAttribute('aria-selected', String(n === i)); b.tabIndex = n === i ? 0 : -1; });
}
function initStage() {
  const tabs = $('#stageTabs');
  tabs.innerHTML = HERO_IDS.map((id, n) => `<button role="tab" id="st${n}" data-i="${n}">${CATS.find(c => c.id === BY_ID[id].cat).tab}</button>`).join('');
  renderStage(0, false);
  const stopAuto = () => { clearInterval(stageTimer); stageTimer = null; };
  tabs.addEventListener('click', e => { const b = e.target.closest('button'); if (b) { stopAuto(); renderStage(+b.dataset.i); } });
  tabs.addEventListener('keydown', e => {
    if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
    stopAuto();
    const n = (stageIdx + (e.key === 'ArrowRight' ? 1 : -1) + HERO_IDS.length) % HERO_IDS.length;
    renderStage(n); $('#st' + n).focus();
  });
  $('#stageInfo').addEventListener('click', e => { if (e.target.closest('[data-stage-view]')) openQuick(HERO_IDS[stageIdx]); });
  const stage = $('#stage');
  stage.addEventListener('pointermove', e => {
    const r = stage.getBoundingClientRect();
    stage.style.setProperty('--mx', (e.clientX - r.left) + 'px');
    stage.style.setProperty('--my', (e.clientY - r.top) + 'px');
  });
  if (!reduceMotion) {
    stageTimer = setInterval(() => { if (!document.hidden && !layer) renderStage((stageIdx + 1) % HERO_IDS.length); }, 5500);
    stage.addEventListener('pointerenter', stopAuto, { once: true });
    stage.addEventListener('focusin', stopAuto, { once: true });
  }
}

/* ---------------- Deal ---------------- */
function renderDeal() {
  const p = BY_ID[DEAL_ID], d = off(p);
  $('#dealBox').innerHTML = `<div>
      <span class="tag">Today's deal · ${d}% off</span>
      <h2>${p.name}</h2>
      <p class="lead">${p.desc} Price drops back to ${money(p.old)} when the timer ends.</p>
      <div class="timer" role="timer" aria-label="Time left on today's deal"><div><b id="tH">00</b><span>hours</span></div><div><b id="tM">00</b><span>minutes</span></div><div><b id="tS">00</b><span>seconds</span></div></div>
      <div class="deal-price"><span class="price">${money(p.price)}</span><span class="was">${money(p.old)}</span></div>
      <div class="deal-actions"><button class="btn btn-primary" data-deal-add>Add to cart</button><button class="btn btn-ghost" data-deal-view>View details</button></div>
    </div>
    <div class="art">${productMedia(p, 'deal-img')}</div>`;
  const tick = () => {
    const now = new Date(), end = new Date(now); end.setHours(24, 0, 0, 0);
    let s = Math.max(0, Math.floor((end - now) / 1000));
    const h = String(Math.floor(s / 3600)).padStart(2, '0'), m = String(Math.floor(s % 3600 / 60)).padStart(2, '0'), sec = String(s % 60).padStart(2, '0');
    const H = $('#tH'); if (!H) return;
    H.textContent = h; $('#tM').textContent = m; $('#tS').textContent = sec;
  };
  tick(); setInterval(tick, 1000);
  $('#dealBox').addEventListener('click', e => {
    if (e.target.closest('[data-deal-add]')) addToCart(DEAL_ID, 0, 1, true);
    if (e.target.closest('[data-deal-view]')) openQuick(DEAL_ID);
  });
}

/* ---------------- Quick view ---------------- */
function openQuick(id) {
  const p = BY_ID[id]; let ci = 0, qty = 1;
  const card = $('#qvCard'), wished = () => state.wish.includes(id);
  const draw = () => {
    const d = off(p), low = p.stock <= 8;
    card.innerHTML = `<button class="icon-btn modal-close" data-close aria-label="Close product details"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
      <div class="qv-media">${productMedia(p, 'qv-img', p.name + ' - ' + p.colors[ci].n)}</div>
      <div class="qv-info">
        <span class="brand">${p.brand} · ${catLabel(p.cat)}</span>
        <h2 id="qvName">${p.name}</h2>
        <div class="rating"><span class="stars" aria-hidden="true">${stars(p.rating)}</span><span>${p.rating} from ${p.reviews.toLocaleString('en-IN')} reviews</span></div>
        <p class="desc">${p.desc}</p>
        <div class="price-row"><span class="price">${money(p.price)}</span>${d ? `<span class="was">${money(p.old)}</span><span class="off">Save ${money(p.old - p.price)}</span>` : ''}</div>
        <div class="swatches" role="radiogroup" aria-label="Color"><span class="label">Color: <strong>${p.colors[ci].n}</strong></span>
          ${p.colors.map((c, n) => `<button class="swatch" role="radio" aria-checked="${n === ci}" aria-label="${c.n}" data-ci="${n}" style="background:hsl(${c.h} 75% 55%)"></button>`).join('')}</div>
        <div class="spec-list">${p.specs.map(s => `<div><span>${s[0]}</span>${s[1]}</div>`).join('')}</div>
        <div class="stock${low ? ' low' : ''}">${low ? `Only ${p.stock} left in stock` : 'In stock, ships within 24 hours'}</div>
        <div class="qv-actions">
          <div class="qty" aria-label="Quantity"><button data-q="-1" aria-label="Decrease quantity">−</button><output>${qty}</output><button data-q="1" aria-label="Increase quantity">+</button></div>
          <button class="btn btn-primary" data-add>Add to cart · ${money(p.price * qty)}</button>
          <button class="wish" data-wish aria-pressed="${wished()}" aria-label="${wished() ? 'Remove from' : 'Add to'} wishlist">${heartSVG}</button>
        </div></div>`;
    $$('[data-close]', card).forEach(b => b.addEventListener('click', () => closeLayer()));
  };
  draw();
  card.onclick = e => {
    const sw = e.target.closest('[data-ci]'), q = e.target.closest('[data-q]');
    if (sw) { ci = +sw.dataset.ci; draw(); $$('.swatch', card)[ci].focus(); }
    else if (q) { qty = Math.min(MAX_QTY, Math.max(1, qty + +q.dataset.q)); draw(); $(`[data-q="${q.dataset.q}"]`, card).focus(); }
    else if (e.target.closest('[data-add]')) { addToCart(id, ci, qty, true); }
    else if (e.target.closest('[data-wish]')) { toggleWish(id); draw(); $('[data-wish]', card).focus(); }
  };
  openLayer($('#quickModal'));
}

/* ---------------- Wishlist ---------------- */
function toggleWish(id) {
  const i = state.wish.indexOf(id);
  if (i > -1) { state.wish.splice(i, 1); toast('Removed from wishlist'); }
  else { state.wish.push(id); toast('Saved to wishlist'); }
  saveWish(); updateBadges(); renderWish();
  const btn = $(`.card[data-id="${id}"] .wish`);
  if (btn) {
    const w = state.wish.includes(id);
    btn.setAttribute('aria-pressed', String(w));
    btn.setAttribute('aria-label', `${w ? 'Remove' : 'Add'} ${BY_ID[id].name} ${w ? 'from' : 'to'} wishlist`);
    btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
  }
}
function renderWish() {
  const body = $('#wishBody');
  if (!state.wish.length) {
    body.innerHTML = `<div class="drawer-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z"/></svg><h3>Your wishlist is empty</h3><p>Tap the heart on any product to save it here.</p><button class="btn btn-primary" data-close-shop>Browse products</button></div>`;
    return;
  }
  body.innerHTML = state.wish.map(id => {
    const p = BY_ID[id];
    return `<div class="line" data-id="${id}"><div class="thumb">${productMedia(p, 'thumb-img')}</div>
      <div><h4>${p.name}</h4><small>${p.brand}</small><button class="rm" data-w-rm>Remove</button></div>
      <div class="right"><b>${money(p.price)}</b><button class="btn btn-ghost" style="padding:8px 14px;font-size:14px" data-w-add>Add to cart</button></div></div>`;
  }).join('');
}
$('#wishBody').addEventListener('click', e => {
  if (e.target.closest('[data-close-shop]')) { closeLayer(); $('#shop').scrollIntoView(); return; }
  const line = e.target.closest('.line'); if (!line) return;
  const id = +line.dataset.id;
  if (e.target.closest('[data-w-rm]')) toggleWish(id);
  if (e.target.closest('[data-w-add]')) addToCart(id, 0, 1);
});

/* ---------------- Cart ---------------- */
const lineKey = l => l.id + ':' + l.c;
function addToCart(id, c = 0, q = 1, open = false) {
  const ex = state.cart.find(l => l.id === id && l.c === c);
  if (ex) {
    if (ex.q + q > MAX_QTY) { ex.q = MAX_QTY; toast(`Limit of ${MAX_QTY} per product`); }
    else { ex.q += q; toast(`${BY_ID[id].name} added`, 'View cart', openCart); }
  } else { state.cart.push({ id, c, q }); toast(`${BY_ID[id].name} added`, 'View cart', openCart); }
  saveCart(); updateBadges(); renderCart();
  const cb = $('#cartCount'); cb.classList.remove('bump'); void cb.offsetWidth; cb.classList.add('bump');
}
function totals() {
  const sub = state.cart.reduce((s, l) => s + BY_ID[l.id].price * l.q, 0);
  const rate = PROMOS[state.promo] || 0, disc = Math.round(sub * rate);
  const ship = !state.cart.length || sub - disc >= FREE_SHIP ? 0 : SHIP_FEE;
  return { sub, disc, ship, total: sub - disc + ship, rate };
}
function renderCart() {
  const body = $('#cartBody'), foot = $('#cartFoot'), meter = $('#shipMeter');
  if (!state.cart.length) {
    meter.innerHTML = '';
    body.innerHTML = `<div class="drawer-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 4h2.5l2 11h10l2-8H7"/><circle cx="9" cy="19.5" r="1.3"/><circle cx="17" cy="19.5" r="1.3"/></svg><h3>Your cart is empty</h3><p>Add a device and it will show up here.</p><button class="btn btn-primary" data-close-shop>Start shopping</button></div>`;
    foot.innerHTML = ''; foot.hidden = true; return;
  }
  foot.hidden = false;
  const t = totals(), after = t.sub - t.disc, left = FREE_SHIP - after;
  meter.innerHTML = left > 0
    ? `Add <strong>${money(left)}</strong> more for free delivery<div class="bar"><i style="width:${Math.min(100, after / FREE_SHIP * 100)}%"></i></div>`
    : `You've unlocked <strong>free delivery</strong><div class="bar"><i style="width:100%"></i></div>`;
  body.innerHTML = state.cart.map(l => {
    const p = BY_ID[l.id], col = p.colors[l.c];
    return `<div class="line" data-k="${lineKey(l)}"><div class="thumb">${productMedia(p, 'thumb-img')}</div>
      <div><h4>${p.name}</h4><small>${col.n}</small>
        <div class="qty"><button data-d="-1" aria-label="Decrease quantity of ${p.name}">−</button><output>${l.q}</output><button data-d="1" aria-label="Increase quantity of ${p.name}">+</button></div></div>
      <div class="right"><b>${money(p.price * l.q)}</b><button class="rm" data-rm>Remove</button></div></div>`;
  }).join('');
  foot.innerHTML = `
    <form class="promo" id="promoForm"><label class="sr" for="promoInput">Promo code</label><input id="promoInput" placeholder="Promo code" value="${state.promo}" autocomplete="off"><button class="btn btn-ghost" type="submit">Apply</button></form>
    <p class="promo-msg" id="promoMsg" role="status">${state.promo && PROMOS[state.promo] ? `<span style="color:var(--ok)">${state.promo} applied: ${Math.round(PROMOS[state.promo] * 100)}% off</span>` : ''}</p>
    <div class="sum"><span>Subtotal</span><span>${money(t.sub)}</span></div>
    ${t.disc ? `<div class="sum"><span>Discount</span><span class="disc">−${money(t.disc)}</span></div>` : ''}
    <div class="sum"><span>Delivery</span><span>${t.ship ? money(t.ship) : 'Free'}</span></div>
    <div class="sum total"><span>Total</span><span>${money(t.total)}</span></div>
    <button class="btn btn-primary full" id="checkoutBtn">Checkout</button>`;
}
$('#cartBody').addEventListener('click', e => {
  if (e.target.closest('[data-close-shop]')) { closeLayer(); $('#shop').scrollIntoView(); return; }
  const row = e.target.closest('.line'); if (!row) return;
  const l = state.cart.find(x => lineKey(x) === row.dataset.k); if (!l) return;
  const dBtn = e.target.closest('[data-d]');
  if (dBtn) {
    const n = l.q + +dBtn.dataset.d;
    if (n < 1) removeLine(l); else if (n > MAX_QTY) toast(`Limit of ${MAX_QTY} per product`); else l.q = n;
  }
  if (e.target.closest('[data-rm]')) removeLine(l);
  saveCart(); updateBadges(); renderCart();
});
function removeLine(l) {
  const idx = state.cart.indexOf(l), copy = { ...l };
  state.cart.splice(idx, 1);
  toast(`${BY_ID[l.id].name} removed`, 'Undo', () => { state.cart.splice(idx, 0, copy); saveCart(); updateBadges(); renderCart(); });
}
$('#cartFoot').addEventListener('submit', e => {
  if (e.target.id !== 'promoForm') return;
  e.preventDefault();
  const code = $('#promoInput').value.trim().toUpperCase();
  if (PROMOS[code]) { state.promo = code; saveCart(); renderCart(); }
  else { $('#promoMsg').innerHTML = `<span style="color:var(--sale)">${code ? 'That code isn\'t valid. Check the spelling and try again.' : 'Enter a promo code first.'}</span>`; }
});
$('#cartFoot').addEventListener('click', e => { if (e.target.id === 'checkoutBtn') openCheckout(); });
function openCart() { renderCart(); openLayer($('#cartDrawer')); }
function openWish() { renderWish(); openLayer($('#wishDrawer')); }
function updateBadges() {
  const n = state.cart.reduce((s, l) => s + l.q, 0), w = state.wish.length;
  const cc = $('#cartCount'), wc = $('#wishCount');
  cc.textContent = n; cc.hidden = !n; wc.textContent = w; wc.hidden = !w;
  $('#cartBtn').setAttribute('aria-label', `Open cart, ${n} ${n === 1 ? 'item' : 'items'}`);
  $('#wishBtn').setAttribute('aria-label', `Open wishlist, ${w} ${w === 1 ? 'item' : 'items'}`);
  const dwc = $('#dropWishCount'), dcc = $('#dropCartCount');
  if (dwc) dwc.textContent = w;
  if (dcc) dcc.textContent = n;
}

/* ---------------- Checkout ---------------- */
const FIELDS = [
  ['name', 'Full name', 'text', 'name', v => v.trim().length >= 2 || 'Enter your full name.'],
  ['email', 'Email', 'email', 'email', v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) || 'Enter a valid email, like you@example.com.'],
  ['phone', 'Mobile number', 'tel', 'tel', v => /^[6-9]\d{9}$/.test(v.replace(/\s/g, '')) || 'Enter a 10-digit mobile number.'],
  ['pin', 'PIN code', 'text', 'postal-code', v => /^\d{6}$/.test(v) || 'Enter a 6-digit PIN code.'],
  ['address', 'Delivery address', 'text', 'street-address', v => v.trim().length >= 8 || 'Enter your house number, street and area.', true],
  ['city', 'City', 'text', 'address-level2', v => v.trim().length >= 2 || 'Enter your city.']
];
function openCheckout() {
  if (!state.cart.length) return;
  const t = totals();
  const authPrompt = !state.user ? `
    <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 14px;border-radius:12px;background:rgba(45,104,255,.08);border:1px solid rgba(45,104,255,.2);margin-bottom:18px;font-size:13.5px">
      <span>Have a TechNova account?</span>
      <button type="button" id="coAuthPrompt" class="btn btn-ghost" style="padding:5px 12px;font-size:12px">Log In to Autofill</button>
    </div>` : '';

  $('#coCard').innerHTML = `<button class="icon-btn modal-close" data-close aria-label="Close checkout"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg></button>
    <h2 id="coTitle">Checkout</h2><p>${state.cart.reduce((s, l) => s + l.q, 0)} items · ${money(t.total)} total</p>
    ${authPrompt}
    <form id="coForm" novalidate><div class="co-grid">
      ${FIELDS.map(f => `<div class="field${f[5] ? ' span' : ''}" data-f="${f[0]}"><label for="f_${f[0]}">${f[1]}</label><input id="f_${f[0]}" name="${f[0]}" type="${f[2]}" autocomplete="${f[3]}" ${f[0] === 'name' ? 'data-autofocus' : ''} aria-describedby="e_${f[0]}"><span class="err" id="e_${f[0]}" role="alert"></span></div>`).join('')}
      <fieldset class="field span" style="border:0"><legend style="font-size:14px;color:var(--text2);margin-bottom:6px">Payment method</legend>
        <div class="pay"><label><input type="radio" name="pay" value="UPI" checked><span>UPI</span></label><label><input type="radio" name="pay" value="Card"><span>Card</span></label><label><input type="radio" name="pay" value="Cash on delivery"><span>Cash on delivery</span></label></div></fieldset>
    </div>
    <div class="co-foot"><p class="note">This is a demo store. No payment is taken and nothing is shipped.</p><button class="btn btn-primary" type="submit">Place order · ${money(t.total)}</button></div></form>`;
  $$('[data-close]', $('#coCard')).forEach(b => b.addEventListener('click', () => closeLayer()));

  const coPrompt = $('#coAuthPrompt');
  if (coPrompt) coPrompt.addEventListener('click', () => openAuthModal('login'));

  // Autofill if logged in
  if (state.user) {
    if (state.user.name && $('#f_name')) $('#f_name').value = state.user.name;
    if (state.user.email && $('#f_email')) $('#f_email').value = state.user.email;
    if (state.user.phone && $('#f_phone')) $('#f_phone').value = state.user.phone;
  }

  const form = $('#coForm');
  const check = (f, show = true) => {
    const input = $('#f_' + f[0]), res = f[4](input.value), box = input.closest('.field');
    box.classList.toggle('bad', res !== true && show);
    $('#e_' + f[0]).textContent = res !== true && show ? res : '';
    input.setAttribute('aria-invalid', String(res !== true && show));
    return res === true;
  };
  FIELDS.forEach(f => { const i = $('#f_' + f[0]); i.addEventListener('blur', () => i.value && check(f)); i.addEventListener('input', () => i.closest('.field').classList.contains('bad') && check(f)); });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const results = FIELDS.map(f => [f, check(f)]), bad = results.find(r => !r[1]);
    if (bad) { $('#f_' + bad[0][0]).focus(); return; }
    placeOrder(new FormData(form).get('pay'), t);
  });
  openLayer($('#checkoutModal'));
}
function placeOrder(pay, t) {
  const oid = 'TN-' + Date.now().toString(36).toUpperCase().slice(-6) + Math.floor(Math.random() * 90 + 10);
  const email = $('#f_email').value.trim();
  $('#coCard').innerHTML = `<div class="done"><div class="tick"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12l5 5L20 6"/></svg></div>
    <h2 id="coTitle">Order placed</h2><p>Thanks! We've sent a confirmation to <strong>${email.replace(/</g, '&lt;')}</strong>. Your order will arrive in about two days.</p>
    <span class="oid">${oid}</span><p style="font-size:14px">${money(t.total)} · ${pay}</p>
    <div style="margin-top:22px"><button class="btn btn-primary" data-done data-autofocus>Continue shopping</button></div></div>`;
  $('[data-done]').addEventListener('click', () => { closeLayer(); $('#shop').scrollIntoView(); });
  state.cart = []; state.promo = ''; saveCart(); updateBadges(); renderCart();
}

/* ---------------- Search ---------------- */
const searchBox = $('#search'), searchInput = $('#searchInput'), suggestEl = $('#suggest');
let sugIdx = -1;
function openSearch() { searchBox.classList.add('open'); searchInput.focus(); searchInput.select(); }
function hideSuggest() { suggestEl.hidden = true; searchInput.setAttribute('aria-expanded', 'false'); sugIdx = -1; }
function showSuggest() {
  const q = searchInput.value.trim().toLowerCase();
  if (!q) return hideSuggest();
  const hits = PRODUCTS.filter(p => `${p.name} ${p.brand} ${catLabel(p.cat)}`.toLowerCase().includes(q)).slice(0, 5);
  suggestEl.innerHTML = hits.length
    ? hits.map((p, i) => `<li role="option" data-id="${p.id}" id="sg${i}"><span class="thumb">${productMedia(p, 'thumb-img')}</span><span><strong>${p.name}</strong><small>${catLabel(p.cat)} · ${money(p.price)}</small></span></li>`).join('')
    : `<li class="none" role="option">No products match "${q.replace(/[<>&]/g, '')}". Try a brand or category.</li>`;
  suggestEl.hidden = false; searchInput.setAttribute('aria-expanded', 'true'); sugIdx = -1;
}
const applySearch = debounce(() => { state.q = searchInput.value; if (state.q) state.cat = 'all'; renderGrid(); }, 160);
searchInput.addEventListener('input', () => { showSuggest(); applySearch(); });
searchInput.addEventListener('focus', showSuggest);
searchInput.addEventListener('keydown', e => {
  const items = $$('li[data-id]', suggestEl);
  if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
    if (!items.length) return; e.preventDefault();
    sugIdx = (sugIdx + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length;
    items.forEach((li, i) => li.setAttribute('aria-selected', String(i === sugIdx)));
  } else if (e.key === 'Enter') {
    e.preventDefault();
    if (sugIdx > -1 && items[sugIdx]) { hideSuggest(); openQuick(+items[sugIdx].dataset.id); }
    else { state.q = searchInput.value; if (state.q) state.cat = 'all'; renderGrid(); hideSuggest(); $('#shop').scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }); }
  }
});
suggestEl.addEventListener('mousedown', e => { const li = e.target.closest('li[data-id]'); if (li) { e.preventDefault(); hideSuggest(); openQuick(+li.dataset.id); } });
document.addEventListener('click', e => { if (!searchBox.contains(e.target) && !e.target.closest('#searchBtn')) hideSuggest(); });

/* ---------------- Mobile UI ---------------- */
function closeMobileUI() {
  $('#mainNav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false');
}
$('#menuBtn').addEventListener('click', () => {
  const open = $('#mainNav').classList.toggle('open');
  $('#menuBtn').setAttribute('aria-expanded', String(open));
});
$('#searchBtn').addEventListener('click', () => { searchBox.classList.contains('open') ? searchBox.classList.remove('open') : openSearch(); });
$$('#mainNav a').forEach(a => a.addEventListener('click', closeMobileUI));
$('#filterToggle').addEventListener('click', e => {
  const open = $('#filters').classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', String(open));
});

/* ---------------- Wiring ---------------- */
$('#grid').addEventListener('click', e => {
  const card = e.target.closest('.card'); if (!card) return;
  const act = e.target.closest('[data-act]'); if (!act) return;
  e.preventDefault();
  const id = +card.dataset.id;
  if (act.dataset.act === 'quick') openQuick(id);
  if (act.dataset.act === 'add') addToCart(id, 0, 1);
  if (act.dataset.act === 'wish') toggleWish(id);
});
document.addEventListener('click', e => {
  const c = e.target.closest('#catRail [data-cat], #footCats [data-cat]');
  if (c) goCategory(c.dataset.cat);
});
$('#chips').addEventListener('click', e => { const c = e.target.closest('.chip'); if (c) { state.cat = c.dataset.cat; renderGrid(); } });
$('#sort').addEventListener('change', e => { state.sort = e.target.value; renderGrid(); });
$('#brandList').addEventListener('change', e => {
  e.target.checked ? state.brands.add(e.target.value) : state.brands.delete(e.target.value); renderGrid();
});
$('#priceRange').addEventListener('input', e => { state.max = +e.target.value; $('#priceVal').textContent = money(state.max); renderGrid(); });
$('#ratingList').addEventListener('change', e => { state.rating = +e.target.value; renderGrid(); });
$('#saleOnly').addEventListener('change', e => { state.sale = e.target.checked; renderGrid(); });
$('#resetFilters').addEventListener('click', resetFilters);
$('#emptyReset').addEventListener('click', resetFilters);
$('#cartBtn').addEventListener('click', openCart);
$('#wishBtn').addEventListener('click', openWish);

$('#newsForm').addEventListener('submit', e => {
  e.preventDefault();
  const v = $('#newsEmail').value.trim(), m = $('#newsMsg');
  if (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) { m.className = 'form-msg ok'; m.textContent = 'Subscribed. Your first email arrives this week.'; $('#newsEmail').value = ''; }
  else { m.className = 'form-msg err'; m.textContent = 'Enter a valid email, like you@example.com.'; }
});

/* Header shadow + active nav */
const header = $('#siteHeader');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 8), { passive: true });
if ('IntersectionObserver' in window) {
  const links = $$('[data-nav]');
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id)); });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['shop', 'categories', 'deal', 'why', 'reviews'].forEach(id => io.observe($('#' + id)));
}

/* ---------------- Theme (Light / Dark mode) ---------------- */
function applyTheme(t) {
  document.documentElement.setAttribute('data-theme', t);
  document.body.setAttribute('data-theme', t);
  store.set('theme', t);
  const metaTheme = $('meta[name="theme-color"]');
  if (metaTheme) metaTheme.setAttribute('content', t === 'light' ? '#F8FAFC' : '#070A12');
  const btn = $('#themeBtn');
  if (btn) {
    const next = t === 'light' ? 'dark' : 'light';
    btn.setAttribute('aria-label', `Switch to ${next} mode`);
    btn.setAttribute('title', `Switch to ${next} mode`);
  }
}

function initTheme() {
  const saved = store.get('theme', null);
  const prefersLight = window.matchMedia && matchMedia('(prefers-color-scheme: light)').matches;
  const current = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(current);
  const btn = $('#themeBtn');
  if (btn) {
    btn.addEventListener('click', () => {
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';
      const next = isLight ? 'dark' : 'light';
      applyTheme(next);
      toast(`Switched to ${next} mode`);
    });
  }
  if (window.matchMedia) {
    matchMedia('(prefers-color-scheme: light)').addEventListener('change', e => {
      if (!store.get('theme', null)) {
        applyTheme(e.matches ? 'light' : 'dark');
      }
    });
  }
}

/* ---------------- Digital Preloader (3s Electronic HUD Boot) ---------------- */
function initPreloader() {
  const preloader = $('#preloader');
  if (!preloader) return;

  const bar = $('#loaderBar');
  const percent = $('#loaderPercent');
  const status = $('#loaderStatus');
  const timer = $('#loaderTimer');
  const clock = $('#telClock');

  const DURATION = 3000; // 3 seconds exactly
  const startTime = performance.now();

  const PHASES = [
    { p: 0.18, text: 'INITIALIZING HARDWARE ENCLAVE...', clock: '3.60 GHz' },
    { p: 0.40, text: 'CALIBRATING QUANTUM DISPLAY BUS...', clock: '4.20 GHz' },
    { p: 0.65, text: 'MOUNTING TECHNOVA INVENTORY (27/27)...', clock: '4.85 GHz' },
    { p: 0.88, text: 'ENCRYPTING UPI & INR PAYMENT MESH...', clock: '5.10 GHz' },
    { p: 1.00, text: 'TECHNOVA READY // ENTERING SYSTEM', clock: '5.20 GHz' }
  ];

  document.body.classList.add('preloading');

  function tick(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / DURATION);

    // Update progress bar & percent
    const pct = Math.floor(progress * 100);
    if (bar) bar.style.width = `${pct}%`;
    if (percent) percent.textContent = `${pct < 10 ? '0' : ''}${pct}%`;
    preloader.setAttribute('aria-valuenow', pct);

    // Update timer readout
    const currentSec = (Math.min(DURATION, elapsed) / 1000).toFixed(2);
    if (timer) timer.textContent = `${currentSec}s / 3.00s`;

    // Update diagnostic phase status
    const phase = PHASES.find(ph => progress <= ph.p) || PHASES[PHASES.length - 1];
    if (status && status.textContent !== phase.text) {
      status.textContent = phase.text;
    }
    if (clock && clock.textContent !== phase.clock) {
      clock.textContent = phase.clock;
    }

    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      if (bar) bar.style.width = '100%';
      if (percent) percent.textContent = '100%';
      if (status) status.textContent = 'TECHNOVA ONLINE // WELCOME';
      if (timer) timer.textContent = '3.00s / 3.00s';

      setTimeout(() => {
        preloader.classList.add('fade-out');
        document.body.classList.remove('preloading');
        playHeroVideo();
        setTimeout(() => {
          preloader.remove();
        }, 650);
      }, 180);
    }
  }

  requestAnimationFrame(tick);
}

function playHeroVideo() {
  const vid = $('#heroBgVideo');
  const badge = $('#heroVideoBadge');
  if (!vid) return;

  vid.muted = true;
  vid.playsInline = true;

  const onPlaying = () => {
    vid.classList.add('playing');
    if (badge) badge.classList.add('show');
  };

  const playPromise = vid.play();
  if (playPromise !== undefined) {
    playPromise
      .then(() => {
        onPlaying();
      })
      .catch(() => {
        // Fallback: show poster gracefully and retry on first user interaction
        vid.classList.add('playing');
        if (badge) badge.classList.add('show');
        const retryPlay = () => {
          vid.play().then(() => onPlaying()).catch(() => {});
        };
        window.addEventListener('pointerdown', retryPlay, { once: true });
        window.addEventListener('scroll', retryPlay, { once: true });
      });
  } else {
    onPlaying();
  }
}

/* ---------------- Authentication & User Profile ---------------- */
function renderAuth() {
  const loggedOut = $('#authLoggedOut');
  const loggedIn = $('#authLoggedIn');
  const mobileNav = $('#navAuthMobile');
  const footBtn = $('#footAuthBtn');

  if (state.user) {
    if (loggedOut) loggedOut.hidden = true;
    if (loggedIn) loggedIn.hidden = false;

    const initial = (state.user.name || 'U').charAt(0).toUpperCase();
    const firstName = (state.user.name || 'Account').split(' ')[0];

    const av = $('#userAvatar'), nl = $('#userNameLabel');
    if (av) av.textContent = initial;
    if (nl) nl.textContent = firstName;

    const du = $('#dropUserName'), de = $('#dropUserEmail');
    if (du) du.textContent = state.user.name || 'TechNova Member';
    if (de) de.textContent = state.user.email || 'user@technova.in';

    if (footBtn) footBtn.textContent = `My Account (${firstName})`;

    if (mobileNav) {
      mobileNav.innerHTML = `
        <div class="mobile-user-card">
          <div class="avatar-lg">${initial}</div>
          <div class="info">
            <strong>${state.user.name}</strong>
            <small>${state.user.email}</small>
          </div>
          <button class="btn-logout" id="mobileLogoutBtn" type="button">Sign Out</button>
        </div>`;
      const mOut = $('#mobileLogoutBtn');
      if (mOut) mOut.addEventListener('click', () => { closeMobileUI(); logoutUser(); });
    }
  } else {
    if (loggedOut) loggedOut.hidden = false;
    if (loggedIn) loggedIn.hidden = true;
    if (footBtn) footBtn.textContent = 'Account / Sign In';

    if (mobileNav) {
      mobileNav.innerHTML = `
        <div class="auth-mobile-row">
          <button class="btn btn-ghost" id="mobileLoginBtn" type="button">Log In</button>
          <button class="btn btn-primary" id="mobileSignupBtn" type="button">Sign Up</button>
        </div>
        <button class="auth-demo-btn" id="mobileDemoBtn" type="button">
          <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>
          Quick Demo Login
        </button>`;
      const ml = $('#mobileLoginBtn'), ms = $('#mobileSignupBtn'), md = $('#mobileDemoBtn');
      if (ml) ml.addEventListener('click', () => { closeMobileUI(); openAuthModal('login'); });
      if (ms) ms.addEventListener('click', () => { closeMobileUI(); openAuthModal('signup'); });
      if (md) md.addEventListener('click', () => { closeMobileUI(); loginDemoUser(); });
    }
  }
}

function toggleUserMenu() {
  const drop = $('#userDropdown');
  const btn = $('#userMenuBtn');
  if (!drop || !btn) return;
  const isHidden = drop.hidden;
  drop.hidden = !isHidden;
  btn.setAttribute('aria-expanded', String(isHidden));
}

function closeUserMenu() {
  const drop = $('#userDropdown');
  const btn = $('#userMenuBtn');
  if (drop) drop.hidden = true;
  if (btn) btn.setAttribute('aria-expanded', 'false');
}

function logoutUser() {
  state.user = null;
  saveUser();
  renderAuth();
  closeUserMenu();
  toast('You have been signed out.');
}

function loginDemoUser() {
  state.user = {
    name: 'Shiva Sharma',
    email: 'shiva@technova.in',
    phone: '9876543210',
    joined: '2026',
    role: 'Verified Member'
  };
  saveUser();
  renderAuth();
  closeLayer();
  closeUserMenu();
  toast('Welcome back, Shiva!');
}

function openAuthModal(tab = 'login') {
  const card = $('#authCard');
  if (!card) return;

  function renderModalContent(activeTab) {
    const isLogin = activeTab === 'login';
    card.innerHTML = `
      <button class="icon-btn modal-close" data-close aria-label="Close dialog">
        <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>

      <div class="auth-top-readout">
        <span class="auth-tag"><span class="auth-tag-dot"></span>TECHNOVA_AUTH // SHA-256</span>
        <span>SECURE GATEWAY</span>
      </div>

      <div class="auth-header">
        <h2 id="authTitle">${isLogin ? 'Welcome Back' : 'Create an Account'}</h2>
        <p>${isLogin ? 'Access your orders, wishlist, and personalized tech feeds.' : 'Join TechNova to unlock member pricing and priority shipping.'}</p>
      </div>

      <div class="auth-tabs" role="tablist">
        <button class="auth-tab ${isLogin ? 'active' : ''}" id="tabLogin" type="button" role="tab" aria-selected="${isLogin}">Log In</button>
        <button class="auth-tab ${!isLogin ? 'active' : ''}" id="tabSignup" type="button" role="tab" aria-selected="${!isLogin}">Create Account</button>
      </div>

      <!-- Quick 1-Click Demo Login -->
      <button class="auth-demo-btn" id="modalDemoBtn" type="button">
        <svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor"/></svg>
        <span>Instant Demo Login (Shiva)</span>
      </button>

      <!-- Google Social Login -->
      <button class="auth-google-btn" id="googleBtn" type="button">
        <svg viewBox="0 0 24 24">
          <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.14z"/>
          <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"/>
          <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"/>
          <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"/>
        </svg>
        <span>Continue with Google</span>
      </button>

      <div class="auth-divider"><span>or with email</span></div>

      <div class="auth-error-msg" id="authErrorMsg">
        <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        <span id="authErrorText"></span>
      </div>

      ${isLogin ? `
      <!-- Log In Form -->
      <form class="auth-form" id="loginForm" novalidate>
        <div class="auth-field">
          <label for="authEmail">Email address</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input class="auth-input" id="authEmail" type="email" placeholder="you@example.com" autocomplete="email" required>
          </div>
        </div>

        <div class="auth-field">
          <label for="authPass">Password</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input class="auth-input" id="authPass" type="password" placeholder="••••••••" autocomplete="current-password" required>
            <button class="toggle-pw-btn" type="button" id="togglePwBtn" aria-label="Toggle password visibility">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
        </div>

        <div class="auth-row">
          <label class="auth-checkbox-label">
            <input type="checkbox" id="authRemember" checked>
            <span>Remember me</span>
          </label>
          <button class="auth-forgot-link" type="button" id="forgotPassBtn">Forgot password?</button>
        </div>

        <button class="auth-submit-btn" type="submit">Sign In to TechNova</button>

        <div class="auth-foot-note">
          Don't have an account? <button type="button" id="switchSignup">Create one free</button>
        </div>
      </form>
      ` : `
      <!-- Sign Up Form -->
      <form class="auth-form" id="signupForm" novalidate>
        <div class="auth-field">
          <label for="regName">Full name</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <input class="auth-input" id="regName" type="text" placeholder="e.g. Shiva Sharma" autocomplete="name" required>
          </div>
        </div>

        <div class="auth-field">
          <label for="regEmail">Email address</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            <input class="auth-input" id="regEmail" type="email" placeholder="you@example.com" autocomplete="email" required>
          </div>
        </div>

        <div class="auth-field">
          <label for="regPhone">Mobile number (optional)</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
            <input class="auth-input" id="regPhone" type="tel" placeholder="10-digit mobile" autocomplete="tel">
          </div>
        </div>

        <div class="auth-field">
          <label for="regPass">Create password</label>
          <div class="auth-input-wrap">
            <svg class="field-icon" viewBox="0 0 24 24"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <input class="auth-input" id="regPass" type="password" placeholder="At least 6 characters" autocomplete="new-password" required>
            <button class="toggle-pw-btn" type="button" id="togglePwBtn" aria-label="Toggle password visibility">
              <svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
            </button>
          </div>
          <div class="pw-strength" id="pwStrength">
            <div class="pw-strength-bars">
              <span class="pw-strength-bar" id="psb1"></span>
              <span class="pw-strength-bar" id="psb2"></span>
              <span class="pw-strength-bar" id="psb3"></span>
              <span class="pw-strength-bar" id="psb4"></span>
            </div>
            <span class="pw-strength-label" id="psLabel">Password strength</span>
          </div>
        </div>

        <div class="auth-row">
          <label class="auth-checkbox-label">
            <input type="checkbox" id="regTerms" checked required>
            <span>I agree to TechNova's Terms & Privacy Policy</span>
          </label>
        </div>

        <button class="auth-submit-btn" type="submit">Create TechNova Account</button>

        <div class="auth-foot-note">
          Already have an account? <button type="button" id="switchLogin">Sign In</button>
        </div>
      </form>
      `}
    `;

    // Hook close buttons
    $$('[data-close]', card).forEach(b => b.addEventListener('click', () => closeLayer()));

    // Hook tab switches
    const tabL = $('#tabLogin'), tabS = $('#tabSignup');
    if (tabL) tabL.addEventListener('click', () => renderModalContent('login'));
    if (tabS) tabS.addEventListener('click', () => renderModalContent('signup'));

    const swL = $('#switchLogin'), swS = $('#switchSignup');
    if (swL) swL.addEventListener('click', () => renderModalContent('login'));
    if (swS) swS.addEventListener('click', () => renderModalContent('signup'));

    // Hook demo login button
    const demoB = $('#modalDemoBtn');
    if (demoB) demoB.addEventListener('click', loginDemoUser);

    // Hook Google button
    const gBtn = $('#googleBtn');
    if (gBtn) {
      gBtn.addEventListener('click', () => {
        state.user = {
          name: 'Shiva Sharma',
          email: 'shiva.sharma@gmail.com',
          phone: '9876543210',
          role: 'Verified Member'
        };
        saveUser();
        renderAuth();
        closeLayer();
        toast('Signed in with Google! Welcome back, Shiva.');
      });
    }

    // Toggle password eye
    const toggleBtn = $('#togglePwBtn');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        const input = isLogin ? $('#authPass') : $('#regPass');
        if (!input) return;
        const isPass = input.type === 'password';
        input.type = isPass ? 'text' : 'password';
        toggleBtn.innerHTML = isPass
          ? `<svg viewBox="0 0 24 24"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`
          : `<svg viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>`;
      });
    }

    // Password strength meter
    if (!isLogin) {
      const regPassInput = $('#regPass');
      if (regPassInput) {
        regPassInput.addEventListener('input', () => {
          const val = regPassInput.value;
          let score = 0;
          if (val.length >= 6) score++;
          if (val.length >= 10) score++;
          if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
          if (/[^A-Za-z0-9]/.test(val)) score++;

          const b1 = $('#psb1'), b2 = $('#psb2'), b3 = $('#psb3'), b4 = $('#psb4');
          const psLabel = $('#psLabel');
          [b1, b2, b3, b4].forEach(b => { if (b) b.className = 'pw-strength-bar'; });

          if (!val) {
            if (psLabel) psLabel.textContent = 'Password strength';
            return;
          }

          if (score <= 1) {
            if (b1) b1.classList.add('weak');
            if (psLabel) psLabel.textContent = 'Weak password';
          } else if (score === 2) {
            if (b1) b1.classList.add('medium');
            if (b2) b2.classList.add('medium');
            if (psLabel) psLabel.textContent = 'Fair password';
          } else if (score === 3) {
            if (b1) b1.classList.add('good');
            if (b2) b2.classList.add('good');
            if (b3) b3.classList.add('good');
            if (psLabel) psLabel.textContent = 'Good password';
          } else {
            [b1, b2, b3, b4].forEach(b => b.classList.add('strong'));
            if (psLabel) psLabel.textContent = 'Strong password';
          }
        });
      }
    }

    // Forgot password button
    const forgotBtn = $('#forgotPassBtn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        const email = ($('#authEmail')?.value || '').trim();
        if (email && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
          toast(`Password reset instructions sent to ${email}`);
        } else {
          toast('Enter your email address above to receive reset instructions');
          $('#authEmail')?.focus();
        }
      });
    }

    // Form submission
    const showError = (msg) => {
      const errBox = $('#authErrorMsg'), errTxt = $('#authErrorText');
      if (errBox && errTxt) {
        errTxt.textContent = msg;
        errBox.classList.add('show');
      }
    };

    if (isLogin) {
      const loginForm = $('#loginForm');
      if (loginForm) {
        loginForm.addEventListener('submit', e => {
          e.preventDefault();
          const email = $('#authEmail').value.trim();
          const pass = $('#authPass').value;

          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showError('Please enter a valid email address.');
            $('#authEmail').focus();
            return;
          }
          if (pass.length < 6) {
            showError('Password must be at least 6 characters.');
            $('#authPass').focus();
            return;
          }

          const username = email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          state.user = {
            name: username,
            email: email,
            phone: '9876543210',
            role: 'Verified Member'
          };
          saveUser();
          renderAuth();
          closeLayer();
          toast(`Welcome back, ${username}!`);
        });
      }
    } else {
      const signupForm = $('#signupForm');
      if (signupForm) {
        signupForm.addEventListener('submit', e => {
          e.preventDefault();
          const name = $('#regName').value.trim();
          const email = $('#regEmail').value.trim();
          const phone = $('#regPhone').value.trim();
          const pass = $('#regPass').value;
          const terms = $('#regTerms').checked;

          if (name.length < 2) {
            showError('Please enter your full name.');
            $('#regName').focus();
            return;
          }
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
            showError('Please enter a valid email address.');
            $('#regEmail').focus();
            return;
          }
          if (pass.length < 6) {
            showError('Password must be at least 6 characters.');
            $('#regPass').focus();
            return;
          }
          if (!terms) {
            showError('You must agree to the Terms & Privacy Policy.');
            return;
          }

          state.user = {
            name: name,
            email: email,
            phone: phone || '9876543210',
            role: 'Verified Member'
          };
          saveUser();
          renderAuth();
          closeLayer();
          toast(`Account created! Welcome to TechNova, ${name}.`);
        });
      }
    }
  }

  renderModalContent(tab);
  openLayer($('#authModal'));
}

function initAuth() {
  renderAuth();

  const lBtn = $('#loginBtn');
  if (lBtn) lBtn.addEventListener('click', () => openAuthModal('login'));

  const sBtn = $('#signupBtn');
  if (sBtn) sBtn.addEventListener('click', () => openAuthModal('signup'));

  const mBtn = $('#authMobileBtn');
  if (mBtn) mBtn.addEventListener('click', () => {
    if (state.user) toggleUserMenu();
    else openAuthModal('login');
  });

  const uMenuBtn = $('#userMenuBtn');
  if (uMenuBtn) uMenuBtn.addEventListener('click', toggleUserMenu);

  const outBtn = $('#logoutBtn');
  if (outBtn) outBtn.addEventListener('click', logoutUser);

  const dWish = $('#dropWishBtn');
  if (dWish) dWish.addEventListener('click', () => { closeUserMenu(); openWish(); });

  const dCart = $('#dropCartBtn');
  if (dCart) dCart.addEventListener('click', () => { closeUserMenu(); openCart(); });

  const fAuth = $('#footAuthBtn');
  if (fAuth) fAuth.addEventListener('click', () => {
    if (state.user) openWish();
    else openAuthModal('login');
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('#authLoggedIn') && !e.target.closest('#authMobileBtn')) {
      closeUserMenu();
    }
  });
}

/* ---------------- Init ---------------- */
initPreloader();
initTheme();
initAuth();
renderChips(); renderRail(); renderFilters(); renderGrid(); renderDeal(); initStage();
updateBadges(); renderCart(); renderWish();
})();

