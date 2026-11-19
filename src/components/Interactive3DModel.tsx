'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export default function Interactive3DModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Scene & Camera Setup ---
    const width = container.clientWidth || 500;
    const height = container.clientHeight || 700;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 5.2);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // --- 2. Texture & Depth Map Loading ---
    const textureLoader = new THREE.TextureLoader();

    let diffuseTex: THREE.Texture | null = null;
    let depthTex: THREE.Texture | null = null;

    const customUniforms = {
      uTexture: { value: null as THREE.Texture | null },
      uDepthMap: { value: null as THREE.Texture | null },
      uDepthScale: { value: 0.35 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uResolution: { value: new THREE.Vector2(width, height) },
      uTime: { value: 0 },
    };

    // Custom 3D Vertex & Fragment Shaders with true Depth Displacement and Studio Lighting
    const vertexShader = `
      uniform sampler2D uDepthMap;
      uniform float uDepthScale;
      uniform vec2 uMouse;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDepth;

      void main() {
        vUv = uv;

        // Sample depth map (white = forward, black = backward)
        float depth = texture2D(uDepthMap, uv).r;
        vDepth = depth;

        // Displace vertices along normal in true 3D space
        vec3 displacedPos = position;
        displacedPos.z += depth * uDepthScale;

        // Subtle anatomical curvature based on depth
        displacedPos.x += (uv.x - 0.5) * depth * 0.08;

        vPosition = (modelMatrix * vec4(displacedPos, 1.0)).xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * modelViewMatrix * vec4(displacedPos, 1.0);
      }
    `;

    const fragmentShader = `
      uniform sampler2D uTexture;
      uniform sampler2D uDepthMap;
      uniform vec2 uMouse;
      uniform float uTime;

      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      varying float vDepth;

      void main() {
        // Subtle depth parallax refraction for true stereoscopic view
        vec2 parallaxOffset = uMouse * (vDepth * 0.025);
        vec2 finalUv = clamp(vUv - parallaxOffset, 0.001, 0.999);

        vec4 color = texture2D(uTexture, finalUv);

        // Alpha discard for razor-clean silhouette
        if (color.a < 0.05) {
          discard;
        }

        // --- Studio Lighting calculation ---
        // Virtual light follows mouse pointer in 3D space
        vec3 lightPos = vec3(uMouse.x * 2.8, uMouse.y * 2.5 + 0.8, 3.5);
        vec3 lightDir = normalize(lightPos - vPosition);

        // Diffuse lighting
        float diffuse = max(dot(vNormal, lightDir), 0.0) * 0.35 + 0.75;

        // Specular glint on face and fabric
        vec3 viewDir = normalize(-vPosition);
        vec3 reflectDir = reflect(-lightDir, vNormal);
        float spec = pow(max(dot(viewDir, reflectDir), 0.0), 16.0) * vDepth * 0.22;

        // Ambient rim light (warm cashmere tone #d6c7b2)
        vec3 rimColor = vec3(0.84, 0.78, 0.70);
        float rim = pow(1.0 - max(dot(viewDir, vNormal), 0.0), 3.0) * vDepth * 0.18;

        vec3 finalColor = color.rgb * diffuse + vec3(spec) + rimColor * rim;

        gl_FragColor = vec4(finalColor, color.a);
      }
    `;

    // 3D Mesh with high subdivision for buttery smooth depth deformation
    // Photo aspect ratio ~ 1 : 1.6
    const meshWidth = 2.45;
    const meshHeight = 3.9;
    const geometry = new THREE.PlaneGeometry(meshWidth, meshHeight, 160, 160);

    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: customUniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true,
      depthWrite: true,
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -0.05, 0);
    scene.add(mesh);

    // Realistic soft floor shadow below feet
    const shadowGeo = new THREE.PlaneGeometry(2.2, 0.9);
    const shadowMat = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        void main() {
          float dist = distance(vUv, vec2(0.5, 0.5));
          float alpha = smoothstep(0.48, 0.05, dist) * 0.45;
          gl_FragColor = vec4(0.0, 0.0, 0.0, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2.3;
    shadowMesh.position.set(0, -2.0, -0.15);
    scene.add(shadowMesh);

    // Load textures
    textureLoader.load('/profile_transparent.png', (tex) => {
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      customUniforms.uTexture.value = tex;
      diffuseTex = tex;

      textureLoader.load('/profile_depth.png', (dTex) => {
        dTex.minFilter = THREE.LinearFilter;
        dTex.magFilter = THREE.LinearFilter;
        customUniforms.uDepthMap.value = dTex;
        depthTex = dTex;
        setIsReady(true);
      });
    });

    // --- 3. Pointer & Drag Interaction Physics ---
    let targetRotY = 0;
    let targetRotX = 0;
    let currentRotY = 0;
    let currentRotX = 0;

    let targetPosX = 0;
    let currentPosX = 0;

    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let manualDragOffset = 0;

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Normalized coordinates from -1 to 1 across the window
      const normX = (e.clientX - centerX) / (window.innerWidth / 2);
      const normY = (e.clientY - centerY) / (window.innerHeight / 2);

      // Max yaw (~22deg) and pitch (~14deg)
      const clampedX = Math.max(-1.0, Math.min(1.0, normX));
      const clampedY = Math.max(-1.0, Math.min(1.0, normY));

      targetRotY = clampedX * 0.38 + manualDragOffset;
      targetRotX = -clampedY * 0.22;

      // Subtle parallax translation along X axis
      targetPosX = clampedX * 0.15 + (manualDragOffset * 0.6);

      // Pass normalized mouse to shader for dynamic directional lighting
      customUniforms.uMouse.value.set(clampedX, -clampedY);
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragStartX = e.clientX;
      dragStartOffset = manualDragOffset;
      container.style.cursor = 'grabbing';
      container.setPointerCapture?.(e.pointerId);
    };

    const onPointerMoveDrag = (e: PointerEvent) => {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      // Drag rotation factor
      manualDragOffset = Math.max(-0.65, Math.min(0.65, dragStartOffset + deltaX * 0.0035));
      targetRotY = manualDragOffset;
      targetPosX = manualDragOffset * 0.6;
    };

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      container.style.cursor = 'grab';
    };

    window.addEventListener('mousemove', onPointerMove, { passive: true });
    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMoveDrag);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('pointercancel', onPointerUp);

    // --- 4. Render Animation Loop ---
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      customUniforms.uTime.value = clock.getElapsedTime();

      // Fluid damped physics interpolation (lerp)
      const lerpSpeed = 0.07;
      currentRotY += (targetRotY - currentRotY) * lerpSpeed;
      currentRotX += (targetRotX - currentRotX) * lerpSpeed;
      currentPosX += (targetPosX - currentPosX) * lerpSpeed;

      // Apply 3D rotation and translation to the mesh
      mesh.rotation.y = currentRotY;
      mesh.rotation.x = currentRotX;
      mesh.position.x = currentPosX;

      // Soft shadow follows the figure's base
      shadowMesh.position.x = currentPosX;
      shadowMesh.rotation.z = -currentRotY * 0.25;

      renderer.render(scene, camera);
    };

    animate();

    // --- 5. Resize Handling ---
    const handleResize = () => {
      if (!container) return;
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();

      renderer.setSize(newWidth, newHeight);
      customUniforms.uResolution.value.set(newWidth, newHeight);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('resize', handleResize);

      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMoveDrag);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('pointercancel', onPointerUp);

      geometry.dispose();
      material.dispose();
      shadowGeo.dispose();
      shadowMat.dispose();
      diffuseTex?.dispose();
      depthTex?.dispose();
      renderer.dispose();

      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center justify-center select-none">
      {/* 
        Ultra-Clean, Borderless 3D Canvas Stage:
        No cards, no boxes, no buttons, no borders.
        The user stands organically in 3D space, larger and majestic.
      */}
      <div
        ref={mountRef}
        className={`relative w-full max-w-[560px] h-[640px] sm:h-[720px] lg:h-[760px] flex items-center justify-center cursor-grab active:cursor-grabbing touch-none transition-opacity duration-700 ${
          isReady ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          // Hardware acceleration
          transform: 'translateZ(0)',
        }}
      />

      {/* Subtle ambient glow behind the figure matching the dark portfolio palette */}
      <div 
        className="absolute w-[360px] sm:w-[460px] h-[520px] rounded-full bg-gradient-to-t from-[#d6c7b2]/10 via-[#00f5d4]/5 to-transparent blur-[120px] pointer-events-none -z-10"
      />
    </div>
  );
}
