"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer, RoundedBox, useTexture } from "@react-three/drei";
import { slides } from "@/components/home/slides";

/**
 * 3D 디스플레이. 화면에는 지금까지 만든 것들이 차례로 켜진다.
 *
 * 요즘 디스플레이처럼 만든다 — 얇은 알루미늄 판, 아주 가는 검은 테두리, 뒤로 기운 판 하나짜리 받침.
 * 두꺼운 플라스틱 몸체에 굵은 테두리를 두면 오래된 사무용 모니터로 읽힌다.
 * 질감은 조명판의 반사와 부드러운 빛 두 개에서 나온다. 물건이 몇 개뿐이라 내장 그래픽에서도 60프레임이다.
 * 커서 쪽으로 아주 살짝 고개를 돌린다. 물건이 놓여 있다는 느낌이면 충분하다.
 */

/**
 * 은색 알루미늄. 금속감을 끝까지 올리면 비출 것이 없는 어두운 공간에서 검은 쇳덩이가 된다.
 * 반쯤만 금속으로 두고 부드러운 빛을 받게 해서 은색이 살아 있게 한다.
 */
const ALU = { color: "#d7dade", metalness: 0.55, roughness: 0.34 } as const;
/** 화면은 스크린샷과 같은 16:10 — 작업 화면이 잘리지 않는다. */
const SCREEN_W = 3.28;
const SCREEN_H = 2.05;
const BEZEL = 0.045;
const PANEL_W = SCREEN_W + BEZEL * 2;
const PANEL_H = SCREEN_H + BEZEL * 2;
const DEPTH = 0.07;
const FRONT = DEPTH / 2 + 0.001;

/** 페이지 전체의 커서 위치를, 캔버스 중심 기준 -1~1로. */
function usePagePointer(el: React.RefObject<HTMLElement | null>) {
  const p = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      const r = el.current?.getBoundingClientRect();
      if (!r) return;
      const x = (e.clientX - (r.left + r.width / 2)) / (window.innerWidth / 2);
      const y = (e.clientY - (r.top + r.height / 2)) / (window.innerHeight / 2);
      p.current.x = THREE.MathUtils.clamp(x, -1, 1);
      p.current.y = THREE.MathUtils.clamp(y, -1, 1);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [el]);
  return p;
}

/** 화면 위를 비스듬히 지나가는 유리 반사. */
function useGlass() {
  return useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 256;
    c.height = 256;
    const g = c.getContext("2d")!;
    const grad = g.createLinearGradient(0, 0, 256, 256);
    grad.addColorStop(0, "rgba(255,255,255,0.12)");
    grad.addColorStop(0.34, "rgba(255,255,255,0.03)");
    grad.addColorStop(0.35, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 256, 256);
    return new THREE.CanvasTexture(c);
  }, []);
}

/** 스크린샷을 1024 폭으로 줄이고, 화면 비율에 맞춰 위쪽 기준으로 자른다(object-cover). */
function prepare(t: THREE.Texture) {
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  const img = t.image as HTMLImageElement;
  let w = img.width;
  let h = img.height;
  if (w > 1024) {
    const c = document.createElement("canvas");
    c.width = 1024;
    c.height = Math.round((h * 1024) / w);
    c.getContext("2d")!.drawImage(img, 0, 0, c.width, c.height);
    t.image = c;
    t.needsUpdate = true;
    w = c.width;
    h = c.height;
  }
  const screen = SCREEN_W / SCREEN_H;
  const ratio = w / h;
  if (ratio > screen) {
    t.repeat.set(screen / ratio, 1);
    t.offset.set((1 - screen / ratio) / 2, 0);
  } else {
    t.repeat.set(1, ratio / screen);
    t.offset.set(0, 1 - ratio / screen);
  }
}

/** 화면. 장마다 판을 한 장씩 겹쳐 두고, 지금 차례인 판만 밝힌다. */
function Screen({ index, onReady }: { index: number; onReady: () => void }) {
  const textures = useTexture(
    slides.map((s) => s.src),
    (loaded) => (Array.isArray(loaded) ? loaded : [loaded]).forEach(prepare),
  ) as THREE.Texture[];
  const mats = useRef<(THREE.MeshBasicMaterial | null)[]>([]);

  // 여기까지 왔으면 텍스처가 다 올라온 것이다. 그때 2D에서 바꿔 끼운다.
  useEffect(() => onReady(), [onReady]);

  useFrame((_, dt) => {
    mats.current.forEach((m, i) => {
      if (m) m.opacity = THREE.MathUtils.damp(m.opacity, i === index ? 1 : 0, 7, dt);
    });
  });

  return (
    <>
      {textures.map((t, i) => (
        <mesh key={slides[i].slug} position={[0, 0, FRONT + 0.002 + i * 0.0004]} renderOrder={i}>
          <planeGeometry args={[SCREEN_W, SCREEN_H]} />
          <meshBasicMaterial
            ref={(m) => {
              mats.current[i] = m;
            }}
            map={t}
            transparent
            opacity={i === index ? 1 : 0}
            depthWrite={false}
            toneMapped={false}
          />
        </mesh>
      ))}
    </>
  );
}

