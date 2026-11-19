# Shashank-Portfolio

**The Digital Museum** — An interactive 3D architectural portfolio built with **Next.js 16**, **React 19**, **Three.js**, **GSAP**, and **Tailwind CSS v4**.

🌐 **Live Site (GitHub Pages):** https://shashankjha-2003.github.io/Shashank-Portfolio/

## Highlights
- **Interactive 3D Museum Exterior Intro**: Twilight travertine & bronze colonnade with live mirror reflecting pool, GLSL dusk sky, drag-to-orbit camera, swinging 3D glass entrance doors, and a live `3D Model` / `Video` toggle.
- **10 Architectural Galleries & 9 Corner Turns**: Walkable Three.js 3D museum (and toggleable Scroll View) featuring distinct room lighting, art shaders, interactive 360° drag-to-rotate 3D centerpiece bust, White-Wall Light Mode for Projects, live interactive project demos, Hobbies Atelier, dedicated Social Media Lounge (Room 07 + standalone `/socials` route), Zero-Gravity Floating Project Frontend Showroom (Room 08), and Exit Gallery (Room 09).

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Static Export (GitHub Pages)

```bash
GITHUB_PAGES=true npm run build
```

Pushing to `main` automatically builds and deploys the static export via [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml).
