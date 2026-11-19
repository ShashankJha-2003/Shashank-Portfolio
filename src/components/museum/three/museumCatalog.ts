import * as THREE from 'three';
import type { ProjectDemoKey } from '../ProjectDemoPanel';

export interface RoomLayout3D {
  index: number;
  originX: number;
  originZ: number;
  yaw: number; // 0 = North (-Z), -PI/2 = East (+X), +PI/2 = West (-X)
  length: number;
  headingLabel: string;
}

export interface CornerRotunda3D {
  index: number;
  fromRoomIdx: number;
  toRoomIdx: number;
  centerX: number;
  centerZ: number;
  yawIn: number;
  turnDir: 'right' | 'left';
  turnLabel: string;
  nextRoomNum: string;
  nextRoomTitle: string;
  accentHex: number;
  accentCss: string;
}

export interface MuseumRoom3D {
  index: number;
  number: string;
  id: string;
  name: string;
  subtitle: string;
  description: string;
  turnHint: string;
  accentHex: number;
  accentCss: string;
  progress: number;
}

export interface MuseumExhibit3D {
  id: string;
  code: string;
  roomIndex: number;
  roomLabel: string;
  title: string;
  subtitle: string;
  category: string;
  description: string;
  details: string[];
  tags: string[];
  status: string;
  creator: string;
  liveUrl?: string;
  githubUrl?: string;
  demoKey?: ProjectDemoKey;
  actionType?: 'resume' | 'contact' | 'social' | 'replay-intro';
  socialPlatform?: 'instagram' | 'facebook' | 'pinterest' | 'github' | 'linkedin';
  cameraTarget: { x: number; y: number; z: number };
  lookAtTarget: { x: number; y: number; z: number };
  pathProgress: number;
}

export const CORRIDOR_HALF_W = 9.5;

// ============================================================================
// ARCHITECTURAL 10-WING FLOOR PLAN WITH 9 GRAND 90° LEFT & RIGHT TURNS
// Guaranteed zero self-intersection across all 10 galleries & 9 corner rotundas.
// ============================================================================
export const ROOM_LAYOUTS_3D: RoomLayout3D[] = [
  { index: 0, originX: 0, originZ: 18, yaw: 0, length: 30, headingLabel: 'North' },
  { index: 1, originX: 9.5, originZ: -21.5, yaw: -Math.PI / 2, length: 32, headingLabel: 'East' },
  { index: 2, originX: 51.0, originZ: -31.0, yaw: 0, length: 38, headingLabel: 'North' },
  { index: 3, originX: 41.5, originZ: -78.5, yaw: Math.PI / 2, length: 34, headingLabel: 'West' },
  { index: 4, originX: -2.0, originZ: -88.0, yaw: 0, length: 34, headingLabel: 'North' },
  { index: 5, originX: 7.5, originZ: -131.5, yaw: -Math.PI / 2, length: 30, headingLabel: 'East' },
  { index: 6, originX: 47.0, originZ: -141.0, yaw: 0, length: 32, headingLabel: 'North' },
  { index: 7, originX: 37.5, originZ: -182.5, yaw: Math.PI / 2, length: 34, headingLabel: 'West' },
  { index: 8, originX: -6.0, originZ: -192.0, yaw: 0, length: 38, headingLabel: 'North' },
  { index: 9, originX: 3.5, originZ: -239.5, yaw: -Math.PI / 2, length: 28, headingLabel: 'East' },
];

export const CORNER_ROTUNDAS_3D: CornerRotunda3D[] = [
  {
    index: 0,
    fromRoomIdx: 0,
    toRoomIdx: 1,
    centerX: 0,
    centerZ: -21.5,
    yawIn: 0,
    turnDir: 'right',
    turnLabel: '90° Right Turn → Introduction Gallery',
    nextRoomNum: '01',
    nextRoomTitle: 'Introduction Gallery',
    accentHex: 0xf0a978,
    accentCss: '#f0a978',
  },
  {
    index: 1,
    fromRoomIdx: 1,
    toRoomIdx: 2,
    centerX: 51.0,
    centerZ: -21.5,
    yawIn: -Math.PI / 2,
    turnDir: 'left',
    turnLabel: '90° Left Turn → Exhibition Hall (Projects)',
    nextRoomNum: '02',
    nextRoomTitle: 'Exhibition Hall',
    accentHex: 0x10b981,
    accentCss: '#10b981',
  },
  {
    index: 2,
    fromRoomIdx: 2,
    toRoomIdx: 3,
    centerX: 51.0,
    centerZ: -78.5,
    yawIn: 0,
    turnDir: 'left',
    turnLabel: '90° Left Turn → Technology Gallery',
    nextRoomNum: '03',
    nextRoomTitle: 'Technology Gallery',
    accentHex: 0x38bdf8,
    accentCss: '#38bdf8',
  },
  {
    index: 3,
    fromRoomIdx: 3,
    toRoomIdx: 4,
    centerX: -2.0,
    centerZ: -78.5,
    yawIn: Math.PI / 2,
    turnDir: 'right',
    turnLabel: '90° Right Turn → Timeline Gallery',
    nextRoomNum: '04',
    nextRoomTitle: 'Timeline Gallery',
    accentHex: 0xf59e0b,
    accentCss: '#f59e0b',
  },
  {
    index: 4,
    fromRoomIdx: 4,
    toRoomIdx: 5,
    centerX: -2.0,
    centerZ: -131.5,
    yawIn: 0,
    turnDir: 'right',
    turnLabel: '90° Right Turn → Innovation Lab',
    nextRoomNum: '05',
    nextRoomTitle: 'Innovation Lab',
    accentHex: 0xc084fc,
    accentCss: '#c084fc',
  },
  {
    index: 5,
    fromRoomIdx: 5,
    toRoomIdx: 6,
    centerX: 47.0,
    centerZ: -131.5,
    yawIn: -Math.PI / 2,
    turnDir: 'left',
    turnLabel: '90° Left Turn → Hobbies & Passions',
    nextRoomNum: '06',
    nextRoomTitle: 'Hobbies Gallery',
    accentHex: 0xfb7185,
    accentCss: '#fb7185',
  },
  {
    index: 6,
    fromRoomIdx: 6,
    toRoomIdx: 7,
    centerX: 47.0,
    centerZ: -182.5,
    yawIn: 0,
    turnDir: 'left',
    turnLabel: '90° Left Turn → Social Media Lounge',
    nextRoomNum: '07',
    nextRoomTitle: 'Social Media Lounge',
    accentHex: 0xec4899,
    accentCss: '#ec4899',
  },
  {
    index: 7,
    fromRoomIdx: 7,
    toRoomIdx: 8,
    centerX: -6.0,
    centerZ: -182.5,
    yawIn: Math.PI / 2,
    turnDir: 'right',
    turnLabel: '90° Right Turn → Floating Frontend Showcase',
    nextRoomNum: '08',
    nextRoomTitle: 'Floating Showcase',
    accentHex: 0x818cf8,
    accentCss: '#818cf8',
  },
  {
    index: 8,
    fromRoomIdx: 8,
    toRoomIdx: 9,
    centerX: -6.0,
    centerZ: -239.5,
    yawIn: 0,
    turnDir: 'right',
    turnLabel: '90° Right Turn → Exit Gallery',
    nextRoomNum: '09',
    nextRoomTitle: 'Exit Gallery',
    accentHex: 0xf4a8c4,
    accentCss: '#f4a8c4',
  },
];

/** Transforms a coordinate inside Room `roomIndex`'s local frame into World 3D space. */
export function roomLocalToWorld(roomIndex: number, lx: number, ly: number, lz: number): { x: number; y: number; z: number } {
  const layout = ROOM_LAYOUTS_3D[roomIndex];
  const c = Math.cos(layout.yaw);
  const s = Math.sin(layout.yaw);
  return {
    x: layout.originX + lx * c + lz * s,
    y: ly,
    z: layout.originZ - lx * s + lz * c,
  };
}

