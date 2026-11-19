'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';
import { createSpotlightPoolTexture } from './museumTextures';

/** Procedural Warm Honed Travertine Ashlar Stone PBR Texture */
function createTravertinePBR() {
  const size = 512;
  const diffCanvas = document.createElement('canvas');
  diffCanvas.width = size;
  diffCanvas.height = size;
  const dCtx = diffCanvas.getContext('2d');

  const bumpCanvas = document.createElement('canvas');
  bumpCanvas.width = size;
  bumpCanvas.height = size;
  const bCtx = bumpCanvas.getContext('2d');

  if (dCtx && bCtx) {
    dCtx.fillStyle = '#c8b295';
    dCtx.fillRect(0, 0, size, size);
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, size, size);

    // Subtle horizontal limestone sedimentary bands
    for (let y = 0; y < size; y += 2) {
      const n = Math.sin(y * 0.14) * 8 + Math.cos(y * 0.41) * 5;
      const r = Math.min(255, Math.max(0, 198 + n));
      const g = Math.min(255, Math.max(0, 174 + n * 0.9));
      const b = Math.min(255, Math.max(0, 142 + n * 0.8));
      dCtx.fillStyle = `rgba(${r | 0},${g | 0},${b | 0},0.35)`;
      dCtx.fillRect(0, y, size, 2);
    }

    // Ashlar architectural stone block seams
    const rows = 8;
    const rowH = size / rows;
    for (let r = 0; r < rows; r++) {
      const y = r * rowH;
      const cols = 4;
      const colW = size / cols;
      const offset = (r % 2) * (colW * 0.5);

      for (let c = -1; c <= cols; c++) {
        const x = c * colW + offset;
        const shade = ((r * 17 + c * 31) % 19) - 9;
        dCtx.fillStyle = `rgba(${202 + shade},${178 + shade},${146 + shade},0.48)`;
        dCtx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);

        bCtx.fillStyle = `rgb(${132 + shade},${132 + shade},${132 + shade})`;
        bCtx.fillRect(x + 2, y + 2, colW - 4, rowH - 4);
      }

      // Mortar joints
      dCtx.fillStyle = 'rgba(78, 64, 48, 0.45)';
      dCtx.fillRect(0, y, size, 2);
      bCtx.fillStyle = '#383838';
      bCtx.fillRect(0, y, size, 2);
    }
  }

  const map = new THREE.CanvasTexture(diffCanvas);
  map.wrapS = map.wrapT = THREE.RepeatWrapping;
  map.colorSpace = THREE.SRGBColorSpace;
  map.repeat.set(3, 3);

  const bumpMap = new THREE.CanvasTexture(bumpCanvas);
  bumpMap.wrapS = bumpMap.wrapT = THREE.RepeatWrapping;
  bumpMap.repeat.set(3, 3);

  return { map, bumpMap };
}

/** Procedural Wet Dark Slate Plaza Tile Texture */
function createSlatePlazaTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#1b2029';
    ctx.fillRect(0, 0, size, size);
    const step = 64;
    for (let y = 0; y < size; y += step) {
      for (let x = 0; x < size; x += step) {
        const v = 24 + ((x * 7 + y * 13) % 14);
        ctx.fillStyle = `rgb(${v},${v + 5},${v + 12})`;
        ctx.fillRect(x + 2, y + 2, step - 4, step - 4);
      }
    }
    ctx.strokeStyle = 'rgba(8, 10, 14, 0.7)';
    ctx.lineWidth = 2;
    for (let i = 0; i <= size; i += step) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, size);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, i);
      ctx.lineTo(size, i);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.repeat.set(14, 14);
  return tex;
}

