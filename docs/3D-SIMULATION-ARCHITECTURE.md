# 3D Space Simulation — Architecture & Design

**Project:** Ionic Design House Client Portal
**Feature:** Web-based 3D apartment/villa visualization
**Status:** MVP (Phase 1)
**Last updated:** 2026-06-05

---

## 1. Overview

The 3D Simulation feature lets clients of an architectural & interior-design studio
**see their future space before construction**. Instead of reading abstract 2D floor
plans, a client opens a link, orbits or walks through a 3D model of their unit, swaps
finishes, drops in furniture, and watches light change from morning to night.

### Problems It Solves

| Client Problem | Solution in the App |
|---|---|
| "I can't read a 2D plan" | Interactive 3D orbit + first-person walkthrough |
| "Will my furniture fit?" | Drag-and-drop furniture with live dimension labels |
| "I don't like that finish" | Real-time material/colour swapping on surfaces |
| "How does the light feel?" | Day/night sun simulation |
| "I changed my mind too late" | Decisions happen **before** construction → fewer revisions |

---

## 2. Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Rendering | **Three.js** (WebGL) | Mature, huge ecosystem, smaller footprint than Babylon.js |
| React binding | **@react-three/fiber** (R3F v9) | Declarative JSX scene graph; native to existing React 19 app |
| Scene helpers | **@react-three/drei** | Ready-made OrbitControls, shadows, environment, HTML labels |
| State | **Zustand** | Tiny, hook-based, decoupled from React tree; easy to unit-test |
| Models | **glTF 2.0 / GLB** + procedural geometry | Industry standard; MVP uses code-generated rooms (no asset dependency) |
| Delivery (future) | Cloudinary / S3 + CDN | Reuses existing image infra |
| Host | Vercel (existing) | Static + edge; no extra infra |

### Why Three.js over alternatives

- **Babylon.js** — more built-in features but heavier bundle and steeper curve for a team new to 3D.
- **Sketchfab / hosted viewers** — no control over the UI, recurring per-view cost, can't integrate the studio's bilingual/WhatsApp flows.
- **Raw WebGL** — too low-level; R3F gives 90% of the productivity for this use case.

---

## 3. System Architecture

```
┌──────────────────────────────────────────────────────────┐
│                  Next.js App (ionic-studio)               │
│                                                            │
│   /simulate/[id]  page  ──────────────────────────────┐   │
│   ┌───────────────────────────────────────────────┐   │   │
│   │            <SimulationCanvas>  (R3F)           │   │   │
│   │   ┌─────────────────────────────────────────┐ │   │   │
│   │   │  Scene                                   │ │   │   │
│   │   │   ├── <Lighting>      (sun + ambient)    │ │   │   │
│   │   │   ├── <Room>          (procedural walls) │ │   │   │
│   │   │   ├── <FurnitureLayer>(placed items)     │ │   │   │
│   │   │   └── <CameraRig>     (orbit/walk/top)   │ │   │   │
│   │   └─────────────────────────────────────────┘ │   │   │
│   └───────────────────────────────────────────────┘   │   │
│   ┌───────────────────────────────────────────────┐   │   │
│   │  HUD Overlay (plain HTML/CSS, bilingual, RTL)  │   │   │
│   │   Materials · Furniture · Lighting · Camera    │   │   │
│   └───────────────────────────────────────────────┘   │   │
│                                                       │   │
│   Zustand store  ◀────────── drives both layers ──────┘   │
└───────────────────────────┬──────────────────────────────┘
                            │
              GET /api/simulation/[id]   (stub today, CMS later)
                            │
              ┌─────────────┴─────────────┐
              │  lib/simulation/catalog   │  ← hardcoded MVP data
              │  (Materials, Furniture)   │     (swap for CMS in V2)
              └───────────────────────────┘
```

### Layer separation (key design principle)

All **business logic is pure and framework-free** in `lib/simulation/*` so it can be
unit-tested without a browser or WebGL context:

- `dimensions.ts` — bounding-box math, distance, locale-aware formatting
- `share.ts` — encode/decode scene state to a URL, build WhatsApp links
- `catalog.ts` — the MVP material & furniture catalogue
- `types.ts` — the data models (CMS-ready shape)
- `store.ts` — Zustand store (placement add/remove/select/move)

The R3F components in `components/simulate/*` are **thin** — they read the store and
render meshes. This keeps WebGL out of the test path.

---

## 4. Data Models (CMS-ready)

These TypeScript interfaces define the shape a future CMS (Payload) will populate.
Today they are served from a static catalogue; the API contract stays identical.

```ts
// Bilingual string used across the app
type Bi = { ar: string; en: string };

interface MaterialDef {
  id: string;
  name: Bi;
  category: "floor" | "wall" | "ceiling";
  color: string;            // hex — MVP uses solid colours
  roughness: number;        // 0..1 PBR
  metalness: number;        // 0..1 PBR
  costTier: 1 | 2 | 3;      // ●○○ budget … ●●● premium
  textureUrl?: string;      // future: tileable texture map
}

interface FurnitureDef {
  id: string;
  name: Bi;
  category: "sofa" | "bed" | "table" | "chair" | "storage" | "rug";
  size: { w: number; d: number; h: number };  // metres
  color: string;
  modelUrl?: string;        // future: per-item GLB
}

interface Placement {              // a furniture instance in the scene
  id: string;                      // unique instance id
  defId: string;                   // → FurnitureDef.id
  position: [number, number, number];
  rotationY: number;               // radians
}

interface RoomDef {
  id: string;
  name: Bi;
  size: { w: number; d: number; h: number };  // metres
  floorMaterialId: string;
  wallMaterialId: string;
}

interface SimulationProject {      // the unit served per client
  id: string;
  name: Bi;
  room: RoomDef;
  availableMaterials: string[];    // MaterialDef ids
  availableFurniture: string[];    // FurnitureDef ids
}
```