function localVec(roomIndex: number, lx: number, ly: number, lz: number): THREE.Vector3 {
  const p = roomLocalToWorld(roomIndex, lx, ly, lz);
  return new THREE.Vector3(p.x, p.y, p.z);
}

// ============================================================================
// CONTINUOUS C1-SMOOTH TURNING CAMERA SPLINE ACROSS ALL 8 ROOMS & 7 CORNERS
// ============================================================================
interface PathSegmentMeta {
  kind: 'room' | 'corner';
  roomIndex: number;
  cornerIndex?: number;
  uStart: number;
  uEnd: number;
}

function createMuseumNavigationData() {
  const path = new THREE.CurvePath<THREE.Vector3>();
  const rawSegments: { curve: THREE.Curve<THREE.Vector3>; kind: 'room' | 'corner'; roomIndex: number; cornerIndex?: number }[] = [];
  const Y = 2.55;

  // Room 00 (North)
  rawSegments.push({
    curve: new THREE.LineCurve3(localVec(0, 0, Y, -3.0), localVec(0, 0, Y, -5.2)),
    kind: 'room',
    roomIndex: 0,
  });
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(0, 0, Y, -5.2),
        localVec(0, 2.2, Y, -8.6),
        localVec(0, 2.85, Y, -11.8),
        localVec(0, 2.1, Y, -16.0),
        localVec(0, 0.25, Y, -22.5),
        localVec(0, 0, Y, -30.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 0,
  });

  // Corner 0 (Right 90° -> East)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(0, 0, Y, -30.0), new THREE.Vector3(0, Y, -21.5), localVec(1, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 0,
    cornerIndex: 0,
  });

  // Room 01 (East)
  rawSegments.push({
    curve: new THREE.LineCurve3(localVec(1, 0, Y, 0), localVec(1, 0, Y, -32.0)),
    kind: 'room',
    roomIndex: 1,
  });

  // Corner 1 (Left 90° -> North)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(1, 0, Y, -32.0), new THREE.Vector3(51.0, Y, -21.5), localVec(2, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 1,
    cornerIndex: 1,
  });

  // Room 02 (North — sidestep around Vertex Phone X1)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(2, 0, Y, 0),
        localVec(2, 0, Y, -8.5),
        localVec(2, 2.65, Y, -19.0),
        localVec(2, 0, Y, -29.5),
        localVec(2, 0, Y, -38.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 2,
  });

  // Corner 2 (Left 90° -> West)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(2, 0, Y, -38.0), new THREE.Vector3(51.0, Y, -78.5), localVec(3, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 2,
    cornerIndex: 2,
  });

  // Room 03 (West — sidestep around React Atom vitrine)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(3, 0, Y, 0),
        localVec(3, 0, Y, -10.5),
        localVec(3, 2.6, Y, -21.5),
        localVec(3, 0, Y, -29.5),
        localVec(3, 0, Y, -34.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 3,
  });

  // Corner 3 (Right 90° -> North)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(3, 0, Y, -34.0), new THREE.Vector3(-2.0, Y, -78.5), localVec(4, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 3,
    cornerIndex: 3,
  });

  // Room 04 (North)
  rawSegments.push({
    curve: new THREE.LineCurve3(localVec(4, 0, Y, 0), localVec(4, 0, Y, -34.0)),
    kind: 'room',
    roomIndex: 4,
  });

  // Corner 4 (Right 90° -> East)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(4, 0, Y, -34.0), new THREE.Vector3(-2.0, Y, -131.5), localVec(5, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 4,
    cornerIndex: 4,
  });

  // Room 05 (East — sidestep around Innovation Lab Particle Vitrine)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(5, 0, Y, 0),
        localVec(5, 0, Y, -7.5),
        localVec(5, 2.7, Y, -16.5),
        localVec(5, 0, Y, -24.5),
        localVec(5, 0, Y, -30.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 5,
  });

  // Corner 5 (Left 90° -> North into Hobbies Gallery!)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(5, 0, Y, -30.0), new THREE.Vector3(47.0, Y, -131.5), localVec(6, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 5,
    cornerIndex: 5,
  });

  // Room 06 (North — Hobbies & Passions Gallery, sidestep around Hobby Centerpiece at local z = -16)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(6, 0, Y, 0),
        localVec(6, 0, Y, -7.0),
        localVec(6, 2.6, Y, -16.0),
        localVec(6, 0, Y, -25.0),
        localVec(6, 0, Y, -32.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 6,
  });

  // Corner 6 (Left 90° -> West into Social Media Lounge!)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(6, 0, Y, -32.0), new THREE.Vector3(47.0, Y, -182.5), localVec(7, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 6,
    cornerIndex: 6,
  });

  // Room 07 (West — Separate Dedicated Social Media Lounge, sidestep around Constellation Centerpiece at z = -17)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(7, 0, Y, 0),
        localVec(7, 0, Y, -7.5),
        localVec(7, 2.65, Y, -17.0),
        localVec(7, 0, Y, -26.5),
        localVec(7, 0, Y, -34.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 7,
  });

  // Corner 7 (Right 90° -> North into Floating Frontend Showcase!)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(7, 0, Y, -34.0), new THREE.Vector3(-6.0, Y, -182.5), localVec(8, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 7,
    cornerIndex: 7,
  });

  // Room 08 (North — Zero-Gravity Floating Frontend Showcase, sidestep around levitating Vertex X1 at z = -19)
  rawSegments.push({
    curve: new THREE.CatmullRomCurve3(
      [
        localVec(8, 0, Y, 0),
        localVec(8, 0, Y, -8.5),
        localVec(8, 2.75, Y, -19.0),
        localVec(8, 0, Y, -29.5),
        localVec(8, 0, Y, -38.0),
      ],
      false,
      'centripetal'
    ),
    kind: 'room',
    roomIndex: 8,
  });

  // Corner 8 (Right 90° -> East into Exit Gallery!)
  rawSegments.push({
    curve: new THREE.QuadraticBezierCurve3(localVec(8, 0, Y, -38.0), new THREE.Vector3(-6.0, Y, -239.5), localVec(9, 0, Y, 0)),
    kind: 'corner',
    roomIndex: 8,
    cornerIndex: 8,
  });

  // Room 09 (East — Exit Gallery finale under Starlight Crystal Chandelier)
  rawSegments.push({
    curve: new THREE.LineCurve3(localVec(9, 0, Y, 0), localVec(9, 0, Y, -16.5)),
    kind: 'room',
    roomIndex: 9,
  });

  rawSegments.forEach((s) => path.add(s.curve));

  const lengths = path.getCurveLengths();
  const totalLength = lengths[lengths.length - 1] || 1;
  const meta: PathSegmentMeta[] = rawSegments.map((seg, i) => {
    const prevLen = i === 0 ? 0 : lengths[i - 1];
    return {
      kind: seg.kind,
      roomIndex: seg.roomIndex,
      cornerIndex: seg.cornerIndex,
      uStart: prevLen / totalLength,
      uEnd: lengths[i] / totalLength,
    };
  });

  const roomEntryProgress: number[] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
  for (let r = 1; r <= 9; r++) {
    const seg = meta.find((m) => m.kind === 'room' && m.roomIndex === r);
    if (seg) {
      roomEntryProgress[r] = seg.uStart + (seg.uEnd - seg.uStart) * (r === 9 ? 0.55 : 0.16);
    }
  }

  return { path, meta, roomEntryProgress, totalLength };
}

