const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

async function main() {
  const publicDir = path.join(__dirname, '..', 'public');
  const iconsDir = path.join(publicDir, 'icons');
  const imagesDir = path.join(publicDir, 'images');

  if (!fs.existsSync(iconsDir)) fs.mkdirSync(iconsDir, { recursive: true });
  if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true });

  // 1. GymFlow Logo SVG (Orange gradient lightning bolt + GymFlow SaaS branding)
  const logoSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="128" fill="#0A0A0B"/>
    <defs>
      <linearGradient id="brandGrad" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF6B00"/>
        <stop offset="0.5" stop-color="#FFA800"/>
        <stop offset="1" stop-color="#FF4500"/>
      </linearGradient>
      <filter id="glow" x="50" y="50" width="412" height="412" filterUnits="userSpaceOnUse">
        <feGaussianBlur stdDeviation="24" result="blur"/>
        <feComposite in="SourceGraphic" in2="blur" operator="over"/>
      </filter>
    </defs>
    <circle cx="256" cy="256" r="180" fill="url(#brandGrad)" opacity="0.15" filter="url(#glow)"/>
    <path d="M280 96L144 288H256L232 416L368 224H256L280 96Z" fill="url(#brandGrad)" stroke="#FFFFFF" stroke-width="8" stroke-linejoin="round"/>
  </svg>`;

  const logoWhiteSvg = `
  <svg width="512" height="512" viewBox="0 0 512 512" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="512" height="512" rx="128" fill="#121214"/>
    <defs>
      <linearGradient id="orangeGrad" x1="64" y1="64" x2="448" y2="448" gradientUnits="userSpaceOnUse">
        <stop stop-color="#FF6B00"/>
        <stop offset="1" stop-color="#FFA800"/>
      </linearGradient>
    </defs>
    <path d="M280 96L144 288H256L232 416L368 224H256L280 96Z" fill="url(#orangeGrad)" stroke="#FFFFFF" stroke-width="12" stroke-linejoin="round"/>
  </svg>`;

  const avatarSvg = `
  <svg width="256" height="256" viewBox="0 0 256 256" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="256" height="256" rx="128" fill="#1E1E24"/>
    <circle cx="128" cy="96" r="48" fill="#FF6B00"/>
    <path d="M48 224C48 179.817 83.8172 144 128 144C172.183 144 208 179.817 208 224" fill="#FF6B00" opacity="0.8"/>
  </svg>`;

  const buffer = Buffer.from(logoSvg);
  const whiteBuffer = Buffer.from(logoWhiteSvg);
  const avatarBuffer = Buffer.from(avatarSvg);

  // Generate public/logo.png & logo-white.png
  await sharp(buffer).resize(512, 512).png().toFile(path.join(publicDir, 'logo.png'));
  await sharp(whiteBuffer).resize(512, 512).png().toFile(path.join(publicDir, 'logo-white.png'));

  // Generate Favicons & Touch Icons
  await sharp(buffer).resize(16, 16).png().toFile(path.join(publicDir, 'favicon-16x16.png'));
  await sharp(buffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon-32x32.png'));
  await sharp(buffer).resize(32, 32).png().toFile(path.join(publicDir, 'favicon.ico'));
  await sharp(buffer).resize(180, 180).png().toFile(path.join(iconsDir, 'apple-touch-icon.png'));
  await sharp(buffer).resize(192, 192).png().toFile(path.join(iconsDir, 'icon-192x192.png'));
  await sharp(buffer).resize(512, 512).png().toFile(path.join(iconsDir, 'icon-512x512.png'));

  // Generate default avatar
  await sharp(avatarBuffer).resize(256, 256).png().toFile(path.join(imagesDir, 'default-avatar.png'));

  // Generate valid manifest.json
  const manifest = {
    name: "GymFlow SaaS - Next-Gen Gym Operating System",
    short_name: "GymFlow",
    description: "Cloud-native gym management, automated check-ins, fee recovery & POS.",
    start_url: "/",
    display: "standalone",
    background_color: "#0A0A0B",
    theme_color: "#FF6B00",
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable"
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable"
      }
    ]
  };

  fs.writeFileSync(path.join(publicDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

  console.log("Successfully generated all public image assets and manifest!");
}

main().catch(console.error);