function Monitor({
  pointer,
  index,
  onReady,
  onOpen,
}: {
  pointer: React.RefObject<{ x: number; y: number }>;
  index: number;
  onReady: () => void;
  onOpen: () => void;
}) {
  const root = useRef<THREE.Group>(null);
  const glass = useGlass();

  useFrame((state, dt) => {
    const g = root.current;
    if (!g) return;
    const { x, y } = pointer.current;
    g.rotation.y = THREE.MathUtils.damp(g.rotation.y, x * 0.22, 3, dt);
    g.rotation.x = THREE.MathUtils.damp(g.rotation.x, y * 0.08, 3, dt);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.035;
  });

  return (
    <group ref={root} onClick={onOpen}>
      {/* 판. 옆과 뒤는 알루미늄 */}
      <RoundedBox args={[PANEL_W + 0.012, PANEL_H + 0.012, DEPTH]} radius={0.03} smoothness={4}>
        <meshStandardMaterial {...ALU} />
      </RoundedBox>

      {/* 앞면 유리. 가는 검은 테두리가 여기서 나온다 */}
      <mesh position={[0, 0, FRONT]}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshStandardMaterial color="#050506" metalness={0.2} roughness={0.15} />
      </mesh>

      {/* 꺼진 화면 바탕 — 첫 장이 뜨기 전, 장이 바뀌는 사이 */}
      <mesh position={[0, 0, FRONT + 0.001]}>
        <planeGeometry args={[SCREEN_W, SCREEN_H]} />
        <meshBasicMaterial color="#0c0d10" />
      </mesh>

      <Suspense fallback={null}>
        <Screen index={index} onReady={onReady} />
      </Suspense>

      {/* 유리 반사 */}
      <mesh position={[0, 0, FRONT + 0.01]} renderOrder={20}>
        <planeGeometry args={[PANEL_W, PANEL_H]} />
        <meshBasicMaterial map={glass} transparent depthWrite={false} />
      </mesh>

      {/* 받침. 판 뒤에서 내려와 뒤로 기운 알루미늄 한 장, 바닥에 닿는 발판 한 장 */}
      <mesh position={[0, -1.02, -0.3]} rotation={[-0.2, 0, 0]}>
        <boxGeometry args={[0.72, 1.55, 0.04]} />
        <meshStandardMaterial {...ALU} />
      </mesh>
      <mesh position={[0, -1.79, -0.36]}>
        <boxGeometry args={[0.82, 0.035, 0.95]} />
        <meshStandardMaterial {...ALU} />
      </mesh>
    </group>
  );
}

export default function Monitor3D({
  active,
  index,
  onReady,
  onOpen,
}: {
  active: boolean;
  index: number;
  onReady: () => void;
  onOpen: () => void;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const pointer = usePagePointer(wrap);

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={active ? "always" : "never"}
        gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.35, 8.8], fov: 30 }}
        style={{ cursor: "pointer" }}
      >
        {/* 스튜디오 조명판. 몸체의 광택이 전부 이 반사에서 나온다. 한 번만 굽는다. */}
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={3} position={[0, 5, 2]} rotation-x={Math.PI / 2} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1.6} position={[-5, 1, 3]} rotation-y={Math.PI / 2.4} scale={[4, 6, 1]} />
          <Lightformer form="rect" intensity={1.1} color="#ffb48a" position={[5, 0, 2]} rotation-y={-Math.PI / 2.4} scale={[3, 6, 1]} />
          <Lightformer form="ring" intensity={0.8} position={[0, 0, 6]} scale={3} />
        </Environment>
        {/* 은색이 살 만큼의 부드러운 빛. 물건 몇 개짜리 작은 화면이라 두 개로는 부담이 없다. */}
        <ambientLight intensity={0.7} />
        <directionalLight position={[2.5, 4, 5]} intensity={1.4} />
        <Monitor pointer={pointer} index={index} onReady={onReady} onOpen={onOpen} />
        <ContactShadows position={[0, -1.81, 0]} opacity={0.4} scale={9} blur={2.6} far={2.5} frames={1} />
      </Canvas>
    </div>
  );
}