const navData = createMuseumNavigationData();
export const MUSEUM_CAMERA_PATH = navData.path;
export const MUSEUM_PATH_SEGMENTS = navData.meta;
export const ROOM_ENTRY_PROGRESS = navData.roomEntryProgress;

export function getRoomIndexAtProgress(u: number): number {
  const clamped = Math.max(0, Math.min(1, u));
  for (let i = 0; i < MUSEUM_PATH_SEGMENTS.length; i++) {
    const seg = MUSEUM_PATH_SEGMENTS[i];
    if (clamped >= seg.uStart && clamped <= seg.uEnd) {
      if (seg.kind === 'corner' && seg.cornerIndex !== undefined) {
        const mid = (seg.uStart + seg.uEnd) * 0.5;
        return clamped >= mid ? CORNER_ROTUNDAS_3D[seg.cornerIndex].toRoomIdx : seg.roomIndex;
      }
      return seg.roomIndex;
    }
  }
  return clamped < 0.5 ? 0 : 9;
}

export function getActiveTurnCorner(u: number): CornerRotunda3D | null {
  const clamped = Math.max(0, Math.min(1, u));
  for (let i = 0; i < MUSEUM_PATH_SEGMENTS.length; i++) {
    const seg = MUSEUM_PATH_SEGMENTS[i];
    if (seg.kind === 'corner' && seg.cornerIndex !== undefined) {
      const pad = 0.01;
      if (clamped >= seg.uStart - pad && clamped <= seg.uEnd + pad) {
        return CORNER_ROTUNDAS_3D[seg.cornerIndex];
      }
    }
  }
  return null;
}

export function findNearestProgress(worldPt: { x: number; y: number; z: number }): number {
  let bestU = 0;
  let bestDistSq = Infinity;
  const samples = 280;
  for (let i = 0; i <= samples; i++) {
    const u = i / samples;
    const p = MUSEUM_CAMERA_PATH.getPointAt(u);
    const dx = p.x - worldPt.x;
    const dz = p.z - worldPt.z;
    const d2 = dx * dx + dz * dz;
    if (d2 < bestDistSq) {
      bestDistSq = d2;
      bestU = u;
    }
  }
  return bestU;
}

export const MUSEUM_ROOMS_3D: MuseumRoom3D[] = [
  {
    index: 0,
    number: '00',
    id: 'hero',
    name: 'Entrance Hall',
    subtitle: 'Obsidian & Gold Atrium',
    description: 'Grand champagne-gold atrium showcasing Shashank’s interactive 360° 3D centerpiece.',
    turnHint: 'Start • Facing North',
    accentHex: 0xd6c7b2,
    accentCss: '#d6c7b2',
    progress: ROOM_ENTRY_PROGRESS[0],
  },
  {
    index: 1,
    number: '01',
    id: 'introduction',
    name: 'Introduction Gallery',
    subtitle: 'Warm Terracotta Sanctuary',
    description: 'Sunlit limestone wing with botanical olive sculptures, Creator Dossier & Philosophy Wall.',
    turnHint: '↱ 90° Right Turn (East Wing)',
    accentHex: 0xf0a978,
    accentCss: '#f0a978',
    progress: ROOM_ENTRY_PROGRESS[1],
  },
  {
    index: 2,
    number: '02',
    id: 'exhibition-hall',
    name: 'Exhibition Hall',
    subtitle: 'White Gallery • Projects & Demos',
    description: 'Sunlit white-wall projects pavilion with Live Demos, GitHub links & Holographic Vertex X1.',
    turnHint: '↰ 90° Left Turn (North Wing)',
    accentHex: 0x10b981,
    accentCss: '#10b981',
    progress: ROOM_ENTRY_PROGRESS[2],
  },
  {
    index: 3,
    number: '03',
    id: 'technology-gallery',
    name: 'Technology Gallery',
    subtitle: 'Electric Sapphire Lab',
    description: 'Cyber-cyan wing with dichroic rainbow glass knot, plasma React atom & kinetic pillars.',
    turnHint: '↰ 90° Left Turn (West Wing)',
    accentHex: 0x38bdf8,
    accentCss: '#38bdf8',
    progress: ROOM_ENTRY_PROGRESS[3],
  },
  {
    index: 4,
    number: '04',
    id: 'timeline-gallery',
    name: 'Timeline Gallery',
    subtitle: 'Burnished Copper Corridor',
    description: 'Warm amber cathedral ribs & glowing floor milestone bands from 2022 to 2026.',
    turnHint: '↱ 90° Right Turn (North Wing)',
    accentHex: 0xf59e0b,
    accentCss: '#f59e0b',
    progress: ROOM_ENTRY_PROGRESS[4],
  },
  {
    index: 5,
    number: '05',
    id: 'innovation-lab',
    name: 'Innovation Lab',
    subtitle: 'Ultraviolet Experiment Dome',
    description: 'Amethyst & magenta laboratory with floating crystal prisms & aurora plasma core.',
    turnHint: '↱ 90° Right Turn (East Wing)',
    accentHex: 0xc084fc,
    accentCss: '#c084fc',
    progress: ROOM_ENTRY_PROGRESS[5],
  },
  {
    index: 6,
    number: '06',
    id: 'hobbies-gallery',
    name: 'Hobbies Gallery',
    subtitle: 'Coral & Teal Passions Atelier',
    description: '3D Cricket & WebGL art sculpture, Python AI tinkering, Java DSA, Reading & Writing.',
    turnHint: '↰ 90° Left Turn (North Wing)',
    accentHex: 0xfb7185,
    accentCss: '#fb7185',
    progress: ROOM_ENTRY_PROGRESS[6],
  },
  {
    index: 7,
    number: '07',
    id: 'social-gallery',
    name: 'Social Media Lounge',
    subtitle: 'Neon Magenta Connect Wing',
    description: 'Dedicated social lounge for Instagram, Facebook, Pinterest, GitHub & LinkedIn with live link editor.',
    turnHint: '↰ 90° Left Turn (West Wing)',
    accentHex: 0xec4899,
    accentCss: '#ec4899',
    progress: ROOM_ENTRY_PROGRESS[7],
  },
  {
    index: 8,
    number: '08',
    id: 'floating-showcase',
    name: 'Floating Showcase',
    subtitle: 'Zero-Gravity Frontend Showroom',
    description: 'Levitating 3D laptops, cinema screens, tablets & phones displaying live interactive project frontends.',
    turnHint: '↱ 90° Right Turn (North Showroom)',
    accentHex: 0x818cf8,
    accentCss: '#818cf8',
    progress: ROOM_ENTRY_PROGRESS[8],
  },
  {
    index: 9,
    number: '09',
    id: 'exit-gallery',
    name: 'Exit Gallery',
    subtitle: 'Rose Starlight Rotunda',
    description: 'Cascading crystal pendant chandelier, opalescent orbs, direct email, resume & guestbook.',
    turnHint: '↱ 90° Right Turn (East Rotunda)',
    accentHex: 0xf4a8c4,
    accentCss: '#f4a8c4',
    progress: ROOM_ENTRY_PROGRESS[9],
  },
];

function makeExhibit(
  roomIndex: number,
  localCam: [number, number, number],
  localLook: [number, number, number],
  fields: Omit<MuseumExhibit3D, 'roomIndex' | 'cameraTarget' | 'lookAtTarget' | 'pathProgress'>
): MuseumExhibit3D {
  const cameraTarget = roomLocalToWorld(roomIndex, localCam[0], localCam[1], localCam[2]);
  const lookAtTarget = roomLocalToWorld(roomIndex, localLook[0], localLook[1], localLook[2]);
  return {
    ...fields,
    roomIndex,
    cameraTarget,
    lookAtTarget,
    pathProgress: findNearestProgress(cameraTarget),
  };
}

