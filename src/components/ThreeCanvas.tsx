'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { usePortfolio } from '../context/PortfolioContext';

export default function ThreeCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { backgroundTheme } = usePortfolio();

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x05060b, 0.0018);

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 80;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x05060b, 1);
    container.appendChild(renderer.domElement);

    // --- Ambient & Point Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLightCyan = new THREE.PointLight(0x00f5d4, 3, 200);
    pointLightCyan.position.set(40, 30, 40);
    scene.add(pointLightCyan);

    const pointLightPurple = new THREE.PointLight(0x9d4edd, 3, 200);
    pointLightPurple.position.set(-40, -30, 30);
    scene.add(pointLightPurple);

    // --- 1. Starfield / Floating Particle Constellation ---
    const particleCount = 1800;
    const particleGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const scales = new Float32Array(particleCount);

    const colorCyan = new THREE.Color(0x00f5d4);
    const colorPurple = new THREE.Color(0x9d4edd);
    const colorBlue = new THREE.Color(0x38bdf8);
    const colorWhite = new THREE.Color(0xffffff);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 250;
      positions[i3 + 1] = (Math.random() - 0.5) * 200;
      positions[i3 + 2] = (Math.random() - 0.5) * 200;

      // Color distribution
      const rand = Math.random();
      let chosenColor = colorCyan;
      if (rand > 0.7) chosenColor = colorPurple;
      else if (rand > 0.4) chosenColor = colorBlue;
      else if (rand > 0.25) chosenColor = colorWhite;

      colors[i3] = chosenColor.r;
      colors[i3 + 1] = chosenColor.g;
      colors[i3 + 2] = chosenColor.b;

      scales[i] = Math.random() * 2.5 + 0.5;
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    // Custom circular sprite texture for smooth particles
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255,255,255,1)');
      gradient.addColorStop(0.3, 'rgba(255,255,255,0.8)');
      gradient.addColorStop(0.7, 'rgba(255,255,255,0.15)');
      gradient.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(16, 16, 16, 0, Math.PI * 2);
      ctx.fill();
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particleMat = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      depthWrite: false,
      opacity: 0.85
    });

    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // --- 2. Floating 3D Geometric Core (Torus Knot + Outer Orbital Cage) ---
    const coreGroup = new THREE.Group();
    coreGroup.position.set(28, 0, -10);

    const torusGeo = new THREE.TorusKnotGeometry(12, 3.2, 120, 18, 2, 3);
    const torusWireMat = new THREE.MeshStandardMaterial({
      color: 0x00f5d4,
      wireframe: true,
      transparent: true,
      opacity: 0.35,
      roughness: 0.2,
      metalness: 0.8
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusWireMat);
    coreGroup.add(torusKnot);

    // Outer orbital ring
    const ringGeo = new THREE.TorusGeometry(22, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x9d4edd,
      wireframe: true,
      transparent: true,
      opacity: 0.45
    });
    const ring1 = new THREE.Mesh(ringGeo, ringMat);
    ring1.rotation.x = Math.PI / 3;
    coreGroup.add(ring1);

    const ring2 = new THREE.Mesh(ringGeo, ringMat.clone());
    ring2.rotation.y = Math.PI / 2.5;
    ring2.scale.set(1.15, 1.15, 1.15);
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // --- 3. Cyber Wave Terrain Grid (at lower elevation) ---
    const waveGeo = new THREE.PlaneGeometry(240, 240, 48, 48);
    const waveMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      wireframe: true,
      transparent: true,
      opacity: 0.12
    });
    const wavePlane = new THREE.Mesh(waveGeo, waveMat);
    wavePlane.rotation.x = -Math.PI / 2.2;
    wavePlane.position.set(0, -45, -20);
    scene.add(wavePlane);

    // --- Interactive Mouse & Parallax State ---
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;
    let scrollY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollY = window.scrollY || window.pageYOffset;
    };

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

      // Responsive positioning for geometric core
      if (window.innerWidth < 768) {
        coreGroup.position.set(0, 15, -25);
        coreGroup.scale.set(0.65, 0.65, 0.65);
      } else {
        coreGroup.position.set(28, 0, -10);
        coreGroup.scale.set(1, 1, 1);
      }
    };

    handleResize();
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    // --- Animation Render Loop ---
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse lerp
      mouseX += (targetMouseX - mouseX) * 0.05;
      mouseY += (targetMouseY - mouseY) * 0.05;

      // Parallax camera tilt
      camera.position.x = mouseX * 8;
      camera.position.y = -mouseY * 8 - (scrollY * 0.02);
      camera.lookAt(0, -scrollY * 0.02, 0);

      // Rotate particle constellation
      particles.rotation.y = elapsedTime * 0.03 + mouseX * 0.15;
      particles.rotation.x = elapsedTime * 0.015 - mouseY * 0.1;

      // Core rotation
      coreGroup.rotation.x = elapsedTime * 0.25;
      coreGroup.rotation.y = elapsedTime * 0.35 + mouseX * 0.5;
      ring1.rotation.z = elapsedTime * 0.4;
      ring2.rotation.z = -elapsedTime * 0.3;

      // Undulate Cyber Wave Terrain
      const wavePos = waveGeo.attributes.position;
      for (let i = 0; i < wavePos.count; i++) {
        const u = wavePos.getX(i);
        const v = wavePos.getY(i);
        const z = Math.sin(u * 0.08 + elapsedTime * 1.2) * Math.cos(v * 0.08 + elapsedTime * 1.2) * 3;
        wavePos.setZ(i, z);
      }
      wavePos.needsUpdate = true;

      // Dynamic light orbit
      pointLightCyan.position.x = Math.sin(elapsedTime * 0.8) * 50 + 20;
      pointLightCyan.position.y = Math.cos(elapsedTime * 0.7) * 30;
      pointLightPurple.position.x = -Math.sin(elapsedTime * 0.6) * 50 - 20;
      pointLightPurple.position.y = -Math.cos(elapsedTime * 0.5) * 30;

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }

      particleGeo.dispose();
      particleMat.dispose();
      particleTexture.dispose();
      torusGeo.dispose();
      torusWireMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      waveGeo.dispose();
      waveMat.dispose();
      renderer.dispose();
    };
  }, [backgroundTheme]);

  return (
    <div
      ref={mountRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    />
  );
}