### API contract (stub today)

```
GET /api/simulation/:id
→ 200 { project: SimulationProject,
        materials: MaterialDef[],
        furniture: FurnitureDef[] }
```

The MVP route returns the static catalogue. When the CMS lands, only the route's
internals change — the frontend and the response shape do not.

---

## 5. Core Features (MVP scope)

| Feature | Description |
|---|---|
| **Orbit camera** | Rotate/zoom around the room (default mode) |
| **Walkthrough camera** | First-person; move with on-screen pad / drag |
| **Top-down camera** | 2D-style floor-plan overview |
| **Material swapping** | Click a finish → applied live to floor or walls; PBR roughness/metalness |
| **Furniture placement** | Add from catalogue, select, move on the floor, rotate, delete |
| **Dimension labels** | Selected item shows W×D×H; room shows overall dimensions |
| **Lighting** | Day/night slider repositions the sun and shifts colour temperature |
| **Screenshot** | Capture the current view as PNG |
| **Share** | Encode scene → shareable URL + "Send on WhatsApp" (matches studio's lead flow) |
| **Bilingual + RTL** | All labels AR/EN via existing `lib/i18n`; panel mirrors in Arabic |
| **Responsive** | Desktop full panel; tablet drawer; mobile view-only simplified controls |

### Out of MVP (future phases)

- Real GLB/CAD/BIM model import
- CMS-driven content management (Payload)
- VR/AR (WebXR)
- Client annotation/comment pins
- Before/After photo mapping
- Persisted user accounts & saved boards

---

## 6. Scene State (Zustand)

```ts
interface SimState {
  cameraMode: "orbit" | "walk" | "top";
  timeOfDay: number;                 // 0..24 hours
  floorMaterialId: string;
  wallMaterialId: string;
  placements: Placement[];
  selectedId: string | null;

  setCameraMode(m): void;
  setTimeOfDay(h): void;
  setMaterial(cat, id): void;
  addFurniture(defId): void;         // drops at room centre
  moveSelected(pos): void;
  rotateSelected(deltaY): void;
  removeSelected(): void;
  select(id | null): void;
  reset(): void;
}
```

The store is the **single source of truth**. Both the WebGL scene and the HTML HUD
subscribe to it. Share-links serialise a subset of this state.

---

## 7. Performance Strategy

- **Procedural rooms** for MVP → zero asset download, instant load.
- **On-demand frameloop** (`frameloop="demand"`) — render only when state changes or
  the camera moves, saving battery on mobile.
- **Shadow budget** — single directional (sun) shadow map at 1024px; capped.
- **Future GLB**: Draco compression (`gltf-pipeline --draco`), LOD by device memory,
  progressive load (shell first, furniture streamed).
- **Targets:** 60fps desktop, ≥30fps mid-range mobile, <4s first interaction on 4G.

---

## 8. Cross-Device Strategy

| Device | Controls | Panel |
|---|---|---|
| Desktop | Mouse orbit, scroll zoom, click-select | Fixed side panel |
| Tablet | Touch orbit, pinch zoom, tap-select | Collapsible drawer |
| Mobile | Orbit + simplified controls; placement read-only-friendly | Bottom sheet |

WebGL 2 covers ~95% of browsers; a graceful fallback banner is shown otherwise.

---

## 9. Testing Strategy

| Level | Tool | What it covers |
|---|---|---|
| **Unit** | Vitest | `dimensions` math, `share` encode/decode, `catalog` integrity |
| **Integration** | Vitest + RTL | Zustand store transitions (add/move/remove/select), API stub |
| **Component** | Vitest + RTL | HUD panels render & dispatch correct store actions |
| **E2E / UX** | Browser preview | Camera modes, material swap, furniture add, responsiveness |

WebGL rendering itself is validated visually in the browser preview (jsdom has no
GPU), while all deterministic logic is covered by fast headless unit tests.

---

## 10. Roadmap

| Phase | Scope |
|---|---|
| **1 — MVP (this)** | Procedural room, 3 cameras, materials, furniture, lighting, share, tests |
| **2 — Beta** | Annotation pins, before/after, multi-room villas, cost tiers, analytics |
| **3 — Release** | CMS (Payload) designer workflow, GLB import, measurement ruler, PDF export, WebXR |

---

## 11. Success Metrics

| Category | Metric | Target |
|---|---|---|
| Engagement | Avg session on simulator | > 8 min |
| Engagement | % who swap a material | > 60% |
| Engagement | % who share the link | > 30% |
| Business | Reduction in revision rounds | −40% |
| Business | Inquiry → contract conversion | +15% |
| Technical | First interaction on 4G | < 4 s |
| Technical | Mobile frame rate | ≥ 28 fps |

---

## 12. Directory Map

```
app/
  simulate/
    page.tsx                  # entry route (client, bilingual)
  api/
    simulation/[id]/route.ts  # API stub (CMS-ready contract)

lib/simulation/
  types.ts                    # data models (CMS shape)
  catalog.ts                  # MVP materials + furniture (placeholder data)
  dimensions.ts               # pure math + formatting
  share.ts                    # scene <-> URL, WhatsApp link
  store.ts                    # Zustand scene state

components/simulate/
  SimulationCanvas.tsx        # R3F canvas + scene assembly
  Room.tsx                    # procedural walls/floor/ceiling
  FurnitureModel.tsx          # one placed item + selection box
  CameraRig.tsx               # orbit / walk / top controllers
  Lighting.tsx                # sun + ambient from timeOfDay
  Hud.tsx                     # overlay container
  panels/                     # Materials, Furniture, Lighting, CameraBar

__tests__/                    # Vitest unit + integration suites
```
