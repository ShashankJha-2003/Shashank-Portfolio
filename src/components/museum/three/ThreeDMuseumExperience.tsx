'use client';

import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import Link from 'next/link';
import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { Reflector } from 'three/examples/jsm/objects/Reflector.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
import gsap from 'gsap';
import {
  LayoutGrid,
  X,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  FileText,
  Mail,
  Copy,
  CheckCircle2,
  Compass,
  Sparkles,
  RotateCcw,
  MousePointerClick,
  Send,
  Play,
  Pause,
  MoveHorizontal,
  CornerUpRight,
  CornerUpLeft,
  Sun,
  Moon,
  Share2,
} from 'lucide-react';
import { GithubIcon, LinkedinIcon } from '../../SocialIcons';
import { usePortfolio } from '../../../context/PortfolioContext';
import { withBasePath } from '../../../lib/assetPath';
import ProjectDemoPanel from '../ProjectDemoPanel';
import SocialMediaHub from '../SocialMediaHub';
import {
  CORRIDOR_HALF_W,
  ROOM_LAYOUTS_3D,
  CORNER_ROTUNDAS_3D,
  MUSEUM_CAMERA_PATH,
  MUSEUM_ROOMS_3D,
  MUSEUM_EXHIBITS_3D,
  MuseumExhibit3D,
  MuseumRoom3D,
  CornerRotunda3D,
  getRoomIndexAtProgress,
  getActiveTurnCorner,
} from './museumCatalog';
import {
  createMarbleFloorPBR,
  createStoneWallPBR,
  createSpotlightPoolTexture,
  createExhibitPanelTexture,
  createArchSignTexture,
  createProjectFrontendTexture,
} from './museumTextures';

interface ThreeDMuseumExperienceProps {
  requestedRoom?: { id: string; seq: number } | null;
  onRoomChange?: (roomId: string) => void;
}

interface RoomThemeConfig {
  fogColor: THREE.Color;
  lightColorObj: THREE.Color;
  wallColor: number;
  ceilingColor: number;
  accentHex: number;
  accentCss: string;
  lightColor: number;
  sideLightColor: number;
  keyIntensity: number;
}

const ROOM_THEMES: RoomThemeConfig[] = [
  {
    // 00 — Entrance Hall: Obsidian & Champagne Gold Atrium
    fogColor: new THREE.Color(0x0b0c10),
    lightColorObj: new THREE.Color(0xffe8c6),
    wallColor: 0x1d202b,
    ceilingColor: 0x0e1017,
    accentHex: 0xd6c7b2,
    accentCss: '#d6c7b2',
    lightColor: 0xffe6bf,
    sideLightColor: 0xe6c79c,
    keyIntensity: 5.5,
  },
  {
    // 01 — Introduction Gallery: Warm Terracotta & Sunlit Limestone Sanctuary
    fogColor: new THREE.Color(0x1b120d),
    lightColorObj: new THREE.Color(0xffc99e),
    wallColor: 0x422e23,
    ceilingColor: 0x1e140f,
    accentHex: 0xf0a978,
    accentCss: '#f0a978',
    lightColor: 0xffc694,
    sideLightColor: 0xe88d5a,
    keyIntensity: 6.2,
  },
  {
    // 02 — Exhibition Hall: Royal Emerald Dark Mode (dynamically switches to White Gallery Light Mode!)
    fogColor: new THREE.Color(0x071711),
    lightColorObj: new THREE.Color(0x86efac),
    wallColor: 0x133328,
    ceilingColor: 0x091b14,
    accentHex: 0x10b981,
    accentCss: '#10b981',
    lightColor: 0x6ee7b7,
    sideLightColor: 0x10b981,
    keyIntensity: 6.8,
  },
  {
    // 03 — Technology Gallery: Electric Sapphire Cyan & Cyber-Steel Lab
    fogColor: new THREE.Color(0x061322),
    lightColorObj: new THREE.Color(0x7dd3fc),
    wallColor: 0x10283f,
    ceilingColor: 0x071626,
    accentHex: 0x38bdf8,
    accentCss: '#38bdf8',
    lightColor: 0x38bdf8,
    sideLightColor: 0x0ea5e9,
    keyIntensity: 6.6,
  },
  {
    // 04 — Timeline Gallery: Burnished Copper & Warm Heritage Amber Corridor
    fogColor: new THREE.Color(0x1c1008),
    lightColorObj: new THREE.Color(0xffc66d),
    wallColor: 0x3d2312,
    ceilingColor: 0x1c1008,
    accentHex: 0xf59e0b,
    accentCss: '#f59e0b',
    lightColor: 0xffb74d,
    sideLightColor: 0xf97316,
    keyIntensity: 6.4,
  },
  {
    // 05 — Innovation Lab: Deep Ultraviolet, Magenta-Iris & Midnight Amethyst Dome
    fogColor: new THREE.Color(0x130824),
    lightColorObj: new THREE.Color(0xd8b4fe),
    wallColor: 0x291547,
    ceilingColor: 0x120821,
    accentHex: 0xc084fc,
    accentCss: '#c084fc',
    lightColor: 0xc084fc,
    sideLightColor: 0xe879f9,
    keyIntensity: 6.6,
  },
  {
    // 06 — Hobbies Gallery: Sunset Coral & Teal Passions Atelier
    fogColor: new THREE.Color(0x1a0d14),
    lightColorObj: new THREE.Color(0xfda4af),
    wallColor: 0x3b1b29,
    ceilingColor: 0x1c0d16,
    accentHex: 0xfb7185,
    accentCss: '#fb7185',
    lightColor: 0xffb4c2,
    sideLightColor: 0x2dd4bf,
    keyIntensity: 6.5,
  },
  {
    // 07 — Social Media Lounge: Electric Neon Magenta, Velvet Plum & Hyper-Cyan
    fogColor: new THREE.Color(0x18091d),
    lightColorObj: new THREE.Color(0xff9ad5),
    wallColor: 0x331438,
    ceilingColor: 0x16081b,
    accentHex: 0xec4899,
    accentCss: '#ec4899',
    lightColor: 0xff8ed4,
    sideLightColor: 0x38bdf8,
    keyIntensity: 6.8,
  },
  {
    // 08 — Floating Showcase: Zero-Gravity Luminous Indigo & Arctic Cyan Showroom
    fogColor: new THREE.Color(0x081020),
    lightColorObj: new THREE.Color(0xb4c2ff),
    wallColor: 0x15223d,
    ceilingColor: 0x090f20,
    accentHex: 0x818cf8,
    accentCss: '#818cf8',
    lightColor: 0xa5b4fc,
    sideLightColor: 0x67e8f9,
    keyIntensity: 6.9,
  },
  {
    // 09 — Exit Gallery: Rose Champagne, Pearl Alabaster & Starlight Rotunda
    fogColor: new THREE.Color(0x180f1b),
    lightColorObj: new THREE.Color(0xffd6e6),
    wallColor: 0x322238,
    ceilingColor: 0x170e1b,
    accentHex: 0xf4a8c4,
    accentCss: '#f4a8c4',
    lightColor: 0xffcce0,
    sideLightColor: 0xf9a8d4,
    keyIntensity: 6.4,
  },
];

// Contemporary White-Wall Gallery Colors for Projects Light Mode
const WHITE_GALLERY_WALL = new THREE.Color(0xf4f2ec);
const WHITE_GALLERY_CEILING = new THREE.Color(0xfbfaf6);
const WHITE_GALLERY_ARCH = new THREE.Color(0xeae6dd);
const WHITE_GALLERY_FOG = new THREE.Color(0xeae6de);
const WHITE_GALLERY_LIGHT = new THREE.Color(0xfffdf8);
const WHITE_FLOOR_TINT = new THREE.Color(0xe8e5de);
const DARK_FLOOR_TINT = new THREE.Color(0xffffff);
const DARK_ARCH_COLOR = new THREE.Color(0x262b38);
const ROOM2_DARK_WALL = new THREE.Color(ROOM_THEMES[2].wallColor);
const ROOM2_DARK_CEIL = new THREE.Color(ROOM_THEMES[2].ceilingColor);
const ROOM2_DARK_KEY_LIGHT = new THREE.Color(ROOM_THEMES[2].lightColor);
const ROOM2_DARK_SIDE_LIGHT = new THREE.Color(ROOM_THEMES[2].sideLightColor);

// Project world (x, z) onto the 2D Mini Turn-Map SVG (viewBox 0 0 100 175) covering all 10 rooms
const mapWorldToMiniSvg = (wx: number, wz: number) => {
  const sx = 14 + ((wx + 16) / 78) * 72;
  const sy = 167 - ((18 - wz) / 272) * 156;
  return { sx, sy };
};

