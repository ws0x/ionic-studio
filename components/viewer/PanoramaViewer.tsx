"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import * as THREE from "three";
import { useLocale } from "@/lib/i18n";

export interface Hotspot {
  id: string;
  yaw: number; // -180 to 180 degrees
  pitch: number; // -90 to 90 degrees
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  specAr: string;
  specEn: string;
}

export interface PanoramaScene {
  id: string;
  nameAr: string;
  nameEn: string;
  descriptionAr: string;
  descriptionEn: string;
  dayColors: { top: string; mid: string; bottom: string; accent: string };
  nightColors: { top: string; mid: string; bottom: string; accent: string };
  hotspots: Hotspot[];
}

export const PANORAMA_SCENES: PanoramaScene[] = [
  {
    id: "reception",
    nameAr: "صالون الاستقبال والسفرة الملكي",
    nameEn: "Grand Reception & Dining Salon",
    descriptionAr: "تصميم نيو كلاسيك فاخر بألواح رخام ستاتوريو وتجاليد أرو طبيعية وإضاءة سقفية مدروسة",
    descriptionEn: "Luxury neo-classic salon featuring bookmatched Statuario marble and bespoke fluted oak paneling",
    dayColors: { top: "#7fa1c3", mid: "#f5eee6", bottom: "#e3ded8", accent: "#d4af37" },
    nightColors: { top: "#0f172a", mid: "#1e1b18", bottom: "#292524", accent: "#f59e0b" },
    hotspots: [
      {
        id: "stat-marble",
        yaw: 25,
        pitch: -15,
        titleAr: "رخام ستاتوريو إيطالي فاخر",
        titleEn: "Italian Statuario Marble Slabs",
        categoryAr: "الأرضيات والرخام",
        categoryEn: "Flooring & Stone",
        specAr: "ألواح مقاس 240×160 سم مفتوحة العروق (Bookmatch) مع جلي وتلميع إيطالي كريستالي.",
        specEn: "240×160cm large format bookmatched slabs, diamond micro-beveled with Italian crystal polish.",
      },
      {
        id: "cove-light",
        yaw: 160,
        pitch: 24,
        titleAr: "إضاءة غير مباشرة مخفية 3000K",
        titleEn: "Architectural 3000K Warm LED Cove",
        categoryAr: "الإنارة والكهرباء",
        categoryEn: "Lighting Design",
        specAr: "بروفايل ألومنيوم غائر مع شريط ليد عالي النقاء CRI>95 بدون وميض لراحة العين.",
        specEn: "Concealed architectural cove profile with flicker-free CRI>95 continuous strip.",
      },
      {
        id: "oak-wall",
        yaw: -80,
        pitch: -2,
        titleAr: "تجاليد خشب أرو طبيعي مع أبواب مخفية",
        titleEn: "Acoustic Fluted Oak with Flush Doors",
        categoryAr: "التجاليد والنجارة",
        categoryEn: "Joinery & Cladding",
        specAr: "قشرة أرو ماسيف مدهونة بولي يوريثان مطفي مع فواصل شادو جاب ألمنيوم سوداء.",
        specEn: "Solid oak fluted slats treated with matte polyurethane and black shadow gap reveals.",
      },
    ],
  },
  {
    id: "master_suite",
    nameAr: "الجناح الرئيسي وغرفة النوم",
    nameEn: "Executive Master Bedroom Suite",
    descriptionAr: "أجواء فندقية هادئة بأرضيات خشب شيفرون وإضاءات خافتة مدمجة مع دريسنج روم",
    descriptionEn: "Tranquil master sanctuary with chevron engineered timber and integrated walk-in wardrobe",
    dayColors: { top: "#93c5fd", mid: "#fafaf9", bottom: "#d6c7b2", accent: "#b45309" },
    nightColors: { top: "#020617", mid: "#1c1917", bottom: "#27221e", accent: "#fbbf24" },
    hotspots: [
      {
        id: "chevron-wood",
        yaw: -20,
        pitch: -18,
        titleAr: "أرضيات خشب باركيه شيفرون 45°",
        titleEn: "45° Chevron Engineered Hardwood",
        categoryAr: "الأرضيات الخشبية",
        categoryEn: "Timber Flooring",
        specAr: "طبقة خشب طبيعي سماكة 4 مم مع عازل صوتي وطبقة حماية ضد الخدش والأشعة فوق البنفسجية.",
        specEn: "4mm European oak top layer over high-density acoustic underlayment, UV lacquer finish.",
      },
      {
        id: "smart-hvac",
        yaw: 120,
        pitch: 28,
        titleAr: "تكييف كونسيلد مخفي ونظام هواء نقي",
        titleEn: "Concealed Inverter Fan Coil & Linear Slots",
        categoryAr: "التكييف والتهوية",
        categoryEn: "MEP & Climate Control",
        specAr: "جريلات ألومنيوم خطية Slimline بدون براغي ظاهرة مع توزيع هوائي متوازن وهادئ للغاية.",
        specEn: "Architectural frameless linear slot diffusers with variable-speed sound attenuators.",
      },
    ],
  },
  {
    id: "kitchen",
    nameAr: "المطبخ العصري والجزيرة الرخامية",
    nameEn: "Minimalist Island Kitchen",
    descriptionAr: "مطبخ مفتوح بخامات مقاومة للحرارة والزيوت مع أجهزة ألمانية مدمجة وجزيرة كوارتز",
    descriptionEn: "Seamless open kitchen featuring antibacterial quartz waterfall island and concealed appliances",
    dayColors: { top: "#a5f3fc", mid: "#f3f4f6", bottom: "#4b5563", accent: "#0d9488" },
    nightColors: { top: "#0f172a", mid: "#111827", bottom: "#1e293b", accent: "#14b8a6" },
    hotspots: [
      {
        id: "island-quartz",
        yaw: 40,
        pitch: -10,
        titleAr: "جزيرة كوارتز شلال (Waterfall Island)",
        titleEn: "Silestone Antibacterial Quartz Waterfall",
        categoryAr: "المطابخ والرخام",
        categoryEn: "Kitchen Stone",
        specAr: "سطح كوارتز مضاد للبقع والحرارة سماكة 2 سم مع لحامات 45 درجة مخفية بالليزر.",
        specEn: "Non-porous heat and stain-resistant quartz with precision 45-degree mitered waterfall edge.",
      },
      {
        id: "cabinets",
        yaw: -110,
        pitch: 5,
        titleAr: "خزائن مطبخ مات بملمس ناعم مضاد للبصمات",
        titleEn: "Anti-Fingerprint Supermatte Cabinetry",
        categoryAr: "خزائن المطبخ",
        categoryEn: "Cabinetry & Hardware",
        specAr: "خامات Fenix نانو تكنولوجي بمفصلات بلوم نمساوية مدمجة مع نظام فتح باللمس Servo-Drive.",
        specEn: "Thermal-healing nanotech matte laminate with Blum motorized servo-drive touch latches.",
      },
    ],
  },
];