export const MUSEUM_EXHIBITS_3D: MuseumExhibit3D[] = [
  // ROOM 00
  makeExhibit(0, [0, 2.75, -5.8], [0, 2.85, -11.8], {
    id: 'centerpiece-3d-face',
    code: 'CENTERPIECE 000',
    roomLabel: 'Room 00 — Entrance Hall',
    title: 'Shashank Jha — Interactive 3D Model',
    subtitle: 'Drag Left or Right Directly on the Model to Rotate 360°',
    category: 'Interactive 3D Sculpture',
    description:
      'Founder & Curator of The Digital Museum. Drag directly across this sculpted 3D bust centerpiece to inspect every angle in smooth 360° motion, then scroll forward to turn right into the Introduction Gallery.',
    details: [
      'Drag horizontally directly on the 3D model to manually rotate it 360° at your own pace.',
      'B.Tech Computer Science & Engineering undergraduate at Parul University (2022–2026).',
      'Software & Web Developer specializing in React, Next.js, Three.js, GSAP & Java.',
    ],
    tags: ['Interactive 3D Bust', '360° Drag Control', 'Shashank Jha', 'Founder'],
    status: 'Live Interactive Centerpiece',
    creator: 'Shashank Jha',
    actionType: 'resume',
  }),
  makeExhibit(0, [0, 2.55, -5.5], [0, 2.6, -16.0], {
    id: 'entrance-emblem',
    code: 'ATRIUM 000',
    roomLabel: 'Room 00 — Entrance Hall',
    title: 'THE DIGITAL MUSEUM',
    subtitle: 'An Exhibition of Ideas, Experiments & Creations',
    category: 'Architectural Atrium',
    description:
      'Welcome to Shashank Jha’s interactive 3D architectural museum. Follow the turning corridor through eight distinctly lit rooms—including the White-Wall Projects Hall and Hobbies Atelier.',
    details: [
      'Drag the central 3D model left or right to rotate it smoothly 360°.',
      'Scroll the mouse wheel, press Arrow / W-S keys, or click Auto Tour to glide around every 90° corner.',
      'Use the White Walls toggle in the HUD to switch the Projects Gallery between Contemporary White Walls and Dark Luxury.',
    ],
    tags: ['Three.js WebGL', 'White-Wall Light Mode', 'Live Project Demos', 'Hobbies Wing'],
    status: 'Open for Exploration',
    creator: 'Shashank Jha',
    actionType: 'resume',
  }),

  // ROOM 01 — INTRODUCTION GALLERY
  makeExhibit(1, [-1.4, 2.35, -13.0], [-5.8, 2.45, -14.2], {
    id: 'creator-portrait',
    code: 'EXHIBIT 001',
    roomLabel: 'Room 01 — Introduction Gallery',
    title: 'The Creator — Shashank Jha',
    subtitle: 'Frontend Developer | Three.js & Creative Technology Specialist',
    category: 'Identity & Dossier',
    description:
      'Passionate Software & Web Developer pursuing B.Tech in Computer Science & Engineering at Parul University (2022–2026). Bridging core computer science principles in Java & DSA with interactive 3D web experiences using React, Three.js, GSAP, and Tailwind CSS.',
    details: [
      'B.Tech CSE Undergraduate at Parul University, Vadodara (2022–2026).',
      'Completed frontend and web development internships at PRISMIO and CodSoft.',
      'Specializes in fluid GSAP scroll choreography, WebGL/Three.js spatial interfaces, and responsive full-stack engineering.',
    ],
    tags: ['React', 'Three.js', 'GSAP', 'Java & DSA', 'Python', 'Tailwind CSS'],
    status: 'Founder & Curator',
    creator: 'Shashank Jha',
    actionType: 'resume',
  }),
  makeExhibit(1, [1.4, 2.35, -13.0], [5.8, 2.45, -14.2], {
    id: 'journey-wall',
    code: 'EXHIBIT 002',
    roomLabel: 'Room 01 — Introduction Gallery',
    title: 'The Journey (2022 – 2026)',
    subtitle: 'Milestones from First Code to Interactive 3D Engineering',
    category: 'Curated Biography',
    description:
      'Every room in this museum reflects a chapter of continuous curiosity—evolving from Java OOP and Data Structures into Python AI automation, full-stack MERN architecture, and interactive 3D WebGL engineering.',
    details: [
      '2022 — Began B.Tech CSE at Parul University; built strong Java & DSA fundamentals.',
      '2023 — Explored HTML5, CSS3, JavaScript & Python automation (J.A.R.V.I.S).',
      '2024 — Earned IIT NPTEL certifications in Theory of Computation & IoT + MERN Stack Workshop.',
      '2025 — Web Development Intern at CodSoft building full-stack web apps & REST API workflows.',
      '2026 — React Frontend Trainee at PRISMIO shipping the 3D Vertex Phone X1 prototype on Vercel.',
    ],
    tags: ['Parul University', 'NPTEL IIT', 'MERN Workshop', 'CodSoft', 'PRISMIO'],
    status: 'Ongoing Archive',
    creator: 'Shashank Jha',
  }),
  makeExhibit(1, [0, 2.55, -18.5], [0, 4.6, -26.5], {
    id: 'philosophy-wall',
    code: 'EXHIBIT 003',
    roomLabel: 'Room 01 — Introduction Gallery',
    title: 'The Philosophy Wall',
    subtitle: 'Monumental Gallery Inscription',
    category: 'Curatorial Manifesto',
    description:
      '"Built by experiences, guided by principles, and driven by dreams that refuse to fade." — Every interface should balance engineering rigor with unmistakable craft and emotion.',
    details: [
      'Engineering first: clean architecture, accessible navigation, and 60 FPS hardware-accelerated performance.',
      'Storytelling through interaction: turning software into memorable spatial experiences.',
      'Continuous experimentation: learning relentlessly across 3D graphics, AI, algorithms, and design.',
    ],
    tags: ['Craftsmanship', 'First Principles', 'Creative Engineering'],
    status: 'Permanent Inscription',
    creator: 'Shashank Jha',
  }),

  // ROOM 02 — EXHIBITION HALL (PROJECTS WITH LIVE DEMOS + GITHUB LINKS)
  makeExhibit(2, [0, 2.45, -12.2], [0, 2.55, -19.0], {
    id: 'project-vertex',
    code: 'EXHIBIT 001',
    roomLabel: 'Room 02 — Exhibition Hall',
    title: 'VERTEX PHONE X1 — 3D Prototype',
    subtitle: 'Interactive 3D Mobile Showcase built with Three.js & GSAP',
    category: 'Creative & 3D Web',
    description:
      'Flagship centrepiece built during the PRISMIO React Frontend Traineeship. Features a real-time interactive 3D smartphone prototype, smooth GSAP ScrollTrigger camera transitions, mobile-first luxury UI, and Vite/Vercel deployment at 60 FPS.',
    details: [
      'Real-time Three.js 3D hardware visualization with holographic scanline art shader.',
      'Choreographed GSAP scroll animations and seamless responsive transitions.',
      'Optimized with Vite and deployed live on Vercel with sub-second load times.',
    ],
    tags: ['Three.js', 'GSAP', 'Tailwind CSS', 'JavaScript', 'Vite', 'Vercel'],
    status: 'Completed & Live',
    creator: 'Shashank Jha',
    liveUrl: 'https://vercel.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-vertex',
  }),
  makeExhibit(2, [-1.8, 2.35, -10.8], [-6.4, 2.4, -12.5], {
    id: 'project-jarvis',
    code: 'EXHIBIT 002',
    roomLabel: 'Room 02 — Exhibition Hall',
    title: 'J.A.R.V.I.S — AI Voice Assistant',
    subtitle: 'Intelligent Python Desktop Voice Automation System',
    category: 'AI & Automation',
    description:
      'Python-powered desktop voice assistant combining SpeechRecognition, pyttsx3 text-to-speech synthesis, and REST API integrations to execute conversational system tasks, web research, and telemetry queries.',
    details: [
      'Real-time ambient noise calibration and sub-second voice-to-command recognition.',
      'Modular command registry enabling rapid expansion of API & OS automation skills.',
      'Try the interactive J.A.R.V.I.S command terminal demo right inside this plaque.',
    ],
    tags: ['Python', 'SpeechRecognition', 'pyttsx3', 'REST APIs', 'Automation'],
    status: 'Completed • Interactive Demo',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-jarvis',
  }),
  makeExhibit(2, [1.8, 2.35, -10.8], [6.4, 2.4, -12.5], {
    id: 'project-codsoft-portfolio',
    code: 'EXHIBIT 003',
    roomLabel: 'Room 02 — Exhibition Hall',
    title: 'CodSoft Portfolio Web Application',
    subtitle: 'Clean Responsive Developer Showcase built during CodSoft Internship',
    category: 'Web Development',
    description:
      'Engineered a crisp, semantic, responsive personal portfolio application featuring project showcases, technical skill maps, and direct contact flows built with pure HTML5, CSS3, and modular JavaScript.',
    details: [
      '100% responsive fluid layout across mobile, tablet, and desktop breakpoints.',
      'Zero heavy dependencies for instant first-paint performance.',
      'Built & versioned using structured Git branch workflows during the CodSoft internship.',
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsive UI', 'CodSoft'],
    status: 'Completed • Live Demo',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-codsoft-portfolio',
  }),
  makeExhibit(2, [-1.8, 2.35, -25.5], [-6.4, 2.4, -27.5], {
    id: 'project-netflix',
    code: 'EXHIBIT 004',
    roomLabel: 'Room 02 — Exhibition Hall',
    title: 'Netflix UI Clone & Streaming Hub',
    subtitle: 'High-Fidelity Media Catalog Interface',
    category: 'Frontend Engineering',
    description:
      'A responsive streaming catalog interface recreating hero preview banners, horizontal category carousels, hover preview cards, and clean modal overlays.',
    details: [
      'Responsive grid and smooth horizontal scroll carousels across screen widths.',
      'Interactive preview modal overlays and semantic CSS architecture.',
      'Delivered as part of the CodSoft Web Development Internship.',
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'UI Architecture', 'Git'],
    status: 'Completed • Live Demo',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-netflix',
  }),
  makeExhibit(2, [1.8, 2.35, -25.5], [6.4, 2.4, -27.5], {
    id: 'project-calculator',
    code: 'EXHIBIT 005',
    roomLabel: 'Room 02 — Exhibition Hall',
    title: 'Scientific Calculator & Utility Suite',
    subtitle: 'Precision Expression Engine & Keyboard-First UI',
    category: 'Algorithms & UI',
    description:
      'Algorithmic scientific calculation web app supporting chained expressions, keyboard shortcuts, robust syntax validation, and a sleek precision interface.',
    details: [
      'Instant equation evaluation with edge-case error handling.',
      'Try the live working scientific calculator right above in this drawer!',
      'Zero external runtime dependencies.',
    ],
    tags: ['JavaScript', 'Algorithms', 'HTML5', 'CSS3'],
    status: 'Completed • Working Demo',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-calculator',
  }),

  // ROOM 03 — TECHNOLOGY GALLERY
  makeExhibit(3, [-2.0, 2.35, -9.5], [-5.2, 2.35, -15.5], {
    id: 'tech-threejs',
    code: 'INSTALLATION 01',
    roomLabel: 'Room 03 — Technology Gallery',
    title: 'The Three.js & WebGL Installation',
    subtitle: 'Dichroic Rainbow Glass Shader, PBR Materials & Spatial Cameras',
    category: '3D Engineering',
    description:
      'Demonstrates spatial WebGL art: custom dichroic iridescent Fresnel GLSL shaders, metallic PBR lighting, raycasting interactions, and 60 FPS render loops.',
    details: [
      'Proven in: VERTEX PHONE X1 3D Prototype (PRISMIO) & This 3D Digital Museum.',
      'Skills: Three.js, GLSL Shaders, Camera Choreography, VideoTextures & Raycasting.',
      'Performance focus: hardware-accelerated rendering and clean GPU memory disposal.',
    ],
    tags: ['Three.js', 'WebGL', 'GLSL Art Shaders', 'PBR Lighting', 'Raycasting'],
    status: 'Live Dichroic Sculpture',
    creator: 'Shashank Jha',
  }),
  makeExhibit(3, [0, 2.4, -14.0], [0, 2.45, -21.5], {
    id: 'tech-react',
    code: 'INSTALLATION 02',
    roomLabel: 'Room 03 — Technology Gallery',
    title: 'The React & Next.js Installation',
    subtitle: 'Plasma Energy Core & Orbiting Component Electrons',
    category: 'Frontend Architecture',
    description:
      'Visualized as a luminous plasma orbital atom with live racing electron spheres—representing modular hooks, Context state synchronization, and clean TypeScript composition.',
    details: [
      'Proven in: PRISMIO React Frontend Traineeship, The Digital Museum (Next.js 16 + React 19).',
      'Skills: React 19, Next.js App Router, TypeScript, Tailwind CSS, Vite & Vercel.',
      'Focus: Predictable data flow, reusable UI systems, and responsive layout craftsmanship.',
    ],
    tags: ['React 19', 'Next.js 16', 'TypeScript', 'Tailwind CSS', 'Vite', 'Vercel'],
    status: 'Live Plasma Sculpture',
    creator: 'Shashank Jha',
  }),
  makeExhibit(3, [2.0, 2.35, -9.5], [5.2, 2.35, -15.5], {
    id: 'tech-js-gsap',
    code: 'INSTALLATION 03',
    roomLabel: 'Room 03 — Technology Gallery',
    title: 'JavaScript, GSAP & Full-Stack Core',
    subtitle: 'Chromatic Harmonic Wave Pillars & Backend Foundations',
    category: 'Motion & Core Engineering',
    description:
      'Represented by 7 hue-shifting chromatic kinetic pillars—combining fluid GSAP motion physics with deep CS foundations in Java, DSA, Python, Node.js, Express.js, MongoDB, SQL, and Git.',
    details: [
      'Motion & Web: ES6+ JavaScript, GSAP Timelines & ScrollTrigger, HTML5, CSS3.',
      'Core CS & Languages: Java (OOP & DSA), Python (AI Automation), C/C++, Theory of Computation.',
      'Backend & Tools: Node.js, Express.js, REST APIs, MongoDB, SQL, Postman, Git & IoT.',
    ],
    tags: ['JavaScript ES6+', 'GSAP', 'Java & DSA', 'Python', 'Node.js / Express', 'MongoDB & SQL'],
    status: 'Live Kinetic Sculpture',
    creator: 'Shashank Jha',
  }),

  // ROOM 04 — TIMELINE GALLERY
  makeExhibit(4, [-1.8, 2.3, -5.5], [-6.2, 2.4, -8.0], {
    id: 'chapter-01',
    code: 'CHAPTER 01',
    roomLabel: 'Room 04 — Timeline Gallery',
    title: 'Academic Journey — Parul University',
    subtitle: 'B.Tech in Computer Science & Engineering (2022 – 2026)',
    category: 'Education & Core CS',
    description:
      'Comprehensive undergraduate foundation in Computer Science & Engineering in Vadodara, combining algorithmic mastery with active participation in tech clubs and IIT NPTEL certifications.',
    details: [
      'Core coursework: Data Structures & Algorithms, OS, DBMS, Computer Networks & TOC.',
      'Earned IIT NPTEL Certifications in Theory of Computation and Internet of Things (IoT).',
      'Completed Certified Web Development Course (TeachNook × IIT Roorkee) & MERN Stack Workshop.',
    ],
    tags: ['B.Tech CSE', 'Parul University', 'Java DSA', 'NPTEL IIT', 'IIT Roorkee'],
    status: '2022 – 2026',
    creator: 'Shashank Jha',
  }),
  makeExhibit(4, [1.8, 2.3, -10.0], [6.2, 2.4, -12.5], {
    id: 'chapter-02',
    code: 'CHAPTER 02',
    roomLabel: 'Room 04 — Timeline Gallery',
    title: 'First Development Projects',
    subtitle: 'From Classroom Theory to Interactive Applications (2023 – 2024)',
    category: 'Early Creations',
    description:
      'Built early responsive websites, algorithmic utilities, and the J.A.R.V.I.S Python AI Voice Assistant—turning curiosity into shipped software.',
    details: [
      'Built J.A.R.V.I.S voice automation bot in Python with SpeechRecognition & pyttsx3.',
      'Completed intensive MERN Stack Workshop mastering MongoDB, Express, React & Node.js.',
      'Established clean GitHub workflows and responsive UI engineering discipline.',
    ],
    tags: ['HTML5/CSS3', 'JavaScript', 'Python', 'MERN Stack', 'GitHub'],
    status: '2023 – 2024',
    creator: 'Shashank Jha',
  }),
  makeExhibit(4, [-1.8, 2.3, -15.5], [-6.2, 2.4, -18.0], {
    id: 'chapter-03',
    code: 'CHAPTER 03',
    roomLabel: 'Room 04 — Timeline Gallery',
    title: 'CodSoft Internship',
    subtitle: 'Web Development Intern (Jan 2025 – Feb 2025)',
    category: 'Industry Experience',
    description:
      'Built responsive full-stack web applications and interface clones under real project deadlines while mastering Git workflows and Postman API testing.',
    details: [
      'Built full-stack web apps with HTML5, CSS3, JavaScript, Node.js, and Express.js.',
      'Shipped a Portfolio Website, Scientific Calculator Suite, and Netflix UI Clone.',
      'Strengthened version control discipline and REST API debugging using Postman.',
    ],
    tags: ['CodSoft', 'Node.js', 'Express.js', 'JavaScript', 'Postman', 'Git'],
    status: 'Completed • Feb 2025',
    creator: 'Shashank Jha',
  }),
  makeExhibit(4, [1.8, 2.3, -20.5], [6.2, 2.4, -23.0], {
    id: 'chapter-04',
    code: 'CHAPTER 04',
    roomLabel: 'Room 04 — Timeline Gallery',
    title: 'PRISMIO Internship',
    subtitle: 'React Frontend Trainee (Jan 2026 – March 2026)',
    category: '3D & Frontend Engineering',
    description:
      'Spearheaded modern interactive web interfaces, dynamic GSAP motion choreography, and Three.js 3D product showcases deployed via Vite & Vercel.',
    details: [
      'Architected clean, premium responsive interfaces using React, Tailwind CSS & JavaScript.',
      'Engineered the Vertex Phone X1 interactive 3D prototype with Three.js and GSAP.',
      'Optimized modern frontend builds using Vite and continuous production hosting on Vercel.',
    ],
    tags: ['PRISMIO', 'React', 'Three.js', 'GSAP', 'Tailwind CSS', 'Vite', 'Vercel'],
    status: 'Completed • March 2026',
    creator: 'Shashank Jha',
  }),
  makeExhibit(4, [-1.8, 2.3, -25.5], [-6.2, 2.4, -28.0], {
    id: 'chapter-05',
    code: 'CHAPTER 05',
    roomLabel: 'Room 04 — Timeline Gallery',
    title: 'Edugenius – Teaching & Robotics',
    subtitle: 'STEM Mentorship, IoT/Robotics Exploration & Technical Sharing',
    category: 'Teaching & Robotics',
    description:
      'Sharing engineering curiosity through hands-on teaching, robotics & IoT exploration, and mentoring fellow students in modern web development and computer science fundamentals.',
    details: [
      'Mentored students in practical programming, Git workflows, and interactive frontend design.',
      'Combined NPTEL Internet of Things (IoT) training with robotics and hardware-software concepts.',
      'Authored accessible technical guides on Java DSA, Python AI, and 3D web engineering.',
    ],
    tags: ['Edugenius', 'Teaching', 'Robotics & IoT', 'Mentorship', 'Technical Writing'],
    status: 'Active Chapter',
    creator: 'Shashank Jha',
  }),

  // ROOM 05 — INNOVATION LAB
  makeExhibit(5, [0, 2.4, -8.5], [0, 2.5, -16.5], {
    id: 'lab-particles',
    code: 'LAB EXP-01',
    roomLabel: 'Room 05 — Innovation Lab',
    title: 'Where Ideas Become Experiments',
    subtitle: 'Aurora Plasma Core & Generative Particle Vortex',
    category: 'Experimental R&D',
    description:
      'A developer is defined not only by finished products, but by curiosity. This aurora-shader particle matrix demonstrates real-time GLSL wave harmonics, particle physics, and WebGL performance experiments.',
    details: [
      'Custom GLSL Aurora Plasma Orb pulsing inside a 560-point harmonic sphere.',
      'Explores kinetic typography, micro-interaction physics, and UI/UX prototypes.',
      'Continue around the next left turn to explore the dedicated Hobbies & Passions Gallery.',
    ],
    tags: ['Aurora GLSL Shader', 'WebGL Particles', 'Prototypes', 'Creative Code'],
    status: 'Live Experiment',
    creator: 'Shashank Jha',
  }),
  makeExhibit(5, [1.8, 2.35, -10.5], [6.2, 2.4, -13.0], {
    id: 'lab-notebooks',
    code: 'LAB EXP-02',
    roomLabel: 'Room 05 — Innovation Lab',
    title: 'Technical Research Notebooks',
    subtitle: '4 Engineering Deep-Dives & Architecture Notes',
    category: 'Technical Writing',
    description:
      'Documented learnings from real builds—covering Three.js + GSAP 3D prototyping, transitioning from college to internships, Python voice automation, and mastering Java Data Structures.',
    details: [
      '01. Building the Vertex Phone X1 3D Prototype with Three.js & GSAP (March 2026)',
      '02. From College to First Internships: CodSoft & PRISMIO Lessons (Feb 2026)',
      '03. Developing J.A.R.V.I.S: Extensible Python Voice Assistant Architecture (Jan 2026)',
      '04. Demystifying Core Data Structures & Algorithms in Java (Dec 2025)',
    ],
    tags: ['Three.js Guide', 'Career Notes', 'Python AI', 'Java DSA'],
    status: 'Published Archive',
    creator: 'Shashank Jha',
  }),

  // ROOM 06 — HOBBIES & PASSIONS GALLERY (BRAND NEW DEDICATED WING!)
  makeExhibit(6, [0, 2.45, -8.8], [0, 2.6, -16.0], {
    id: 'hobby-centerpiece',
    code: 'HOBBIES // CENTERPIECE',
    roomLabel: 'Room 06 — Hobbies Gallery',
    title: 'Beyond Code — 6 Personal Passions',
    subtitle: 'Cricket • 3D WebGL Shaders • Python AI • Java DSA • Reading • Writing',
    category: 'Personal Interests & Art',
    description:
      'Represented by a sculptural crimson-stitched Cricket Sphere orbited by an iridescent holographic code cube—celebrating the balance between competitive sports, creative coding, and continuous learning.',
    details: [
      '🏏 Cricket & Team Sports — Active college tournaments & weekend matches building sharp focus & teamwork.',
      '🌐 Interactive 3D Coding & WebGL Shaders — Exploring particle clouds, lighting models & camera choreography.',
      '🤖 Python AI & Voice Automation — Tinkering with voice bots & desktop micro-automation.',
      '☕ Competitive Java DSA • 📚 Open Source Reading • ✍ Technical Writing & Peer Mentorship.',
    ],
    tags: ['Cricket', 'WebGL Shaders', 'Python AI', 'Java DSA', 'Open Source', 'Writing'],
    status: '6 Active Passions',
    creator: 'Shashank Jha',
  }),
  makeExhibit(6, [-1.8, 2.35, -11.0], [-6.2, 2.4, -14.0], {
    id: 'hobby-creative-ai',
    code: 'PASSIONS // TECH & CRAFT',
    roomLabel: 'Room 06 — Hobbies Gallery',
    title: '3D Shaders, Python AI & Java DSA',
    subtitle: 'Creative Technology • AI Automation • Competitive Problem Solving',
    category: 'Technical Hobbies',
    description:
      'Outside formal coursework and internships, Shashank spends evenings crafting procedural WebGL shader art, prototyping JARVIS-inspired Python voice tools, and solving Java DSA problems.',
    details: [
      '🌐 Interactive 3D Coding: Three.js particle systems, procedural geometry & GSAP camera transitions.',
      '🤖 Python AI & Voice Automation: Speech synthesis scripts & REST workflow micro-endpoints.',
      '☕ Competitive Problem Solving in Java: Arrays, trees, recursion & dynamic programming optimization.',
    ],
    tags: ['WebGL Shaders', 'Python AI', 'Java DSA', 'Creative 3D'],
    status: 'Daily Craft',
    creator: 'Shashank Jha',
  }),
  makeExhibit(6, [1.8, 2.35, -11.0], [6.2, 2.4, -14.0], {
    id: 'hobby-sports-writing',
    code: 'PASSIONS // LIFE & COMMUNITY',
    roomLabel: 'Room 06 — Hobbies Gallery',
    title: 'Cricket, Open Source & Technical Writing',
    subtitle: 'Team Sports • Dev Community • Knowledge Sharing',
    category: 'Sports & Community',
    description:
      'Sharp engineering is fueled by an active life outside the IDE—from competitive college cricket tournaments to reading open-source architecture blogs and mentoring fellow students.',
    details: [
      '🏏 Cricket & Team Sports: Sharp hand-eye coordination, leadership & tactical focus under pressure.',
      '📚 Tech Reading & Open Source: Tracking Vite, Next.js & trending GitHub repositories.',
      '✍ Technical Writing & Mentorship: Tutorials on Git, Tailwind CSS & internship prep for peers.',
    ],
    tags: ['Cricket', 'Team Leadership', 'Open Source', 'Technical Writing'],
    status: 'Life & Community',
    creator: 'Shashank Jha',
  }),

  // ROOM 07 — DEDICATED SOCIAL MEDIA LOUNGE (Neon Magenta West Wing)
  makeExhibit(7, [0, 2.45, -9.8], [0, 2.6, -17.0], {
    id: 'social-media-hub',
    code: 'ROOM 07 // CENTERPIECE',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'Social Media Constellation Hub',
    subtitle: 'Instagram • Facebook • Pinterest • GitHub • LinkedIn',
    category: 'Social Media Lounge',
    description:
      'Welcome to the dedicated Social Media Lounge! Five illuminated platform orbs orbit a luminous prism—click any wall exhibit in this room or use the Connect / Edit Links tool below to attach and save all 5 of your live social URLs.',
    details: [
      'Dedicated gallery wing connecting Instagram, Facebook, Pinterest, GitHub, and LinkedIn.',
      'Click "Connect / Edit Links" below to paste and save your live profile URLs.',
      'Also accessible anytime as a standalone shareable page at /socials.',
    ],
    tags: ['Instagram', 'Facebook', 'Pinterest', 'GitHub', 'LinkedIn'],
    status: '5 Channels Live',
    creator: 'Shashank Jha',
    actionType: 'social',
  }),
  makeExhibit(7, [-1.8, 2.35, -6.5], [-6.3, 2.4, -8.5], {
    id: 'social-instagram',
    code: 'SOCIAL 01 // INSTAGRAM',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'Instagram — Visual Stories & Reels',
    subtitle: 'Behind-the-Scenes Creative 3D, Design & Life Moments',
    category: 'Instagram Profile',
    description:
      'Follow visual stories, WebGL experiment reels, creative UI snapshots, and behind-the-scenes moments on Instagram.',
    details: [
      'Click "Visit Instagram Profile" below to jump straight to your connected account.',
      'Update your Instagram handle anytime using "Connect / Edit Links" below.',
    ],
    tags: ['Instagram', 'Visual Stories', 'Reels', 'Creative Showcase'],
    status: 'Connected Channel',
    creator: 'Shashank Jha',
    actionType: 'social',
    socialPlatform: 'instagram',
  }),
  makeExhibit(7, [1.8, 2.35, -8.5], [6.3, 2.4, -10.5], {
    id: 'social-facebook',
    code: 'SOCIAL 02 // FACEBOOK',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'Facebook — Community & Updates',
    subtitle: 'Milestones, Events & Direct Community Connections',
    category: 'Facebook Profile',
    description:
      'Stay in touch through Facebook for milestone announcements, community highlights, and direct personal connections.',
    details: [
      'Click "Visit Facebook Profile" below to open your connected Facebook page.',
      'Update your Facebook profile link anytime via "Connect / Edit Links".',
    ],
    tags: ['Facebook', 'Community', 'Updates', 'Network'],
    status: 'Connected Channel',
    creator: 'Shashank Jha',
    actionType: 'social',
    socialPlatform: 'facebook',
  }),
  makeExhibit(7, [-1.8, 2.35, -19.5], [-6.3, 2.4, -21.5], {
    id: 'social-pinterest',
    code: 'SOCIAL 03 // PINTEREST',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'Pinterest — Design Boards & Inspiration',
    subtitle: 'Curated Visual Moodboards, 3D Architecture & UI Aesthetics',
    category: 'Pinterest Boards',
    description:
      'Explore curated visual inspiration boards covering architectural minimalism, futuristic UI systems, typography, and 3D lighting studies.',
    details: [
      'Click "Visit Pinterest Profile" below to browse your curated Pinterest boards.',
      'Attach your live Pinterest handle anytime via "Connect / Edit Links".',
    ],
    tags: ['Pinterest', 'Moodboards', 'UI Inspiration', '3D Aesthetics'],
    status: 'Connected Channel',
    creator: 'Shashank Jha',
    actionType: 'social',
    socialPlatform: 'pinterest',
  }),
  makeExhibit(7, [1.8, 2.35, -21.5], [6.3, 2.4, -23.5], {
    id: 'social-github',
    code: 'SOCIAL 04 // GITHUB',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'GitHub — Open-Source Code & Repos',
    subtitle: 'React, Next.js, Three.js, Java DSA & Python Automation',
    category: 'GitHub Archive',
    description:
      'Inspect complete source code, commit histories, live project repositories, and open-source experiments directly on GitHub.',
    details: [
      'Click "Visit GitHub Profile" below to explore code repositories.',
      'Customize your GitHub profile URL anytime with "Connect / Edit Links".',
    ],
    tags: ['GitHub', 'Open Source', 'Three.js', 'React', 'Java DSA'],
    status: 'Connected Channel',
    creator: 'Shashank Jha',
    actionType: 'social',
    socialPlatform: 'github',
  }),
  makeExhibit(7, [-1.8, 2.35, -26.5], [-6.2, 2.4, -29.0], {
    id: 'social-linkedin',
    code: 'SOCIAL 05 // LINKEDIN',
    roomLabel: 'Room 07 — Social Media Lounge',
    title: 'LinkedIn — Career & Engineering Network',
    subtitle: 'Internships, Certifications, Collaborations & Roles',
    category: 'LinkedIn Profile',
    description:
      'Connect professionally on LinkedIn for full-time software engineering opportunities, frontend & 3D creative collaborations, and technical networking.',
    details: [
      'Click "Visit LinkedIn Profile" below to connect professionally.',
      'Keep your LinkedIn link up-to-date anytime via "Connect / Edit Links".',
    ],
    tags: ['LinkedIn', 'Career', 'Software Engineering', 'Networking'],
    status: 'Connected Channel',
    creator: 'Shashank Jha',
    actionType: 'social',
    socialPlatform: 'linkedin',
  }),

  // ROOM 08 — ZERO-GRAVITY FLOATING FRONTEND SHOWCASE (North Showroom)
  makeExhibit(8, [0, 2.55, -12.6], [0, 2.75, -19.0], {
    id: 'float-vertex',
    code: 'FLOATING UI 01 // VERTEX X1',
    roomLabel: 'Room 08 — Floating Showcase',
    title: 'Vertex Phone X1 — Floating 3D UI',
    subtitle: 'Levitating Titanium Smartphone & Spatial Hologram Cards',
    category: 'Floating 3D Frontend',
    description:
      'A zero-gravity floating 3D smartphone displaying the Vertex Phone X1 frontend—flanked by levitating holographic specification cards. Interact with the live 3D phone demo right inside this drawer!',
    details: [
      'Floating titanium bezel device with live illuminated frontend screen mockup.',
      'Click the interactive color & orbit preview below to test the Vertex X1 frontend live.',
      'Built with React, Three.js, GSAP ScrollTrigger & Tailwind CSS during PRISMIO.',
    ],
    tags: ['Three.js', 'GSAP', 'React', 'Spatial UI', 'Live Demo'],
    status: 'Floating Live Frontend',
    creator: 'Shashank Jha',
    liveUrl: 'https://vercel.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-vertex',
  }),
  makeExhibit(8, [-1.4, 2.55, -6.4], [-5.4, 2.8, -10.8], {
    id: 'float-jarvis',
    code: 'FLOATING UI 02 // J.A.R.V.I.S',
    roomLabel: 'Room 08 — Floating Showcase',
    title: 'J.A.R.V.I.S — Floating AI HUD Monitor',
    subtitle: 'Curved Levitating Holographic Voice Console & Arc Ring',
    category: 'Floating AI Frontend',
    description:
      'Levitating ultrawide holographic display showcasing the J.A.R.V.I.S voice visualizer and live command transcript UI—powered by a glowing floating telemetry ring behind the glass.',
    details: [
      'Real-time voice visualizer & command log dashboard mockup hovering in mid-air.',
      'Test the interactive J.A.R.V.I.S voice command console live inside this panel.',
      'Python SpeechRecognition, pyttsx3 TTS & REST API automation engine.',
    ],
    tags: ['Python AI', 'Voice HUD', 'REST APIs', 'Interactive Console'],
    status: 'Floating Live Frontend',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-jarvis',
  }),
  makeExhibit(8, [1.4, 2.55, -7.2], [5.4, 2.8, -11.6], {
    id: 'float-netflix',
    code: 'FLOATING UI 03 // NETFLIX CLONE',
    roomLabel: 'Room 08 — Floating Showcase',
    title: 'Netflix Clone — Floating OLED Cinema',
    subtitle: 'Curved Zero-Gravity Streaming Screen & Poster Rows',
    category: 'Floating Media UI',
    description:
      'A sleek floating curved cinema display rendering the responsive Netflix streaming frontend—featuring the featured hero banner, crimson ambient backlight, and trending carousel.',
    details: [
      'High-fidelity curved OLED cinema screen levitating on an anti-gravity floor ring.',
      'Switch featured movies & preview trailers in the live demo below.',
      'Crafted with semantic HTML5, CSS3 & modular JavaScript.',
    ],
    tags: ['Streaming UI', 'Responsive Grid', 'HTML5/CSS3', 'JavaScript'],
    status: 'Floating Live Frontend',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-netflix',
  }),
  makeExhibit(8, [-1.4, 2.5, -22.8], [-5.4, 2.7, -27.5], {
    id: 'float-portfolio',
    code: 'FLOATING UI 04 // PORTFOLIO APP',
    roomLabel: 'Room 08 — Floating Showcase',
    title: 'CodSoft Portfolio — Floating 3D Laptop',
    subtitle: 'Open Levitating Aluminum MacBook Displaying Live Web App',
    category: 'Floating Web Frontend',
    description:
      'A sleek open 3D aluminum laptop hovering weightlessly in zero gravity—displaying the responsive CodSoft Portfolio web frontend with clean hero typography and project cards.',
    details: [
      'Custom 3D levitating laptop chassis with glowing display & backlit keyboard deck.',
      'Explore the interactive portfolio preview tabs right inside this panel.',
      'Zero heavy dependencies for instant load speed across every viewport.',
    ],
    tags: ['Web App', 'Responsive UI', 'CodSoft', 'HTML5/CSS3/JS'],
    status: 'Floating Live Frontend',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-codsoft-portfolio',
  }),
  makeExhibit(8, [1.4, 2.5, -23.8], [5.4, 2.7, -28.5], {
    id: 'float-calculator',
    code: 'FLOATING UI 05 // SCI-CALC PRO',
    roomLabel: 'Room 08 — Floating Showcase',
    title: 'Scientific Calculator — Floating Tablet',
    subtitle: 'Levitating Frosted Glass Pad & Precision Expression UI',
    category: 'Floating Utility UI',
    description:
      'A bevelled zero-gravity glass tablet floating effortlessly in mid-air—displaying the scientific expression readout and glowing numeric keypad of the Scientific Calculator Suite.',
    details: [
      'Floating glass tablet with luminous amber-cyan expression display.',
      'Try computing live expressions right now in the interactive calculator below!',
      'Keyboard-first algorithmic evaluation engine in pure JavaScript.',
    ],
    tags: ['JavaScript', 'Algorithms', 'Glass Tablet UI', 'Working Demo'],
    status: 'Floating Live Frontend',
    creator: 'Shashank Jha',
    liveUrl: 'https://github.com',
    githubUrl: 'https://github.com',
    demoKey: 'project-calculator',
  }),

  // ROOM 09 — EXIT GALLERY (East Rotunda Finale)
  makeExhibit(9, [0, 2.45, -13.5], [0, 2.8, -24.0], {
    id: 'exit-wall',
    code: 'ROOM 09 // EXIT',
    roomLabel: 'Room 09 — Exit Gallery',
    title: "THE EXHIBITION DOESN'T END HERE.",
    subtitle: 'There is always something new to create. Thank you for visiting.',
    category: 'Connect & Collaborate',
    description:
      'Thank you for walking through all 10 rooms of The Digital Museum. Send a direct museum dispatch, copy Shashank’s email, download the complete CV, or revisit the Social Media Lounge.',
    details: [
      'Email: aj8085769067@gmail.com',
      'Location: Vadodara, Gujarat, India (+91-8085769067)',
      'Full social profiles available in Room 07 (Social Media Lounge) & /socials.',
    ],
    tags: ['Direct Email', 'Resume CV', 'Guestbook', 'Open to Collaborate'],
    status: 'Open to Collaborate',
    creator: 'Shashank Jha',
    actionType: 'contact',
  }),
];