export default function MuseumExterior3D() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [enteringPortal, setEnteringPortal] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const trackedGeos: THREE.BufferGeometry[] = [];
    const trackedMats: THREE.Material[] = [];
    const trackedTexs: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      trackedGeos.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      trackedMats.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      trackedTexs.push(t);
      return t;
    };

    // -----------------------------------------------------------------------
    // 1. RENDERER, SCENE, PMREM IBL & HDR POST-PROCESSING
    // -----------------------------------------------------------------------
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x071022);
    scene.fog = new THREE.FogExp2(0x091326, 0.0085);

    const pmremGen = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGen.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmremGen.dispose();

    const camera = new THREE.PerspectiveCamera(44, width / height, 0.15, 320);
    camera.position.set(0, 4.1, 28.5);

    const rt = new THREE.WebGLRenderTarget(width, height, {
      samples: 4,
      type: THREE.HalfFloatType,
    });
    const composer = new EffectComposer(renderer, rt);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.42, 0.58, 0.84);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // -----------------------------------------------------------------------
    // 2. BLUE-HOUR TWILIGHT SKY DOME SHADER + TWINKLING STARS
    // -----------------------------------------------------------------------
    const skyUniforms = {
      uTime: { value: 0 },
    };
    const skyMat = trackMat(
      new THREE.ShaderMaterial({
        side: THREE.BackSide,
        depthWrite: false,
        uniforms: skyUniforms,
        vertexShader: `
          varying vec3 vWorldDir;
          void main() {
            vec4 wp = modelMatrix * vec4(position, 1.0);
            vWorldDir = normalize(position);
            gl_Position = projectionMatrix * viewMatrix * wp;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vWorldDir;

          float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
          }
          float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            vec2 u = f * f * (3.0 - 2.0 * f);
            return mix(
              mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), u.x),
              mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
              u.y
            );
          }
          float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            for (int i = 0; i < 4; i++) {
              v += a * noise(p);
              p *= 2.05;
              a *= 0.5;
            }
            return v;
          }

          void main() {
            vec3 d = normalize(vWorldDir);
            float h = clamp(d.y, 0.0, 1.0);

            // Deep midnight indigo zenith -> rich cobalt twilight -> warm dusk horizon
            vec3 zenith = vec3(0.025, 0.055, 0.145);
            vec3 midSky = vec3(0.075, 0.155, 0.335);
            vec3 horizon = vec3(0.18, 0.25, 0.42);
            vec3 col = mix(horizon, midSky, smoothstep(0.0, 0.28, h));
            col = mix(col, zenith, smoothstep(0.24, 0.78, h));

            // Warm golden-amber sunset glow along the right horizon (matching reference design)
            vec3 sunDir = normalize(vec3(0.72, 0.07, -0.68));
            float sunProx = max(0.0, dot(d, sunDir));
            float horizonBand = exp(-h * 7.5);
            vec3 sunsetAmber = vec3(0.96, 0.68, 0.42);
            vec3 sunsetRose = vec3(0.55, 0.36, 0.48);
            col += sunsetAmber * pow(sunProx, 4.0) * horizonBand * 0.95;
            col += sunsetRose * pow(sunProx, 1.8) * exp(-h * 4.0) * 0.32;

            // Soft drifting twilight clouds near mid-horizon
            if (d.y > 0.01) {
              vec2 cloudUV = d.xz / (d.y + 0.22) * 1.15 + vec2(uTime * 0.008, -uTime * 0.003);
              float c = fbm(cloudUV);
              float cloudMask = smoothstep(0.46, 0.76, c) * smoothstep(0.01, 0.12, d.y) * (1.0 - smoothstep(0.22, 0.58, d.y));
              vec3 cloudTint = mix(vec3(0.16, 0.22, 0.36), vec3(0.88, 0.66, 0.48), pow(sunProx, 2.2));
              col = mix(col, cloudTint, cloudMask * 0.55);
            }

            gl_FragColor = vec4(col, 1.0);
          }
        `,
      })
    );
    const skyDome = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(180, 48, 32)), skyMat);
    scene.add(skyDome);

    // 3D Starfield twinkling in the upper blue-hour sky
    const starCount = 420;
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(0.18 + Math.random() * 0.8);
      const r = 148;
      starPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      starPos[i * 3 + 1] = r * Math.cos(phi);
      starPos[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
    }
    const starGeo = trackGeo(new THREE.BufferGeometry());
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = trackMat(
      new THREE.PointsMaterial({ color: 0xe6f0ff, size: 0.72, transparent: true, opacity: 0.78, fog: false })
    );
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    // -----------------------------------------------------------------------
    // 3. ARCHITECTURAL PBR MATERIALS
    // -----------------------------------------------------------------------
    const travPBR = createTravertinePBR();
    trackTex(travPBR.map);
    trackTex(travPBR.bumpMap);
    const slateTex = trackTex(createSlatePlazaTexture());
    const goldPoolTex = trackTex(createSpotlightPoolTexture('#ffcf86'));

    const travertineMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: travPBR.map,
        bumpMap: travPBR.bumpMap,
        bumpScale: 0.045,
        color: 0xe7d4b8,
        roughness: 0.68,
        metalness: 0.05,
      })
    );

    const darkBronzeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x26221e,
        metalness: 0.88,
        roughness: 0.26,
        clearcoat: 0.5,
        clearcoatRoughness: 0.22,
      })
    );

    const columnBronzeMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x352e27,
        metalness: 0.85,
        roughness: 0.24,
        clearcoat: 0.55,
        clearcoatRoughness: 0.18,
      })
    );

    const brushedBrassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xdcc59b,
        metalness: 0.94,
        roughness: 0.2,
        clearcoat: 0.45,
      })
    );

    const darkGraniteMat = trackMat(
      new THREE.MeshStandardMaterial({
        map: slateTex,
        color: 0x3f4756,
        roughness: 0.34,
        metalness: 0.18,
      })
    );

    const podiumStoneMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x383f4d,
        roughness: 0.52,
        metalness: 0.12,
      })
    );

    const stairMarbleMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x9aa0aa,
        roughness: 0.42,
        metalness: 0.1,
      })
    );

    const warmInteriorWallMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfff0d4,
        emissive: 0xffc978,
        emissiveIntensity: 0.95,
        roughness: 0.45,
      })
    );

    const warmGlowStripMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0xfff4dd,
        emissive: 0xffcb78,
        emissiveIntensity: 2.2,
        roughness: 0.15,
      })
    );

    const warmWindowGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffe4b3,
        emissive: 0xffb85c,
        emissiveIntensity: 0.55,
        roughness: 0.08,
        metalness: 0.12,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.42,
      })
    );

    const cypressFoliageMat = trackMat(
      new THREE.MeshStandardMaterial({
        color: 0x0c1b14,
        roughness: 0.92,
        metalness: 0.02,
      })
    );

    // -----------------------------------------------------------------------
    // 4. GLOBAL TWILIGHT & ARCHITECTURAL MUSEUM LIGHTING
    // -----------------------------------------------------------------------
    scene.add(new THREE.AmbientLight(0x526b9c, 0.52));
    scene.add(new THREE.HemisphereLight(0x6d8ec9, 0x1a1410, 0.65));

    // Soft cool blue moonlight directional fill from upper-left sky
    const moonDir = new THREE.DirectionalLight(0x8bb4ff, 0.72);
    moonDir.position.set(-28, 34, 24);
    scene.add(moonDir);

    // Warm sunset horizon rim light from the right
    const sunsetRim = new THREE.DirectionalLight(0xffb878, 0.55);
    sunsetRim.position.set(42, 10, -24);
    scene.add(sunsetRim);

    // Warm interior atrium lights radiating golden glow out through the arched portal
    const atriumMainLight = new THREE.PointLight(0xffcf82, 42, 34, 1.35);
    atriumMainLight.position.set(0, 8.2, -6.4);
    scene.add(atriumMainLight);

    const atriumDoorLight = new THREE.PointLight(0xffd796, 26, 24, 1.4);
    atriumDoorLight.position.set(0, 4.4, -2.5);
    scene.add(atriumDoorLight);

    // Architectural warm facade uplights washing the travertine piers & colonnade
    [-14.5, -9.2, 9.2, 14.5].forEach((ux) => {
      const uplight = new THREE.PointLight(0xffc36e, 14, 18, 1.45);
      uplight.position.set(ux, 4.0, -3.5);
      scene.add(uplight);
    });
    [-18.8, 18.8].forEach((wx) => {
      const wingLight = new THREE.PointLight(0xffbe68, 11, 16, 1.5);
      wingLight.position.set(wx, 4.2, -5.8);
      scene.add(wingLight);
    });

    // -----------------------------------------------------------------------
    // 5. COURTYARD PLAZA + LIVE MIRROR REFLECTING POOL WITH ANIMATED RIPPLES
    // -----------------------------------------------------------------------
    const ground = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(180, 140)), darkGraniteMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.set(0, 0, 8);
    scene.add(ground);

    // Real-Time Live Mirror Reflector for the Black Granite Reflecting Pool!
    const poolW = 24.4;
    const poolD = 27.5;
    const poolCenterZ = 17.6;
    const poolReflector = new Reflector(trackGeo(new THREE.PlaneGeometry(poolW, poolD)), {
      clipBias: 0.004,
      textureWidth: 1024,
      textureHeight: 1024,
      color: 0x9aa4b5,
    });
    poolReflector.rotation.x = -Math.PI / 2;
    poolReflector.position.set(0, 0.015, poolCenterZ);
    scene.add(poolReflector);

    // Translucent Animated Water Ripple Specular Glaze over the live mirror Reflector
    const waterUniforms = {
      uTime: { value: 0 },
    };
    const waterRippleMat = trackMat(
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        uniforms: waterUniforms,
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec2 vUv;
          void main() {
            // Subtle capillary water ripples catching warm golden entrance reflection
            float w1 = sin(vUv.y * 52.0 - uTime * 2.2 + sin(vUv.x * 14.0 + uTime * 0.7) * 1.2);
            float w2 = cos(vUv.y * 86.0 + vUv.x * 22.0 - uTime * 3.1);
            float crest = smoothstep(0.55, 0.98, w1 * 0.6 + w2 * 0.4);

            // Concentrate golden water glints directly below the glowing arched facade
            float centerFocus = exp(-pow((vUv.x - 0.5) * 3.4, 2.0));
            vec3 darkTint = vec3(0.02, 0.04, 0.08);
            vec3 goldGlint = vec3(1.0, 0.85, 0.58);

            float alpha = 0.24 + crest * centerFocus * 0.26;
            vec3 col = mix(darkTint, goldGlint, crest * centerFocus * 0.85);
            gl_FragColor = vec4(col, alpha);
          }
        `,
      })
    );
    const waterGlaze = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(poolW, poolD)), waterRippleMat);
    waterGlaze.rotation.x = -Math.PI / 2;
    waterGlaze.position.set(0, 0.028, poolCenterZ);
    scene.add(waterGlaze);

    // Sleek Dark Stone Reflecting Pool Coping Borders
    const copingH = 0.22;
    const copingT = 0.55;
    const backCoping = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(poolW + copingT * 2, copingH, copingT)), podiumStoneMat);
    backCoping.position.set(0, copingH * 0.5, poolCenterZ - poolD * 0.5 - copingT * 0.5);
    scene.add(backCoping);

    const frontCoping = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(poolW + copingT * 2, copingH, copingT)), podiumStoneMat);
    frontCoping.position.set(0, copingH * 0.5, poolCenterZ + poolD * 0.5 + copingT * 0.5);
    scene.add(frontCoping);

    [-1, 1].forEach((side) => {
      const sideCoping = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(copingT, copingH, poolD)), podiumStoneMat);
      sideCoping.position.set(side * (poolW * 0.5 + copingT * 0.5), copingH * 0.5, poolCenterZ);
      scene.add(sideCoping);
    });

    // -----------------------------------------------------------------------
    // 6. MONUMENTAL 3D MUSEUM BUILDING (1-to-1 Faithful to Twilight Design!)
    // -----------------------------------------------------------------------
    const museum = new THREE.Group();
    scene.add(museum);

    // Raised Dark-Limestone Museum Podium Base (y = 0 -> 2.6)
    const podiumH = 2.6;
    const podium = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(48, podiumH, 20)), podiumStoneMat);
    podium.position.set(0, podiumH * 0.5, -12.0);
    museum.add(podium);

    // Upper Terrace Slab Lip
    const terraceLip = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(48.6, 0.22, 20.6)), travertineMat);
    terraceLip.position.set(0, podiumH + 0.08, -12.0);
    museum.add(terraceLip);

    // Symmetrical Wide Grand Stone Staircase (13 steps climbing from z = +2.4 -> -2.0)
    const stairCount = 13;
    const stairWidth = 12.6;
    const stairStartZ = 2.4;
    const stairEndZ = -2.0;
    for (let s = 0; s < stairCount; s++) {
      const t = (s + 1) / stairCount;
      const sh = podiumH / stairCount;
      const sd = (stairStartZ - stairEndZ) / stairCount;
      const sz = stairStartZ - s * sd - sd * 0.5;
      const stepMesh = new THREE.Mesh(
        trackGeo(new THREE.BoxGeometry(stairWidth, sh * (s + 1), sd + 0.04)),
        stairMarbleMat
      );
      stepMesh.position.set(0, (sh * (s + 1)) * 0.5, sz);
      museum.add(stepMesh);

      // Subtle warm glowing linear LED step light strip along every alternate tread edge
      if (s % 2 === 0) {
        const stepLed = new THREE.Mesh(
          trackGeo(new THREE.BoxGeometry(stairWidth - 0.5, 0.035, 0.035)),
          warmGlowStripMat
        );
        stepLed.position.set(0, t * podiumH - 0.03, sz + sd * 0.51);
        museum.add(stepLed);
      }
    }

    // Sloped Limestone Staircase Cheek Walls & Brushed Brass Handrails
    [-1, 1].forEach((side) => {
      const cheekX = side * (stairWidth * 0.5 + 0.42);
      const cheek = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.84, podiumH + 0.35, 4.8)), podiumStoneMat);
      cheek.position.set(cheekX, (podiumH + 0.35) * 0.5 - 0.35, 0.2);
      museum.add(cheek);

      const cap = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.92, 0.14, 5.0)), travertineMat);
      cap.position.set(cheekX, podiumH * 0.55 + 0.5, 0.2);
      cap.rotation.x = 0.52;
      museum.add(cap);

      // Warm Recessed Under-Portal Alcoves flanking the grand stairs (signature detail!)
      const alcoveFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.55, 1.95, 0.35)), darkBronzeMat);
      alcoveFrame.position.set(side * 8.15, 0.98, -2.02);
      museum.add(alcoveFrame);
      const alcoveGlow = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.18, 1.72)), warmGlowStripMat);
      alcoveGlow.position.set(side * 8.15, 0.96, -1.83);
      museum.add(alcoveGlow);
    });

    // --- 8 TOWERING FLUTED DARK BRONZE COLONNADE COLUMNS ---
    const colH = 11.9;
    const colBaseY = podiumH + 0.18;
    const colPositionsX = [-15.2, -11.3, -7.4, -3.9, 3.9, 7.4, 11.3, 15.2];
    const colShaftGeo = trackGeo(new THREE.CylinderGeometry(0.46, 0.54, colH, 16));
    const colPlinthGeo = trackGeo(new THREE.BoxGeometry(1.42, 0.44, 1.42));
    const colRingGeo = trackGeo(new THREE.TorusGeometry(0.56, 0.075, 10, 24));
    const colCapGeo = trackGeo(new THREE.CylinderGeometry(0.76, 0.48, 0.56, 16));
    const colAbacusGeo = trackGeo(new THREE.BoxGeometry(1.48, 0.24, 1.48));

    colPositionsX.forEach((cx) => {
      const colGrp = new THREE.Group();
      colGrp.position.set(cx, colBaseY, -3.55);

      const plinth = new THREE.Mesh(colPlinthGeo, podiumStoneMat);
      plinth.position.y = 0.22;
      colGrp.add(plinth);

      const baseRing = new THREE.Mesh(colRingGeo, brushedBrassMat);
      baseRing.rotation.x = Math.PI / 2;
      baseRing.position.y = 0.48;
      colGrp.add(baseRing);

      const shaft = new THREE.Mesh(colShaftGeo, columnBronzeMat);
      shaft.position.y = 0.44 + colH * 0.5;
      colGrp.add(shaft);

      const cap = new THREE.Mesh(colCapGeo, columnBronzeMat);
      cap.position.y = 0.44 + colH + 0.22;
      colGrp.add(cap);

      const abacus = new THREE.Mesh(colAbacusGeo, darkBronzeMat);
      abacus.position.y = 0.44 + colH + 0.56;
      colGrp.add(abacus);

      // Subtle architectural uplight glow disk at column base
      const upGlow = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(2.6, 2.6)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: goldPoolTex,
            transparent: true,
            opacity: 0.42,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      upGlow.rotation.x = -Math.PI / 2;
      upGlow.position.y = 0.04;
      colGrp.add(upGlow);

      museum.add(colGrp);
    });

    // --- MONUMENTAL 3-TIER CANTILEVERED OVERHANGING ROOF CANOPY ---
    const roofBaseY = colBaseY + colH + 1.05;
    const roofTier1 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(36.4, 0.52, 15.8)), darkBronzeMat);
    roofTier1.position.set(0, roofBaseY, -9.2);
    museum.add(roofTier1);

    const roofTier2 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(39.4, 0.52, 17.6)), darkBronzeMat);
    roofTier2.position.set(0, roofBaseY + 0.54, -9.2);
    museum.add(roofTier2);

    const roofTier3 = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(42.4, 0.56, 19.2)), darkBronzeMat);
    roofTier3.position.set(0, roofBaseY + 1.08, -9.2);
    museum.add(roofTier3);

    // Warm recessed soffit ceiling cornice line under overhanging canopy
    const soffitTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(34.8, 0.09, 0.14)), warmGlowStripMat);
    soffitTrim.position.set(0, roofBaseY - 0.25, -2.5);
    museum.add(soffitTrim);

    // --- WARM HONED TRAVERTINE FACADE PIERS & RECESSED OUTER WINGS ---
    const facadeH = colH + 0.7;
    const facadeMidY = colBaseY + facadeH * 0.5;

    // Inner Main Travertine Piers (x = ±9.35)
    [-9.35, 9.35].forEach((px) => {
      const pier = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.1, facadeH, 2.2)), travertineMat);
      pier.position.set(px, facadeMidY, -6.2);
      museum.add(pier);

      // Warm architectural wall-grazer uplight strip at pier base
      const grazer = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.5, 0.12, 0.18)), warmGlowStripMat);
      grazer.position.set(px, colBaseY + 0.08, -5.02);
      museum.add(grazer);
    });

    // Outer Lower Setback Travertine Gallery Wings (left & right silhouette!)
    [-19.6, 19.6].forEach((wx) => {
      const wingH = 8.9;
      const wing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(9.6, wingH, 12.2)), travertineMat);
      wing.position.set(wx, colBaseY + wingH * 0.5, -10.8);
      museum.add(wing);

      // Sleek cantilevered bronze wing roof overhang
      const wingRoof = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.8, 0.42, 13.4)), darkBronzeMat);
      wingRoof.position.set(wx, colBaseY + wingH + 0.22, -10.8);
      museum.add(wingRoof);

      // Glowing vertical architectural slot window on outer wing
      const slotGlow = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.15, wingH - 0.6)), warmInteriorWallMat);
      slotGlow.position.set(wx - Math.sign(wx) * 4.4, colBaseY + wingH * 0.5, -4.68);
      museum.add(slotGlow);

      const slotGlass = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.22, wingH - 0.4)), warmWindowGlassMat);
      slotGlass.position.set(wx - Math.sign(wx) * 4.4, colBaseY + wingH * 0.5, -4.62);
      museum.add(slotGlass);
    });

    // Outer Tall Illuminated Vertical Glass Bays (x = ±13.4)
    [-13.35, 13.35].forEach((bx) => {
      const bayBack = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(2.8, facadeH - 0.4)), warmInteriorWallMat);
      bayBack.position.set(bx, facadeMidY, -7.1);
      museum.add(bayBack);

      const bayGlass = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(2.85, facadeH - 0.2)), warmWindowGlassMat);
      bayGlass.position.set(bx, facadeMidY, -5.8);
      museum.add(bayGlass);

      // Slim vertical brass mullion
      const mullion = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.08, facadeH, 0.14)), darkBronzeMat);
      mullion.position.set(bx, facadeMidY, -5.72);
      museum.add(mullion);
    });

    // --- SOARING CENTRAL ILLUMINATED ARCHED GLASS-AND-BRASS ENTRANCE PORTAL ---
    const archRadius = 3.25;
    const archSpringY = colBaseY + 7.6;

    // Extruded Travertine Arch Spandrel Wall framing the central portal
    const portalWallShape = new THREE.Shape();
    portalWallShape.moveTo(-6.8, 0);
    portalWallShape.lineTo(-archRadius, 0);
    portalWallShape.lineTo(-archRadius, 7.6);
    portalWallShape.absarc(0, 7.6, archRadius, Math.PI, 0, true);
    portalWallShape.lineTo(archRadius, 0);
    portalWallShape.lineTo(6.8, 0);
    portalWallShape.lineTo(6.8, facadeH);
    portalWallShape.lineTo(-6.8, facadeH);
    portalWallShape.closePath();

    // Cut out flanking tall rectangular curtain glass bays inside the central section
    [-5.05, 5.05].forEach((holeX) => {
      const hole = new THREE.Path();
      hole.moveTo(holeX - 1.35, 0.2);
      hole.lineTo(holeX + 1.35, 0.2);
      hole.lineTo(holeX + 1.35, facadeH - 0.5);
      hole.lineTo(holeX - 1.35, facadeH - 0.5);
      hole.closePath();
      portalWallShape.holes.push(hole);
    });

    const portalWallGeo = trackGeo(
      new THREE.ExtrudeGeometry(portalWallShape, {
        depth: 1.0,
        bevelEnabled: true,
        bevelThickness: 0.06,
        bevelSize: 0.05,
        bevelSegments: 2,
        curveSegments: 36,
      })
    );
    const portalWall = new THREE.Mesh(portalWallGeo, travertineMat);
    portalWall.position.set(0, colBaseY, -6.3);
    museum.add(portalWall);

    // Glowing Brushed-Brass Semicircular Fanlight Arch Rings & Radial Spokes!
    [archRadius, archRadius * 0.68].forEach((r, idx) => {
      const arcMesh = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(r, idx === 0 ? 0.09 : 0.055, 12, 48, Math.PI)),
        brushedBrassMat
      );
      arcMesh.position.set(0, archSpringY, -5.32);
      museum.add(arcMesh);
    });

    // Radial architectural arch spokes
    for (let k = 1; k <= 5; k++) {
      const ang = (k / 6) * Math.PI;
      const spoke = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.055, archRadius, 0.08)), brushedBrassMat);
      spoke.position.set(
        Math.cos(ang) * (archRadius * 0.5),
        archSpringY + Math.sin(ang) * (archRadius * 0.5),
        -5.32
      );
      spoke.rotation.z = ang - Math.PI / 2;
      museum.add(spoke);
    }

    // Horizontal & vertical window transoms above the double doors
    const transomY = colBaseY + 3.95;
    const mainTransom = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(archRadius * 2, 0.14, 0.14)), brushedBrassMat);
    mainTransom.position.set(0, transomY, -5.32);
    museum.add(mainTransom);

    const upperTransom = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(archRadius * 2, 0.09, 0.1)), brushedBrassMat);
    upperTransom.position.set(0, archSpringY, -5.32);
    museum.add(upperTransom);

    [-1.4, 1.4].forEach((mx) => {
      const vBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.07, archSpringY - transomY, 0.1)), brushedBrassMat);
      vBar.position.set(mx, (archSpringY + transomY) * 0.5, -5.32);
      museum.add(vBar);
    });

    // Upper Portal Translucent Warm Glass Panes
    const upperGlass = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(archRadius * 2, archSpringY - transomY)),
      warmWindowGlassMat
    );
    upperGlass.position.set(0, (archSpringY + transomY) * 0.5, -5.38);
    museum.add(upperGlass);

    const fanlightGlass = new THREE.Mesh(
      trackGeo(new THREE.CircleGeometry(archRadius, 40, 0, Math.PI)),
      warmWindowGlassMat
    );
    fanlightGlass.position.set(0, archSpringY, -5.38);
    museum.add(fanlightGlass);

    // Flanking Curtain Glass Panes & Mullions (x = ±5.05)
    [-5.05, 5.05].forEach((gx) => {
      const pane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(2.7, facadeH - 0.7)), warmWindowGlassMat);
      pane.position.set(gx, facadeMidY, -5.55);
      museum.add(pane);
      const vMul = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, facadeH - 0.7, 0.1)), brushedBrassMat);
      vMul.position.set(gx, facadeMidY, -5.48);
      museum.add(vMul);
      [colBaseY + 3.95, colBaseY + 7.6].forEach((hy) => {
        const hMul = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.7, 0.07, 0.1)), brushedBrassMat);
        hMul.position.set(gx, hy, -5.48);
        museum.add(hMul);
      });
    });

    // --- ANIMATED 3D DOUBLE BRASS-AND-GLASS ENTRANCE DOORS (Swing Open on Enter!) ---
    const doorH = 3.92;
    const doorW = 1.62;
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-doorW, colBaseY, -5.32);
    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(doorW, colBaseY, -5.32);

    const buildDoorLeaf = (pivot: THREE.Group, sign: number) => {
      const offsetX = sign * (doorW * 0.5);
      const glass = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(doorW - 0.16, doorH - 0.16)), warmWindowGlassMat);
      glass.position.set(offsetX, doorH * 0.5, 0);
      pivot.add(glass);

      // Outer brass frame stiles
      const topBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(doorW, 0.1, 0.1)), brushedBrassMat);
      topBar.position.set(offsetX, doorH - 0.05, 0);
      pivot.add(topBar);
      const botBar = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(doorW, 0.18, 0.1)), brushedBrassMat);
      botBar.position.set(offsetX, 0.09, 0);
      pivot.add(botBar);
      [-1, 1].forEach((edge) => {
        const stile = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, doorH, 0.1)), brushedBrassMat);
        stile.position.set(offsetX + edge * (doorW * 0.5 - 0.05), doorH * 0.5, 0);
        pivot.add(stile);
      });
      // Vertical brass door pull handle
      const handle = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.032, 0.032, 1.15, 10)), brushedBrassMat);
      handle.position.set(sign * (doorW - 0.24), 1.55, 0.12);
      pivot.add(handle);
    };

    buildDoorLeaf(leftDoorPivot, 1);
    buildDoorLeaf(rightDoorPivot, -1);
    museum.add(leftDoorPivot);
    museum.add(rightDoorPivot);

    // --- REAL 3D ILLUMINATED INTERIOR ATRIUM VISIBLE THROUGH THE GLASS! ---
    const atriumBack = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(19, facadeH + 1)), warmInteriorWallMat);
    atriumBack.position.set(0, facadeMidY, -14.8);
    museum.add(atriumBack);

    [-9.5, 9.5].forEach((ax) => {
      const sideAtrium = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(9.6, facadeH + 1)), warmInteriorWallMat);
      sideAtrium.rotation.y = ax < 0 ? Math.PI / 2 : -Math.PI / 2;
      sideAtrium.position.set(ax, facadeMidY, -10.2);
      museum.add(sideAtrium);
    });

    const atriumCeiling = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(19, 10)), warmGlowStripMat);
    atriumCeiling.rotation.x = Math.PI / 2;
    atriumCeiling.position.set(0, colBaseY + facadeH - 0.2, -10.2);
    museum.add(atriumCeiling);

    // Interior Mezzanine Gallery Balcony visible inside the glowing arch
    const mezzanineFloor = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(17.5, 0.35, 3.2)), travertineMat);
    mezzanineFloor.position.set(0, colBaseY + 4.3, -13.2);
    museum.add(mezzanineFloor);

    const mezzanineRail = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(17.2, 0.08, 0.08)), brushedBrassMat);
    mezzanineRail.position.set(0, colBaseY + 5.25, -11.65);
    museum.add(mezzanineRail);

    // Inner Framed Gallery Artworks visible on the illuminated atrium back wall
    [-4.8, 0, 4.8].forEach((fx) => {
      const frame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.2, 2.8, 0.12)), darkBronzeMat);
      frame.position.set(fx, colBaseY + 2.2, -14.65);
      museum.add(frame);
      const canvasArt = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.9, 2.5)), travertineMat);
      canvasArt.position.set(fx, colBaseY + 2.2, -14.58);
      museum.add(canvasArt);
    });

    // -----------------------------------------------------------------------
    // 7. COURTYARD BRONZE BOLLARD LIGHTS & SCULPTED 3D CYPRESS TREES
    // -----------------------------------------------------------------------
    const bollardPostGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.13, 0.92, 12));
    const bollardLampGeo = trackGeo(new THREE.CylinderGeometry(0.095, 0.095, 0.22, 12));
    [-13.5, 13.5].forEach((bx) => {
      [2.2, 10.5, 19.5].forEach((bz) => {
        const post = new THREE.Mesh(bollardPostGeo, darkBronzeMat);
        post.position.set(bx, 0.46, bz);
        scene.add(post);
        const lamp = new THREE.Mesh(bollardLampGeo, warmGlowStripMat);
        lamp.position.set(bx, 0.95, bz);
        scene.add(lamp);
        const pool = new THREE.Mesh(
          trackGeo(new THREE.PlaneGeometry(2.6, 2.6)),
          trackMat(
            new THREE.MeshBasicMaterial({
              map: goldPoolTex,
              transparent: true,
              opacity: 0.45,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
            })
          )
        );
        pool.rotation.x = -Math.PI / 2;
        pool.position.set(bx, 0.02, bz);
        scene.add(pool);
      });
    });

    // Sculpted 3D Mediterranean Cypress Trees flanking left & right plaza edges
    const createCypressTree = (x: number, z: number, scaleH: number) => {
      const tree = new THREE.Group();
      tree.position.set(x, 0, z);
      const trunk = new THREE.Mesh(
        trackGeo(new THREE.CylinderGeometry(0.18, 0.28, 1.4, 8)),
        darkBronzeMat
      );
      trunk.position.y = 0.7;
      tree.add(trunk);

      const tiers = 5;
      for (let t = 0; t < tiers; t++) {
        const frac = t / (tiers - 1);
        const rad = (1.15 - frac * 0.78) * (0.85 + scaleH * 0.08);
        const h = scaleH * (0.42 - frac * 0.04);
        const cone = new THREE.Mesh(trackGeo(new THREE.ConeGeometry(rad, h, 9)), cypressFoliageMat);
        cone.position.y = 1.6 + t * (scaleH * 0.16);
        cone.rotation.y = t * 0.8;
        tree.add(cone);
      }
      scene.add(tree);
    };

    createCypressTree(-17.8, 0.2, 7.2);
    createCypressTree(-22.8, 3.8, 9.6);
    createCypressTree(-25.5, 9.5, 6.2);
    createCypressTree(17.8, 0.2, 7.0);
    createCypressTree(23.0, 4.2, 9.4);
    createCypressTree(26.2, 10.2, 6.4);

    // -----------------------------------------------------------------------
    // 8. FLOATING WARM GOLDEN TWILIGHT MOTES IN 3D COURTYARD AIR
    // -----------------------------------------------------------------------
    const moteCount = 260;
    const motePos = new Float32Array(moteCount * 3);
    for (let i = 0; i < moteCount; i++) {
      motePos[i * 3] = (Math.random() - 0.5) * 44;
      motePos[i * 3 + 1] = 0.6 + Math.random() * 14.5;
      motePos[i * 3 + 2] = -6 + Math.random() * 34;
    }
    const moteGeo = trackGeo(new THREE.BufferGeometry());
    moteGeo.setAttribute('position', new THREE.BufferAttribute(motePos, 3));
    const moteMat = trackMat(
      new THREE.PointsMaterial({ color: 0xffe1a8, size: 0.12, transparent: true, opacity: 0.62 })
    );
    const moteCloud = new THREE.Points(moteGeo, moteMat);
    scene.add(moteCloud);

    // -----------------------------------------------------------------------
    // 9. INTERACTIVE 3D ORBIT / DRAG / ZOOM + CINEMATIC PORTAL FLY-THROUGH
    // -----------------------------------------------------------------------
    const orbit = {
      targetAzimuth: 0,
      azimuth: 0,
      targetElevation: 4.1,
      elevation: 4.1,
      targetRadius: 28.5,
      radius: 28.5,
      mouseNormX: 0,
      mouseNormY: 0,
      isFlyingIn: false,
    };

    const lookAtPos = new THREE.Vector3(0, 6.2, -5.2);
    let isDragging = false;
    let lastPtrX = 0;
    let lastPtrY = 0;

    const handlePointerDown = (e: PointerEvent) => {
      if (orbit.isFlyingIn) return;
      const target = e.target as HTMLElement | null;
      if (target?.closest('button, a')) return;
      isDragging = true;
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;
    };

    const handlePointerMove = (e: PointerEvent) => {
      orbit.mouseNormX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      orbit.mouseNormY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;

      if (!isDragging || orbit.isFlyingIn) return;
      const dx = e.clientX - lastPtrX;
      const dy = e.clientY - lastPtrY;
      lastPtrX = e.clientX;
      lastPtrY = e.clientY;

      orbit.targetAzimuth = Math.max(-0.78, Math.min(0.78, orbit.targetAzimuth - dx * 0.0045));
      orbit.targetElevation = Math.max(1.8, Math.min(13.0, orbit.targetElevation + dy * 0.025));
    };

    const handlePointerUp = () => {
      isDragging = false;
    };

    const handleWheel = (e: WheelEvent) => {
      if (orbit.isFlyingIn) return;
      orbit.targetRadius = Math.max(13.5, Math.min(34.0, orbit.targetRadius + e.deltaY * 0.014));
    };

    const handleEnterFlythrough = () => {
      if (orbit.isFlyingIn) return;
      orbit.isFlyingIn = true;
      setEnteringPortal(true);

      // Swing BOTH 3D entrance doors open inward!
      gsap.to(leftDoorPivot.rotation, { y: 1.75, duration: 0.85, ease: 'power2.out' });
      gsap.to(rightDoorPivot.rotation, { y: -1.75, duration: 0.85, ease: 'power2.out' });

      // Smoothly glide the real 3D camera up the grand stairs straight into the illuminated portal!
      gsap.to(camera.position, {
        x: 0,
        y: 4.5,
        z: -8.2,
        duration: 1.02,
        ease: 'power2.inOut',
      });
      gsap.to(lookAtPos, {
        x: 0,
        y: 4.6,
        z: -16.0,
        duration: 0.95,
        ease: 'power2.inOut',
      });
      gsap.to(atriumMainLight, { intensity: 95, duration: 0.95, ease: 'power2.in' });
      gsap.to(bloomPass, { strength: 1.15, duration: 0.95, ease: 'power2.in' });
    };

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      composer.setSize(w, h);
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('museum-enter-flythrough', handleEnterFlythrough);

    // -----------------------------------------------------------------------
    // 10. 60FPS ANIMATION LOOP
    // -----------------------------------------------------------------------
    let animId = 0;
    const startMs = performance.now();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsed = (performance.now() - startMs) * 0.001;

      skyUniforms.uTime.value = elapsed;
      waterUniforms.uTime.value = elapsed;

      // Subtle living warm interior illumination & floating courtyard dust
      if (!orbit.isFlyingIn) {
        atriumMainLight.intensity = 40 + Math.sin(elapsed * 1.1) * 3.5;

        // Smooth camera orbit + gentle idle drone hover + cursor parallax
        orbit.azimuth += (orbit.targetAzimuth - orbit.azimuth) * 0.065;
        orbit.elevation += (orbit.targetElevation - orbit.elevation) * 0.065;
        orbit.radius += (orbit.targetRadius - orbit.radius) * 0.065;

        const idleSway = Math.sin(elapsed * 0.35) * 0.055;
        const idleZoom = Math.sin(elapsed * 0.28) * 0.85;
        const az = orbit.azimuth + idleSway + orbit.mouseNormX * 0.07;
        const rad = orbit.radius + idleZoom;

        camera.position.set(
          Math.sin(az) * rad,
          orbit.elevation - orbit.mouseNormY * 0.45 + Math.sin(elapsed * 0.5) * 0.12,
          Math.cos(az) * rad - 2.0
        );
      }

      camera.lookAt(lookAtPos);
      moteCloud.position.y = Math.sin(elapsed * 0.4) * 0.28;
      stars.rotation.y = elapsed * 0.003;

      composer.render();
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('museum-enter-flythrough', handleEnterFlythrough);

      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(lookAtPos);
      gsap.killTweensOf(leftDoorPivot.rotation);
      gsap.killTweensOf(rightDoorPivot.rotation);

      envRT.dispose();
      poolReflector.dispose();
      rt.dispose();
      composer.dispose();
      trackedGeos.forEach((g) => g.dispose());
      trackedMats.forEach((m) => m.dispose());
      trackedTexs.forEach((t) => t.dispose());
      renderer.dispose();
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden bg-[#060911] select-none cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />

      {/* Subtle top & bottom readability framing gradients */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 h-36 bg-gradient-to-b from-[#060911]/75 via-[#060911]/30 to-transparent z-10" />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#060911]/82 via-[#060911]/36 to-transparent z-10" />

      {/* Warm Golden Portal Dissolve Veil as camera flies through open 3D doors */}
      <div
        className={`pointer-events-none absolute inset-0 z-20 transition-opacity duration-[920ms] ease-in bg-[radial-gradient(circle_at_50%_48%,rgba(255,238,200,0.96)_0%,rgba(214,199,178,0.72)_45%,rgba(15,16,19,0.96)_100%)] ${
          enteringPortal ? 'opacity-100' : 'opacity-0'
        }`}
      />
    </div>
  );
}