// Generates an equirectangular panoramic canvas texture
function createEquirectangularTexture(
  colors: { top: string; mid: string; bottom: string; accent: string },
  sceneName: string,
  isNight: boolean
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    // 1. Sky / Ceiling to Floor Gradient
    const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    grad.addColorStop(0, colors.top);
    grad.addColorStop(0.48, colors.mid);
    grad.addColorStop(0.52, colors.bottom);
    grad.addColorStop(1, isNight ? "#111" : "#d8d3cd");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // 2. Horizon & Wall Lines
    ctx.strokeStyle = isNight ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, canvas.height * 0.5);
    ctx.lineTo(canvas.width, canvas.height * 0.5);
    ctx.stroke();

    // 3. Panoramic Architectural Pillars & Windows
    const columns = 8;
    const colWidth = canvas.width / columns;
    for (let i = 0; i < columns; i++) {
      const x = i * colWidth;

      // Window view pane (simulating panoramic compound view)
      if (i % 2 === 0) {
        ctx.fillStyle = isNight ? "rgba(2, 6, 23, 0.6)" : "rgba(224, 242, 254, 0.4)";
        ctx.fillRect(x + 40, canvas.height * 0.25, colWidth - 80, canvas.height * 0.25);

        // Window mullions
        ctx.strokeStyle = isNight ? "rgba(100, 116, 139, 0.4)" : "rgba(30, 41, 59, 0.3)";
        ctx.lineWidth = 3;
        ctx.strokeRect(x + 40, canvas.height * 0.25, colWidth - 80, canvas.height * 0.25);

        // Landscape silhouette outside
        ctx.fillStyle = isNight ? "rgba(15, 23, 42, 0.9)" : "rgba(34, 197, 94, 0.15)";
        ctx.beginPath();
        ctx.arc(x + colWidth / 2, canvas.height * 0.5, 45, Math.PI, 0);
        ctx.fill();
      }

      // Vertical architectural wall reveal
      ctx.fillStyle = isNight ? "rgba(30, 27, 75, 0.3)" : "rgba(241, 245, 249, 0.4)";
      ctx.fillRect(x, 0, 15, canvas.height);
    }

    // 4. Floor Grid / Marble Tiles
    ctx.strokeStyle = isNight ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.06)";
    ctx.lineWidth = 1.5;
    for (let y = canvas.height * 0.5; y < canvas.height; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }

    // 5. Ceiling Cove Light Glow
    const glowGrad = ctx.createLinearGradient(0, canvas.height * 0.2, 0, canvas.height * 0.3);
    glowGrad.addColorStop(0, colors.accent);
    glowGrad.addColorStop(1, "transparent");
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, canvas.height * 0.18, canvas.width, canvas.height * 0.08);

    // 6. Watermark Studio Stamp
    ctx.font = "bold 28px 'Inter', sans-serif";
    ctx.fillStyle = isNight ? "rgba(251, 191, 36, 0.25)" : "rgba(180, 83, 9, 0.25)";
    ctx.textAlign = "center";
    ctx.fillText(`IONIC STUDIO 360° · ${sceneName.toUpperCase()}`, canvas.width / 2, canvas.height * 0.88);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.mapping = THREE.EquirectangularReflectionMapping;
  return texture;
}