export default function ThreeDMuseumExperience({
  requestedRoom,
  onRoomChange,
}: ThreeDMuseumExperienceProps) {
  const { data, playAudioCue, setResumeModalOpen, replayIntro } = usePortfolio();

  const mountRef = useRef<HTMLDivElement>(null);
  const progressObjRef = useRef({ value: 0 });
  const smoothProgressRef = useRef(0);
  const autoTourRef = useRef(false);
  const bloomEnabledRef = useRef(true);
  const projectsLightModeRef = useRef(true); // Contemporary White-Wall Light Mode ON by default for Projects!
  const resetFaceModelRef = useRef<(() => void) | null>(null);

  const startPos = useMemo(() => MUSEUM_CAMERA_PATH.getPointAt(0), []);

  const cameraStateRef = useRef({
    focused: false,
    camX: startPos.x,
    camY: startPos.y,
    camZ: startPos.z,
    lookX: startPos.x,
    lookY: 2.55,
    lookZ: startPos.z - 14,
    yawOffset: 0,
    pitchOffset: 0,
  });

  const [activeRoom, setActiveRoom] = useState<MuseumRoom3D>(MUSEUM_ROOMS_3D[0]);
  const [activeTurn, setActiveTurn] = useState<CornerRotunda3D | null>(null);
  const [hoveredExhibit, setHoveredExhibit] = useState<MuseumExhibit3D | null>(null);
  const [selectedExhibit, setSelectedExhibit] = useState<MuseumExhibit3D | null>(null);
  const [floorMapOpen, setFloorMapOpen] = useState(false);
  const [autoTour, setAutoTour] = useState(false);
  const [ultraLighting, setUltraLighting] = useState(true);
  const [projectsLightMode, setProjectsLightMode] = useState(true);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [guestForm, setGuestForm] = useState({ name: '', email: '', message: '' });
  const [guestSent, setGuestSent] = useState(false);
  const [walkProgressPct, setWalkProgressPct] = useState(0);
  const [faceAngleDeg, setFaceAngleDeg] = useState(0);
  const [isDraggingFaceUi, setIsDraggingFaceUi] = useState(false);
  const [miniVisitor, setMiniVisitor] = useState(() => {
    const p = mapWorldToMiniSvg(startPos.x, startPos.z);
    return { x: p.sx, y: p.sy, angleDeg: 0 };
  });

  const projectExhibits = useMemo(
    () => MUSEUM_EXHIBITS_3D.filter((ex) => ex.roomIndex === 2 && Boolean(ex.demoKey)),
    []
  );

  const miniMapSvgPath = useMemo(() => {
    const pts: string[] = [];
    const steps = 140;
    for (let i = 0; i <= steps; i++) {
      const p = MUSEUM_CAMERA_PATH.getPointAt(i / steps);
      const { sx, sy } = mapWorldToMiniSvg(p.x, p.z);
      pts.push(`${i === 0 ? 'M' : 'L'} ${sx.toFixed(1)} ${sy.toFixed(1)}`);
    }
    return pts.join(' ');
  }, []);

  const miniRoomDots = useMemo(
    () =>
      MUSEUM_ROOMS_3D.map((r) => {
        const p = MUSEUM_CAMERA_PATH.getPointAt(r.progress);
        const { sx, sy } = mapWorldToMiniSvg(p.x, p.z);
        return { ...r, sx, sy };
      }),
    []
  );

  useEffect(() => {
    autoTourRef.current = autoTour;
  }, [autoTour]);

  useEffect(() => {
    bloomEnabledRef.current = ultraLighting;
  }, [ultraLighting]);

  useEffect(() => {
    projectsLightModeRef.current = projectsLightMode;
  }, [projectsLightMode]);

  const stopAutoTour = useCallback(() => {
    if (autoTourRef.current) {
      autoTourRef.current = false;
      setAutoTour(false);
    }
  }, []);

  const flyToRoom = useCallback(
    (room: MuseumRoom3D) => {
      playAudioCue('whoosh');
      stopAutoTour();
      setSelectedExhibit(null);
      setFloorMapOpen(false);
      cameraStateRef.current.focused = false;
      gsap.killTweensOf(progressObjRef.current);
      gsap.killTweensOf(cameraStateRef.current);

      const dist = Math.abs(room.progress - progressObjRef.current.value);
      const dur = Math.max(1.15, Math.min(3.3, dist * 6.0));

      gsap.to(cameraStateRef.current, {
        yawOffset: 0,
        pitchOffset: 0,
        duration: 0.8,
        ease: 'power2.out',
      });
      gsap.to(progressObjRef.current, {
        value: room.progress,
        duration: dur,
        ease: 'power2.inOut',
      });
    },
    [playAudioCue, stopAutoTour]
  );

  const focusExhibit = useCallback(
    (exhibit: MuseumExhibit3D) => {
      playAudioCue('click');
      stopAutoTour();
      setSelectedExhibit(exhibit);
      setFloorMapOpen(false);
      cameraStateRef.current.focused = true;

      gsap.killTweensOf(progressObjRef.current);
      gsap.killTweensOf(cameraStateRef.current);

      progressObjRef.current.value = exhibit.pathProgress;
      smoothProgressRef.current = exhibit.pathProgress;

      gsap.to(cameraStateRef.current, {
        camX: exhibit.cameraTarget.x,
        camY: exhibit.cameraTarget.y,
        camZ: exhibit.cameraTarget.z,
        lookX: exhibit.lookAtTarget.x,
        lookY: exhibit.lookAtTarget.y,
        lookZ: exhibit.lookAtTarget.z,
        yawOffset: 0,
        pitchOffset: 0,
        duration: 1.1,
        ease: 'power3.out',
      });
    },
    [playAudioCue, stopAutoTour]
  );

  const exitFocus = useCallback(() => {
    playAudioCue('click');
    setSelectedExhibit(null);
    cameraStateRef.current.focused = false;
  }, [playAudioCue]);

  useEffect(() => {
    if (!requestedRoom) return;
    const room = MUSEUM_ROOMS_3D.find((r) => r.id === requestedRoom.id);
    if (room) flyToRoom(room);
  }, [requestedRoom, flyToRoom]);

  // =========================================================================
  // THREE.JS 8-WING TURNING ARCHITECTURAL MUSEUM + CUSTOM ART FX + WHITE MODE
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const currentBgColor = new THREE.Color(0x0b0c10);
    scene.background = currentBgColor;
    const fog = new THREE.FogExp2(0x0b0c10, 0.014);
    scene.fog = fog;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 185);
    camera.position.copy(MUSEUM_CAMERA_PATH.getPointAt(0));

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.12;
    container.appendChild(renderer.domElement);

    // PMREM Image-Based Lighting
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmremGenerator.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    scene.environmentIntensity = 0.58;
    roomEnv.dispose();
    pmremGenerator.dispose();

    // 4x MSAA HDR Post-Processing Composer
    const composerTarget = new THREE.WebGLRenderTarget(width, height, {
      type: THREE.HalfFloatType,
      samples: 4,
    });
    const composer = new EffectComposer(renderer, composerTarget);
    composer.setSize(width, height);
    composer.addPass(new RenderPass(scene, camera));
    const bloomPass = new UnrealBloomPass(new THREE.Vector2(width, height), 0.34, 0.55, 0.82);
    composer.addPass(bloomPass);
    composer.addPass(new OutputPass());

    // GPU resource trackers
    const geometries: THREE.BufferGeometry[] = [];
    const materials: THREE.Material[] = [];
    const textures: THREE.Texture[] = [];

    const trackGeo = <T extends THREE.BufferGeometry>(g: T): T => {
      geometries.push(g);
      return g;
    };
    const trackMat = <T extends THREE.Material>(m: T): T => {
      materials.push(m);
      return m;
    };
    const trackTex = <T extends THREE.Texture>(t: T): T => {
      textures.push(t);
      return t;
    };

    const interactiveMeshes: THREE.Object3D[] = [];
    const exhibitHoverGlows = new Map<string, THREE.MeshStandardMaterial>();

    // -----------------------------------------------------------------------
    // PBR TEXTURES & MATERIALS
    // -----------------------------------------------------------------------
    const marblePBR = createMarbleFloorPBR();
    marblePBR.map.repeat.set(28, 62);
    marblePBR.roughnessMap.repeat.set(28, 62);
    marblePBR.bumpMap.repeat.set(28, 62);
    trackTex(marblePBR.map);
    trackTex(marblePBR.roughnessMap);
    trackTex(marblePBR.bumpMap);

    const wallPBR = createStoneWallPBR();
    wallPBR.map.repeat.set(8, 2);
    wallPBR.bumpMap.repeat.set(8, 2);
    trackTex(wallPBR.map);
    trackTex(wallPBR.bumpMap);

    const goldPoolTex = trackTex(createSpotlightPoolTexture('#d6c7b2'));
    const terracottaPoolTex = trackTex(createSpotlightPoolTexture('#f0a978'));
    const emeraldPoolTex = trackTex(createSpotlightPoolTexture('#10b981'));
    const cyanPoolTex = trackTex(createSpotlightPoolTexture('#38bdf8'));
    const amberPoolTex = trackTex(createSpotlightPoolTexture('#f59e0b'));
    const violetPoolTex = trackTex(createSpotlightPoolTexture('#c084fc'));
    const coralPoolTex = trackTex(createSpotlightPoolTexture('#fb7185'));
    const magentaPoolTex = trackTex(createSpotlightPoolTexture('#ec4899'));
    const fbBluePoolTex = trackTex(createSpotlightPoolTexture('#1877f2'));
    const pinRedPoolTex = trackTex(createSpotlightPoolTexture('#e60023'));
    const liBluePoolTex = trackTex(createSpotlightPoolTexture('#0a66c2'));
    const indigoPoolTex = trackTex(createSpotlightPoolTexture('#818cf8'));
    const rosePoolTex = trackTex(createSpotlightPoolTexture('#f4a8c4'));

    const marbleFloorMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        map: marblePBR.map,
        roughnessMap: marblePBR.roughnessMap,
        bumpMap: marblePBR.bumpMap,
        bumpScale: 0.015,
        color: 0xffffff,
        roughness: 0.24,
        metalness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.12,
        transparent: true,
        opacity: 0.78,
      })
    );

    const archStoneMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x262b38,
        roughness: 0.48,
        metalness: 0.18,
        clearcoat: 0.25,
        clearcoatRoughness: 0.4,
      })
    );

    // Dedicated Projects Room Arch & Column Material (smoothly morphs between White Plaster & Dark Stone!)
    const projectsArchColMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xeae6dd,
        roughness: 0.42,
        metalness: 0.08,
        clearcoat: 0.2,
      })
    );

    const brushedBrassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xdccaa9,
        metalness: 0.94,
        roughness: 0.2,
        clearcoat: 0.45,
        clearcoatRoughness: 0.15,
      })
    );

    const darkMarblePlinthMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x151821,
        roughness: 0.22,
        metalness: 0.25,
        clearcoat: 0.85,
        clearcoatRoughness: 0.16,
      })
    );

    const walnutWoodMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x3b281d, roughness: 0.42, metalness: 0.08 }));
    const darkFixtureMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x0f1116, roughness: 0.32, metalness: 0.85 }));
    const museumGlassMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xffffff,
        roughness: 0.06,
        metalness: 0.05,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
        transparent: true,
        opacity: 0.11,
        depthWrite: false,
      })
    );
    const warmEmissiveMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xf5e9d6, emissive: 0xe6d2b5, emissiveIntensity: 1.35, roughness: 0.2 })
    );

    const roomAccentEmissiveMats = ROOM_THEMES.map((theme) =>
      trackMat(
        new THREE.MeshStandardMaterial({
          color: theme.accentHex,
          emissive: theme.accentHex,
          emissiveIntensity: 1.55,
          roughness: 0.2,
        })
      )
    );

    // Note: Room 02 wall uses a clean plaster-whiteable material (subtle bump, NO dark albedo tinting!)
    const roomWallMats = ROOM_THEMES.map((theme, idx) =>
      trackMat(
        new THREE.MeshStandardMaterial({
          map: idx === 2 ? null : wallPBR.map,
          bumpMap: wallPBR.bumpMap,
          bumpScale: idx === 2 ? 0.018 : 0.038,
          color: idx === 2 ? 0xf4f2ec : theme.wallColor,
          roughness: idx === 2 ? 0.58 : 0.7,
          metalness: idx === 2 ? 0.04 : 0.12,
        })
      )
    );

    const roomCeilingMats = ROOM_THEMES.map((theme, idx) =>
      trackMat(
        new THREE.MeshStandardMaterial({
          color: idx === 2 ? 0xfbfaf6 : theme.ceilingColor,
          roughness: 0.82,
          metalness: idx === 2 ? 0.04 : 0.14,
        })
      )
    );

    // -----------------------------------------------------------------------
    // GLOBAL LIGHTING (Dynamically brightens into Daylight when in White-Wall Projects!)
    // -----------------------------------------------------------------------
    const ambientLight = new THREE.AmbientLight(0xefe6d8, 0.34);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(0xf7efe0, 0x10121a, 0.44);
    scene.add(hemiLight);
    const cameraLight = new THREE.PointLight(0xffe8c6, 1.45, 34, 1.5);
    scene.add(cameraLight);

    // -----------------------------------------------------------------------
    // FULL-FOOTPRINT LIVE MIRROR MARBLE FLOOR (Covers All 10 Wings & 9 Corners)
    // -----------------------------------------------------------------------
    const floorCenterX = 22;
    const floorCenterZ = -118;
    const floorW = 120;
    const floorD = 310;

    const floorReflector = new Reflector(trackGeo(new THREE.PlaneGeometry(floorW, floorD)), {
      clipBias: 0.004,
      textureWidth: 768,
      textureHeight: 768,
      color: 0x3b3f4a,
    });
    floorReflector.rotation.x = -Math.PI / 2;
    floorReflector.position.set(floorCenterX, 0.0, floorCenterZ);
    scene.add(floorReflector);

    const marbleFloor = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(floorW, floorD)), marbleFloorMat);
    marbleFloor.rotation.x = -Math.PI / 2;
    marbleFloor.position.set(floorCenterX, 0.012, floorCenterZ);
    scene.add(marbleFloor);

    // -----------------------------------------------------------------------
    // SHARED GEOMETRIES & ARCHWAY BUILDER
    // -----------------------------------------------------------------------
    const colGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.38, 8.0, 24));
    const colBaseGeo = trackGeo(new THREE.BoxGeometry(1.05, 0.32, 1.05));
    const colCapGeo = trackGeo(new THREE.BoxGeometry(1.05, 0.24, 1.05));
    const colRingGeo = trackGeo(new THREE.TorusGeometry(0.38, 0.035, 10, 28));
    const colAccentRingGeo = trackGeo(new THREE.TorusGeometry(0.355, 0.024, 10, 28));
    const ceilingBeamGeo = trackGeo(new THREE.BoxGeometry(19.2, 0.5, 0.65));
    const skylightFrameGeo = trackGeo(new THREE.BoxGeometry(6.4, 0.16, 1.15));
    const skylightPanelGeo = trackGeo(new THREE.PlaneGeometry(5.9, 0.72));
    const spotCanGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.14, 0.36, 14));
    const spotLensGeo = trackGeo(new THREE.CircleGeometry(0.11, 14));

    const archWallShape = new THREE.Shape();
    archWallShape.moveTo(-9.6, 0);
    archWallShape.lineTo(-4.6, 0);
    archWallShape.lineTo(-4.6, 2.4);
    archWallShape.absarc(0, 2.4, 4.6, Math.PI, 0, true);
    archWallShape.lineTo(4.6, 0);
    archWallShape.lineTo(9.6, 0);
    archWallShape.lineTo(9.6, 8.4);
    archWallShape.lineTo(-9.6, 8.4);
    archWallShape.closePath();

    const sharedArchExtrudeGeo = trackGeo(
      new THREE.ExtrudeGeometry(archWallShape, {
        depth: 1.05,
        bevelEnabled: true,
        bevelThickness: 0.08,
        bevelSize: 0.07,
        bevelSegments: 3,
        curveSegments: 36,
      })
    );
    sharedArchExtrudeGeo.translate(0, 0, -0.525);

    const buildArchPortalGroup = (
      roomNum: string,
      roomTitle: string,
      accentHex: number,
      accentCss: string,
      wallMat: THREE.Material
    ) => {
      const group = new THREE.Group();
      group.add(new THREE.Mesh(sharedArchExtrudeGeo, wallMat));

      const brassArchRim = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(4.62, 0.075, 16, 56, Math.PI)),
        brushedBrassMat
      );
      brassArchRim.position.set(0, 2.4, 0.56);
      group.add(brassArchRim);

      const glowArchMat = trackMat(
        new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.9, roughness: 0.2 })
      );
      const glowArch = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(4.48, 0.045, 12, 56, Math.PI)), glowArchMat);
      glowArch.position.set(0, 2.4, 0.52);
      group.add(glowArch);

      const jambGeo = trackGeo(new THREE.BoxGeometry(0.08, 2.42, 0.08));
      [-4.6, 4.6].forEach((jx) => {
        const jamb = new THREE.Mesh(jambGeo, brushedBrassMat);
        jamb.position.set(jx, 1.21, 0.56);
        group.add(jamb);
      });

      const signTex = trackTex(createArchSignTexture(roomNum, roomTitle, accentCss));
      const signBack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(5.5, 0.98, 0.14)), brushedBrassMat);
      signBack.position.set(0, 7.62, 0.58);
      group.add(signBack);

      const signMesh = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(5.32, 0.86)),
        trackMat(new THREE.MeshBasicMaterial({ map: signTex }))
      );
      signMesh.position.set(0, 7.62, 0.66);
      group.add(signMesh);

      return group;
    };

    // Track Room 02 lights for live White-Wall / Dark-Mode switching
    let projectsKeyLight: THREE.PointLight | null = null;
    let projectsSideLight: THREE.PointLight | null = null;
    let projectsExtraDaylight: THREE.PointLight | null = null;
    let corner1LightRef: THREE.PointLight | null = null;

    // -----------------------------------------------------------------------
    // CREATE ALL 8 ORIENTED ROOM GROUPS & ARCHITECTURAL SHELLS
    // -----------------------------------------------------------------------
    const roomGroups: THREE.Group[] = ROOM_LAYOUTS_3D.map((layout, idx) => {
      const grp = new THREE.Group();
      grp.position.set(layout.originX, 0, layout.originZ);
      grp.rotation.y = layout.yaw;

      const theme = ROOM_THEMES[idx];
      const accentMat = roomAccentEmissiveMats[idx];
      const colBeamMat = idx === 2 ? projectsArchColMat : archStoneMat;
      const L = layout.length;
      const midZ = -L * 0.5;

      const ceiling = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(CORRIDOR_HALF_W * 2, L)), roomCeilingMats[idx]);
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.set(0, 8.4, midZ);
      grp.add(ceiling);

      const sideWallGeo = trackGeo(new THREE.PlaneGeometry(L, 8.4));
      const leftWall = new THREE.Mesh(sideWallGeo, roomWallMats[idx]);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.position.set(-CORRIDOR_HALF_W, 4.2, midZ);
      grp.add(leftWall);

      const rightWall = new THREE.Mesh(sideWallGeo, roomWallMats[idx]);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.position.set(CORRIDOR_HALF_W, 4.2, midZ);
      grp.add(rightWall);

      const baseGeo = trackGeo(new THREE.BoxGeometry(0.24, 0.34, L));
      const corniceGeo = trackGeo(new THREE.BoxGeometry(0.45, 0.36, L));
      const coveGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.055, L - 0.3));
      const upperCoveGeo = trackGeo(new THREE.BoxGeometry(0.05, 0.045, L - 0.3));
      const trackGeoRail = trackGeo(new THREE.BoxGeometry(0.1, 0.08, L));
      const floorRailGeo = trackGeo(new THREE.BoxGeometry(0.06, 0.016, L));

      [-CORRIDOR_HALF_W + 0.12, CORRIDOR_HALF_W - 0.12].forEach((wx) => {
        const sign = wx < 0 ? 1 : -1;
        const base = new THREE.Mesh(baseGeo, darkMarblePlinthMat);
        base.position.set(wx, 0.17, midZ);
        grp.add(base);

        const cove = new THREE.Mesh(coveGeo, accentMat);
        cove.position.set(wx + sign * 0.13, 0.36, midZ);
        grp.add(cove);

        const upperCove = new THREE.Mesh(upperCoveGeo, accentMat);
        upperCove.position.set(wx + sign * 0.2, 7.98, midZ);
        grp.add(upperCove);

        const cornice = new THREE.Mesh(corniceGeo, colBeamMat);
        cornice.position.set(wx + sign * 0.1, 8.2, midZ);
        grp.add(cornice);
      });

      [-4.8, 4.8].forEach((tx) => {
        const rail = new THREE.Mesh(trackGeoRail, darkFixtureMat);
        rail.position.set(tx, 7.95, midZ);
        grp.add(rail);
      });

      [-2.25, 2.25].forEach((rx) => {
        const floorRail = new THREE.Mesh(floorRailGeo, accentMat);
        floorRail.position.set(rx, 0.018, midZ);
        grp.add(floorRail);
      });

      for (let z = -5; z >= -L + 4; z -= 12) {
        [-8.75, 8.75].forEach((x) => {
          const col = new THREE.Mesh(colGeo, colBeamMat);
          col.position.set(x, 4.15, z);
          grp.add(col);
          const base = new THREE.Mesh(colBaseGeo, darkMarblePlinthMat);
          base.position.set(x, 0.16, z);
          grp.add(base);
          const brassLow = new THREE.Mesh(colRingGeo, brushedBrassMat);
          brassLow.rotation.x = Math.PI / 2;
          brassLow.position.set(x, 0.34, z);
          grp.add(brassLow);
          const accentMid = new THREE.Mesh(colAccentRingGeo, accentMat);
          accentMid.rotation.x = Math.PI / 2;
          accentMid.position.set(x, 5.8, z);
          grp.add(accentMid);
          const cap = new THREE.Mesh(colCapGeo, brushedBrassMat);
          cap.position.set(x, 8.05, z);
          grp.add(cap);
        });

        const beam = new THREE.Mesh(ceilingBeamGeo, colBeamMat);
        beam.position.set(0, 8.2, z);
        grp.add(beam);

        if (z - 6 > -L + 2) {
          const skylightFrame = new THREE.Mesh(skylightFrameGeo, darkMarblePlinthMat);
          skylightFrame.position.set(0, 8.32, z - 6);
          grp.add(skylightFrame);
          const skylightPanel = new THREE.Mesh(skylightPanelGeo, idx === 2 ? warmEmissiveMat : accentMat);
          skylightPanel.rotation.x = Math.PI / 2;
          skylightPanel.position.set(0, 8.23, z - 6);
          grp.add(skylightPanel);
        }

        [-4.8, 4.8].forEach((tx) => {
          const canGroup = new THREE.Group();
          canGroup.position.set(tx, 7.75, z - 3);
          canGroup.rotation.z = tx < 0 ? 0.42 : -0.42;
          canGroup.add(new THREE.Mesh(spotCanGeo, darkFixtureMat));
          const lens = new THREE.Mesh(spotLensGeo, accentMat);
          lens.rotation.x = Math.PI / 2;
          lens.position.y = -0.185;
          canGroup.add(lens);
          grp.add(canGroup);
        });
      }

      const keyPt = new THREE.PointLight(theme.lightColor, theme.keyIntensity, L * 1.25, 1.32);
      keyPt.position.set(0, 7.2, midZ);
      grp.add(keyPt);

      const sidePt = new THREE.PointLight(theme.sideLightColor, theme.keyIntensity * 0.72, L * 1.0, 1.4);
      sidePt.position.set(idx % 2 === 0 ? -6.2 : 6.2, 4.4, midZ + 2);
      grp.add(sidePt);

      if (idx === 2) {
        projectsKeyLight = keyPt;
        projectsSideLight = sidePt;
        // Additional crisp gallery daylight fill for bright White-Wall Light Mode
        projectsExtraDaylight = new THREE.PointLight(0xfffdf8, 12.0, 48, 1.1);
        projectsExtraDaylight.position.set(0, 6.8, -11);
        grp.add(projectsExtraDaylight);
      }

      scene.add(grp);
      return grp;
    });

    const entranceBackWall = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(CORRIDOR_HALF_W * 2, 8.4)), roomWallMats[0]);
    entranceBackWall.rotation.y = Math.PI;
    entranceBackWall.position.set(0, 4.2, 0);
    roomGroups[0].add(entranceBackWall);

    // -----------------------------------------------------------------------
    // 7 ILLUMINATED 90° CORNER TURNING ROTUNDAS
    // -----------------------------------------------------------------------
    const cornerSpinnerRings: THREE.Mesh[] = [];
    const cornerWallGeo = trackGeo(new THREE.PlaneGeometry(CORRIDOR_HALF_W * 2, 8.4));
    const cornerCeilGeo = trackGeo(new THREE.PlaneGeometry(CORRIDOR_HALF_W * 2, CORRIDOR_HALF_W * 2));
    const cornerBaseGeo = trackGeo(new THREE.BoxGeometry(CORRIDOR_HALF_W * 2, 0.34, 0.24));
    const cornerCoveGeo = trackGeo(new THREE.BoxGeometry(CORRIDOR_HALF_W * 2 - 0.3, 0.055, 0.06));
    const oculusBrassGeo = trackGeo(new THREE.TorusGeometry(4.2, 0.14, 14, 56));
    const oculusGlowGeo = trackGeo(new THREE.CircleGeometry(3.9, 40));
    const floorCompassRingGeo = trackGeo(new THREE.TorusGeometry(3.1, 0.03, 10, 56));

    CORNER_ROTUNDAS_3D.forEach((corner) => {
      const cGrp = new THREE.Group();
      cGrp.position.set(corner.centerX, 0, corner.centerZ);
      cGrp.rotation.y = corner.yawIn;

      const nextTheme = ROOM_THEMES[corner.toRoomIdx];
      const nextAccentMat = roomAccentEmissiveMats[corner.toRoomIdx];
      const nextWallMat = roomWallMats[corner.toRoomIdx];
      const isRight = corner.turnDir === 'right';

      const cCeil = new THREE.Mesh(cornerCeilGeo, roomCeilingMats[corner.toRoomIdx]);
      cCeil.rotation.x = Math.PI / 2;
      cCeil.position.set(0, 8.4, 0);
      cGrp.add(cCeil);

      const oculusBrass = new THREE.Mesh(oculusBrassGeo, brushedBrassMat);
      oculusBrass.rotation.x = Math.PI / 2;
      oculusBrass.position.set(0, 8.24, 0);
      cGrp.add(oculusBrass);

      const oculusGlow = new THREE.Mesh(oculusGlowGeo, nextAccentMat);
      oculusGlow.rotation.x = Math.PI / 2;
      oculusGlow.position.set(0, 8.28, 0);
      cGrp.add(oculusGlow);

      const floorCompass = new THREE.Mesh(floorCompassRingGeo, nextAccentMat);
      floorCompass.rotation.x = Math.PI / 2;
      floorCompass.position.set(0, 0.02, 0);
      cGrp.add(floorCompass);

      const cornerLight = new THREE.PointLight(nextTheme.lightColor, 5.2, 28, 1.35);
      cornerLight.position.set(0, 7.0, 0);
      cGrp.add(cornerLight);
      if (corner.index === 1) corner1LightRef = cornerLight;

      const farWall = new THREE.Mesh(cornerWallGeo, nextWallMat);
      farWall.position.set(0, 4.2, -CORRIDOR_HALF_W);
      cGrp.add(farWall);

      const farBase = new THREE.Mesh(cornerBaseGeo, darkMarblePlinthMat);
      farBase.position.set(0, 0.17, -CORRIDOR_HALF_W + 0.12);
      cGrp.add(farBase);

      const farCove = new THREE.Mesh(cornerCoveGeo, nextAccentMat);
      farCove.position.set(0, 0.36, -CORRIDOR_HALF_W + 0.25);
      cGrp.add(farCove);

      const dirTex = trackTex(
        createExhibitPanelTexture({
          code: `GALLERY TURN // ${isRight ? '90° RIGHT →' : '← 90° LEFT'}`,
          title: `ROOM ${corner.nextRoomNum} — ${corner.nextRoomTitle}`,
          subtitle: isRight ? 'FOLLOW THE ROTUNDA RIGHT TO ENTER' : 'FOLLOW THE ROTUNDA LEFT TO ENTER',
          body: 'Scroll forward to glide smoothly around this architectural corner into the next gallery wing.',
          centered: true,
          accent: corner.accentCss,
          width: 1024,
          height: 460,
        })
      );
      const dirBack = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(6.6, 2.85, 0.16)), brushedBrassMat);
      dirBack.position.set(0, 3.65, -CORRIDOR_HALF_W + 0.16);
      cGrp.add(dirBack);
      const dirFace = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(6.35, 2.62)),
        trackMat(new THREE.MeshBasicMaterial({ map: dirTex }))
      );
      dirFace.position.set(0, 3.65, -CORRIDOR_HALF_W + 0.26);
      cGrp.add(dirFace);

      const sideX = isRight ? -CORRIDOR_HALF_W : CORRIDOR_HALF_W;
      const sideSign = isRight ? 1 : -1;
      const outerWall = new THREE.Mesh(cornerWallGeo, nextWallMat);
      outerWall.rotation.y = isRight ? Math.PI / 2 : -Math.PI / 2;
      outerWall.position.set(sideX, 4.2, 0);
      cGrp.add(outerWall);

      const outerBase = new THREE.Mesh(cornerBaseGeo, darkMarblePlinthMat);
      outerBase.rotation.y = Math.PI / 2;
      outerBase.position.set(sideX + sideSign * 0.12, 0.17, 0);
      cGrp.add(outerBase);

      const outerCove = new THREE.Mesh(cornerCoveGeo, nextAccentMat);
      outerCove.rotation.y = Math.PI / 2;
      outerCove.position.set(sideX + sideSign * 0.25, 0.36, 0);
      cGrp.add(outerCove);

      const archPortal = buildArchPortalGroup(
        corner.nextRoomNum,
        corner.nextRoomTitle,
        corner.accentHex,
        corner.accentCss,
        corner.toRoomIdx === 2 ? projectsArchColMat : archStoneMat
      );
      archPortal.position.set(isRight ? CORRIDOR_HALF_W : -CORRIDOR_HALF_W, 0, 0);
      archPortal.rotation.y = isRight ? -Math.PI / 2 : Math.PI / 2;
      cGrp.add(archPortal);

      const pivotX = isRight ? CORRIDOR_HALF_W : -CORRIDOR_HALF_W;
      [7.25, 11.75].forEach((arcR) => {
        const arcMesh = new THREE.Mesh(
          trackGeo(new THREE.TorusGeometry(arcR, 0.032, 8, 28, Math.PI / 2)),
          nextAccentMat
        );
        arcMesh.position.set(pivotX, 0.018, CORRIDOR_HALF_W);
        if (isRight) {
          arcMesh.rotation.order = 'YXZ';
          arcMesh.rotation.x = Math.PI / 2;
          arcMesh.rotation.y = Math.PI;
        } else {
          arcMesh.rotation.x = -Math.PI / 2;
        }
        cGrp.add(arcMesh);
      });

      const beaconX = isRight ? -6.3 : 6.3;
      const beaconGrp = new THREE.Group();
      beaconGrp.position.set(beaconX, 0, -6.3);
      const bPlinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.68, 0.82, 0.9, 24)), darkMarblePlinthMat);
      bPlinth.position.y = 0.45;
      beaconGrp.add(bPlinth);
      const bCore = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.14, 0.14, 3.1, 16)), nextAccentMat);
      bCore.position.y = 2.45;
      beaconGrp.add(bCore);
      const bRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.66, 0.035, 12, 36)), brushedBrassMat);
      bRing.position.y = 2.55;
      beaconGrp.add(bRing);
      cornerSpinnerRings.push(bRing);
      cGrp.add(beaconGrp);

      scene.add(cGrp);
    });

    // -----------------------------------------------------------------------
    // SHARED HELPERS: INTERACTIVE REGISTRY, FRAMES, PEDESTALS & BENCHES
    // -----------------------------------------------------------------------
    const registerInteractive = (mesh: THREE.Object3D, exhibitId: string, glowMat?: THREE.MeshStandardMaterial) => {
      mesh.userData.exhibitId = exhibitId;
      interactiveMeshes.push(mesh);
      if (glowMat) exhibitHoverGlows.set(exhibitId, glowMat);
    };

    const createMuseumBench = (parent: THREE.Object3D, x: number, z: number, rotY = 0) => {
      const bench = new THREE.Group();
      bench.position.set(x, 0, z);
      bench.rotation.y = rotY;
      const seat = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.8, 0.14, 0.78)), walnutWoodMat);
      seat.position.y = 0.56;
      bench.add(seat);
      const brassTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.84, 0.03, 0.81)), brushedBrassMat);
      brassTrim.position.y = 0.48;
      bench.add(brassTrim);
      const legGeo = trackGeo(new THREE.BoxGeometry(0.12, 0.48, 0.66));
      [-1.12, 1.12].forEach((lx) => {
        const leg = new THREE.Mesh(legGeo, darkMarblePlinthMat);
        leg.position.set(lx, 0.24, 0);
        bench.add(leg);
      });
      parent.add(bench);
    };

    const createStandingExhibitFrame = (
      parent: THREE.Object3D,
      params: {
        exhibitId: string;
        x: number;
        z: number;
        rotY: number;
        width?: number;
        height?: number;
        texture: THREE.Texture;
        accentHex?: number;
        poolTexture?: THREE.CanvasTexture;
      }
    ) => {
      const fw = params.width || 4.8;
      const fh = params.height || 3.35;
      const accentHex = params.accentHex || 0xd6c7b2;

      const group = new THREE.Group();
      group.position.set(params.x, 0, params.z);
      group.rotation.y = params.rotY;

      const lowerPlinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(fw + 0.72, 0.16, 1.05)), darkMarblePlinthMat);
      lowerPlinth.position.set(0, 0.08, 0);
      group.add(lowerPlinth);

      const upperPlinth = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(fw + 0.45, 0.16, 0.8)), brushedBrassMat);
      upperPlinth.position.set(0, 0.22, 0);
      group.add(upperPlinth);

      const floorPool = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(fw * 1.15, 2.8)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: params.poolTexture || goldPoolTex,
            transparent: true,
            opacity: 0.45,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      floorPool.rotation.x = -Math.PI / 2;
      floorPool.position.set(0, 0.025, 1.0);
      group.add(floorPool);

      const frameGlowMat = trackMat(
        new THREE.MeshStandardMaterial({
          color: 0x1b1f2a,
          emissive: new THREE.Color(accentHex),
          emissiveIntensity: 0.07,
          roughness: 0.35,
          metalness: 0.62,
        })
      );
      const backing = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(fw + 0.34, fh + 0.34, 0.28)), frameGlowMat);
      backing.position.set(0, fh / 2 + 0.68, 0);
      group.add(backing);

      const hBarGeo = trackGeo(new THREE.BoxGeometry(fw + 0.38, 0.07, 0.32));
      const vBarGeo = trackGeo(new THREE.BoxGeometry(0.07, fh + 0.38, 0.32));
      const topBar = new THREE.Mesh(hBarGeo, brushedBrassMat);
      topBar.position.set(0, fh + 0.85, 0.01);
      group.add(topBar);
      const botBar = new THREE.Mesh(hBarGeo, brushedBrassMat);
      botBar.position.set(0, 0.51, 0.01);
      group.add(botBar);
      const leftBar = new THREE.Mesh(vBarGeo, brushedBrassMat);
      leftBar.position.set(-(fw / 2 + 0.16), fh / 2 + 0.68, 0.01);
      group.add(leftBar);
      const rightBar = new THREE.Mesh(vBarGeo, brushedBrassMat);
      rightBar.position.set(fw / 2 + 0.16, fh / 2 + 0.68, 0.01);
      group.add(rightBar);

      const lightArm = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.06, 0.06, 0.65)), brushedBrassMat);
      lightArm.position.set(0, fh + 0.94, 0.32);
      group.add(lightArm);
      const lightBar = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.045, 0.045, 1.35, 16)), brushedBrassMat);
      lightBar.rotation.z = Math.PI / 2;
      lightBar.position.set(0, fh + 0.92, 0.62);
      group.add(lightBar);
      const bulbGlow = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(1.18, 0.06)), warmEmissiveMat);
      bulbGlow.rotation.x = Math.PI / 2;
      bulbGlow.position.set(0, fh + 0.87, 0.62);
      group.add(bulbGlow);

      const faceMesh = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(fw, fh)),
        trackMat(new THREE.MeshBasicMaterial({ map: params.texture }))
      );
      faceMesh.position.set(0, fh / 2 + 0.68, 0.155);
      group.add(faceMesh);

      const glassPane = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(fw, fh)), museumGlassMat);
      glassPane.position.set(0, fh / 2 + 0.68, 0.185);
      group.add(glassPane);

      const beam = new THREE.Mesh(
        trackGeo(new THREE.ConeGeometry(2.3, 6.4, 24, 1, true)),
        trackMat(
          new THREE.MeshBasicMaterial({
            color: accentHex,
            transparent: true,
            opacity: 0.014,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          })
        )
      );
      beam.position.set(0, 5.1, 0.85);
      group.add(beam);

      registerInteractive(faceMesh, params.exhibitId, frameGlowMat);
      registerInteractive(backing, params.exhibitId);

      parent.add(group);
      return group;
    };

    const createLuxuryPedestal = (
      parent: THREE.Object3D,
      params: {
        x: number;
        z: number;
        radius?: number;
        height?: number;
        accentHex?: number;
        poolTexture?: THREE.CanvasTexture;
        withGlassVitrine?: boolean;
        vitrineHeight?: number;
        withSpotlightCone?: boolean;
      }
    ) => {
      const r = params.radius || 1.45;
      const h = params.height || 1.0;
      const accentHex = params.accentHex || 0xd6c7b2;

      const group = new THREE.Group();
      group.position.set(params.x, 0, params.z);

      const step1 = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(r * 1.24, r * 1.32, 0.18, 40)), darkMarblePlinthMat);
      step1.position.y = 0.09;
      group.add(step1);

      const drum = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(r, r * 1.06, h - 0.18, 40)), darkMarblePlinthMat);
      drum.position.y = 0.18 + (h - 0.18) / 2;
      group.add(drum);

      const topBrass = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r + 0.02, 0.04, 14, 56)), brushedBrassMat);
      topBrass.rotation.x = Math.PI / 2;
      topBrass.position.y = h;
      group.add(topBrass);

      const accentRingMat = trackMat(
        new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.65, roughness: 0.2 })
      );
      const baseGlowRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r * 1.25, 0.02, 12, 56)), accentRingMat);
      baseGlowRing.rotation.x = Math.PI / 2;
      baseGlowRing.position.y = 0.19;
      group.add(baseGlowRing);

      const pool = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(r * 4.4, r * 4.4)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: params.poolTexture || goldPoolTex,
            transparent: true,
            opacity: 0.55,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.y = 0.026;
      group.add(pool);

      if (params.withGlassVitrine) {
        const vh = params.vitrineHeight || 2.95;
        const glassCyl = new THREE.Mesh(
          trackGeo(new THREE.CylinderGeometry(r * 0.94, r * 0.94, vh, 36, 1, true)),
          museumGlassMat
        );
        glassCyl.position.y = h + vh / 2;
        group.add(glassCyl);

        const vitrineTopRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(r * 0.94, 0.022, 12, 48)), brushedBrassMat);
        vitrineTopRing.rotation.x = Math.PI / 2;
        vitrineTopRing.position.y = h + vh;
        group.add(vitrineTopRing);
      }

      if (params.withSpotlightCone !== false) {
        const beam = new THREE.Mesh(
          trackGeo(new THREE.ConeGeometry(r * 1.9, 7.3, 28, 1, true)),
          trackMat(
            new THREE.MeshBasicMaterial({
              color: accentHex,
              transparent: true,
              opacity: 0.032,
              depthWrite: false,
              blending: THREE.AdditiveBlending,
              side: THREE.DoubleSide,
            })
          )
        );
        beam.position.y = 4.7;
        group.add(beam);
      }

      parent.add(group);
      return group;
    };

    // -----------------------------------------------------------------------
    // CUSTOM ART SHADER MATERIALS (UNIQUE ARTISTIC EFFECT PER SCULPTURE!)
    // -----------------------------------------------------------------------
    // ART FX 1: Iridescent Fresnel Crystal Prism Shader (Room 00 Chandelier & Room 06 Code Cube)
    const iridescentCrystalMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vPos;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            vPos = position;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vPos;
          void main() {
            float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.4);
            vec3 goldBase = vec3(0.85, 0.72, 0.48);
            vec3 spectral = 0.55 + 0.45 * cos(uTime * 1.1 + vPos.y * 2.5 + fresnel * 4.5 + vec3(0.0, 2.1, 4.2));
            vec3 col = mix(goldBase * 0.45, spectral * 1.35, clamp(fresnel * 1.35, 0.0, 1.0));
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      })
    );

    // ART FX 2: Holographic Cyberpunk Scanline Projection Aura Shader (Room 02 Vertex Phone X1)
    const holoScanAuraMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec2 vUv;
          void main() {
            vUv = uv;
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec2 vUv;
          void main() {
            float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), 2.0);
            float scanlines = 0.5 + 0.5 * sin(vUv.y * 95.0 - uTime * 7.0);
            float sweep = smoothstep(0.06, 0.0, abs(fract(vUv.y - uTime * 0.35) - 0.5));
            vec3 col = mix(vec3(0.08, 0.88, 0.65), vec3(0.32, 0.78, 1.0), vUv.y);
            float alpha = clamp(fresnel * 0.48 + scanlines * 0.09 + sweep * 0.52, 0.0, 0.72);
            gl_FragColor = vec4(col * (1.1 + sweep * 1.2), alpha);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
      })
    );

    // ART FX 3: Liquid Dichroic Rainbow Glass Art Shader (Room 03 Three.js TorusKnot)
    const dichroicGlassMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vWorldPos;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            vWorldPos = (modelMatrix * vec4(position, 1.0)).xyz;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vWorldPos;
          void main() {
            float ndv = max(dot(vNormal, vViewDir), 0.0);
            float fresnel = pow(1.0 - ndv, 2.2);
            float wave = sin(vWorldPos.x * 2.2 + vWorldPos.y * 2.4 + uTime * 1.4) * 0.5 + 0.5;
            vec3 rainbow = 0.52 + 0.48 * cos(6.28318 * (ndv * 0.65 + wave * 0.25 + uTime * 0.12 + vec3(0.0, 0.33, 0.67)));
            vec3 specular = vec3(1.0) * pow(ndv, 18.0) * 0.65;
            vec3 col = rainbow * (0.65 + fresnel * 1.15) + specular;
            gl_FragColor = vec4(col, 1.0);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
      })
    );

    // ART FX 4: Aurora Plasma Energy Orb Shader (Room 05 Innovation Lab Core)
    const auroraPlasmaMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0 } },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vPos;
          void main() {
            vec4 mv = modelViewMatrix * vec4(position, 1.0);
            vNormal = normalize(normalMatrix * normal);
            vViewDir = normalize(-mv.xyz);
            vPos = position;
            gl_Position = projectionMatrix * mv;
          }
        `,
        fragmentShader: `
          uniform float uTime;
          varying vec3 vNormal;
          varying vec3 vViewDir;
          varying vec3 vPos;
          void main() {
            float fresnel = pow(1.0 - max(dot(vNormal, vViewDir), 0.0), 2.1);
            float plasma = sin(vPos.x * 5.0 + uTime * 2.2) * cos(vPos.y * 5.5 - uTime * 1.8) + sin(vPos.z * 4.5 + uTime * 1.5);
            vec3 c1 = vec3(0.68, 0.25, 0.98);
            vec3 c2 = vec3(0.95, 0.32, 0.82);
            vec3 c3 = vec3(0.22, 0.82, 0.98);
            vec3 col = mix(c1, c2, plasma * 0.4 + 0.5);
            col = mix(col, c3, fresnel);
            gl_FragColor = vec4(col * (0.85 + fresnel * 1.15), 0.92);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
      })
    );

    // =======================================================================
    // ROOM 00 — ENTRANCE HALL (OBSIDIAN & GOLD ATRIUM)
    // =======================================================================
    const r0 = roomGroups[0];
    const cpLocalZ = -11.8;

    createLuxuryPedestal(r0, {
      x: 0,
      z: cpLocalZ,
      radius: 1.65,
      height: 0.54,
      accentHex: 0xd6c7b2,
      poolTexture: goldPoolTex,
      withSpotlightCone: false,
    });

    const centerpieceKeyLight = new THREE.PointLight(0xfff1dc, 4.2, 18, 1.4);
    centerpieceKeyLight.position.set(0, 6.2, cpLocalZ + 2.4);
    r0.add(centerpieceKeyLight);

    const uplightHousingGeo = trackGeo(new THREE.CylinderGeometry(0.12, 0.16, 0.24, 16));
    const uplightLensGeo = trackGeo(new THREE.CircleGeometry(0.11, 16));
    [-1.92, 1.92].forEach((ux) => {
      const uplight = new THREE.Group();
      uplight.position.set(ux, 0.12, cpLocalZ + 0.95);
      uplight.rotation.z = ux < 0 ? -0.45 : 0.45;
      uplight.rotation.x = -0.25;
      uplight.add(new THREE.Mesh(uplightHousingGeo, darkFixtureMat));
      const lens = new THREE.Mesh(uplightLensGeo, warmEmissiveMat);
      lens.rotation.x = -Math.PI / 2;
      lens.position.y = 0.125;
      uplight.add(lens);
      r0.add(uplight);
    });

    const stanchionPostGeo = trackGeo(new THREE.CylinderGeometry(0.045, 0.055, 0.92, 16));
    const stanchionBaseGeo = trackGeo(new THREE.CylinderGeometry(0.18, 0.21, 0.06, 20));
    const stanchionBallGeo = trackGeo(new THREE.SphereGeometry(0.072, 16, 16));
    const velvetRopeMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x6b1c26, roughness: 0.65, metalness: 0.15 }));
    [-1, 1].forEach((xSide) => {
      const zA = cpLocalZ + 1.25;
      const zB = cpLocalZ - 1.15;
      const xA = xSide * 2.55;
      const xB = xSide * 2.7;
      [
        [xA, zA],
        [xB, zB],
      ].forEach(([px, pz]) => {
        const postGrp = new THREE.Group();
        postGrp.position.set(px, 0, pz);
        const base = new THREE.Mesh(stanchionBaseGeo, brushedBrassMat);
        base.position.y = 0.03;
        postGrp.add(base);
        const shaft = new THREE.Mesh(stanchionPostGeo, brushedBrassMat);
        shaft.position.y = 0.48;
        postGrp.add(shaft);
        const finial = new THREE.Mesh(stanchionBallGeo, brushedBrassMat);
        finial.position.y = 0.97;
        postGrp.add(finial);
        r0.add(postGrp);
      });
      const ropeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(xA, 0.88, zA),
        new THREE.Vector3((xA + xB) * 0.5, 0.64, (zA + zB) * 0.5),
        new THREE.Vector3(xB, 0.88, zB),
      ]);
      r0.add(new THREE.Mesh(trackGeo(new THREE.TubeGeometry(ropeCurve, 18, 0.026, 8, false)), velvetRopeMat));
    });

    const pilasterGeo = trackGeo(new THREE.BoxGeometry(0.14, 7.6, 0.24));
    [-6, -12, -18, -24].forEach((pz) => {
      [-9.42, 9.42].forEach((px) => {
        const pil = new THREE.Mesh(pilasterGeo, brushedBrassMat);
        pil.position.set(px, 4.15, pz);
        r0.add(pil);
      });
    });

    // Precision 36-Tick Brushed-Brass 360° Turntable synced to 3D Face Model Drag
    const faceTurntableGroup = new THREE.Group();
    faceTurntableGroup.position.set(0, 0.56, cpLocalZ);
    const turntableOuterRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.66, 0.036, 18, 84)), brushedBrassMat);
    turntableOuterRing.rotation.x = Math.PI / 2;
    faceTurntableGroup.add(turntableOuterRing);
    const turntableHaloMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xe6d6bc, emissive: 0xd6c09c, emissiveIntensity: 0.65, roughness: 0.25 })
    );
    const turntableInnerHalo = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.36, 0.018, 14, 72)), turntableHaloMat);
    turntableInnerHalo.rotation.x = Math.PI / 2;
    turntableInnerHalo.position.y = 0.02;
    faceTurntableGroup.add(turntableInnerHalo);
    const tickGeo = trackGeo(new THREE.BoxGeometry(0.032, 0.024, 0.15));
    const majorTickGeo = trackGeo(new THREE.BoxGeometry(0.055, 0.036, 0.24));
    for (let t = 0; t < 36; t++) {
      const angle = (t / 36) * Math.PI * 2;
      const isCardinal = t % 9 === 0;
      const tick = new THREE.Mesh(isCardinal ? majorTickGeo : tickGeo, isCardinal ? turntableHaloMat : brushedBrassMat);
      tick.position.set(Math.sin(angle) * 1.48, 0.032, Math.cos(angle) * 1.48);
      tick.rotation.y = angle;
      faceTurntableGroup.add(tick);
    }
    r0.add(faceTurntableGroup);

    // GPU-Resident 96-Angle RGBA WebP Turntable Atlas (4 sheets x 24 angles = 3.75° spacing!)
    // Zero <video> seeking latency -> locked 60-120 FPS liquid-smooth 360° drag rotation!
    const TURNTABLE_TOTAL_FRAMES = 96;
    const texLoader = new THREE.TextureLoader();
    const sheetLoaded = [false, false, false, false];
    const sheetTexs: THREE.Texture[] = [0, 1, 2, 3].map((idx) => {
      const tex = trackTex(
        texLoader.load(withBasePath(`/face_turntable_${idx}.webp?v=7`), () => {
          sheetLoaded[idx] = true;
          if (idx === 0) {
            faceBustShaderMat.uniforms.uAtlasReady.value = 1.0;
          }
        })
      );
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = false;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      return tex;
    });

    // Normalized rotation state (1.0 = full 360° turn) with silky magnetic-bearing momentum
    let faceTargetTurn = 0.0;
    let faceCurrentTurn = 0.0;
    let faceVelocity = 0.0;

    resetFaceModelRef.current = () => {
      const nearestZero = Math.round(faceCurrentTurn);
      faceVelocity = 0;
      faceTargetTurn = nearestZero;
    };

    const faceBustShaderMat = trackMat(
      new THREE.ShaderMaterial({
        uniforms: {
          uSheet0: { value: sheetTexs[0] },
          uSheet1: { value: sheetTexs[1] },
          uSheet2: { value: sheetTexs[2] },
          uSheet3: { value: sheetTexs[3] },
          uFrameFloat: { value: 0.0 },
          uAtlasReady: { value: 0.0 },
          uHoverGlow: { value: 0.0 },
          uDragIntensity: { value: 0.0 },
        },
        vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          uniform sampler2D uSheet0;
          uniform sampler2D uSheet1;
          uniform sampler2D uSheet2;
          uniform sampler2D uSheet3;
          uniform float uFrameFloat;
          uniform float uAtlasReady;
          uniform float uHoverGlow;
          uniform float uDragIntensity;
          varying vec2 vUv;

          vec4 sampleTurntableFrame(float frameIdx, vec2 uv) {
            float sheetIdx = floor(frameIdx / 24.0);
            float localIdx = frameIdx - sheetIdx * 24.0;
            float row = floor(localIdx / 8.0);
            float col = localIdx - row * 8.0;

            // Inset slightly inside each 384x682 cell to prevent any neighbor-cell bleed
            float cellU = (col + mix(0.004, 0.996, uv.x)) / 8.0;
            float pixelY = (row + mix(0.997, 0.003, uv.y)) * 682.0;
            float cellV = 1.0 - (pixelY / 2048.0);
            vec2 atlasUv = vec2(cellU, cellV);

            if (sheetIdx < 0.5) return texture2D(uSheet0, atlasUv);
            if (sheetIdx < 1.5) return texture2D(uSheet1, atlasUv);
            if (sheetIdx < 2.5) return texture2D(uSheet2, atlasUv);
            return texture2D(uSheet3, atlasUv);
          }

          void main() {
            if (uAtlasReady < 0.5) discard;

            float wrapped = mod(uFrameFloat, 96.0);
            if (wrapped < 0.0) wrapped += 96.0;
            float idxA = floor(wrapped);
            float idxB = mod(idxA + 1.0, 96.0);
            float blend = fract(wrapped);

            vec4 sa = sampleTurntableFrame(idxA, vUv);
            vec4 sb = sampleTurntableFrame(idxB, vUv);

            // Premultiplied-alpha safe sub-frame interpolation for silky 120fps rotation
            float matte = mix(sa.a, sb.a, blend);
            float bottomFeather = smoothstep(0.0, 0.055, vUv.y);
            float sideFeather = smoothstep(0.0, 0.02, vUv.x) * (1.0 - smoothstep(0.98, 1.0, vUv.x));
            float alpha = matte * bottomFeather * sideFeather;

            if (alpha < 0.03) discard;

            vec3 premulRgb = mix(sa.rgb * sa.a, sb.rgb * sb.a, blend);
            vec3 naturalSrgb = matte > 0.002 ? clamp(premulRgb / matte, 0.0, 1.0) : sa.rgb;

            // Convert sRGB -> Linear accurately for Three.js ACES Filmic OutputPass
            vec3 linearCol = pow(max(naturalSrgb, vec3(0.0)), vec3(2.2));

            // Whisper-subtle champagne rim response when hovered or actively spinning
            float edgeGlow = (1.0 - smoothstep(0.25, 0.92, matte)) * (uHoverGlow * 0.08 + uDragIntensity * 0.12);
            linearCol += vec3(0.94, 0.85, 0.72) * edgeGlow;

            gl_FragColor = vec4(linearCol, alpha);
            #include <tonemapping_fragment>
            #include <colorspace_fragment>
          }
        `,
        transparent: true,
        depthWrite: true,
        side: THREE.DoubleSide,
      })
    );

    // Gentle sculptural relief matching exact 9:16 portrait aspect (width 2.70 x height 4.80)
    // Framed cleanly above the brass turntable with full head clearance below the top navbar!
    const bustArcRadius = 5.4;
    const bustArcGeo = trackGeo(new THREE.CylinderGeometry(bustArcRadius, bustArcRadius, 4.8, 48, 1, true, -0.25, 0.5));
    bustArcGeo.translate(0, 0, -bustArcRadius);
    const faceBustMesh = new THREE.Mesh(bustArcGeo, faceBustShaderMat);
    faceBustMesh.position.set(0, 2.94, cpLocalZ);
    faceBustMesh.renderOrder = 3;
    r0.add(faceBustMesh);

    const faceModelHitMesh = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.65, 1.65, 4.9, 24)),
      trackMat(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    );
    faceModelHitMesh.position.set(0, 2.94, cpLocalZ);
    registerInteractive(faceModelHitMesh, 'centerpiece-3d-face');
    const faceHitTargets: THREE.Object3D[] = [faceModelHitMesh];
    r0.add(faceModelHitMesh);

    // Overhead Iridescent Crystal Prism Emblem Chandelier (elevated high near ceiling so it never overlaps the bust!)
    const emblemGroup = new THREE.Group();
    emblemGroup.position.set(0, 7.55, -22.5);
    emblemGroup.scale.setScalar(0.48);
    const emblemCore = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.66, 0)), iridescentCrystalMat);
    emblemGroup.add(emblemCore);
    const emblemRing1 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.16, 0.032, 18, 72)), brushedBrassMat);
    emblemGroup.add(emblemRing1);
    const emblemRing2 = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.48, 0.022, 18, 72)), brushedBrassMat);
    emblemRing2.rotation.x = Math.PI / 3;
    emblemGroup.add(emblemRing2);
    registerInteractive(emblemCore, 'entrance-emblem');
    r0.add(emblemGroup);

    const entranceWelcomeTex = trackTex(
      createExhibitPanelTexture({
        code: 'ROOM 00 // THE DIGITAL MUSEUM',
        title: 'THE DIGITAL MUSEUM',
        subtitle: 'An Exhibition of Ideas, Experiments & Creations',
        body: 'Founded by Shashank Jha — Drag the 3D bust to rotate 360°, explore White-Wall Projects with Live Demos & turn through 10 distinct galleries.',
        centered: true,
        accent: '#d6c7b2',
      })
    );
    createStandingExhibitFrame(r0, {
      exhibitId: 'entrance-emblem',
      x: -6.0,
      z: -17.2,
      rotY: 0.42,
      width: 4.5,
      height: 3.1,
      texture: entranceWelcomeTex,
    });

    const entranceGuideTex = trackTex(
      createExhibitPanelTexture({
        code: 'VISITOR GUIDE // 10 GALLERIES',
        title: 'EXPLORE THE WINGS',
        subtitle: 'White-Wall Projects • Social Lounge • Floating UI Showroom',
        body: 'Every gallery wing opens via an illuminated 90° corner rotunda with distinct lighting, art shaders, and interactive demos.',
        bullets: [
          'Room 02: Bright White-Wall Projects Hall + Live Demos & GitHub',
          'Room 03–05: Dichroic Tech Shaders, Copper Timeline & Lab',
          'Room 06–07: Dedicated Hobbies Atelier & Starlight Exit',
        ],
        accent: '#d6c7b2',
      })
    );
    createStandingExhibitFrame(r0, {
      exhibitId: 'entrance-emblem',
      x: 6.0,
      z: -17.2,
      rotY: -0.42,
      width: 4.5,
      height: 3.1,
      texture: entranceGuideTex,
    });

    // =======================================================================
    // ROOM 01 — INTRODUCTION GALLERY (TERRACOTTA SANCTUARY)
    // =======================================================================
    const r1 = roomGroups[1];
    createMuseumBench(r1, -4.0, -5.5, 0.12);

    const creatorDossierTex = trackTex(
      createExhibitPanelTexture({
        code: 'EXHIBIT 001 // THE CREATOR',
        title: 'SHASHANK JHA',
        subtitle: 'Software & Web Developer | Three.js & React Specialist',
        body: 'B.Tech Computer Science & Engineering undergraduate at Parul University (2022–2026), blending first-principles engineering with spatial 3D storytelling.',
        bullets: [
          'Core Craft: React 19, Next.js 16, Three.js, GSAP & Java DSA',
          'Internships: PRISMIO React Frontend & CodSoft Full-Stack',
          'Mission: Turning code into memorable interactive exhibits',
        ],
        tags: ['Parul Univ.', 'React & Three.js', 'GSAP', 'Java & DSA'],
        accent: '#f0a978',
      })
    );
    createStandingExhibitFrame(r1, {
      exhibitId: 'creator-portrait',
      x: -5.8,
      z: -14.2,
      rotY: 0.42,
      width: 4.9,
      height: 3.4,
      texture: creatorDossierTex,
      accentHex: 0xf0a978,
      poolTexture: terracottaPoolTex,
    });

    const journeyTex = trackTex(
      createExhibitPanelTexture({
        code: 'EXHIBIT 002 // THE JOURNEY',
        title: 'From First Code to 3D Web',
        subtitle: '2022 – 2026 • Parul University → CodSoft → PRISMIO',
        body: 'A timeline of curiosity and technical growth across core computer science, AI automation, and interactive 3D graphics.',
        bullets: [
          '2022: B.Tech CSE at Parul University (Java & DSA)',
          '2023–24: Python J.A.R.V.I.S, IIT NPTEL & MERN Workshop',
          '2025: CodSoft Web Development Internship',
          '2026: PRISMIO React & Three.js Frontend Trainee',
        ],
        tags: ['Parul Univ.', 'NPTEL IIT', 'CodSoft', 'PRISMIO'],
        accent: '#f0a978',
      })
    );
    createStandingExhibitFrame(r1, {
      exhibitId: 'journey-wall',
      x: 5.8,
      z: -14.2,
      rotY: -0.42,
      width: 4.9,
      height: 3.4,
      texture: journeyTex,
      accentHex: 0xf0a978,
      poolTexture: terracottaPoolTex,
    });

    const philosophyTex = trackTex(
      createExhibitPanelTexture({
        code: 'EXHIBIT 003 // THE PHILOSOPHY WALL',
        title: '"Built by experiences, guided by principles, and driven by dreams that refuse to fade."',
        subtitle: '— SHASHANK JHA • FOUNDER INSCRIPTION',
        body: 'Click to read the curatorial philosophy',
        quoteMode: true,
        accent: '#f0a978',
        width: 1200,
        height: 520,
      })
    );
    const philGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x191d27, emissive: 0xf0a978, emissiveIntensity: 0.08, roughness: 0.35, metalness: 0.55 })
    );
    const philGroup = new THREE.Group();
    philGroup.position.set(0, 5.25, -26.5);
    philGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.35, 3.15, 0.26)), philGlowMat));
    const philFrameRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(7.45, 3.25, 0.16)), brushedBrassMat);
    philFrameRim.position.z = -0.02;
    philGroup.add(philFrameRim);
    const philFace = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(7.0, 2.85)),
      trackMat(new THREE.MeshBasicMaterial({ map: philosophyTex }))
    );
    philFace.position.z = 0.145;
    philGroup.add(philFace);
    registerInteractive(philFace, 'philosophy-wall', philGlowMat);
    r1.add(philGroup);

    const bronzePlanterMat = trackMat(new THREE.MeshPhysicalMaterial({ color: 0x3b261b, metalness: 0.72, roughness: 0.34, clearcoat: 0.35 }));
    const treeBarkMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x4b382a, roughness: 0.9, metalness: 0.05 }));
    const oliveLeafMatA = trackMat(new THREE.MeshStandardMaterial({ color: 0x4d6347, roughness: 0.72, metalness: 0.05 }));
    const oliveLeafMatB = trackMat(new THREE.MeshStandardMaterial({ color: 0x6b7c57, roughness: 0.68, metalness: 0.05 }));
    const planterGeo = trackGeo(new THREE.CylinderGeometry(0.62, 0.48, 0.92, 24));
    const planterRimGeo = trackGeo(new THREE.TorusGeometry(0.62, 0.035, 12, 32));
    const leafGeo = trackGeo(new THREE.DodecahedronGeometry(0.55, 1));
    [
      [-7.7, -6.0],
      [7.7, -6.0],
      [-7.7, -24.5],
      [7.7, -24.5],
    ].forEach(([tx, tz]) => {
      const tree = new THREE.Group();
      tree.position.set(tx, 0, tz);
      const pot = new THREE.Mesh(planterGeo, bronzePlanterMat);
      pot.position.y = 0.46;
      tree.add(pot);
      const rim = new THREE.Mesh(planterRimGeo, brushedBrassMat);
      rim.rotation.x = Math.PI / 2;
      rim.position.y = 0.92;
      tree.add(rim);
      const trunk = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.08, 0.14, 2.25, 12)), treeBarkMat);
      trunk.position.y = 1.85;
      trunk.rotation.z = tx < 0 ? -0.08 : 0.08;
      tree.add(trunk);
      [
        [0, 3.25, 0, 1.05],
        [-0.45, 2.95, 0.25, 0.82],
        [0.48, 3.05, -0.2, 0.88],
        [0.12, 3.55, 0.32, 0.74],
        [-0.25, 3.45, -0.35, 0.72],
      ].forEach(([bx, by, bz, sc], idx) => {
        const canopy = new THREE.Mesh(leafGeo, idx % 2 === 0 ? oliveLeafMatA : oliveLeafMatB);
        canopy.position.set(bx, by, bz);
        canopy.scale.set(sc * 1.15, sc * 0.85, sc);
        tree.add(canopy);
      });
      r1.add(tree);
    });

    const sconceOuterGeo = trackGeo(new THREE.TorusGeometry(0.88, 0.04, 14, 42));
    const sconceInnerGeo = trackGeo(new THREE.TorusGeometry(0.54, 0.03, 12, 36));
    [-8, -22].forEach((sz) => {
      [-9.36, 9.36].forEach((sx) => {
        const sconce = new THREE.Group();
        sconce.position.set(sx, 4.7, sz);
        sconce.rotation.y = sx < 0 ? Math.PI / 2 : -Math.PI / 2;
        sconce.add(new THREE.Mesh(sconceOuterGeo, brushedBrassMat));
        sconce.add(new THREE.Mesh(sconceInnerGeo, roomAccentEmissiveMats[1]));
        r1.add(sconce);
      });
    });

    // =======================================================================
    // ROOM 02 — EXHIBITION HALL (WHITE-WALL PROJECTS + HOLOGRAPHIC ART FX!)
    // =======================================================================
    const r2 = roomGroups[2];
    const emeraldCanopyNodes: THREE.Mesh[] = [];
    createMuseumBench(r2, 4.6, -5.0, -0.15);

    createLuxuryPedestal(r2, {
      x: 0,
      z: -19.0,
      radius: 1.8,
      height: 1.0,
      accentHex: 0x10b981,
      poolTexture: emeraldPoolTex,
    });

    const vertexPhoneGroup = new THREE.Group();
    vertexPhoneGroup.position.set(0, 2.8, -19.0);
    const phoneChassisMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x181c26,
        emissive: 0x10b981,
        emissiveIntensity: 0.06,
        metalness: 0.94,
        roughness: 0.16,
        clearcoat: 1.0,
        clearcoatRoughness: 0.1,
      })
    );
    const phoneBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.42, 2.88, 0.16)), phoneChassisMat);
    vertexPhoneGroup.add(phoneBody);
    vertexPhoneGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.49, 2.95, 0.12)), brushedBrassMat));

    // ART FX 2: Holographic Scanline Projection Shell & Animated Vertical Laser Scan Ring around Vertex X1!
    const phoneHoloShell = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.66, 3.16, 0.34)), holoScanAuraMat);
    vertexPhoneGroup.add(phoneHoloShell);

    const vertexScanRing = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(1.18, 0.024, 12, 48)),
      roomAccentEmissiveMats[2]
    );
    vertexScanRing.rotation.x = Math.PI / 2;
    vertexPhoneGroup.add(vertexScanRing);

    const phoneScreenTex = trackTex(
      createExhibitPanelTexture({
        code: 'LIVE DEMO • GITHUB',
        title: 'VERTEX X1',
        subtitle: '3D Mobile Prototype',
        body: 'Click to Open Live Demo & Repo',
        centered: true,
        accent: '#34d399',
        bgTop: '#0a221a',
        bgBottom: '#070f0d',
        width: 512,
        height: 980,
      })
    );
    const phoneScreen = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(1.32, 2.72)),
      trackMat(new THREE.MeshBasicMaterial({ map: phoneScreenTex }))
    );
    phoneScreen.position.z = 0.088;
    vertexPhoneGroup.add(phoneScreen);

    const camBox = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.62, 0.72, 0.06)), darkMarblePlinthMat);
    camBox.position.set(0.28, 0.85, -0.1);
    vertexPhoneGroup.add(camBox);
    const lensGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.11, 0.05, 22));
    [
      [0.14, 1.0],
      [0.14, 0.7],
      [0.42, 0.85],
    ].forEach(([lx, ly]) => {
      const l = new THREE.Mesh(lensGeo, brushedBrassMat);
      l.rotation.x = Math.PI / 2;
      l.position.set(lx, ly, -0.13);
      vertexPhoneGroup.add(l);
    });

    const vertexOrbitRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.96, 0.025, 14, 72)), roomAccentEmissiveMats[2]);
    vertexOrbitRing.rotation.x = Math.PI / 2.2;
    vertexPhoneGroup.add(vertexOrbitRing);

    registerInteractive(phoneBody, 'project-vertex', phoneChassisMat);
    registerInteractive(phoneScreen, 'project-vertex');
    registerInteractive(phoneHoloShell, 'project-vertex');
    r2.add(vertexPhoneGroup);

    const projectWallConfigs: {
      exhibitId: string;
      x: number;
      z: number;
      rotY: number;
      accent: string;
      accentHex: number;
    }[] = [
      { exhibitId: 'project-jarvis', x: -6.4, z: -12.5, rotY: 0.36, accent: '#38bdf8', accentHex: 0x10b981 },
      { exhibitId: 'project-codsoft-portfolio', x: 6.4, z: -12.5, rotY: -0.36, accent: '#34d399', accentHex: 0x10b981 },
      { exhibitId: 'project-netflix', x: -6.4, z: -27.5, rotY: 0.36, accent: '#f87171', accentHex: 0x10b981 },
      { exhibitId: 'project-calculator', x: 6.4, z: -27.5, rotY: -0.36, accent: '#34d399', accentHex: 0x10b981 },
    ];
    projectWallConfigs.forEach((cfg) => {
      const ex = MUSEUM_EXHIBITS_3D.find((e) => e.id === cfg.exhibitId);
      if (!ex) return;
      const tex = trackTex(
        createExhibitPanelTexture({
          code: `${ex.code} // LIVE DEMO & GITHUB`,
          title: ex.title,
          subtitle: ex.subtitle,
          body: ex.description,
          bullets: ['▶ Click Exhibit to Launch Live Interactive Demo', '↗ Direct Live Project Link & GitHub Repository Included'],
          tags: ex.tags,
          accent: cfg.accent,
        })
      );
      createStandingExhibitFrame(r2, {
        exhibitId: ex.id,
        x: cfg.x,
        z: cfg.z,
        rotY: cfg.rotY,
        width: 4.8,
        height: 3.3,
        texture: tex,
        accentHex: cfg.accentHex,
        poolTexture: emeraldPoolTex,
      });
    });

    const canopyRingGeo = trackGeo(new THREE.TorusGeometry(3.2, 0.055, 8, 6));
    const canopyNodeGeo = trackGeo(new THREE.OctahedronGeometry(0.24, 0));
    [-10, -19, -28].forEach((cz, idx) => {
      const hexRing = new THREE.Mesh(canopyRingGeo, brushedBrassMat);
      hexRing.rotation.x = Math.PI / 2;
      hexRing.rotation.z = idx * 0.52;
      hexRing.position.set(0, 7.35, cz);
      r2.add(hexRing);
      const innerHex = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(2.1, 0.032, 8, 6)), roomAccentEmissiveMats[2]);
      innerHex.rotation.x = Math.PI / 2;
      innerHex.position.set(0, 7.15, cz);
      r2.add(innerHex);
      [-2.4, 2.4].forEach((nx) => {
        const node = new THREE.Mesh(canopyNodeGeo, roomAccentEmissiveMats[2]);
        node.position.set(nx, 6.85, cz);
        r2.add(node);
        emeraldCanopyNodes.push(node);
      });
    });

    const bollardGeo = trackGeo(new THREE.CylinderGeometry(0.2, 0.24, 1.05, 16));
    const bollardCapGeo = trackGeo(new THREE.OctahedronGeometry(0.2, 0));
    [
      [-2.85, -7.0],
      [2.85, -7.0],
      [-2.85, -31.0],
      [2.85, -31.0],
    ].forEach(([bx, bz]) => {
      const bollard = new THREE.Group();
      bollard.position.set(bx, 0, bz);
      const pillar = new THREE.Mesh(bollardGeo, darkMarblePlinthMat);
      pillar.position.y = 0.525;
      bollard.add(pillar);
      const gem = new THREE.Mesh(bollardCapGeo, roomAccentEmissiveMats[2]);
      gem.position.y = 1.24;
      bollard.add(gem);
      emeraldCanopyNodes.push(gem);
      r2.add(bollard);
    });

    // =======================================================================
    // ROOM 03 — TECHNOLOGY GALLERY (DICHROIC GLASS, PLASMA ELECTRONS & WAVE!)
    // =======================================================================
    const r3 = roomGroups[3];
    const techHoloRings: THREE.Mesh[] = [];
    const reactElectrons: { mesh: THREE.Mesh; orbitTilt: number; orbitYaw: number; phase: number; speed: number }[] = [];

    createLuxuryPedestal(r3, {
      x: -5.2,
      z: -15.5,
      radius: 1.5,
      height: 1.0,
      accentHex: 0x38bdf8,
      poolTexture: cyanPoolTex,
      withGlassVitrine: true,
      vitrineHeight: 3.2,
    });
    const threeInstallGroup = new THREE.Group();
    threeInstallGroup.position.set(-5.2, 2.65, -15.5);
    // ART FX 3: Liquid Dichroic Rainbow Glass Art Shader on TorusKnot!
    const knotMesh = new THREE.Mesh(trackGeo(new THREE.TorusKnotGeometry(0.74, 0.22, 128, 24)), dichroicGlassMat);
    threeInstallGroup.add(knotMesh);
    const cageMesh = new THREE.Mesh(
      trackGeo(new THREE.IcosahedronGeometry(1.28, 1)),
      trackMat(new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true, transparent: true, opacity: 0.34 }))
    );
    threeInstallGroup.add(cageMesh);
    registerInteractive(knotMesh, 'tech-threejs');
    r3.add(threeInstallGroup);

    createLuxuryPedestal(r3, {
      x: 0,
      z: -21.5,
      radius: 1.7,
      height: 1.0,
      accentHex: 0x38bdf8,
      poolTexture: cyanPoolTex,
      withGlassVitrine: true,
      vitrineHeight: 3.4,
    });
    const reactInstallGroup = new THREE.Group();
    reactInstallGroup.position.set(0, 2.78, -21.5);
    const reactCoreMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x9be7ff, emissive: 0x38bdf8, emissiveIntensity: 1.75, metalness: 0.4, roughness: 0.15 })
    );
    const reactCore = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.42, 32, 32)), reactCoreMat);
    reactInstallGroup.add(reactCore);
    const reactOrbitGeo = trackGeo(new THREE.TorusGeometry(1.26, 0.03, 16, 72));
    const reactOrbitMat = trackMat(new THREE.MeshStandardMaterial({ color: 0x7dd3fc, emissive: 0x38bdf8, emissiveIntensity: 1.3 }));
    const electronGeo = trackGeo(new THREE.SphereGeometry(0.11, 16, 16));
    const electronMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0x7dd3fc, emissiveIntensity: 2.2 }));

    [0, Math.PI / 3, -Math.PI / 3].forEach((ang, idx) => {
      const ring = new THREE.Mesh(reactOrbitGeo, reactOrbitMat);
      ring.rotation.x = Math.PI / 2.6;
      ring.rotation.y = ang;
      ring.rotation.z = idx * 0.4;
      reactInstallGroup.add(ring);

      const eOrb = new THREE.Mesh(electronGeo, electronMat);
      reactInstallGroup.add(eOrb);
      reactElectrons.push({ mesh: eOrb, orbitTilt: Math.PI / 2.6, orbitYaw: ang, phase: idx * 2.1, speed: 2.1 + idx * 0.35 });
    });
    registerInteractive(reactCore, 'tech-react', reactCoreMat);
    r3.add(reactInstallGroup);

    createLuxuryPedestal(r3, {
      x: 5.2,
      z: -15.5,
      radius: 1.5,
      height: 1.0,
      accentHex: 0x38bdf8,
      poolTexture: cyanPoolTex,
      withGlassVitrine: true,
      vitrineHeight: 3.2,
    });
    const gsapWaveGroup = new THREE.Group();
    gsapWaveGroup.position.set(5.2, 1.15, -15.5);
    const gsapPillars: { mesh: THREE.Mesh; mat: THREE.MeshPhysicalMaterial }[] = [];
    const pGeo = trackGeo(new THREE.BoxGeometry(0.22, 1.35, 0.22));
    for (let i = 0; i < 7; i++) {
      // ART FX 5: Individual hue-shifting Chromatic Kinetic Pillar Materials!
      const pMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: 0xeef6ff,
          emissive: 0x38bdf8,
          emissiveIntensity: 0.45,
          metalness: 0.85,
          roughness: 0.16,
          clearcoat: 1.0,
        })
      );
      const p = new THREE.Mesh(pGeo, pMat);
      p.position.set((i - 3) * 0.31, 0.8, 0);
      gsapWaveGroup.add(p);
      gsapPillars.push({ mesh: p, mat: pMat });
      registerInteractive(p, 'tech-js-gsap', i === 3 ? pMat : undefined);
    }
    r3.add(gsapWaveGroup);

    const cyberRibGeo = trackGeo(new THREE.TorusGeometry(8.9, 0.055, 10, 48, Math.PI));
    [-5, -11, -17, -23, -29].forEach((rz) => {
      const rib = new THREE.Mesh(cyberRibGeo, roomAccentEmissiveMats[3]);
      rib.position.set(0, 0.2, rz);
      r3.add(rib);
    });
    const monolithGeo = trackGeo(new THREE.BoxGeometry(0.65, 4.8, 1.35));
    const monoStripGeo = trackGeo(new THREE.BoxGeometry(0.06, 4.2, 0.08));
    [
      [-8.3, -8],
      [8.3, -8],
      [-8.3, -27],
      [8.3, -27],
    ].forEach(([mx, mz]) => {
      const sign = mx < 0 ? 1 : -1;
      const mono = new THREE.Group();
      mono.position.set(mx, 2.4, mz);
      mono.add(new THREE.Mesh(monolithGeo, darkFixtureMat));
      [-0.36, 0, 0.36].forEach((dz) => {
        const bar = new THREE.Mesh(monoStripGeo, roomAccentEmissiveMats[3]);
        bar.position.set(sign * 0.34, 0, dz);
        mono.add(bar);
      });
      r3.add(mono);
    });
    const holoRingGeoA = trackGeo(new THREE.TorusGeometry(3.1, 0.032, 12, 64));
    const holoRingGeoB = trackGeo(new THREE.TorusGeometry(2.35, 0.024, 12, 48));
    [-12, -24].forEach((hz) => {
      const ringA = new THREE.Mesh(holoRingGeoA, roomAccentEmissiveMats[3]);
      ringA.rotation.x = Math.PI / 2;
      ringA.position.set(0, 6.2, hz);
      r3.add(ringA);
      techHoloRings.push(ringA);
      const ringB = new THREE.Mesh(holoRingGeoB, brushedBrassMat);
      ringB.rotation.x = Math.PI / 2.2;
      ringB.position.set(0, 6.0, hz);
      r3.add(ringB);
      techHoloRings.push(ringB);
    });

    // =======================================================================
    // ROOM 04 — TIMELINE GALLERY (BURNISHED COPPER CORRIDOR)
    // =======================================================================
    const r4 = roomGroups[4];
    createMuseumBench(r4, 4.5, -3.5, 0.0);

    const chapterConfigs = [
      { id: 'chapter-01', x: -6.2, z: -8.0, rotY: 0.44 },
      { id: 'chapter-02', x: 6.2, z: -12.5, rotY: -0.44 },
      { id: 'chapter-03', x: -6.2, z: -18.0, rotY: 0.44 },
      { id: 'chapter-04', x: 6.2, z: -23.0, rotY: -0.44 },
      { id: 'chapter-05', x: -6.2, z: -28.0, rotY: 0.44 },
    ];
    chapterConfigs.forEach((cc) => {
      const ch = MUSEUM_EXHIBITS_3D.find((e) => e.id === cc.id);
      if (!ch) return;
      const tex = trackTex(
        createExhibitPanelTexture({
          code: `${ch.code} // ${ch.status}`,
          title: ch.title,
          subtitle: ch.subtitle,
          body: ch.description,
          bullets: ch.details.slice(0, 2),
          tags: ch.tags,
          accent: '#f59e0b',
        })
      );
      createStandingExhibitFrame(r4, {
        exhibitId: ch.id,
        x: cc.x,
        z: cc.z,
        rotY: cc.rotY,
        width: 4.5,
        height: 3.15,
        texture: tex,
        accentHex: 0xf59e0b,
        poolTexture: amberPoolTex,
      });
    });

    const copperMat = trackMat(new THREE.MeshPhysicalMaterial({ color: 0xb86b35, metalness: 0.9, roughness: 0.24, clearcoat: 0.5 }));
    const copperArchGeo = trackGeo(new THREE.TorusGeometry(7.8, 0.09, 12, 48, Math.PI));
    const amberSubArchGeo = trackGeo(new THREE.TorusGeometry(7.55, 0.032, 10, 48, Math.PI));
    [-6, -12, -18, -24, -30].forEach((cz) => {
      const arch = new THREE.Mesh(copperArchGeo, copperMat);
      arch.position.set(0, 0.5, cz);
      r4.add(arch);
      const glow = new THREE.Mesh(amberSubArchGeo, roomAccentEmissiveMats[4]);
      glow.position.set(0, 0.5, cz);
      r4.add(glow);
    });
    const spineMesh = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.1, 0.02, 31)), roomAccentEmissiveMats[4]);
    spineMesh.position.set(0, 0.02, -17);
    r4.add(spineMesh);
    const bandGeo = trackGeo(new THREE.BoxGeometry(5.2, 0.018, 0.07));
    const discGeo = trackGeo(new THREE.CylinderGeometry(0.32, 0.36, 0.025, 24));
    const totemPostGeo = trackGeo(new THREE.CylinderGeometry(0.11, 0.16, 1.85, 16));
    const lanternGeo = trackGeo(new THREE.SphereGeometry(0.19, 18, 18));
    chapterConfigs.forEach((cc, idx) => {
      const band = new THREE.Mesh(bandGeo, roomAccentEmissiveMats[4]);
      band.position.set(0, 0.021, cc.z);
      r4.add(band);
      const disc = new THREE.Mesh(discGeo, copperMat);
      disc.position.set(0, 0.024, cc.z);
      r4.add(disc);
      const totem = new THREE.Group();
      totem.position.set(idx % 2 === 0 ? 3.55 : -3.55, 0, cc.z);
      const post = new THREE.Mesh(totemPostGeo, copperMat);
      post.position.y = 0.925;
      totem.add(post);
      const lantern = new THREE.Mesh(lanternGeo, roomAccentEmissiveMats[4]);
      lantern.position.y = 2.02;
      totem.add(lantern);
      r4.add(totem);
    });

    // =======================================================================
    // ROOM 05 — INNOVATION LAB (ULTRAVIOLET AURORA PLASMA DOME)
    // =======================================================================
    const r5 = roomGroups[5];
    const labFloatingCrystals: { mesh: THREE.Object3D; baseY: number; phase: number; speed: number }[] = [];

    createLuxuryPedestal(r5, {
      x: 0,
      z: -16.5,
      radius: 1.8,
      height: 0.95,
      accentHex: 0xc084fc,
      poolTexture: violetPoolTex,
      withGlassVitrine: true,
      vitrineHeight: 3.5,
    });

    const labGroup = new THREE.Group();
    labGroup.position.set(0, 2.75, -16.5);
    const labParticleCount = 560;
    const labPositions = new Float32Array(labParticleCount * 3);
    for (let i = 0; i < labParticleCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / labParticleCount);
      const theta = Math.sqrt(labParticleCount * Math.PI) * phi;
      const rad = 1.38 + (Math.random() - 0.5) * 0.22;
      labPositions[i * 3] = rad * Math.cos(theta) * Math.sin(phi);
      labPositions[i * 3 + 1] = rad * Math.sin(theta) * Math.sin(phi);
      labPositions[i * 3 + 2] = rad * Math.cos(phi);
    }
    const labGeo = trackGeo(new THREE.BufferGeometry());
    labGeo.setAttribute('position', new THREE.BufferAttribute(labPositions, 3));
    const labPoints = new THREE.Points(
      labGeo,
      trackMat(new THREE.PointsMaterial({ color: 0xd8b4fe, size: 0.068, transparent: true, opacity: 0.95 }))
    );
    labGroup.add(labPoints);

    // ART FX 4: Aurora Plasma Energy Orb Shader inside Innovation Lab Vitrine!
    const labCore = new THREE.Mesh(trackGeo(new THREE.IcosahedronGeometry(0.84, 3)), auroraPlasmaMat);
    labGroup.add(labCore);
    registerInteractive(labCore, 'lab-particles');
    r5.add(labGroup);

    const labLeftTex = trackTex(
      createExhibitPanelTexture({
        code: 'INNOVATION LAB // R&D',
        title: 'Where Ideas Become Experiments',
        subtitle: 'WebGL Shaders • Prototypes • UI Physics',
        body: 'Dedicated to unfinished prototypes, particle physics simulations, kinetic UI micro-interactions, and creative coding curiosity.',
        tags: ['Shaders', 'Particles', 'Prototypes', 'Creative Code'],
        accent: '#c4b5fd',
      })
    );
    createStandingExhibitFrame(r5, {
      exhibitId: 'lab-particles',
      x: -6.2,
      z: -13.0,
      rotY: 0.42,
      width: 4.5,
      height: 3.15,
      texture: labLeftTex,
      accentHex: 0xc084fc,
      poolTexture: violetPoolTex,
    });

    const labRightTex = trackTex(
      createExhibitPanelTexture({
        code: 'RESEARCH NOTEBOOKS // 4 ARTICLES',
        title: 'Technical Writings & Curiosities',
        subtitle: 'Vertex X1 • Internships • Python AI • Java DSA',
        body: 'Architectural essays and developer guides authored by Shashank Jha documenting real-world engineering insights.',
        bullets: [
          'Building Vertex X1 with Three.js & GSAP',
          'From College to Internships: CodSoft & PRISMIO',
          'Developing J.A.R.V.I.S in Python & Java DSA',
        ],
        tags: ['Articles', 'Architecture', 'Mentorship'],
        accent: '#c4b5fd',
      })
    );
    createStandingExhibitFrame(r5, {
      exhibitId: 'lab-notebooks',
      x: 6.2,
      z: -13.0,
      rotY: -0.42,
      width: 4.5,
      height: 3.15,
      texture: labRightTex,
      accentHex: 0xc084fc,
      poolTexture: violetPoolTex,
    });

    const crystalMat = trackMat(
      new THREE.MeshPhysicalMaterial({ color: 0xd8b4fe, emissive: 0xa855f7, emissiveIntensity: 0.75, metalness: 0.3, roughness: 0.12, clearcoat: 1.0 })
    );
    const magentaGlowMat = trackMat(new THREE.MeshStandardMaterial({ color: 0xf0abfc, emissive: 0xe879f9, emissiveIntensity: 1.65, roughness: 0.2 }));
    const crystalGeo = trackGeo(new THREE.OctahedronGeometry(0.42, 0));
    const crystalWireGeo = trackGeo(new THREE.IcosahedronGeometry(0.74, 0));
    const crystalWireMat = trackMat(new THREE.MeshBasicMaterial({ color: 0xe879f9, wireframe: true, transparent: true, opacity: 0.42 }));
    [
      [-5.6, 5.4, -6.5],
      [5.6, 5.8, -8.5],
      [-5.2, 5.9, -21.5],
      [5.2, 5.2, -23.5],
      [-3.2, 6.4, -16.5],
      [3.2, 6.4, -16.5],
    ].forEach(([cx, cy, cz], idx) => {
      const grp = new THREE.Group();
      grp.position.set(cx, cy, cz);
      const core = new THREE.Mesh(crystalGeo, idx % 2 === 0 ? crystalMat : magentaGlowMat);
      core.scale.set(0.85, 1.55, 0.85);
      grp.add(core);
      grp.add(new THREE.Mesh(crystalWireGeo, crystalWireMat));
      r5.add(grp);
      labFloatingCrystals.push({ mesh: grp, baseY: cy, phase: idx * 1.15, speed: 0.55 + idx * 0.08 });
    });
    const diagBarGeo = trackGeo(new THREE.BoxGeometry(0.08, 4.6, 0.08));
    [-6, -15, -24].forEach((bz, idx) => {
      [-9.36, 9.36].forEach((bx) => {
        const bar = new THREE.Mesh(diagBarGeo, idx % 2 === 0 ? roomAccentEmissiveMats[5] : magentaGlowMat);
        bar.position.set(bx, 4.4, bz);
        bar.rotation.x = idx % 2 === 0 ? 0.52 : -0.52;
        r5.add(bar);
      });
    });
    [2.55, 3.35, 4.15].forEach((rad, idx) => {
      const floorRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(rad, 0.022, 10, 64)),
        idx === 1 ? magentaGlowMat : roomAccentEmissiveMats[5]
      );
      floorRing.rotation.x = Math.PI / 2;
      floorRing.position.set(0, 0.025, -16.5);
      r5.add(floorRing);
    });

    // =======================================================================
    // ROOM 06 — HOBBIES & PASSIONS GALLERY (CORAL & TEAL ART ATELIER, L = 32)
    // =======================================================================
    const r6 = roomGroups[6];
    const tealGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x5eead4, emissive: 0x2dd4bf, emissiveIntensity: 1.5, roughness: 0.2 })
    );

    createLuxuryPedestal(r6, {
      x: 0,
      z: -16.0,
      radius: 1.7,
      height: 0.95,
      accentHex: 0xfb7185,
      poolTexture: coralPoolTex,
      withGlassVitrine: true,
      vitrineHeight: 3.4,
    });

    // ART FX 6: Sculpted Crimson Cricket Ball with Raised Gold Seam + Orbiting Iridescent Code Prism!
    const hobbySculptureGroup = new THREE.Group();
    hobbySculptureGroup.position.set(0, 2.7, -16.0);

    const cricketLeatherMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x991b2e,
        roughness: 0.34,
        metalness: 0.14,
        clearcoat: 0.82,
        clearcoatRoughness: 0.18,
      })
    );
    const cricketSphere = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.66, 36, 36)), cricketLeatherMat);
    hobbySculptureGroup.add(cricketSphere);

    // Raised Brushed-Gold Equatorial Cricket Seam Stitch Rings
    const seamA = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.675, 0.024, 12, 64)), brushedBrassMat);
    seamA.rotation.x = Math.PI / 4;
    hobbySculptureGroup.add(seamA);
    const seamB = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.672, 0.014, 10, 64)), warmEmissiveMat);
    seamB.rotation.x = Math.PI / 4 + 0.08;
    hobbySculptureGroup.add(seamB);

    // Orbiting Iridescent Holographic Code Cube & Teal/Coral Art Ribbons
    const hobbyOrbitCube = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.38, 0.38, 0.38)), iridescentCrystalMat);
    hobbyOrbitCube.position.set(1.18, 0.25, 0);
    hobbySculptureGroup.add(hobbyOrbitCube);

    const hobbyRibbonCoral = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.22, 0.026, 12, 64)), roomAccentEmissiveMats[6]);
    hobbyRibbonCoral.rotation.x = Math.PI / 3;
    hobbySculptureGroup.add(hobbyRibbonCoral);

    const hobbyRibbonTeal = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.36, 0.022, 12, 64)), tealGlowMat);
    hobbyRibbonTeal.rotation.y = Math.PI / 3;
    hobbyRibbonTeal.rotation.x = -Math.PI / 4;
    hobbySculptureGroup.add(hobbyRibbonTeal);

    registerInteractive(cricketSphere, 'hobby-centerpiece');
    registerInteractive(hobbyOrbitCube, 'hobby-centerpiece');
    r6.add(hobbySculptureGroup);

    const hobbyLeftTex = trackTex(
      createExhibitPanelTexture({
        code: 'HOBBIES 01–03 // TECH & CRAFT',
        title: '3D Shaders, Python AI & Java DSA',
        subtitle: 'Interactive Coding • AI Bots • Competitive Algorithms',
        body: 'Creative late-night exploration bridging visual 3D art shaders, voice automation bots, and algorithmic problem solving.',
        bullets: [
          '🌐 Interactive 3D Coding & WebGL Particle Shaders',
          '🤖 Python AI & JARVIS-inspired Voice Automation',
          '☕ Competitive Problem Solving & Java DSA',
        ],
        tags: ['WebGL 3D', 'Python AI', 'Java DSA'],
        accent: '#fb7185',
      })
    );
    createStandingExhibitFrame(r6, {
      exhibitId: 'hobby-creative-ai',
      x: -6.2,
      z: -14.0,
      rotY: 0.42,
      width: 4.7,
      height: 3.3,
      texture: hobbyLeftTex,
      accentHex: 0xfb7185,
      poolTexture: coralPoolTex,
    });

    const hobbyRightTex = trackTex(
      createExhibitPanelTexture({
        code: 'HOBBIES 04–06 // SPORTS & COMMUNITY',
        title: 'Cricket, Open Source & Writing',
        subtitle: 'Team Sports • Dev Community • Peer Mentorship',
        body: 'Staying grounded and energized through competitive team sports, open-source discovery, and teaching fellow engineers.',
        bullets: [
          '🏏 Cricket & Team Sports — Focus, Teamwork & Leadership',
          '📚 Tech Reading & Exploring Open Source Repositories',
          '✍ Technical Writing & Student Mentorship Tutorials',
        ],
        tags: ['Cricket', 'Open Source', 'Writing', 'Mentorship'],
        accent: '#2dd4bf',
      })
    );
    createStandingExhibitFrame(r6, {
      exhibitId: 'hobby-sports-writing',
      x: 6.2,
      z: -14.0,
      rotY: -0.42,
      width: 4.7,
      height: 3.3,
      texture: hobbyRightTex,
      accentHex: 0x2dd4bf,
      poolTexture: coralPoolTex,
    });

    // Room 06 Bespoke Artistic Decorations: Suspended Sculptural Coral & Teal Art Loops
    const artLoopGeo = trackGeo(new THREE.TorusKnotGeometry(0.9, 0.045, 72, 12, 2, 3));
    const hobbyArtLoops: THREE.Mesh[] = [];
    [
      [-5.2, 6.2, -7.5],
      [5.2, 6.2, -7.5],
      [-5.2, 6.2, -24.5],
      [5.2, 6.2, -24.5],
    ].forEach(([ax, ay, az], idx) => {
      const loop = new THREE.Mesh(artLoopGeo, idx % 2 === 0 ? roomAccentEmissiveMats[6] : tealGlowMat);
      loop.position.set(ax, ay, az);
      r6.add(loop);
      hobbyArtLoops.push(loop);
    });
    createMuseumBench(r6, -4.4, -6.0, 0.16);

    // =======================================================================
    // ROOM 07 — DEDICATED SOCIAL MEDIA LOUNGE (NEON MAGENTA & VELVET PLUM, West Wing, L = 34)
    // =======================================================================
    const r7 = roomGroups[7];
    const socialOrbitOrbs: { mesh: THREE.Object3D; radius: number; speed: number; phase: number; yAmp: number }[] = [];
    const socialHaloRings: THREE.Mesh[] = [];
    const socialNeonCyanMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x38bdf8, emissiveIntensity: 1.75, roughness: 0.18 })
    );
    const socialNeonPinkMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 1.8, roughness: 0.18 })
    );

    // Architectural Glowing Neon Vertical Wall Columns along Room 07
    const neonRibGeo = trackGeo(new THREE.BoxGeometry(0.08, 6.2, 0.12));
    [-5.5, -13.5, -21.5, -29.5].forEach((nz, ribIdx) => {
      [-9.25, 9.25].forEach((nx, sideIdx) => {
        const rib = new THREE.Mesh(neonRibGeo, (ribIdx + sideIdx) % 2 === 0 ? socialNeonPinkMat : socialNeonCyanMat);
        rib.position.set(nx, 3.6, nz);
        r7.add(rib);
      });
    });

    // VIP Velvet-Wood Lounge Benches
    createMuseumBench(r7, 4.4, -4.5, -0.2);
    createMuseumBench(r7, 4.6, -29.5, 0.24);

    // 3-Tier Overhead Neon Halo Ring Chandelier above Social Constellation
    [
      { r: 3.1, y: 7.05, mat: socialNeonPinkMat },
      { r: 2.25, y: 6.45, mat: socialNeonCyanMat },
      { r: 1.45, y: 5.9, mat: brushedBrassMat },
    ].forEach((tier) => {
      const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(tier.r, 0.045, 14, 64)), tier.mat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(0, tier.y, -17.0);
      r7.add(ring);
      socialHaloRings.push(ring);
    });

    // CENTERPIECE ART SCULPTURE: 5-Platform Social Media Constellation (Clickable -> social-media-hub)
    const socialCenterGrp = new THREE.Group();
    socialCenterGrp.position.set(0, 0, -17.0);
    const socialBasePlinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(1.45, 1.72, 1.12, 40)), darkMarblePlinthMat);
    socialBasePlinth.position.y = 0.56;
    socialCenterGrp.add(socialBasePlinth);
    const socialBaseNeonRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.48, 0.04, 12, 48)), socialNeonPinkMat);
    socialBaseNeonRing.rotation.x = Math.PI / 2;
    socialBaseNeonRing.position.y = 1.13;
    socialCenterGrp.add(socialBaseNeonRing);
    const socialCenterPool = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(5.2, 5.2)),
      trackMat(
        new THREE.MeshBasicMaterial({
          map: magentaPoolTex,
          transparent: true,
          opacity: 0.6,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        })
      )
    );
    socialCenterPool.rotation.x = -Math.PI / 2;
    socialCenterPool.position.y = 0.025;
    socialCenterGrp.add(socialCenterPool);

    const socialPrismMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xfce7f3,
        emissive: 0xec4899,
        emissiveIntensity: 0.35,
        metalness: 0.5,
        roughness: 0.06,
        clearcoat: 1.0,
        iridescence: 1.0,
        iridescenceIOR: 1.65,
      })
    );
    const socialCorePrism = new THREE.Mesh(trackGeo(new THREE.OctahedronGeometry(0.68, 0)), socialPrismMat);
    socialCorePrism.position.y = 2.65;
    socialCenterGrp.add(socialCorePrism);
    registerInteractive(socialCorePrism, 'social-media-hub', socialPrismMat);

    // Twin tilted luminous orbital tracks
    [
      { rx: 0.58, rz: 0.32, mat: socialNeonPinkMat },
      { rx: -0.64, rz: -0.45, mat: socialNeonCyanMat },
    ].forEach((tr) => {
      const orbitTrack = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.38, 0.02, 10, 56)), tr.mat);
      orbitTrack.position.y = 2.65;
      orbitTrack.rotation.set(tr.rx, 0, tr.rz);
      socialCenterGrp.add(orbitTrack);
    });

    // 5 Orbiting Platform-Colored Glowing Spheres (Instagram, Facebook, Pinterest, GitHub, LinkedIn)
    const platformOrbSpecs = [
      { color: 0xe1306c, r: 1.38, speed: 0.95, phase: 0.0, yAmp: 0.38 },
      { color: 0x1877f2, r: 1.46, speed: -0.82, phase: 1.25, yAmp: 0.44 },
      { color: 0xe60023, r: 1.34, speed: 1.08, phase: 2.5, yAmp: 0.35 },
      { color: 0xe5d8c5, r: 1.52, speed: -0.76, phase: 3.75, yAmp: 0.42 },
      { color: 0x0a66c2, r: 1.4, speed: 0.88, phase: 5.0, yAmp: 0.36 },
    ];
    const platformOrbGeo = trackGeo(new THREE.SphereGeometry(0.19, 24, 24));
    platformOrbSpecs.forEach((spec) => {
      const orbMat = trackMat(
        new THREE.MeshPhysicalMaterial({
          color: spec.color,
          emissive: spec.color,
          emissiveIntensity: 1.15,
          roughness: 0.14,
          metalness: 0.3,
          clearcoat: 1.0,
        })
      );
      const orbMesh = new THREE.Mesh(platformOrbGeo, orbMat);
      orbMesh.position.set(Math.cos(spec.phase) * spec.r, 2.65, Math.sin(spec.phase) * spec.r);
      socialCenterGrp.add(orbMesh);
      registerInteractive(orbMesh, 'social-media-hub', orbMat);
      socialOrbitOrbs.push({ mesh: orbMesh, radius: spec.r, speed: spec.speed, phase: spec.phase, yAmp: spec.yAmp });
    });

    // Invisible click halo on pedestal so clicking anywhere on the centerpiece triggers the Social Hub
    const socialHitCylinder = new THREE.Mesh(
      trackGeo(new THREE.CylinderGeometry(1.5, 1.5, 3.3, 16)),
      trackMat(new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false }))
    );
    socialHitCylinder.position.y = 2.1;
    socialCenterGrp.add(socialHitCylinder);
    registerInteractive(socialHitCylinder, 'social-media-hub', socialPrismMat);
    r7.add(socialCenterGrp);

    // 5 INDIVIDUAL ILLUMINATED SOCIAL PLATFORM WALL EXHIBITS IN ROOM 07
    const instagramTex = trackTex(
      createExhibitPanelTexture({
        code: 'SOCIAL 01 // INSTAGRAM',
        title: 'INSTAGRAM',
        subtitle: 'Visual Stories, Reels & Creative 3D Moments',
        body: 'Click to open Shashank’s Instagram profile or connect & save your own Instagram link directly.',
        bullets: ['3D Shader Clips & UI Shots', 'Behind-the-Scenes Builds', 'Click to Visit or Edit Link'],
        tags: ['Instagram', 'Reels', 'Stories'],
        accent: '#E1306C',
      })
    );
    createStandingExhibitFrame(r7, {
      exhibitId: 'social-instagram',
      x: -6.3,
      z: -8.5,
      rotY: 0.45,
      width: 4.3,
      height: 3.1,
      texture: instagramTex,
      accentHex: 0xe1306c,
      poolTexture: magentaPoolTex,
    });

    const facebookTex = trackTex(
      createExhibitPanelTexture({
        code: 'SOCIAL 02 // FACEBOOK',
        title: 'FACEBOOK',
        subtitle: 'Community Updates, Events & Connections',
        body: 'Click to open the connected Facebook profile or paste your live Facebook URL inside the lounge editor.',
        bullets: ['Milestones & Community Posts', 'Direct Social Updates', 'Click to Visit or Edit Link'],
        tags: ['Facebook', 'Community', 'Updates'],
        accent: '#1877F2',
      })
    );
    createStandingExhibitFrame(r7, {
      exhibitId: 'social-facebook',
      x: 6.3,
      z: -10.5,
      rotY: -0.45,
      width: 4.3,
      height: 3.1,
      texture: facebookTex,
      accentHex: 0x1877f2,
      poolTexture: fbBluePoolTex,
    });

    const pinterestTex = trackTex(
      createExhibitPanelTexture({
        code: 'SOCIAL 03 // PINTEREST',
        title: 'PINTEREST',
        subtitle: 'Design Moodboards, 3D Architecture & UI Aesthetics',
        body: 'Click to explore curated design inspiration boards or link your live Pinterest profile URL.',
        bullets: ['UI & Spatial Design Boards', 'Architectural Lighting Refs', 'Click to Visit or Edit Link'],
        tags: ['Pinterest', 'Design Boards', 'Inspiration'],
        accent: '#E60023',
      })
    );
    createStandingExhibitFrame(r7, {
      exhibitId: 'social-pinterest',
      x: -6.3,
      z: -21.5,
      rotY: 0.45,
      width: 4.3,
      height: 3.1,
      texture: pinterestTex,
      accentHex: 0xe60023,
      poolTexture: pinRedPoolTex,
    });

    const githubSocialTex = trackTex(
      createExhibitPanelTexture({
        code: 'SOCIAL 04 // GITHUB',
        title: 'GITHUB',
        subtitle: 'Open-Source Code, 3D Prototypes & Repositories',
        body: 'Click to inspect live GitHub repositories covering React, Next.js, Three.js, Java DSA & Python AI.',
        bullets: ['Full Project Source Code', 'Open-Source Contributions', 'Click to Visit or Edit Link'],
        tags: ['GitHub', 'Open Source', 'Code'],
        accent: '#d6c7b2',
      })
    );
    createStandingExhibitFrame(r7, {
      exhibitId: 'social-github',
      x: 6.3,
      z: -23.5,
      rotY: -0.45,
      width: 4.3,
      height: 3.1,
      texture: githubSocialTex,
      accentHex: 0xd6c7b2,
      poolTexture: goldPoolTex,
    });

    const linkedinSocialTex = trackTex(
      createExhibitPanelTexture({
        code: 'SOCIAL 05 // LINKEDIN',
        title: 'LINKEDIN',
        subtitle: 'Professional Engineering Network & Collaborations',
        body: 'Click to connect professionally on LinkedIn for engineering roles, internships, and creative tech projects.',
        bullets: ['PRISMIO & CodSoft Experience', 'B.Tech CSE • Parul University', 'Click to Visit or Edit Link'],
        tags: ['LinkedIn', 'Career', 'Engineering'],
        accent: '#0A66C2',
      })
    );
    createStandingExhibitFrame(r7, {
      exhibitId: 'social-linkedin',
      x: -6.2,
      z: -29.0,
      rotY: 0.35,
      width: 4.3,
      height: 3.1,
      texture: linkedinSocialTex,
      accentHex: 0x0a66c2,
      poolTexture: liBluePoolTex,
    });

    // =======================================================================
    // ROOM 08 — ZERO-GRAVITY FLOATING FRONTEND SHOWCASE (North Showroom, L = 38)
    // Levitating 3D Devices Displaying Each Project's Live Frontend UI!
    // =======================================================================
    const r8 = roomGroups[8];
    const floatingProjectObjects: {
      group: THREE.Object3D;
      baseY: number;
      baseRotY: number;
      phase: number;
      amp: number;
      speed: number;
      yawSwing: number;
    }[] = [];
    const floatingRingsRoom8: THREE.Mesh[] = [];
    const floatingUiShards: { mesh: THREE.Mesh; baseY: number; phase: number; speed: number }[] = [];

    const indigoGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x818cf8, emissive: 0x818cf8, emissiveIntensity: 1.75, roughness: 0.18 })
    );
    const iceCyanGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x67e8f9, emissive: 0x38bdf8, emissiveIntensity: 1.65, roughness: 0.18 })
    );
    const titaniumBodyMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0x242c3d,
        metalness: 0.88,
        roughness: 0.2,
        clearcoat: 0.9,
        clearcoatRoughness: 0.12,
      })
    );
    const silverAlumMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xcbd5e1,
        metalness: 0.9,
        roughness: 0.22,
        clearcoat: 0.65,
      })
    );
    const holoGlassCardMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xa5b4fc,
        emissive: 0x6366f1,
        emissiveIntensity: 0.35,
        roughness: 0.08,
        metalness: 0.2,
        clearcoat: 1.0,
        transparent: true,
        opacity: 0.34,
        side: THREE.DoubleSide,
      })
    );

    // Spatial Computing Ceiling Halo Frames suspended along Room 08
    [-9.5, -19.0, -28.5].forEach((cz, idx) => {
      const frameRing = new THREE.Mesh(
        trackGeo(new THREE.TorusGeometry(3.4, 0.04, 12, 4)),
        idx % 2 === 0 ? indigoGlowMat : iceCyanGlowMat
      );
      frameRing.rotation.x = Math.PI / 2;
      frameRing.rotation.z = Math.PI / 4;
      frameRing.position.set(0, 7.65, cz);
      r8.add(frameRing);
      floatingRingsRoom8.push(frameRing);
    });

    // High-floating translucent glass UI shards drifting gently near ceiling edges
    const shardGeo = trackGeo(new THREE.PlaneGeometry(0.95, 0.58));
    [
      [-7.6, 5.8, -6.5],
      [7.6, 6.2, -14.5],
      [-7.4, 5.9, -22.5],
      [7.5, 6.1, -31.5],
      [-6.8, 6.4, -34.0],
      [6.8, 5.7, -7.0],
    ].forEach(([sx, sy, sz], idx) => {
      const shard = new THREE.Mesh(shardGeo, holoGlassCardMat);
      shard.position.set(sx, sy, sz);
      shard.rotation.y = sx < 0 ? 0.45 : -0.45;
      r8.add(shard);
      floatingUiShards.push({ mesh: shard, baseY: sy, phase: idx * 1.15, speed: 0.85 + (idx % 3) * 0.18 });
    });

    // Helper: Anti-Gravity Floor Levitation Pad (glowing ring + light pool + hovering aura ring, ZERO pedestal!)
    const addAntiGravityPad = (x: number, z: number, accentHex: number, poolTex: THREE.Texture, radius = 1.45) => {
      const padMat = trackMat(
        new THREE.MeshStandardMaterial({ color: accentHex, emissive: accentHex, emissiveIntensity: 1.65, roughness: 0.2 })
      );
      const floorRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(radius, 0.032, 12, 48)), padMat);
      floorRing.rotation.x = Math.PI / 2;
      floorRing.position.set(x, 0.04, z);
      r8.add(floorRing);

      const midHoverRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(radius * 0.72, 0.018, 10, 42)), padMat);
      midHoverRing.rotation.x = Math.PI / 2;
      midHoverRing.position.set(x, 0.72, z);
      r8.add(midHoverRing);
      floatingRingsRoom8.push(midHoverRing);

      const pool = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(radius * 3.1, radius * 3.1)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: poolTex,
            transparent: true,
            opacity: 0.62,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      pool.rotation.x = -Math.PI / 2;
      pool.position.set(x, 0.025, z);
      r8.add(pool);
      return padMat;
    };

    // 1. FLOATING OBJECT 01 (CENTER): VERTEX PHONE X1 — Levitating 3D Titanium Smartphone + Spatial UI Cards
    const vertexRimMat = addAntiGravityPad(0, -19.0, 0x34d399, emeraldPoolTex, 1.55);
    const floatVertexGrp = new THREE.Group();
    floatVertexGrp.position.set(0, 2.75, -19.0);
    const vPhoneBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.66, 2.94, 0.14)), titaniumBodyMat);
    floatVertexGrp.add(vPhoneBody);
    const vPhoneRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.72, 3.0, 0.09)), vertexRimMat);
    floatVertexGrp.add(vPhoneRim);
    const vScreenTex = trackTex(createProjectFrontendTexture('vertex'));
    const vScreenMesh = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(1.52, 2.76)),
      trackMat(new THREE.MeshBasicMaterial({ map: vScreenTex }))
    );
    vScreenMesh.position.z = 0.08;
    floatVertexGrp.add(vScreenMesh);
    // Back camera island
    const vCamIsland = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(0.62, 0.62, 0.05)), darkMarblePlinthMat);
    vCamIsland.position.set(-0.34, 0.88, -0.09);
    floatVertexGrp.add(vCamIsland);
    // Twin floating holographic spatial UI side-cards
    const vertexSideCards: THREE.Mesh[] = [];
    [-1.45, 1.45].forEach((cx, ci) => {
      const card = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(0.95, 1.15)), holoGlassCardMat);
      card.position.set(cx, ci === 0 ? 0.35 : -0.25, 0.18);
      card.rotation.y = cx < 0 ? 0.36 : -0.36;
      floatVertexGrp.add(card);
      vertexSideCards.push(card);
    });
    registerInteractive(vScreenMesh, 'float-vertex', vertexRimMat);
    registerInteractive(vPhoneBody, 'float-vertex', vertexRimMat);
    r8.add(floatVertexGrp);
    floatingProjectObjects.push({
      group: floatVertexGrp,
      baseY: 2.75,
      baseRotY: 0,
      phase: 0,
      amp: 0.24,
      speed: 1.25,
      yawSwing: 0.24,
    });

    // 2. FLOATING OBJECT 02 (LEFT-FRONT): J.A.R.V.I.S — Levitating Holographic AI Monitor + Spinning HUD Ring
    const jarvisRimMat = addAntiGravityPad(-5.4, -10.8, 0x38bdf8, cyanPoolTex, 1.65);
    const floatJarvisGrp = new THREE.Group();
    floatJarvisGrp.position.set(-5.4, 2.8, -10.8);
    floatJarvisGrp.rotation.y = 0.44;
    const jMonitorBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.96, 2.48, 0.11)), titaniumBodyMat);
    floatJarvisGrp.add(jMonitorBody);
    const jMonitorRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.04, 2.56, 0.06)), jarvisRimMat);
    floatJarvisGrp.add(jMonitorRim);
    const jScreenTex = trackTex(createProjectFrontendTexture('jarvis'));
    const jScreenMesh = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(3.82, 2.34)),
      trackMat(new THREE.MeshBasicMaterial({ map: jScreenTex }))
    );
    jScreenMesh.position.z = 0.065;
    floatJarvisGrp.add(jScreenMesh);
    const jarvisHudRing = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(1.65, 0.032, 12, 56)), iceCyanGlowMat);
    jarvisHudRing.position.z = -0.22;
    floatJarvisGrp.add(jarvisHudRing);
    registerInteractive(jScreenMesh, 'float-jarvis', jarvisRimMat);
    registerInteractive(jMonitorBody, 'float-jarvis', jarvisRimMat);
    r8.add(floatJarvisGrp);
    floatingProjectObjects.push({
      group: floatJarvisGrp,
      baseY: 2.8,
      baseRotY: 0.44,
      phase: 1.2,
      amp: 0.22,
      speed: 1.08,
      yawSwing: 0.12,
    });

    // 3. FLOATING OBJECT 03 (RIGHT-FRONT): NETFLIX CLONE — Levitating OLED Smart Cinema Screen
    const netflixRimMat = addAntiGravityPad(5.4, -11.6, 0xe50914, pinRedPoolTex, 1.65);
    const floatNetflixGrp = new THREE.Group();
    floatNetflixGrp.position.set(5.4, 2.8, -11.6);
    floatNetflixGrp.rotation.y = -0.44;
    const nBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.04, 2.52, 0.1)), darkMarblePlinthMat);
    floatNetflixGrp.add(nBody);
    const nRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(4.12, 2.6, 0.055)), netflixRimMat);
    floatNetflixGrp.add(nRim);
    const nScreenTex = trackTex(createProjectFrontendTexture('netflix'));
    const nScreenMesh = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(3.9, 2.38)),
      trackMat(new THREE.MeshBasicMaterial({ map: nScreenTex }))
    );
    nScreenMesh.position.z = 0.06;
    floatNetflixGrp.add(nScreenMesh);
    registerInteractive(nScreenMesh, 'float-netflix', netflixRimMat);
    registerInteractive(nBody, 'float-netflix', netflixRimMat);
    r8.add(floatNetflixGrp);
    floatingProjectObjects.push({
      group: floatNetflixGrp,
      baseY: 2.8,
      baseRotY: -0.44,
      phase: 2.4,
      amp: 0.21,
      speed: 1.12,
      yawSwing: 0.12,
    });

    // 4. FLOATING OBJECT 04 (LEFT-BACK): CODSOFT PORTFOLIO — Levitating 3D Open Aluminum Laptop!
    const portfolioRimMat = addAntiGravityPad(-5.4, -27.5, 0x818cf8, indigoPoolTex, 1.7);
    const floatLaptopGrp = new THREE.Group();
    floatLaptopGrp.position.set(-5.4, 2.65, -27.5);
    floatLaptopGrp.rotation.y = 0.44;
    // Laptop Screen Lid (tilted slightly back ergonomically)
    const laptopLidGrp = new THREE.Group();
    laptopLidGrp.position.set(0, 0.15, -0.35);
    laptopLidGrp.rotation.x = -0.14;
    const lidBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.68, 2.32, 0.08)), silverAlumMat);
    lidBody.position.y = 1.16;
    laptopLidGrp.add(lidBody);
    const lidGlowTrim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.74, 2.38, 0.04)), portfolioRimMat);
    lidGlowTrim.position.y = 1.16;
    laptopLidGrp.add(lidGlowTrim);
    const pScreenTex = trackTex(createProjectFrontendTexture('portfolio'));
    const pScreenMesh = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(3.52, 2.18)),
      trackMat(new THREE.MeshBasicMaterial({ map: pScreenTex }))
    );
    pScreenMesh.position.set(0, 1.16, 0.05);
    laptopLidGrp.add(pScreenMesh);
    floatLaptopGrp.add(laptopLidGrp);
    // Laptop Keyboard Base Deck
    const laptopDeck = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.72, 0.09, 2.15)), silverAlumMat);
    laptopDeck.position.set(0, 0.06, 0.72);
    laptopDeck.rotation.x = 0.14;
    floatLaptopGrp.add(laptopDeck);
    const keyBed = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(3.2, 0.03, 1.05)), darkMarblePlinthMat);
    keyBed.position.set(0, 0.13, 0.42);
    keyBed.rotation.x = 0.14;
    floatLaptopGrp.add(keyBed);
    const trackpad = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(1.1, 0.02, 0.62)), titaniumBodyMat);
    trackpad.position.set(0, 0.04, 1.32);
    trackpad.rotation.x = 0.14;
    floatLaptopGrp.add(trackpad);
    registerInteractive(pScreenMesh, 'float-portfolio', portfolioRimMat);
    registerInteractive(lidBody, 'float-portfolio', portfolioRimMat);
    registerInteractive(laptopDeck, 'float-portfolio', portfolioRimMat);
    r8.add(floatLaptopGrp);
    floatingProjectObjects.push({
      group: floatLaptopGrp,
      baseY: 1.95,
      baseRotY: 0.44,
      phase: 3.6,
      amp: 0.2,
      speed: 1.02,
      yawSwing: 0.13,
    });

    // 5. FLOATING OBJECT 05 (RIGHT-BACK): SCIENTIFIC CALCULATOR — Levitating Frosted Glass 3D Tablet!
    const calcRimMat = addAntiGravityPad(5.4, -28.5, 0xf59e0b, amberPoolTex, 1.55);
    const floatTabletGrp = new THREE.Group();
    floatTabletGrp.position.set(5.4, 2.75, -28.5);
    floatTabletGrp.rotation.y = -0.44;
    const tBody = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.58, 3.22, 0.12)), titaniumBodyMat);
    floatTabletGrp.add(tBody);
    const tRim = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(2.65, 3.29, 0.07)), calcRimMat);
    floatTabletGrp.add(tRim);
    const cScreenTex = trackTex(createProjectFrontendTexture('calculator'));
    const cScreenMesh = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(2.42, 3.06)),
      trackMat(new THREE.MeshBasicMaterial({ map: cScreenTex }))
    );
    cScreenMesh.position.z = 0.07;
    floatTabletGrp.add(cScreenMesh);
    registerInteractive(cScreenMesh, 'float-calculator', calcRimMat);
    registerInteractive(tBody, 'float-calculator', calcRimMat);
    r8.add(floatTabletGrp);
    floatingProjectObjects.push({
      group: floatTabletGrp,
      baseY: 2.75,
      baseRotY: -0.44,
      phase: 4.8,
      amp: 0.23,
      speed: 1.18,
      yawSwing: 0.14,
    });

    // =======================================================================
    // ROOM 09 — EXIT GALLERY (ROSE STARLIGHT ROTUNDA, East Wing, L = 28)
    // =======================================================================
    const r9 = roomGroups[9];
    const exitChandelierDrops: { mesh: THREE.Object3D; baseY: number; phase: number }[] = [];
    const exitOrbs: THREE.Mesh[] = [];

    createMuseumBench(r9, -4.4, -7.5, 0.2);
    createMuseumBench(r9, 4.4, -7.5, -0.2);

    const exitWallTex = trackTex(
      createExhibitPanelTexture({
        code: 'ROOM 09 // THE EXIT GALLERY',
        title: "THE EXHIBITION DOESN'T END HERE.",
        subtitle: 'THERE IS ALWAYS SOMETHING NEW TO CREATE. — THANK YOU FOR VISITING.',
        body: 'Click this wall to open direct Email, Resume Archive, Social Links & Visitor Guestbook',
        quoteMode: true,
        accent: '#f4a8c4',
        width: 1280,
        height: 680,
      })
    );
    const exitGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0x161922, emissive: 0xf4a8c4, emissiveIntensity: 0.1, roughness: 0.35, metalness: 0.55 })
    );
    const exitWallGroup = new THREE.Group();
    exitWallGroup.position.set(0, 3.2, -24.0);
    exitWallGroup.add(new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.8, 5.6, 0.35)), exitGlowMat));
    const exitBrassFrame = new THREE.Mesh(trackGeo(new THREE.BoxGeometry(10.95, 5.75, 0.22)), brushedBrassMat);
    exitBrassFrame.position.z = -0.02;
    exitWallGroup.add(exitBrassFrame);
    const exitFace = new THREE.Mesh(
      trackGeo(new THREE.PlaneGeometry(10.4, 5.25)),
      trackMat(new THREE.MeshBasicMaterial({ map: exitWallTex }))
    );
    exitFace.position.z = 0.2;
    exitWallGroup.add(exitFace);
    const exitHalo = new THREE.Mesh(
      trackGeo(new THREE.TorusGeometry(6.4, 0.065, 16, 72, Math.PI)),
      roomAccentEmissiveMats[9]
    );
    exitHalo.position.set(0, -1.8, -0.1);
    exitWallGroup.add(exitHalo);
    registerInteractive(exitFace, 'exit-wall', exitGlowMat);
    r9.add(exitWallGroup);

    const endCap = new THREE.Mesh(trackGeo(new THREE.PlaneGeometry(CORRIDOR_HALF_W * 2, 9)), roomWallMats[9]);
    endCap.position.set(0, 4.5, -28.0);
    r9.add(endCap);

    const chandelierCanopy = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(3.4, 3.4, 0.14, 48)), brushedBrassMat);
    chandelierCanopy.position.set(0, 8.22, -13.5);
    r9.add(chandelierCanopy);
    const dropCordGeo = trackGeo(new THREE.CylinderGeometry(0.008, 0.008, 1.0, 6));
    const dropGemGeo = trackGeo(new THREE.OctahedronGeometry(0.14, 1));
    const pearlGlowMat = trackMat(
      new THREE.MeshStandardMaterial({ color: 0xfff5f8, emissive: 0xffcce0, emissiveIntensity: 1.7, roughness: 0.15 })
    );
    const dropCount = 28;
    for (let d = 0; d < dropCount; d++) {
      const t = d / dropCount;
      const angle = t * Math.PI * 6;
      const radius = 0.55 + t * 2.75;
      const dropLen = 3.1 - t * 1.9;
      const dropY = 8.18 - dropLen;
      const dx = Math.cos(angle) * radius;
      const dz = -13.5 + Math.sin(angle) * radius;
      const cord = new THREE.Mesh(dropCordGeo, brushedBrassMat);
      cord.scale.y = dropLen;
      cord.position.set(dx, 8.18 - dropLen * 0.5, dz);
      r9.add(cord);
      const pendant = new THREE.Mesh(dropGemGeo, d % 2 === 0 ? pearlGlowMat : roomAccentEmissiveMats[9]);
      pendant.scale.set(0.85, 1.5, 0.85);
      pendant.position.set(dx, dropY, dz);
      r9.add(pendant);
      exitChandelierDrops.push({ mesh: pendant, baseY: dropY, phase: d * 0.45 });
    }

    // ART FX 7: Opalescent Iridescent Pearl Orbs on Alabaster Plinths!
    const alabasterMat = trackMat(new THREE.MeshPhysicalMaterial({ color: 0xeae2ea, roughness: 0.28, metalness: 0.1, clearcoat: 0.65 }));
    const opalescentPearlMat = trackMat(
      new THREE.MeshPhysicalMaterial({
        color: 0xfde2ec,
        emissive: 0xf4a8c4,
        emissiveIntensity: 0.28,
        metalness: 0.35,
        roughness: 0.08,
        clearcoat: 1.0,
        iridescence: 1.0,
        iridescenceIOR: 1.55,
      })
    );
    [-6.9, 6.9].forEach((ox) => {
      const plinth = new THREE.Mesh(trackGeo(new THREE.CylinderGeometry(0.68, 0.82, 1.35, 32)), alabasterMat);
      plinth.position.set(ox, 0.675, -18.5);
      r9.add(plinth);
      const ring = new THREE.Mesh(trackGeo(new THREE.TorusGeometry(0.72, 0.03, 12, 42)), brushedBrassMat);
      ring.rotation.x = Math.PI / 2;
      ring.position.set(ox, 1.36, -18.5);
      r9.add(ring);
      const orb = new THREE.Mesh(trackGeo(new THREE.SphereGeometry(0.56, 36, 36)), opalescentPearlMat);
      orb.position.set(ox, 2.38, -18.5);
      r9.add(orb);
      exitOrbs.push(orb);
      const rosePool = new THREE.Mesh(
        trackGeo(new THREE.PlaneGeometry(3.2, 3.2)),
        trackMat(
          new THREE.MeshBasicMaterial({
            map: rosePoolTex,
            transparent: true,
            opacity: 0.52,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          })
        )
      );
      rosePool.rotation.x = -Math.PI / 2;
      rosePool.position.set(ox, 0.025, -18.5);
      r9.add(rosePool);
    });

    // Ambient Floating Dust Motes across All 10 Wings
    const dustCount = 1650;
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      dustPositions[i * 3] = -18 + Math.random() * 82;
      dustPositions[i * 3 + 1] = Math.random() * 7.8 + 0.3;
      dustPositions[i * 3 + 2] = 18 - Math.random() * 274;
    }
    const dustGeo = trackGeo(new THREE.BufferGeometry());
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMat = trackMat(new THREE.PointsMaterial({ color: 0xf2e2c8, size: 0.058, transparent: true, opacity: 0.48 }));
    const dustField = new THREE.Points(dustGeo, dustMat);
    scene.add(dustField);

    // =======================================================================
    // INPUT HANDLERS
    // =======================================================================
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2(-99, -99);
    let isDraggingLook = false;
    let isDraggingFaceModel = false;
    let dragDistance = 0;
    let dragStartX = 0;
    let dragStartY = 0;
    let targetYaw = 0;
    let targetPitch = 0;
    let currentHoveredId: string | null = null;
    let lastRoomIdx = 0;
    let lastCornerIdx = -1;
    let lastFaceAngleDeg = 0;

    const updatePointerNdc = (clientX: number, clientY: number) => {
      const rect = renderer.domElement.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const handleWheel = (e: WheelEvent) => {
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('[data-museum-overlay="true"]')) return;
      e.preventDefault();
      stopAutoTour();
      if (cameraStateRef.current.focused) {
        setSelectedExhibit(null);
        cameraStateRef.current.focused = false;
      }
      const delta = e.deltaY * 0.00031;
      const nextVal = Math.max(0, Math.min(1, progressObjRef.current.value + delta));
      gsap.to(progressObjRef.current, { value: nextVal, duration: 0.72, ease: 'power2.out', overwrite: 'auto' });
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'Escape') {
        setSelectedExhibit(null);
        setFloorMapOpen(false);
        cameraStateRef.current.focused = false;
        return;
      }
      if (['ArrowDown', 's', 'S', 'ArrowRight'].includes(e.key)) {
        stopAutoTour();
        if (cameraStateRef.current.focused) {
          setSelectedExhibit(null);
          cameraStateRef.current.focused = false;
        }
        gsap.to(progressObjRef.current, { value: Math.min(1, progressObjRef.current.value + 0.04), duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
      } else if (['ArrowUp', 'w', 'W', 'ArrowLeft'].includes(e.key)) {
        stopAutoTour();
        if (cameraStateRef.current.focused) {
          setSelectedExhibit(null);
          cameraStateRef.current.focused = false;
        }
        gsap.to(progressObjRef.current, { value: Math.max(0, progressObjRef.current.value - 0.04), duration: 0.7, ease: 'power2.out', overwrite: 'auto' });
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      updatePointerNdc(e.clientX, e.clientY);
      dragDistance = 0;
      dragStartX = e.clientX;
      dragStartY = e.clientY;

      raycaster.setFromCamera(pointerNdc, camera);
      const faceHits = raycaster.intersectObjects(faceHitTargets, false);
      if (faceHits.length > 0 && faceHits[0].distance < 22) {
        isDraggingFaceModel = true;
        isDraggingLook = false;
        stopAutoTour();
        setIsDraggingFaceUi(true);
        renderer.domElement.style.cursor = 'grabbing';
        try {
          renderer.domElement.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
        return;
      }
      isDraggingLook = true;
      isDraggingFaceModel = false;
    };

    const handlePointerMove = (e: PointerEvent) => {
      updatePointerNdc(e.clientX, e.clientY);
      if (isDraggingFaceModel) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        const step = dx / 360;
        faceTargetTurn += step;
        faceVelocity = faceVelocity * 0.35 + step * 0.65;
        renderer.domElement.style.cursor = 'grabbing';
        return;
      }
      if (isDraggingLook) {
        const dx = e.clientX - dragStartX;
        const dy = e.clientY - dragStartY;
        dragDistance += Math.abs(dx) + Math.abs(dy);
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        targetYaw = Math.max(-0.62, Math.min(0.62, targetYaw - dx * 0.0022));
        targetPitch = Math.max(-0.22, Math.min(0.25, targetPitch + dy * 0.0018));
      } else if (currentHoveredId !== 'centerpiece-3d-face') {
        targetYaw += (pointerNdc.x * 0.14 - targetYaw) * 0.07;
        targetPitch += (pointerNdc.y * 0.07 - targetPitch) * 0.07;
      } else {
        targetYaw += (0 - targetYaw) * 0.08;
        targetPitch += (0 - targetPitch) * 0.08;
      }
    };

    const handlePointerUp = (e: PointerEvent) => {
      if (isDraggingFaceModel) {
        try {
          if (renderer.domElement.hasPointerCapture(e.pointerId)) {
            renderer.domElement.releasePointerCapture(e.pointerId);
          }
        } catch {
          // ignore
        }
        if (dragDistance < 6) {
          const ex = MUSEUM_EXHIBITS_3D.find((item) => item.id === 'centerpiece-3d-face');
          if (ex) focusExhibit(ex);
        }
        isDraggingFaceModel = false;
        setIsDraggingFaceUi(false);
        renderer.domElement.style.cursor = currentHoveredId === 'centerpiece-3d-face' ? 'grab' : 'default';
        return;
      }
      if (isDraggingLook && dragDistance < 8 && currentHoveredId) {
        const ex = MUSEUM_EXHIBITS_3D.find((item) => item.id === currentHoveredId);
        if (ex) focusExhibit(ex);
      }
      isDraggingLook = false;
    };

    let touchLastX = 0;
    let touchLastY = 0;
    let isTouchRotatingFace = false;
    const handleTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      touchLastX = t.clientX;
      touchLastY = t.clientY;
      updatePointerNdc(t.clientX, t.clientY);
      raycaster.setFromCamera(pointerNdc, camera);
      const faceHits = raycaster.intersectObjects(faceHitTargets, false);
      isTouchRotatingFace = faceHits.length > 0 && faceHits[0].distance < 22;
      if (isTouchRotatingFace) {
        stopAutoTour();
        setIsDraggingFaceUi(true);
      }
    };
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      const targetEl = e.target as HTMLElement | null;
      if (targetEl?.closest('[data-museum-overlay="true"]')) return;
      if (isTouchRotatingFace) {
        const dx = t.clientX - touchLastX;
        touchLastX = t.clientX;
        touchLastY = t.clientY;
        const step = dx / 250;
        faceTargetTurn += step;
        faceVelocity = faceVelocity * 0.35 + step * 0.65;
        return;
      }
      stopAutoTour();
      const dy = touchLastY - t.clientY;
      touchLastX = t.clientX;
      touchLastY = t.clientY;
      if (cameraStateRef.current.focused) {
        setSelectedExhibit(null);
        cameraStateRef.current.focused = false;
      }
      progressObjRef.current.value = Math.max(0, Math.min(1, progressObjRef.current.value + dy * 0.00056));
    };
    const handleTouchEnd = () => {
      if (isTouchRotatingFace) {
        isTouchRotatingFace = false;
        setIsDraggingFaceUi(false);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('keydown', handleKeyDown);
    renderer.domElement.addEventListener('pointerdown', handlePointerDown);
    renderer.domElement.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
    renderer.domElement.addEventListener('touchstart', handleTouchStart, { passive: true });
    renderer.domElement.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    // =======================================================================
    // 60 FPS PHOTOREALISTIC RENDER LOOP (ART SHADERS + WHITE MODE + TURNS)
    // =======================================================================
    let animId: number;
    const startTime = performance.now();
    const UP_AXIS = new THREE.Vector3(0, 1, 0);
    const smoothForwardVec = new THREE.Vector3(0, 0, -1);
    const desiredForwardVec = new THREE.Vector3(0, 0, -1);
    const lookDirVec = new THREE.Vector3(0, 0, -1);
    const lookTargetVec = new THREE.Vector3();
    const tmpColor = new THREE.Color();
    let frameCount = 0;

    const animate = () => {
      animId = requestAnimationFrame(animate);
      frameCount++;
      const elapsed = (performance.now() - startTime) * 0.001;

      // Update Custom GLSL Art Shaders
      iridescentCrystalMat.uniforms.uTime.value = elapsed;
      holoScanAuraMat.uniforms.uTime.value = elapsed;
      dichroicGlassMat.uniforms.uTime.value = elapsed;
      auroraPlasmaMat.uniforms.uTime.value = elapsed;

      if (autoTourRef.current && !cameraStateRef.current.focused) {
        progressObjRef.current.value += 0.00034;
        if (progressObjRef.current.value >= 1) {
          progressObjRef.current.value = 1;
          autoTourRef.current = false;
          setAutoTour(false);
        }
      }

      // 0. Zero-Latency GPU-Resident 96-Angle Turntable Rotation + Silky Flick Momentum
      if (!isDraggingFaceModel && !isTouchRotatingFace && Math.abs(faceVelocity) > 0.00005) {
        faceTargetTurn += faceVelocity;
        faceVelocity *= 0.935;
      } else if (!isDraggingFaceModel && !isTouchRotatingFace) {
        faceVelocity = 0;
      }
      const turnDiff = faceTargetTurn - faceCurrentTurn;
      if (Math.abs(turnDiff) > 0.00005) {
        const lerpRate = isDraggingFaceModel || isTouchRotatingFace ? 0.36 : 0.22;
        faceCurrentTurn += turnDiff * lerpRate;
        const normAngle = ((faceCurrentTurn % 1) + 1) % 1;
        const allSheetsLoaded = sheetLoaded[0] && sheetLoaded[1] && sheetLoaded[2] && sheetLoaded[3];
        if (allSheetsLoaded) {
          faceBustShaderMat.uniforms.uFrameFloat.value = normAngle * TURNTABLE_TOTAL_FRAMES;
        } else if (sheetLoaded[0]) {
          // Allow instant preview across sheet 0 while sheets 1-3 finish loading
          faceBustShaderMat.uniforms.uFrameFloat.value = Math.min(23, normAngle * TURNTABLE_TOTAL_FRAMES);
        }
        faceTurntableGroup.rotation.y = -normAngle * Math.PI * 2;
        const deg = Math.round(normAngle * 360) % 360;
        if (deg !== lastFaceAngleDeg) {
          lastFaceAngleDeg = deg;
          setFaceAngleDeg(deg);
        }
      }
      const dragGlowTarget = isDraggingFaceModel || isTouchRotatingFace || Math.abs(turnDiff) > 0.003 ? 1.0 : 0.0;
      faceBustShaderMat.uniforms.uDragIntensity.value +=
        (dragGlowTarget - faceBustShaderMat.uniforms.uDragIntensity.value) * 0.14;
      const hoverTarget = isDraggingFaceModel || currentHoveredId === 'centerpiece-3d-face' ? 1.0 : 0.0;
      faceBustShaderMat.uniforms.uHoverGlow.value += (hoverTarget - faceBustShaderMat.uniforms.uHoverGlow.value) * 0.12;

      // 1. Animate 3D Art Sculptures & Per-Room Effects
      emblemCore.rotation.y = elapsed * 0.55;
      emblemCore.rotation.x = Math.sin(elapsed * 0.7) * 0.28;
      emblemRing1.rotation.y = -elapsed * 0.42;
      emblemRing1.rotation.x = elapsed * 0.28;
      emblemRing2.rotation.z = elapsed * 0.32;
      emblemGroup.position.y = 7.55 + Math.sin(elapsed * 1.15) * 0.08;

      vertexPhoneGroup.rotation.y = elapsed * 0.5;
      vertexPhoneGroup.position.y = 2.8 + Math.sin(elapsed * 1.35) * 0.11;
      vertexOrbitRing.rotation.z = elapsed * 0.48;
      vertexScanRing.position.y = Math.sin(elapsed * 1.9) * 1.35;

      knotMesh.rotation.y = elapsed * 0.55;
      knotMesh.rotation.x = elapsed * 0.32;
      cageMesh.rotation.y = -elapsed * 0.24;

      reactInstallGroup.rotation.y = elapsed * 0.44;
      reactInstallGroup.rotation.x = Math.sin(elapsed * 0.75) * 0.14;
      reactElectrons.forEach((el) => {
        const a = elapsed * el.speed + el.phase;
        const r = 1.26;
        const lx = Math.cos(a) * r;
        const ly = Math.sin(a) * r * Math.cos(el.orbitTilt);
        const lz = Math.sin(a) * r * Math.sin(el.orbitTilt);
        const cy = Math.cos(el.orbitYaw);
        const sy = Math.sin(el.orbitYaw);
        el.mesh.position.set(lx * cy + lz * sy, ly, -lx * sy + lz * cy);
      });

      gsapPillars.forEach(({ mesh, mat }, idx) => {
        const wave = Math.sin(elapsed * 2.3 + idx * 0.55);
        mesh.scale.y = 0.55 + (wave * 0.5 + 0.5) * 1.05;
        mesh.position.y = mesh.scale.y * 0.7;
        // Dynamic Chromatic Hue Shift along the wave!
        const hue = (0.52 + idx * 0.045 + elapsed * 0.06) % 1;
        tmpColor.setHSL(hue, 0.85, 0.58);
        mat.emissive.copy(tmpColor);
        mat.emissiveIntensity = 0.35 + (wave * 0.5 + 0.5) * 0.85;
      });

      labPoints.rotation.y = elapsed * 0.34;
      labPoints.rotation.x = elapsed * 0.14;
      labCore.rotation.y = -elapsed * 0.45;
      labCore.rotation.x = elapsed * 0.22;

      // Room 06 Hobbies Sculpture Animation
      cricketSphere.rotation.y = elapsed * 0.48;
      cricketSphere.rotation.z = Math.sin(elapsed * 0.6) * 0.22;
      seamA.rotation.y = elapsed * 0.48;
      seamB.rotation.y = elapsed * 0.48;
      hobbyOrbitCube.position.set(Math.cos(elapsed * 1.05) * 1.22, Math.sin(elapsed * 1.5) * 0.42, Math.sin(elapsed * 1.05) * 1.22);
      hobbyOrbitCube.rotation.x = elapsed * 1.1;
      hobbyOrbitCube.rotation.y = elapsed * 0.85;
      hobbyRibbonCoral.rotation.z = elapsed * 0.42;
      hobbyRibbonTeal.rotation.z = -elapsed * 0.36;
      hobbyArtLoops.forEach((loop, idx) => {
        loop.rotation.y = elapsed * (idx % 2 === 0 ? 0.35 : -0.35);
        loop.rotation.x = Math.sin(elapsed * 0.5 + idx) * 0.25;
      });

      emeraldCanopyNodes.forEach((node, idx) => {
        node.rotation.y = elapsed * (0.65 + (idx % 3) * 0.15);
      });
      techHoloRings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.36 : -0.52);
      });
      labFloatingCrystals.forEach((c) => {
        c.mesh.rotation.y = elapsed * c.speed;
        c.mesh.rotation.x = Math.sin(elapsed * 0.6 + c.phase) * 0.25;
        c.mesh.position.y = c.baseY + Math.sin(elapsed * 1.1 + c.phase) * 0.18;
      });
      socialCorePrism.rotation.y = elapsed * 0.65;
      socialCorePrism.rotation.x = Math.sin(elapsed * 0.9) * 0.28;
      socialCorePrism.position.y = 2.65 + Math.sin(elapsed * 1.4) * 0.1;
      socialOrbitOrbs.forEach((orb, idx) => {
        const ang = elapsed * orb.speed + orb.phase;
        orb.mesh.position.set(
          Math.cos(ang) * orb.radius,
          2.65 + Math.sin(elapsed * 1.3 + idx * 1.1) * orb.yAmp,
          Math.sin(ang) * orb.radius
        );
      });
      socialHaloRings.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.25 : -0.32);
        ring.rotation.x = Math.PI / 2 + Math.sin(elapsed * 0.7 + idx) * 0.08;
      });
      floatingProjectObjects.forEach((item) => {
        item.group.position.y = item.baseY + Math.sin(elapsed * item.speed + item.phase) * item.amp;
        item.group.rotation.y = item.baseRotY + Math.sin(elapsed * 0.65 + item.phase) * item.yawSwing;
        item.group.rotation.z = Math.cos(elapsed * 0.8 + item.phase) * 0.035;
      });
      jarvisHudRing.rotation.z = elapsed * 0.75;
      vertexSideCards.forEach((card, idx) => {
        card.position.y = (idx === 0 ? 0.35 : -0.25) + Math.sin(elapsed * 1.6 + idx * Math.PI) * 0.14;
      });
      floatingRingsRoom8.forEach((ring, idx) => {
        ring.rotation.z = elapsed * (idx % 2 === 0 ? 0.28 : -0.36);
      });
      floatingUiShards.forEach((s) => {
        s.mesh.position.y = s.baseY + Math.sin(elapsed * s.speed + s.phase) * 0.22;
        s.mesh.rotation.x = Math.sin(elapsed * 0.5 + s.phase) * 0.15;
      });
      exitChandelierDrops.forEach((drop) => {
        drop.mesh.rotation.y = elapsed * 0.4 + drop.phase;
        drop.mesh.position.y = drop.baseY + Math.sin(elapsed * 1.3 + drop.phase) * 0.04;
      });
      exitOrbs.forEach((orb, idx) => {
        orb.position.y = 2.38 + Math.sin(elapsed * 1.15 + idx * Math.PI) * 0.12;
      });
      cornerSpinnerRings.forEach((r, idx) => {
        r.rotation.y = elapsed * (idx % 2 === 0 ? 0.55 : -0.55);
        r.rotation.x = Math.sin(elapsed * 0.8 + idx) * 0.3;
      });
      dustField.position.y = Math.sin(elapsed * 0.25) * 0.14;

      // 2. Smooth Turning-Spline Steadicam Camera Movement
      const st = cameraStateRef.current;
      st.yawOffset += (targetYaw - st.yawOffset) * 0.08;
      st.pitchOffset += (targetPitch - st.pitchOffset) * 0.08;

      if (st.focused) {
        camera.position.set(st.camX, st.camY, st.camZ);
        lookTargetVec.set(st.lookX, st.lookY, st.lookZ);
      } else {
        smoothProgressRef.current += (progressObjRef.current.value - smoothProgressRef.current) * 0.11;
        const u = Math.max(0, Math.min(1, smoothProgressRef.current));
        const splinePos = MUSEUM_CAMERA_PATH.getPointAt(u);
        st.camX += (splinePos.x - st.camX) * 0.18;
        st.camY += (2.55 + Math.sin(elapsed * 0.85) * 0.022 - st.camY) * 0.1;
        st.camZ += (splinePos.z - st.camZ) * 0.18;
        camera.position.set(st.camX, st.camY, st.camZ);

        if (u > 0.985) {
          desiredForwardVec.copy(MUSEUM_CAMERA_PATH.getTangentAt(1));
        } else {
          const lookAheadPt = MUSEUM_CAMERA_PATH.getPointAt(Math.min(1, u + 0.024));
          desiredForwardVec.subVectors(lookAheadPt, splinePos);
          desiredForwardVec.y = 0;
          if (desiredForwardVec.lengthSq() < 0.0001) {
            desiredForwardVec.copy(MUSEUM_CAMERA_PATH.getTangentAt(u));
            desiredForwardVec.y = 0;
          }
          desiredForwardVec.normalize();
        }
        smoothForwardVec.lerp(desiredForwardVec, 0.095).normalize();

        lookDirVec.copy(smoothForwardVec).applyAxisAngle(UP_AXIS, -st.yawOffset);
        st.lookX = st.camX + lookDirVec.x * 14;
        st.lookY = 2.55 + st.pitchOffset * 5.0;
        st.lookZ = st.camZ + lookDirVec.z * 14;
        lookTargetVec.set(st.lookX, st.lookY, st.lookZ);
      }

      camera.lookAt(lookTargetVec);
      cameraLight.position.set(
        camera.position.x + smoothForwardVec.x * 2.4,
        camera.position.y + 1.4,
        camera.position.z + smoothForwardVec.z * 2.4
      );

      // 3. Detect Active Room & Smoothly Morph Room 02 White-Wall Light Mode vs Dark Mode!
      const uCurr = Math.max(0, Math.min(1, smoothProgressRef.current));
      const detectedIdx = getRoomIndexAtProgress(uCurr);
      const isWhiteProjectsActive = projectsLightModeRef.current;
      const inWhiteRoomNow = detectedIdx === 2 && isWhiteProjectsActive;

      // Smoothly transition Room 02 walls, ceiling, arches, and lights between White Walls & Dark Mode
      roomWallMats[2].color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_WALL : ROOM2_DARK_WALL, 0.08);
      roomCeilingMats[2].color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_CEILING : ROOM2_DARK_CEIL, 0.08);
      projectsArchColMat.color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_ARCH : DARK_ARCH_COLOR, 0.08);
      if (projectsKeyLight) {
        projectsKeyLight.color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_LIGHT : ROOM2_DARK_KEY_LIGHT, 0.08);
        projectsKeyLight.intensity += ((isWhiteProjectsActive ? 14.5 : 6.8) - projectsKeyLight.intensity) * 0.08;
      }
      if (projectsSideLight) {
        projectsSideLight.color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_LIGHT : ROOM2_DARK_SIDE_LIGHT, 0.08);
        projectsSideLight.intensity += ((isWhiteProjectsActive ? 9.5 : 4.9) - projectsSideLight.intensity) * 0.08;
      }
      if (projectsExtraDaylight) {
        projectsExtraDaylight.intensity += ((isWhiteProjectsActive ? 13.0 : 0.0) - projectsExtraDaylight.intensity) * 0.08;
      }
      if (corner1LightRef) {
        corner1LightRef.color.lerp(isWhiteProjectsActive ? WHITE_GALLERY_LIGHT : ROOM2_DARK_KEY_LIGHT, 0.08);
        corner1LightRef.intensity += ((isWhiteProjectsActive ? 9.5 : 5.2) - corner1LightRef.intensity) * 0.08;
      }

      // Smoothly shift global fog, ambient daylight, floor glaze, and bloom threshold when entering White-Wall Room 02!
      const targetFog = inWhiteRoomNow ? WHITE_GALLERY_FOG : ROOM_THEMES[detectedIdx].fogColor;
      const targetLightTint = inWhiteRoomNow ? WHITE_GALLERY_LIGHT : ROOM_THEMES[detectedIdx].lightColorObj;
      currentBgColor.lerp(targetFog, 0.06);
      fog.color.copy(currentBgColor);
      cameraLight.color.lerp(targetLightTint, 0.06);
      dustMat.color.lerp(targetLightTint, 0.05);

      ambientLight.intensity += ((inWhiteRoomNow ? 1.45 : 0.34) - ambientLight.intensity) * 0.07;
      hemiLight.intensity += ((inWhiteRoomNow ? 1.35 : 0.44) - hemiLight.intensity) * 0.07;
      marbleFloorMat.color.lerp(inWhiteRoomNow ? WHITE_FLOOR_TINT : DARK_FLOOR_TINT, 0.06);
      bloomPass.strength += ((inWhiteRoomNow ? 0.08 : 0.34) - bloomPass.strength) * 0.08;
      bloomPass.threshold += ((inWhiteRoomNow ? 1.18 : 0.82) - bloomPass.threshold) * 0.08;

      if (detectedIdx !== lastRoomIdx) {
        lastRoomIdx = detectedIdx;
        const nextRoom = MUSEUM_ROOMS_3D[detectedIdx];
        setActiveRoom(nextRoom);
        onRoomChange?.(nextRoom.id);
      }

      const cornerNow = getActiveTurnCorner(uCurr);
      const cornerNowIdx = cornerNow ? cornerNow.index : -1;
      if (cornerNowIdx !== lastCornerIdx) {
        lastCornerIdx = cornerNowIdx;
        setActiveTurn(cornerNow);
      }

      const pct = Math.round(uCurr * 100);
      setWalkProgressPct((prev) => (prev !== pct ? pct : prev));

      if (frameCount % 4 === 0) {
        const mapped = mapWorldToMiniSvg(camera.position.x, camera.position.z);
        const angleDeg = (Math.atan2(smoothForwardVec.x, -smoothForwardVec.z) * 180) / Math.PI;
        setMiniVisitor({ x: mapped.sx, y: mapped.sy, angleDeg });
      }

      // 4. Raycasting for Hover Highlight
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(interactiveMeshes, false);
      const hitId = hits.length > 0 && hits[0].distance < 26 ? (hits[0].object.userData.exhibitId as string) : null;

      if (hitId !== currentHoveredId) {
        if (currentHoveredId) {
          const prevMat = exhibitHoverGlows.get(currentHoveredId);
          if (prevMat) prevMat.emissiveIntensity = 0.08;
        }
        currentHoveredId = hitId;
        if (hitId) {
          const nextMat = exhibitHoverGlows.get(hitId);
          if (nextMat) nextMat.emissiveIntensity = 0.42;
          const found = MUSEUM_EXHIBITS_3D.find((item) => item.id === hitId) || null;
          setHoveredExhibit(found);
          if (!isDraggingFaceModel) {
            renderer.domElement.style.cursor = hitId === 'centerpiece-3d-face' ? 'grab' : 'pointer';
          }
        } else {
          setHoveredExhibit(null);
          if (!isDraggingFaceModel) {
            renderer.domElement.style.cursor = isDraggingLook ? 'grabbing' : 'grab';
          }
        }
      }

      floorReflector.visible = bloomEnabledRef.current;
      marbleFloorMat.opacity = bloomEnabledRef.current ? (inWhiteRoomNow ? 0.62 : 0.78) : 1.0;

      if (bloomEnabledRef.current) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const nw = container.clientWidth || window.innerWidth;
      const nh = container.clientHeight || window.innerHeight;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
      composer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      resetFaceModelRef.current = null;
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('pointerdown', handlePointerDown);
      renderer.domElement.removeEventListener('pointermove', handlePointerMove);
      renderer.domElement.removeEventListener('touchstart', handleTouchStart);
      renderer.domElement.removeEventListener('touchmove', handleTouchMove);

      floorReflector.dispose();
      envRT.dispose();
      composer.dispose();
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => m.dispose());
      textures.forEach((t) => t.dispose());
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [focusExhibit, onRoomChange, stopAutoTour]);

  const goPrevRoom = () => {
    const prevIdx = Math.max(0, activeRoom.index - 1);
    flyToRoom(MUSEUM_ROOMS_3D[prevIdx]);
  };
  const goNextRoom = () => {
    const nextIdx = Math.min(MUSEUM_ROOMS_3D.length - 1, activeRoom.index + 1);
    flyToRoom(MUSEUM_ROOMS_3D[nextIdx]);
  };

  const toggleAutoTour = () => {
    playAudioCue('click');
    if (cameraStateRef.current.focused) {
      setSelectedExhibit(null);
      cameraStateRef.current.focused = false;
    }
    if (progressObjRef.current.value >= 0.98) {
      progressObjRef.current.value = 0;
      smoothProgressRef.current = 0;
    }
    setAutoTour((prev) => !prev);
  };

  const handleCopyEmail = () => {
    playAudioCue('click');
    navigator.clipboard.writeText(data.personal.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2200);
  };

  const handleGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name || !guestForm.email || !guestForm.message) return;
    playAudioCue('whoosh');
    setGuestSent(true);
    setGuestForm({ name: '', email: '', message: '' });
    setTimeout(() => setGuestSent(false), 5000);
  };

  const isDrawerLight = Boolean(selectedExhibit?.roomIndex === 2 && projectsLightMode);

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#0b0c10] select-none">
      {/* FULL-VIEWPORT 8-WING TURNING 3D MUSEUM CANVAS */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full z-0" />

      {/* Subtle Photographic Vignette (softens automatically inside White-Wall Room 02!) */}
      <div
        className={`pointer-events-none absolute inset-0 z-10 transition-opacity duration-500 ${
          activeRoom.index === 2 && projectsLightMode
            ? 'bg-[radial-gradient(ellipse_at_center,transparent_68%,rgba(120,115,105,0.22)_100%)]'
            : 'bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(5,6,9,0.62)_100%)]'
        }`}
      />

      {/* LIVE 2D ARCHITECTURAL 8-WING TURN-MAP COMPASS (TOP-RIGHT) */}
      {!selectedExhibit && (
        <button
          type="button"
          onClick={() => {
            playAudioCue('click');
            setFloorMapOpen(true);
          }}
          title="Live 8-Wing Turning Museum Map — Click for Full Floor Plan"
          className="hidden sm:flex fixed top-20 right-5 z-20 flex-col items-center p-2.5 rounded-2xl bg-[#0d0f15]/84 backdrop-blur-xl border border-[#d6c7b2]/25 hover:border-[#d6c7b2]/65 shadow-[0_12px_35px_rgba(0,0,0,0.75)] transition-all cursor-pointer group"
        >
          <span className="text-[8px] font-mono tracking-[0.22em] uppercase text-[#d6c7b2]/75 mb-1 group-hover:text-[#d6c7b2]">
            LIVE MAP
          </span>
          <svg viewBox="0 0 100 175" className="w-[74px] h-[126px] overflow-visible">
            <path
              d={miniMapSvgPath}
              fill="none"
              stroke="rgba(214,199,178,0.28)"
              strokeWidth="4.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {miniRoomDots.map((r) => (
              <circle
                key={r.id}
                cx={r.sx}
                cy={r.sy}
                r={r.index === activeRoom.index ? 4.2 : 2.6}
                fill={r.accentCss}
                opacity={r.index === activeRoom.index ? 1 : 0.65}
              />
            ))}
            <g transform={`translate(${miniVisitor.x.toFixed(1)}, ${miniVisitor.y.toFixed(1)}) rotate(${miniVisitor.angleDeg.toFixed(1)})`}>
              <circle r="5.5" fill={activeRoom.accentCss} opacity="0.28" />
              <polygon points="0,-6.5 4.2,4.5 0,2.2 -4.2,4.5" fill="#ffffff" stroke={activeRoom.accentCss} strokeWidth="0.9" />
            </g>
          </svg>
        </button>
      )}

      {/* 90° ARCHITECTURAL TURN TRANSITION INDICATOR BANNER */}
      {activeTurn && !selectedExhibit && (
        <div
          className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-25 px-5 py-2 rounded-full bg-[#0e1017]/90 backdrop-blur-xl border shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center gap-2.5 animate-in fade-in duration-200"
          style={{ borderColor: `${activeTurn.accentCss}80` }}
        >
          {activeTurn.turnDir === 'right' ? (
            <CornerUpRight className="w-4 h-4" style={{ color: activeTurn.accentCss }} />
          ) : (
            <CornerUpLeft className="w-4 h-4" style={{ color: activeTurn.accentCss }} />
          )}
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-bold" style={{ color: activeTurn.accentCss }}>
            {activeTurn.turnLabel}
          </span>
        </div>
      )}

      {/* FLOATING HOVER EXHIBIT TOOLTIP */}
      {hoveredExhibit && !selectedExhibit && !activeTurn && (hoveredExhibit.id !== 'centerpiece-3d-face' || walkProgressPct >= 4) && (
        <div className="pointer-events-none fixed top-24 left-1/2 -translate-x-1/2 z-30 px-5 py-2.5 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#d6c7b2]/50 shadow-[0_12px_40px_rgba(0,0,0,0.85)] flex items-center gap-3 animate-in fade-in duration-150">
          {hoveredExhibit.id === 'centerpiece-3d-face' ? (
            <MoveHorizontal className="w-4 h-4 text-[#d6c7b2]" />
          ) : (
            <MousePointerClick className="w-4 h-4 text-[#d6c7b2]" />
          )}
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#d6c7b2] font-bold">
            {hoveredExhibit.code}
          </span>
          <span className="text-[#d6c7b2]/35">|</span>
          <span className="font-serif text-base text-[#f5f0e8]">{hoveredExhibit.title}</span>
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#8e877c] hidden sm:inline">
            {hoveredExhibit.id === 'centerpiece-3d-face'
              ? '• Drag Left / Right to Rotate 360°'
              : hoveredExhibit.demoKey
                ? '• Click for Live Demo & GitHub'
                : '• Click to Inspect'}
          </span>
        </div>
      )}

      {/* ROOM 00 OPENING ARCHITECTURAL WORDMARK */}
      {activeRoom.index === 0 && !selectedExhibit && !activeTurn && walkProgressPct < 4 && (
        <div className="pointer-events-none fixed inset-x-0 top-[70px] sm:top-[76px] z-20 flex flex-col items-center text-center px-4">
          <div className="inline-flex items-center gap-2 text-[9px] sm:text-[10px] font-mono tracking-[0.28em] uppercase text-[#d6c7b2]/90">
            <Sparkles className="w-3 h-3 text-[#d6c7b2]" />
            <span>THE DIGITAL MUSEUM • FOUNDED BY {data.personal.name.toUpperCase()}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-4xl font-light tracking-tight leading-tight text-[#f5f0e8] drop-shadow-[0_6px_28px_rgba(0,0,0,0.95)] mt-0.5">
            An Exhibition of <span className="italic text-[#d6c7b2]">Ideas, Experiments &amp; Creations</span>
          </h1>
        </div>
      )}

      {/* ROOM 02 PROJECTS QUICK DEMO & WHITE-WALLS BAR */}
      {activeRoom.index === 2 && !selectedExhibit && !activeTurn && (
        <div
          data-museum-overlay="true"
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-25 max-w-[94vw] px-3 py-2 rounded-full bg-[#101218]/90 backdrop-blur-xl border border-[#d6c7b2]/35 shadow-[0_14px_40px_rgba(0,0,0,0.75)] flex items-center gap-1.5 overflow-x-auto"
        >
          <span className="text-[9px] font-mono tracking-[0.18em] uppercase text-emerald-400 font-bold pl-2 pr-1 shrink-0">
            LIVE DEMOS:
          </span>
          {projectExhibits.map((ex) => (
            <button
              key={ex.id}
              type="button"
              onClick={() => focusExhibit(ex)}
              className="px-2.5 py-1 rounded-full bg-white/8 hover:bg-emerald-400 hover:text-slate-950 text-[10px] font-mono text-[#f5f0e8] transition-colors cursor-pointer shrink-0"
            >
              {ex.title.split('—')[0].split(' ')[0]}
            </button>
          ))}
          <span className="w-px h-4 bg-white/15 mx-0.5 shrink-0" />
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setProjectsLightMode((m) => !m);
            }}
            className={`px-3 py-1 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
              projectsLightMode
                ? 'bg-[#f4f2ec] text-stone-900 shadow-sm'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/40'
            }`}
          >
            {projectsLightMode ? <Sun className="w-3 h-3 text-amber-500" /> : <Moon className="w-3 h-3" />}
            <span>{projectsLightMode ? 'White Walls' : 'Dark Mode'}</span>
          </button>
        </div>
      )}

      {/* LIVE 360° DRAG-TO-ROTATE INTERACTION PILL FOR ROOM 00 CENTERPIECE 3D MODEL */}
      {((activeRoom.index === 0 && walkProgressPct < 4) || selectedExhibit?.id === 'centerpiece-3d-face') && (
        <div
          data-museum-overlay="true"
          className={`fixed bottom-24 left-1/2 -translate-x-1/2 z-20 px-4 py-2 rounded-full backdrop-blur-xl border transition-all duration-200 flex items-center gap-2.5 shadow-[0_10px_35px_rgba(0,0,0,0.85)] ${
            isDraggingFaceUi || hoveredExhibit?.id === 'centerpiece-3d-face'
              ? 'bg-[#1a1d26]/95 border-[#d6c7b2]/75 scale-105'
              : 'bg-[#0f1015]/84 border-[#d6c7b2]/35'
          }`}
        >
          <MoveHorizontal className="w-3.5 h-3.5 text-[#d6c7b2]" />
          <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.18em] uppercase text-[#f5f0e8]">
            {isDraggingFaceUi ? 'Rotating 3D Model' : 'Drag 3D Model to Rotate 360°'}
          </span>
          <span className="text-[#d6c7b2]/35">|</span>
          <span className="text-[11px] font-mono font-bold text-[#d6c7b2] tabular-nums w-9 text-right">
            {faceAngleDeg}°
          </span>
          {faceAngleDeg !== 0 && (
            <button
              type="button"
              onClick={() => {
                playAudioCue('click');
                resetFaceModelRef.current?.();
              }}
              className="ml-0.5 p-1 rounded-full bg-[#d6c7b2]/15 hover:bg-[#d6c7b2] text-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer"
              title="Reset Front View (0°)"
              aria-label="Reset 3D model to front view"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          )}
        </div>
      )}

      {/* CLICKED EXHIBIT INSPECTION PLAQUE & INTERACTIVE LIVE PROJECT DEMO DRAWER */}
      {selectedExhibit && (
        <div
          data-museum-overlay="true"
          className={`fixed top-20 bottom-20 right-4 sm:right-6 z-40 w-[calc(100vw-2rem)] sm:w-[455px] rounded-3xl p-6 sm:p-7 overflow-y-auto shadow-[0_30px_90px_rgba(0,0,0,0.65)] animate-in slide-in-from-right duration-300 border ${
            isDrawerLight
              ? 'bg-[#f8f6f1]/97 backdrop-blur-2xl border-stone-300 text-stone-900'
              : 'museum-plaque text-[#f5f0e8]'
          }`}
        >
          <div className={`flex items-start justify-between gap-3 pb-4 border-b ${isDrawerLight ? 'border-stone-200' : 'border-[#d6c7b2]/15'}`}>
            <div>
              <div className={`text-[10px] font-mono tracking-[0.24em] uppercase font-bold ${isDrawerLight ? 'text-emerald-700' : 'text-[#d6c7b2]'}`}>
                {selectedExhibit.code} // {selectedExhibit.roomLabel}
              </div>
              <h2 className={`font-serif text-2xl sm:text-3xl font-light mt-1 leading-tight ${isDrawerLight ? 'text-stone-900' : 'text-[#f5f0e8]'}`}>
                {selectedExhibit.title}
              </h2>
              <p className={`text-xs font-mono mt-1 ${isDrawerLight ? 'text-stone-500' : 'text-[#d6c7b2]/80'}`}>
                {selectedExhibit.subtitle}
              </p>
            </div>
            <button
              type="button"
              onClick={exitFocus}
              className={`p-2 rounded-full border transition-colors cursor-pointer shrink-0 ${
                isDrawerLight
                  ? 'bg-white border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white'
                  : 'bg-[#0f1013] border-[#d6c7b2]/25 text-[#d5cec2] hover:text-white hover:border-[#d6c7b2]'
              }`}
              aria-label="Close exhibit plaque"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* EMBEDDED LIVE INTERACTIVE PROJECT DEMO + GITHUB & LIVE LINK */}
          {selectedExhibit.demoKey && (
            <div className="mt-5">
              <ProjectDemoPanel
                demoKey={selectedExhibit.demoKey}
                liveUrl={selectedExhibit.liveUrl}
                githubUrl={selectedExhibit.githubUrl}
                lightTheme={isDrawerLight}
                onActionClick={() => playAudioCue('click')}
              />
            </div>
          )}

          <p className={`text-sm font-light leading-relaxed mt-5 ${isDrawerLight ? 'text-stone-700' : 'text-[#d5cec2]/90'}`}>
            {selectedExhibit.description}
          </p>

          <div
            className={`mt-5 rounded-2xl border overflow-hidden text-xs font-mono ${
              isDrawerLight ? 'bg-white border-stone-200' : 'bg-[#0c0e13] border-[#d6c7b2]/18'
            }`}
          >
            <div
              className={`px-4 py-2 border-b text-[10px] tracking-[0.22em] uppercase font-semibold ${
                isDrawerLight ? 'border-stone-200 bg-stone-100 text-stone-700' : 'border-[#d6c7b2]/12 bg-[#141720] text-[#d6c7b2]'
              }`}
            >
              Museum Information Plaque
            </div>
            <div className={`divide-y ${isDrawerLight ? 'divide-stone-200' : 'divide-[#d6c7b2]/10'}`}>
              <div className="grid grid-cols-3 px-4 py-2">
                <span className="text-stone-500">Category</span>
                <span className={`col-span-2 ${isDrawerLight ? 'text-stone-900' : 'text-[#f5f0e8]'}`}>{selectedExhibit.category}</span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2">
                <span className="text-stone-500">Status</span>
                <span className={`col-span-2 ${isDrawerLight ? 'text-emerald-700 font-semibold' : 'text-emerald-300'}`}>
                  {selectedExhibit.status}
                </span>
              </div>
              <div className="grid grid-cols-3 px-4 py-2">
                <span className="text-stone-500">Creator</span>
                <span className={`col-span-2 ${isDrawerLight ? 'text-stone-900' : 'text-[#f5f0e8]'}`}>{selectedExhibit.creator}</span>
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <div className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500">Curatorial Notes</div>
            {selectedExhibit.details.map((line, i) => (
              <div
                key={i}
                className={`flex items-start gap-2 text-xs font-light leading-relaxed ${
                  isDrawerLight ? 'text-stone-700' : 'text-[#f5f0e8]/85'
                }`}
              >
                <span className={isDrawerLight ? 'text-emerald-600 mt-0.5' : 'text-[#d6c7b2] mt-0.5'}>▸</span>
                <span>{line}</span>
              </div>
            ))}
          </div>

          <div className={`flex flex-wrap gap-1.5 mt-5 pt-4 border-t ${isDrawerLight ? 'border-stone-200' : 'border-[#d6c7b2]/12'}`}>
            {selectedExhibit.tags.map((t) => (
              <span
                key={t}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono border ${
                  isDrawerLight
                    ? 'bg-white border-stone-300 text-stone-700'
                    : 'bg-[#0f1013] border-[#d6c7b2]/20 text-[#d6c7b2]'
                }`}
              >
                {t}
              </span>
            ))}
          </div>

          {(selectedExhibit.actionType === 'social' || selectedExhibit.actionType === 'contact') && (
            <div className="mt-5 pt-4 border-t border-[#d6c7b2]/15 space-y-3">
              {selectedExhibit.socialPlatform && (
                <a
                  href={data.personal[selectedExhibit.socialPlatform] || `https://${selectedExhibit.socialPlatform}.com`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => playAudioCue('click')}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ec4899] via-[#f472b6] to-[#f4a8c4] text-[#0f1013] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:brightness-105 transition-all"
                >
                  <span>Visit {selectedExhibit.socialPlatform.charAt(0).toUpperCase() + selectedExhibit.socialPlatform.slice(1)} Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
              <SocialMediaHub compact />
              <Link
                href="/socials"
                onClick={() => playAudioCue('click')}
                className="w-full py-2.5 px-4 rounded-xl bg-[#f4a8c4]/15 border border-[#f4a8c4]/45 hover:bg-[#f4a8c4] text-[#f4a8c4] hover:text-[#0f1013] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Open Dedicated /socials Page</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}

          {selectedExhibit.actionType === 'contact' && (
            <div className="mt-5 pt-4 border-t border-[#d6c7b2]/15 space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-[#0f1013] border border-[#d6c7b2]/18">
                <div className="flex items-center gap-2.5 min-w-0">
                  <Mail className="w-4 h-4 text-[#d6c7b2] shrink-0" />
                  <span className="text-xs font-mono text-[#f5f0e8] truncate">{data.personal.email}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="p-1.5 rounded-lg bg-[#161922] text-[#d6c7b2] hover:bg-[#d6c7b2] hover:text-[#0f1013] transition-colors cursor-pointer"
                  title="Copy Email"
                >
                  {copiedEmail ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setResumeModalOpen(true);
                }}
                className="w-full py-2.5 rounded-xl bg-[#d6c7b2]/15 border border-[#d6c7b2]/40 hover:bg-[#d6c7b2] hover:text-[#0f1013] text-xs font-mono text-[#d6c7b2] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Resume Archive</span>
              </button>
              {guestSent ? (
                <div className="p-4 rounded-xl bg-[#0f1013] border border-emerald-400/35 text-center text-xs text-emerald-300 font-mono">
                  ✓ Dispatch recorded! Thank you for visiting.
                </div>
              ) : (
                <form onSubmit={handleGuestSubmit} className="space-y-2.5">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={guestForm.name}
                    onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0c0e13] border border-[#d6c7b2]/18 text-xs text-[#f5f0e8] placeholder-[#8e877c] focus:outline-none focus:border-[#d6c7b2]"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email *"
                    value={guestForm.email}
                    onChange={(e) => setGuestForm({ ...guestForm, email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0c0e13] border border-[#d6c7b2]/18 text-xs text-[#f5f0e8] placeholder-[#8e877c] focus:outline-none focus:border-[#d6c7b2]"
                  />
                  <textarea
                    rows={3}
                    required
                    placeholder="Leave a visitor note or opportunity..."
                    value={guestForm.message}
                    onChange={(e) => setGuestForm({ ...guestForm, message: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#0c0e13] border border-[#d6c7b2]/18 text-xs text-[#f5f0e8] placeholder-[#8e877c] focus:outline-none focus:border-[#d6c7b2] resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer hover:brightness-105 transition-all"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-2.5">
            {!selectedExhibit.demoKey && selectedExhibit.liveUrl && (
              <a
                href={selectedExhibit.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => playAudioCue('click')}
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Live Exhibit</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
            {selectedExhibit.actionType === 'resume' && (
              <button
                type="button"
                onClick={() => {
                  playAudioCue('click');
                  setResumeModalOpen(true);
                }}
                className="flex-1 py-2.5 px-4 rounded-full bg-gradient-to-r from-[#e2d5c3] to-[#c8b79b] text-[#0f1013] font-mono text-[11px] font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open Resume Archive</span>
              </button>
            )}
            <button
              type="button"
              onClick={exitFocus}
              className={`w-full py-2.5 px-4 rounded-full border font-mono text-[11px] uppercase tracking-wider cursor-pointer transition-colors ${
                isDrawerLight
                  ? 'border-stone-300 text-stone-700 hover:bg-stone-900 hover:text-white'
                  : 'border-[#d6c7b2]/20 text-[#d5cec2] hover:text-[#f5f0e8] hover:border-[#d6c7b2]/50'
              }`}
            >
              ← Return to 3D Gallery
            </button>
          </div>
        </div>
      )}

      {/* BOTTOM ARCHITECTURAL MUSEUM HUD */}
      <div className="fixed bottom-5 left-5 right-5 z-30 pointer-events-none flex items-center justify-between gap-3">
        {/* Bottom-Left: Current 3D Room Plaque */}
        <div className="pointer-events-auto flex items-center gap-3 px-4 py-2 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#d6c7b2]/25 shadow-[0_12px_35px_rgba(0,0,0,0.8)]">
          <span
            className="w-7 h-7 rounded-full border flex items-center justify-center font-mono text-[10px] font-bold"
            style={{
              borderColor: `${activeRoom.accentCss}80`,
              color: activeRoom.accentCss,
              backgroundColor: `${activeRoom.accentCss}18`,
            }}
          >
            {activeRoom.number}
          </span>
          <div className="flex flex-col leading-tight pr-1">
            <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-[#f5f0e8] font-semibold">
              {activeRoom.name}
            </span>
            <span className="text-[9px] font-mono tracking-wider uppercase hidden sm:block" style={{ color: `${activeRoom.accentCss}cc` }}>
              {activeRoom.index === 2 && !projectsLightMode ? 'Royal Emerald Pavilion' : activeRoom.subtitle}
            </span>
          </div>
        </div>

        {/* Bottom-Center: Navigation + Auto-Tour + Floor Map Pill */}
        <div className="pointer-events-auto flex items-center gap-2">
          <button
            type="button"
            onClick={goPrevRoom}
            disabled={activeRoom.index === 0}
            title="Previous Gallery"
            className="p-2.5 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#d6c7b2]/20 text-[#d5cec2] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/60 disabled:opacity-30 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={toggleAutoTour}
            title={autoTour ? 'Pause Guided Auto-Tour' : 'Start Guided 3D Auto-Tour Around Every Turn'}
            className={`hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-full backdrop-blur-xl border text-[10px] font-mono tracking-[0.18em] uppercase font-semibold transition-all cursor-pointer ${
              autoTour
                ? 'bg-[#d6c7b2] border-[#d6c7b2] text-[#0f1013] shadow-[0_0_20px_rgba(214,199,178,0.4)]'
                : 'bg-[#101218]/92 border-[#d6c7b2]/25 text-[#d6c7b2] hover:border-[#d6c7b2]/70'
            }`}
          >
            {autoTour ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            <span>{autoTour ? 'Touring' : 'Auto Tour'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setFloorMapOpen(true);
            }}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-[#12151e]/94 backdrop-blur-xl border border-[#d6c7b2]/35 hover:border-[#d6c7b2]/80 text-[#f5f0e8] hover:text-[#d6c7b2] shadow-[0_12px_35px_rgba(0,0,0,0.85)] transition-all cursor-pointer group"
          >
            <span className="text-[10px] sm:text-[11px] font-mono tracking-[0.2em] uppercase font-semibold">
              {activeRoom.index === 9 ? 'Exit & Connect' : 'Floor Plan'}
            </span>
            <span className="w-px h-3.5 bg-[#d6c7b2]/30" />
            <LayoutGrid className="w-3.5 h-3.5 text-[#d6c7b2] group-hover:rotate-90 transition-transform duration-300" />
          </button>

          <Link
            href="/socials"
            onClick={() => playAudioCue('click')}
            title="Open Dedicated /socials Page — Instagram, Facebook, Pinterest, GitHub & LinkedIn"
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#f4a8c4]/35 hover:border-[#f4a8c4]/85 hover:bg-[#f4a8c4] text-[#f4a8c4] hover:text-[#0f1013] text-[10px] font-mono tracking-[0.18em] uppercase font-semibold transition-all"
          >
            <Share2 className="w-3 h-3" />
            <span>Socials</span>
          </Link>

          <button
            type="button"
            onClick={goNextRoom}
            disabled={activeRoom.index === MUSEUM_ROOMS_3D.length - 1}
            title="Next Gallery (Around 90° Turn)"
            className="p-2.5 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#d6c7b2]/20 text-[#d5cec2] hover:text-[#d6c7b2] hover:border-[#d6c7b2]/60 disabled:opacity-30 transition-all cursor-pointer"
          >
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom-Right: Color-Coded Room Dots + White-Walls Projects Light Toggle + Ultra/Eco */}
        <div className="pointer-events-auto hidden md:flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#101218]/92 backdrop-blur-xl border border-[#d6c7b2]/20 shadow-[0_12px_35px_rgba(0,0,0,0.8)]">
          <div className="flex items-center gap-1.5">
            {MUSEUM_ROOMS_3D.map((room) => {
              const isCurr = room.index === activeRoom.index;
              return (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => flyToRoom(room)}
                  title={`Room ${room.number} — ${room.name} (${room.turnHint})`}
                  style={{
                    backgroundColor: isCurr ? room.accentCss : `${room.accentCss}45`,
                    boxShadow: isCurr ? `0 0 12px ${room.accentCss}` : 'none',
                  }}
                  className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                    isCurr ? 'w-5' : 'w-2 hover:scale-125'
                  }`}
                />
              );
            })}
          </div>
          <span className="w-px h-3.5 bg-[#d6c7b2]/20 mx-0.5" />
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setProjectsLightMode((m) => !m);
            }}
            title="Toggle Projects Room White-Wall Light Mode vs Dark Mode"
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider flex items-center gap-1 transition-colors cursor-pointer ${
              projectsLightMode
                ? 'bg-[#f4f2ec] text-stone-900 font-bold'
                : 'text-[#8e877c] border border-white/10 hover:text-[#f5f0e8]'
            }`}
          >
            {projectsLightMode ? <Sun className="w-2.5 h-2.5 text-amber-500" /> : <Moon className="w-2.5 h-2.5" />}
            <span>{projectsLightMode ? 'LIGHT' : 'DARK'}</span>
          </button>
          <button
            type="button"
            onClick={() => {
              playAudioCue('click');
              setUltraLighting((u) => !u);
            }}
            title="Toggle Real-Time Marble Reflections & Cinematic Bloom"
            className={`px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-wider transition-colors cursor-pointer ${
              ultraLighting
                ? 'bg-[#d6c7b2]/20 text-[#d6c7b2] border border-[#d6c7b2]/40'
                : 'text-[#8e877c] border border-white/10'
            }`}
          >
            {ultraLighting ? 'ULTRA' : 'ECO'}
          </button>
        </div>
      </div>

      {/* INTERACTIVE 8-WING ARCHITECTURAL FLOOR PLAN MODAL */}
      {floorMapOpen && (
        <div
          data-museum-overlay="true"
          className="fixed inset-0 z-50 bg-[#07080b]/82 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setFloorMapOpen(false)}
        >
          <div
            className="w-full max-w-6xl rounded-3xl museum-plaque p-6 sm:p-8 max-h-[88vh] overflow-y-auto shadow-[0_30px_100px_rgba(0,0,0,0.95)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-5 border-b border-[#d6c7b2]/15">
              <div>
                <div className="text-[10px] font-mono tracking-[0.26em] uppercase text-[#d6c7b2] font-bold flex items-center gap-2">
                  <Compass className="w-3.5 h-3.5" />
                  <span>MULTI-WING TURNING ARCHITECTURE • 10 GALLERIES • 9 CORNERS</span>
                </div>
                <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#f5f0e8] mt-1">
                  Explore <span className="italic text-[#d6c7b2]">The Digital Museum</span>
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setFloorMapOpen(false)}
                className="p-2.5 rounded-full bg-[#0f1013] border border-[#d6c7b2]/25 text-[#d5cec2] hover:text-white hover:border-[#d6c7b2] cursor-pointer transition-colors"
                aria-label="Close floor plan"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 mt-6">
              {MUSEUM_ROOMS_3D.map((room) => {
                const isCurr = room.index === activeRoom.index;
                return (
                  <button
                    key={room.id}
                    type="button"
                    onClick={() => flyToRoom(room)}
                    style={{ borderColor: isCurr ? `${room.accentCss}99` : undefined }}
                    className={`text-left p-4 rounded-2xl border transition-all duration-300 cursor-pointer group ${
                      isCurr
                        ? 'bg-[#1a1d26]'
                        : 'bg-[#0f1015]/85 border-[#d6c7b2]/15 hover:border-[#d6c7b2]/55 hover:bg-[#171a22]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono tracking-[0.22em] uppercase font-bold" style={{ color: room.accentCss }}>
                        ROOM {room.number}
                      </span>
                      <span className="text-[8px] font-mono uppercase tracking-wider text-[#d5cec2]/75">
                        {isCurr ? '● HERE' : room.turnHint.split('(')[0]}
                      </span>
                    </div>
                    <div className="font-serif text-lg text-[#f5f0e8] group-hover:text-[#d6c7b2] transition-colors">
                      {room.name}
                    </div>
                    <div className="text-[9px] font-mono uppercase tracking-wider mt-0.5" style={{ color: `${room.accentCss}cc` }}>
                      {room.subtitle}
                    </div>
                    <p className="text-[11px] text-[#d5cec2]/70 font-light mt-2 leading-relaxed">{room.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-5 border-t border-[#d6c7b2]/15 flex flex-wrap items-center justify-between gap-3">
              <div className="text-[11px] font-mono text-[#8e877c]">
                Controls: Scroll / Arrow Keys • Drag 3D Bust 360° • Click Projects for Live Demos &amp; GitHub
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <Link
                  href="/socials"
                  onClick={() => {
                    playAudioCue('click');
                    setFloorMapOpen(false);
                  }}
                  className="px-4 py-2 rounded-full bg-[#f4a8c4]/15 border border-[#f4a8c4]/45 text-[#f4a8c4] hover:bg-[#f4a8c4] hover:text-[#0f1013] font-mono text-[10px] uppercase tracking-wider font-bold transition-colors flex items-center gap-1.5"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Socials (/socials)</span>
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setProjectsLightMode((m) => !m);
                  }}
                  className={`px-4 py-2 rounded-full border font-mono text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                    projectsLightMode
                      ? 'bg-[#f4f2ec] border-[#f4f2ec] text-stone-900'
                      : 'bg-[#0f1013] border-[#d6c7b2]/30 text-[#d6c7b2]'
                  }`}
                >
                  {projectsLightMode ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Moon className="w-3.5 h-3.5" />}
                  <span>{projectsLightMode ? 'Projects: White Walls' : 'Projects: Dark Mode'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playAudioCue('click');
                    setFloorMapOpen(false);
                    setResumeModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-full bg-[#d6c7b2]/15 border border-[#d6c7b2]/45 text-[#d6c7b2] hover:bg-[#d6c7b2] hover:text-[#0f1013] font-mono text-[10px] uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Resume CV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    playAudioCue('whoosh');
                    setFloorMapOpen(false);
                    replayIntro();
                  }}
                  className="px-4 py-2 rounded-full bg-[#0f1013] border border-[#d6c7b2]/25 text-[#d5cec2] hover:text-[#f5f0e8] hover:border-[#d6c7b2]/60 font-mono text-[10px] uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Museum Exterior</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