export function PanoramaViewer({
  onClose,
  initialSceneId = "reception",
}: {
  onClose?: () => void;
  initialSceneId?: string;
}) {
  let locale = "en";
  let tx = (val: { ar: string; en: string }) => val.en;
  try {
    const loc = useLocale();
    locale = loc.locale;
    tx = loc.tx;
  } catch {
    // Graceful fallback outside LocaleProvider
  }

  const mountRef = useRef<HTMLDivElement>(null);

  const [activeSceneId, setActiveSceneId] = useState(initialSceneId);
  const [isNight, setIsNight] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);
  const [selectedHotspot, setSelectedHotspot] = useState<Hotspot | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Screen positions for projected 2D hotspots
  const [hotspotCoords, setHotspotCoords] = useState<{ id: string; x: number; y: number; visible: boolean }[]>([]);

  const currentScene = PANORAMA_SCENES.find((s) => s.id === activeSceneId) || PANORAMA_SCENES[0];

  // Drag interaction state
  const isUserInteractingRef = useRef(false);
  const onPointerDownPointerXRef = useRef(0);
  const onPointerDownPointerYRef = useRef(0);
  const onPointerDownLonRef = useRef(0);
  const onPointerDownLatRef = useRef(0);
  const lonRef = useRef(0);
  const latRef = useRef(0);
  const fovRef = useRef(75);

  // Three.js instances
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sphereMeshRef = useRef<THREE.Mesh | null>(null);

  // Calculate 2D screen positions of hotspots
  const updateHotspotScreenPositions = useCallback(() => {
    if (!cameraRef.current || !mountRef.current) return;
    const camera = cameraRef.current;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const coords = currentScene.hotspots.map((h) => {
      // Convert yaw/pitch to 3D Cartesian coordinates on sphere radius 450
      const phi = THREE.MathUtils.degToRad(90 - h.pitch);
      const theta = THREE.MathUtils.degToRad(h.yaw);
      const radius = 450;

      const vec = new THREE.Vector3(
        radius * Math.sin(phi) * Math.sin(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.cos(theta)
      );

      // Check if point is in front of camera
      const dir = vec.clone().sub(camera.position).normalize();
      const dot = camera.getWorldDirection(new THREE.Vector3()).dot(dir);

      vec.project(camera);

      const x = ((vec.x + 1) * width) / 2;
      const y = ((-vec.y + 1) * height) / 2;

      return {
        id: h.id,
        x,
        y,
        visible: dot > 0.3 && x >= 0 && x <= width && y >= 0 && y <= height,
      };
    });

    setHotspotCoords(coords);
  }, [currentScene]);

  // Texture update on scene / day-night change
  useEffect(() => {
    if (!sphereMeshRef.current) return;
    const colors = isNight ? currentScene.nightColors : currentScene.dayColors;
    const newTexture = createEquirectangularTexture(colors, currentScene.nameEn, isNight);

    const mat = sphereMeshRef.current.material as THREE.MeshBasicMaterial;
    if (mat.map) mat.map.dispose();
    mat.map = newTexture;
    mat.needsUpdate = true;
  }, [currentScene, isNight]);

  // Main Three.js setup & render loop
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 500;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(fovRef.current, width / height, 1, 1100);
    cameraRef.current = camera;


    // 2. Spherical Geometry (Inverted normal for interior view)
    const geometry = new THREE.SphereGeometry(500, 60, 40);
    geometry.scale(-1, 1, 1);

    const colors = isNight ? currentScene.nightColors : currentScene.dayColors;
    const texture = createEquirectangularTexture(colors, currentScene.nameEn, isNight);

    const material = new THREE.MeshBasicMaterial({ map: texture });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);
    sphereMeshRef.current = mesh;

    // 3. Renderer with high performance & graceful fallback
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    } catch (e) {
      console.warn("WebGL not supported, falling back:", e);
      return;
    }

    // 4. Pointer Interaction Handlers
    const onPointerDown = (e: PointerEvent) => {
      if (e.target !== renderer.domElement) return;
      isUserInteractingRef.current = true;
      onPointerDownPointerXRef.current = e.clientX;
      onPointerDownPointerYRef.current = e.clientY;
      onPointerDownLonRef.current = lonRef.current;
      onPointerDownLatRef.current = latRef.current;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isUserInteractingRef.current) return;
      lonRef.current =
        (onPointerDownPointerXRef.current - e.clientX) * 0.18 + onPointerDownLonRef.current;
      latRef.current =
        (e.clientY - onPointerDownPointerYRef.current) * 0.18 + onPointerDownLatRef.current;
    };

    const onPointerUp = () => {
      isUserInteractingRef.current = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      fovRef.current = THREE.MathUtils.clamp(fovRef.current + e.deltaY * 0.05, 40, 85);
      if (cameraRef.current) {
        cameraRef.current.fov = fovRef.current;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const onResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    window.addEventListener("resize", onResize);
    container.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);
    container.addEventListener("wheel", onWheel, { passive: false });

    // 5. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (autoRotate && !isUserInteractingRef.current) {
        lonRef.current += 0.08;
      }

      latRef.current = Math.max(-85, Math.min(85, latRef.current));
      const phi = THREE.MathUtils.degToRad(90 - latRef.current);
      const theta = THREE.MathUtils.degToRad(lonRef.current);

      const targetX = 500 * Math.sin(phi) * Math.cos(theta);
      const targetY = 500 * Math.cos(phi);
      const targetZ = 500 * Math.sin(phi) * Math.sin(theta);

      camera.lookAt(targetX, targetY, targetZ);
      renderer.render(scene, camera);

      updateHotspotScreenPositions();
    };

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", onResize);
      container.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      container.removeEventListener("wheel", onWheel);

      if (renderer.domElement && renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [autoRotate, isNight, currentScene, updateHotspotScreenPositions]);

  const handleZoom = (direction: "in" | "out") => {
    fovRef.current = THREE.MathUtils.clamp(
      fovRef.current + (direction === "in" ? -10 : 10),
      40,
      85
    );
    if (cameraRef.current) {
      cameraRef.current.fov = fovRef.current;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const handleResetCamera = () => {
    lonRef.current = 0;
    latRef.current = 0;
    fovRef.current = 75;
    if (cameraRef.current) {
      cameraRef.current.fov = 75;
      cameraRef.current.updateProjectionMatrix();
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      mountRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  return (
    <div
      className={`relative w-full overflow-hidden bg-stone-950 select-none ${
        isFullscreen ? "h-screen" : "h-[560px] sm:h-[640px] rounded-3xl border border-stone-800"
      }`}
    >
      {/* 3D Canvas Mounting Container */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Interactive 2D Screen Hotspot Markers */}
      <div className="absolute inset-0 pointer-events-none">
        {hotspotCoords.map((coord) => {
          if (!coord.visible) return null;
          const hotspot = currentScene.hotspots.find((h) => h.id === coord.id);
          if (!hotspot) return null;

          return (
            <div
              key={coord.id}
              style={{
                left: `${coord.x}px`,
                top: `${coord.y}px`,
                transform: "translate(-50%, -50%)",
              }}
              className="absolute pointer-events-auto group cursor-pointer"
              onClick={() => setSelectedHotspot(hotspot)}
            >
              <div className="relative flex items-center justify-center">
                <div className="absolute w-8 h-8 rounded-full bg-amber-400/20 animate-ping" />
                <div className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold shadow-lg border border-amber-300">
                  ✦
                </div>
              </div>

              {/* Tooltip Badge */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-stone-950/90 text-stone-100 border border-stone-700 px-3 py-1.5 rounded-xl shadow-xl text-xs whitespace-nowrap z-20 pointer-events-none">
                <span className="font-semibold block text-amber-300">
                  {locale === "ar" ? hotspot.titleAr : hotspot.titleEn}
                </span>
                <span className="text-[10px] text-stone-400 block">
                  {locale === "ar" ? hotspot.categoryAr : hotspot.categoryEn}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Top Floating Control Bar */}
      <div className="absolute top-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        <div className="pointer-events-auto flex items-center gap-2 bg-stone-950/80 backdrop-blur-md border border-stone-800 p-1.5 rounded-2xl shadow-xl">
          {/* Room Scene Selector */}
          {PANORAMA_SCENES.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setActiveSceneId(scene.id);
                setSelectedHotspot(null);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer ${
                activeSceneId === scene.id
                  ? "bg-amber-500 text-stone-950 font-semibold shadow-md shadow-amber-500/20"
                  : "text-stone-300 hover:text-white hover:bg-stone-800/60"
              }`}
            >
              {locale === "ar" ? scene.nameAr : scene.nameEn}
            </button>
          ))}
        </div>

        <div className="pointer-events-auto flex items-center gap-2">
          {/* Day / Night Toggle */}
          <button
            onClick={() => setIsNight(!isNight)}
            title={tx({ ar: "تبديل الإضاءة (نهاري / ليلي)", en: "Toggle Daylight / Evening Mood" })}
            className="flex items-center gap-1.5 px-3 py-2 bg-stone-950/80 backdrop-blur-md border border-stone-800 hover:border-amber-400/40 text-stone-200 rounded-xl text-xs font-medium transition cursor-pointer shadow-xl"
          >
            <span>{isNight ? "🌙" : "☀️"}</span>
            <span className="hidden sm:inline">
              {isNight ? tx({ ar: "أجواء ليلية", en: "Evening Glow" }) : tx({ ar: "ضوء نهاري", en: "Daylight" })}
            </span>
          </button>

          {/* Close button if presented in modal */}
          {onClose && (
            <button
              onClick={onClose}
              className="p-2 bg-stone-950/80 backdrop-blur-md border border-stone-800 hover:border-red-400 text-stone-300 hover:text-white rounded-xl text-xs transition cursor-pointer shadow-xl"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Bottom Floating Control Bar */}
      <div className="absolute bottom-4 inset-x-4 flex items-center justify-between pointer-events-none z-10">
        {/* Scene Info Snippet */}
        <div className="pointer-events-auto hidden sm:block bg-stone-950/80 backdrop-blur-md border border-stone-800 px-4 py-2 rounded-2xl shadow-xl max-w-sm">
          <div className="text-xs font-medium text-stone-200">
            {locale === "ar" ? currentScene.nameAr : currentScene.nameEn}
          </div>
          <div className="text-[11px] text-stone-400 line-clamp-1">
            {locale === "ar" ? currentScene.descriptionAr : currentScene.descriptionEn}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pointer-events-auto flex items-center gap-1.5 bg-stone-950/80 backdrop-blur-md border border-stone-800 p-1.5 rounded-2xl shadow-xl ms-auto">
          {/* Auto Rotate Toggle */}
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            title={autoRotate ? "Pause Auto-Rotation" : "Start Auto-Rotation"}
            className={`p-2 rounded-xl text-xs transition cursor-pointer ${
              autoRotate ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>

          {/* Zoom In */}
          <button
            onClick={() => handleZoom("in")}
            title="Zoom In"
            className="p-2 text-stone-400 hover:text-stone-200 rounded-xl text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>

          {/* Zoom Out */}
          <button
            onClick={() => handleZoom("out")}
            title="Zoom Out"
            className="p-2 text-stone-400 hover:text-stone-200 rounded-xl text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          {/* Reset Camera */}
          <button
            onClick={handleResetCamera}
            title="Reset Angle"
            className="p-2 text-stone-400 hover:text-stone-200 rounded-xl text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3" />
            </svg>
          </button>

          {/* Fullscreen */}
          <button
            onClick={toggleFullscreen}
            title="Toggle Fullscreen"
            className="p-2 text-stone-400 hover:text-stone-200 rounded-xl text-xs transition cursor-pointer"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1v4m0 0h-4m4 0l-5-5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Selected Hotspot Material Detail Modal */}
      {selectedHotspot && (
        <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setSelectedHotspot(null)}
              className="absolute top-4 end-4 text-stone-400 hover:text-stone-200 cursor-pointer text-sm"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] uppercase tracking-wider text-amber-400 font-semibold block mb-1">
                {locale === "ar" ? selectedHotspot.categoryAr : selectedHotspot.categoryEn}
              </span>
              <h3 className="text-lg font-medium text-stone-100">
                {locale === "ar" ? selectedHotspot.titleAr : selectedHotspot.titleEn}
              </h3>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed bg-stone-950/60 p-3.5 rounded-xl border border-stone-800">
              {locale === "ar" ? selectedHotspot.specAr : selectedHotspot.specEn}
            </p>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedHotspot(null)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-xs rounded-xl transition cursor-pointer"
              >
                {tx({ ar: "متابعة الجولة", en: "Continue Tour" })}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
