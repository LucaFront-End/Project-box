import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';

export type HeroModuleId = 'core' | 'net' | 'sec' | 'pwr';

interface HeroMonolith3DProps {
  focusModule: HeroModuleId;
  isDocked: boolean;
  isExploded: boolean;
  onToggleDock: () => void;
  onSelectModule: (id: HeroModuleId) => void;
  onUserInteract: () => void;
}

const CAMERA_PRESETS: Record<HeroModuleId, { yaw: number; pitch: number }> = {
  core: { yaw: -0.66, pitch: 0.44 },
  net: { yaw: 0.88, pitch: 0.32 },
  sec: { yaw: -0.22, pitch: 0.24 },
  pwr: { yaw: -1.48, pitch: 0.56 },
};

function createBrushedMetalTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 512, 512);
    for (let y = 0; y < 512; y++) {
      const shade = 116 + Math.floor(Math.random() * 26);
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 512, 1);
    }
    for (let i = 0; i < 650; i++) {
      const y = Math.floor(Math.random() * 512);
      const x = Math.floor(Math.random() * 440);
      const w = 24 + Math.floor(Math.random() * 72);
      const v = Math.random() > 0.5 ? 148 : 104;
      ctx.fillStyle = `rgba(${v},${v},${v},0.35)`;
      ctx.fillRect(x, y, w, 1);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(2, 2);
  tex.colorSpace = THREE.NoColorSpace;
  return tex;
}

function tagModule(obj: THREE.Object3D, module: HeroModuleId): void {
  obj.userData.module = module;
  obj.traverse((child) => {
    child.userData.module = module;
  });
}

export const HeroMonolith3D: React.FC<HeroMonolith3DProps> = ({
  focusModule,
  isDocked,
  isExploded,
  onToggleDock,
  onSelectModule,
  onUserInteract,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const propsRef = useRef({
    focusModule,
    isDocked,
    isExploded,
    onToggleDock,
    onSelectModule,
    onUserInteract,
  });
  propsRef.current = {
    focusModule,
    isDocked,
    isExploded,
    onToggleDock,
    onSelectModule,
    onUserInteract,
  };

  const targetAnglesRef = useRef<{ yaw: number; pitch: number }>({
    ...CAMERA_PRESETS[focusModule],
  });
  const dockPulseRef = useRef(0);
  const prevDockedRef = useRef(isDocked);

  useEffect(() => {
    targetAnglesRef.current = { ...CAMERA_PRESETS[focusModule] };
  }, [focusModule]);

  useEffect(() => {
    if (prevDockedRef.current !== isDocked) {
      dockPulseRef.current = 1;
      prevDockedRef.current = isDocked;
    }
  }, [isDocked]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 520;
    const height = container.clientHeight || 480;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.touchAction = 'pan-y';
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(34, width / height, 0.1, 100);
    camera.position.set(0, 0.12, 6.45);
    camera.lookAt(0, 0, 0);

    // Apple Keynote Procedural Studio Softbox Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // Studio Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.15);
    keyLight.position.set(4.5, 7.2, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -2.8;
    keyLight.shadow.camera.right = 2.8;
    keyLight.shadow.camera.top = 2.8;
    keyLight.shadow.camera.bottom = -2.8;
    keyLight.shadow.bias = -0.0005;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdce8ff, 0.95);
    rimLight.position.set(-5.2, 3.6, -4.4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfff5ed, 0.65);
    fillLight.position.set(0, -3.5, 4.0);
    scene.add(fillLight);

    // Transparent Contact Shadow Floor Plane
    const shadowFloorGeo = new THREE.PlaneGeometry(9, 9);
    const shadowFloorMat = new THREE.ShadowMaterial({ opacity: 0.13 });
    const shadowFloor = new THREE.Mesh(shadowFloorGeo, shadowFloorMat);
    shadowFloor.rotation.x = -Math.PI / 2;
    shadowFloor.position.y = -1.36;
    shadowFloor.receiveShadow = true;
    scene.add(shadowFloor);

    // Shared Procedural Anodized Textures & Materials
    const brushedTex = createBrushedMetalTexture();

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x16161a,
      metalness: 0.78,
      roughness: 0.34,
      roughnessMap: brushedTex,
      bumpMap: brushedTex,
      bumpScale: 0.004,
      clearcoat: 0.24,
      clearcoatRoughness: 0.32,
      envMapIntensity: 1.25,
    });

    const darkTitaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x2c2d34,
      metalness: 0.88,
      roughness: 0.28,
      roughnessMap: brushedTex,
      clearcoat: 0.3,
      envMapIntensity: 1.4,
    });

    const brushedSilverMat = new THREE.MeshPhysicalMaterial({
      color: 0xc8ccd4,
      metalness: 0.92,
      roughness: 0.22,
      roughnessMap: brushedTex,
      envMapIntensity: 1.35,
    });

    const orangeCoreMat = new THREE.MeshPhysicalMaterial({
      color: 0xea6b1a,
      metalness: 0.56,
      roughness: 0.26,
      roughnessMap: brushedTex,
      bumpMap: brushedTex,
      bumpScale: 0.003,
      clearcoat: 0.52,
      clearcoatRoughness: 0.18,
      emissive: new THREE.Color(0xea6b1a),
      emissiveIntensity: 0.12,
      envMapIntensity: 1.4,
    });

    const orangeGlowMat = new THREE.MeshStandardMaterial({
      color: 0xff7d29,
      emissive: new THREE.Color(0xea6b1a),
      emissiveIntensity: 2.2,
      roughness: 0.2,
      metalness: 0.2,
    });

    const greenLedMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: new THREE.Color(0x10b981),
      emissiveIntensity: 1.7,
      roughness: 0.2,
    });

    const sapphireGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0b1224,
      metalness: 0.15,
      roughness: 0.04,
      clearcoat: 1.0,
      clearcoatRoughness: 0.04,
      reflectivity: 1.0,
      ior: 1.77,
      envMapIntensity: 2.0,
    });

    const solarGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x0e1015,
      metalness: 0.38,
      roughness: 0.1,
      clearcoat: 1.0,
      clearcoatRoughness: 0.06,
      envMapIntensity: 1.7,
    });

    const cavityMat = new THREE.MeshStandardMaterial({
      color: 0x060608,
      roughness: 0.9,
      metalness: 0.2,
    });

    // Root Orbit Group
    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    // =========================================================================
    // 1. BASE FOUNDATION SLAB (Compute / NVMe / Energy Chassis Base)
    // =========================================================================
    const baseGroup = new THREE.Group();
    baseGroup.position.set(0, -0.56, 0);
    const baseSlab = new THREE.Mesh(
      new RoundedBoxGeometry(2.16, 0.94, 2.16, 5, 0.075),
      obsidianMat,
    );
    baseSlab.castShadow = true;
    baseSlab.receiveShadow = true;
    baseGroup.add(baseSlab);

    // Machined Recessed Trim Line around Base
    const baseBelt = new THREE.Mesh(
      new THREE.BoxGeometry(2.18, 0.025, 2.18),
      darkTitaniumMat,
    );
    baseBelt.position.y = 0.28;
    baseGroup.add(baseBelt);

    // 3 Hot-Swap NVMe Drive Bays on +X Side
    const nvmeLeds: THREE.Mesh[] = [];
    for (let i = 0; i < 3; i++) {
      const zPos = -0.62 + i * 0.62;
      const tray = new THREE.Mesh(
        new RoundedBoxGeometry(0.06, 0.28, 0.5, 2, 0.015),
        darkTitaniumMat,
      );
      tray.position.set(1.07, -0.14, zPos);
      baseGroup.add(tray);

      const handle = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.18, 0.05),
        brushedSilverMat,
      );
      handle.position.set(1.105, -0.14, zPos + 0.16);
      baseGroup.add(handle);

      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.02, 0.035, 0.035),
        i === 1 ? greenLedMat.clone() : orangeGlowMat.clone(),
      );
      led.position.set(1.105, -0.14, zPos - 0.16);
      nvmeLeds.push(led);
      baseGroup.add(led);
    }

    // Precision Perforated Thermal Vents on Front Base (+Z)
    for (let i = 0; i < 8; i++) {
      const fin = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.22, 0.03),
        cavityMat,
      );
      fin.position.set(-0.76 + i * 0.11, -0.16, 1.075);
      baseGroup.add(fin);
    }
    tagModule(baseGroup, 'pwr');
    rootGroup.add(baseGroup);

    // =========================================================================
    // 2. FRONT-LEFT OPTICAL & NETWORK TOWER (-X half, full Z span)
    // =========================================================================
    const frontLeftGroup = new THREE.Group();
    const flBlock = new THREE.Mesh(
      new RoundedBoxGeometry(1.1, 1.12, 2.16, 5, 0.075),
      obsidianMat,
    );
    flBlock.position.set(-0.53, 0.48, 0);
    flBlock.castShadow = true;
    flBlock.receiveShadow = true;
    frontLeftGroup.add(flBlock);

    // +Z Optical 4K Camera Assembly (Security)
    const lensMount = new THREE.Group();
    lensMount.position.set(-0.53, 0.48, 1.08);
    const outerBarrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.36, 0.39, 0.09, 48),
      darkTitaniumMat,
    );
    outerBarrel.rotation.x = Math.PI / 2;
    lensMount.add(outerBarrel);

    const orangeAccentRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.33, 0.014, 16, 64),
      orangeGlowMat,
    );
    orangeAccentRing.position.z = 0.042;
    lensMount.add(orangeAccentRing);

    const innerAperture = new THREE.Mesh(
      new THREE.CylinderGeometry(0.25, 0.25, 0.07, 40),
      cavityMat,
    );
    innerAperture.rotation.x = Math.PI / 2;
    innerAperture.position.z = 0.025;
    lensMount.add(innerAperture);

    const sapphireLens = new THREE.Mesh(
      new THREE.SphereGeometry(0.23, 40, 24, 0, Math.PI * 2, 0, Math.PI * 0.42),
      sapphireGlassMat,
    );
    sapphireLens.rotation.x = Math.PI / 2;
    sapphireLens.position.z = -0.04;
    lensMount.add(sapphireLens);

    const sensorGlowRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.1, 0.008, 12, 40),
      orangeGlowMat,
    );
    sensorGlowRing.position.z = 0.065;
    lensMount.add(sensorGlowRing);

    tagModule(lensMount, 'sec');
    frontLeftGroup.add(lensMount);

    // -X Enterprise 10GbE / SFP+ Switch Bay (Network)
    const switchBay = new THREE.Group();
    switchBay.position.set(-1.08, 0.48, 0);
    const bayPlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.05, 0.56, 1.48, 2, 0.02),
      brushedSilverMat,
    );
    switchBay.add(bayPlate);

    const portLeds: THREE.Mesh[] = [];
    for (let i = 0; i < 6; i++) {
      const pz = -0.56 + i * 0.224;
      const cage = new THREE.Mesh(
        new THREE.BoxGeometry(0.05, 0.16, 0.16),
        cavityMat,
      );
      cage.position.set(-0.02, 0, pz);
      switchBay.add(cage);

      const led = new THREE.Mesh(
        new THREE.BoxGeometry(0.03, 0.03, 0.03),
        i % 2 === 0 ? orangeGlowMat.clone() : greenLedMat.clone(),
      );
      led.position.set(-0.035, 0.13, pz);
      portLeds.push(led);
      switchBay.add(led);
    }

    // Subtle SFP+ Transceiver protruding slightly from slot 0
    const sfpModule = new THREE.Mesh(
      new RoundedBoxGeometry(0.14, 0.12, 0.13, 2, 0.015),
      darkTitaniumMat,
    );
    sfpModule.position.set(-0.08, 0, -0.56);
    switchBay.add(sfpModule);

    tagModule(switchBay, 'net');
    tagModule(flBlock, 'sec');
    frontLeftGroup.add(switchBay);
    rootGroup.add(frontLeftGroup);

    // =========================================================================
    // 3. REAR-RIGHT SOLAR & LIFEPO4 WING (+X half, -Z half)
    // =========================================================================
    const rearRightGroup = new THREE.Group();
    const rrBlock = new THREE.Mesh(
      new RoundedBoxGeometry(1.06, 1.12, 1.1, 5, 0.075),
      obsidianMat,
    );
    rrBlock.position.set(0.55, 0.48, -0.53);
    rrBlock.castShadow = true;
    rrBlock.receiveShadow = true;
    rearRightGroup.add(rrBlock);

    // Top Monocrystalline Solar Photovoltaic Glass Array
    const solarPlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.88, 0.04, 0.92, 2, 0.015),
      solarGlassMat,
    );
    solarPlate.position.set(0.55, 1.045, -0.53);
    rearRightGroup.add(solarPlate);

    for (let i = -1; i <= 1; i++) {
      const bus = new THREE.Mesh(
        new THREE.BoxGeometry(0.86, 0.015, 0.016),
        orangeGlowMat,
      );
      bus.position.set(0.55, 1.065, -0.53 + i * 0.26);
      rearRightGroup.add(bus);
    }

    // +X Right Wall LiFePO4 Energy Stack Bars
    for (let i = 0; i < 4; i++) {
      const bar = new THREE.Mesh(
        new RoundedBoxGeometry(0.04, 0.11, 0.58, 2, 0.01),
        orangeGlowMat,
      );
      bar.position.set(1.08, 0.22 + i * 0.18, -0.53);
      rearRightGroup.add(bar);
    }

    tagModule(rearRightGroup, 'pwr');
    rootGroup.add(rearRightGroup);

    // =========================================================================
    // 4. INTERNAL ENGINEERING PCB CORE (Revealed when isExploded = true)
    // =========================================================================
    const pcbGroup = new THREE.Group();
    const pcbBoard = new THREE.Mesh(
      new RoundedBoxGeometry(1.48, 0.08, 1.48, 3, 0.025),
      darkTitaniumMat,
    );
    pcbGroup.add(pcbBoard);

    const cpuHeatsink = new THREE.Mesh(
      new RoundedBoxGeometry(0.52, 0.16, 0.52, 3, 0.03),
      brushedSilverMat,
    );
    cpuHeatsink.position.y = 0.1;
    pcbGroup.add(cpuHeatsink);

    const pcbRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.46, 0.018, 12, 48),
      orangeGlowMat,
    );
    pcbRing.rotation.x = Math.PI / 2;
    pcbRing.position.y = 0.055;
    pcbGroup.add(pcbRing);

    pcbGroup.position.set(0, 0.08, 0);
    pcbGroup.scale.setScalar(0.001);
    rootGroup.add(pcbGroup);

    // =========================================================================
    // 5. NOTCH DOCKING CRADLE + VERTICAL LASER GUIDES
    // =========================================================================
    const dockPadGroup = new THREE.Group();
    dockPadGroup.position.set(0.57, -0.08, 0.57);

    const cradlePlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.92, 0.04, 0.92, 2, 0.02),
      darkTitaniumMat,
    );
    dockPadGroup.add(cradlePlate);

    const cradleRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.014, 14, 48),
      orangeGlowMat,
    );
    cradleRing.rotation.x = Math.PI / 2;
    cradleRing.position.y = 0.024;
    dockPadGroup.add(cradleRing);

    const laserMat = new THREE.MeshBasicMaterial({
      color: 0xea6b1a,
      transparent: true,
      opacity: 0.42,
    });
    const laserCorners = [
      [-0.36, -0.36],
      [0.36, -0.36],
      [-0.36, 0.36],
      [0.36, 0.36],
    ];
    for (const [lx, lz] of laserCorners) {
      const beam = new THREE.Mesh(
        new THREE.CylinderGeometry(0.006, 0.006, 0.9, 8),
        laserMat,
      );
      beam.position.set(lx, 0.45, lz);
      dockPadGroup.add(beam);
    }
    tagModule(dockPadGroup, 'core');
    rootGroup.add(dockPadGroup);

    // =========================================================================
    // 6. SIGNATURE DETACHED FLOATING SIGNAL ORANGE CORE CUBE
    // =========================================================================
    const coreCubeGroup = new THREE.Group();
    coreCubeGroup.position.set(0.6, 0.96, 0.6);

    const orangeCubeMesh = new THREE.Mesh(
      new RoundedBoxGeometry(0.92, 0.92, 0.92, 5, 0.085),
      orangeCoreMat,
    );
    orangeCubeMesh.castShadow = true;
    orangeCubeMesh.receiveShadow = true;
    coreCubeGroup.add(orangeCubeMesh);

    // Subtle Titanium Collar Frame on Cube Bottom
    const coreCollar = new THREE.Mesh(
      new RoundedBoxGeometry(0.62, 0.04, 0.62, 2, 0.015),
      darkTitaniumMat,
    );
    coreCollar.position.y = -0.45;
    coreCubeGroup.add(coreCollar);

    // Top Precision Indicator Dot
    const coreDot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.075, 0.075, 0.02, 24),
      brushedSilverMat,
    );
    coreDot.position.y = 0.46;
    coreCubeGroup.add(coreDot);

    // Real-Time Warm Orange Point Light illuminating the Obsidian Notch
    const coreGlowLight = new THREE.PointLight(0xea6b1a, 4.2, 4.8, 1.6);
    coreGlowLight.position.set(0, -0.42, 0);
    coreCubeGroup.add(coreGlowLight);

    tagModule(coreCubeGroup, 'core');
    rootGroup.add(coreCubeGroup);

    // Set initial visual isometric orientation
    let curYaw = targetAnglesRef.current.yaw;
    let curPitch = targetAnglesRef.current.pitch;
    rootGroup.rotation.order = 'YXZ';
    rootGroup.rotation.y = curYaw;
    rootGroup.rotation.x = curPitch;

    // =========================================================================
    // POINTER DRAG-TO-ORBIT, HOVER PARALLAX & RAYCASTER CLICK
    // =========================================================================
    const raycaster = new THREE.Raycaster();
    const pointerNdc = new THREE.Vector2();
    let isDragging = false;
    let dragDistance = 0;
    let lastX = 0;
    let lastY = 0;
    let yawVel = 0;
    let pitchVel = 0;
    let hoverCursorX = 0;
    let hoverCursorY = 0;
    let coreHovered = false;

    const dom = renderer.domElement;

    const updateNdc = (clientX: number, clientY: number) => {
      const rect = dom.getBoundingClientRect();
      pointerNdc.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      pointerNdc.y = -((clientY - rect.top) / rect.height) * 2 + 1;
    };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      dragDistance = 0;
      lastX = e.clientX;
      lastY = e.clientY;
      dom.setPointerCapture(e.pointerId);
      dom.style.cursor = 'grabbing';
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      hoverCursorX = (e.clientX - rect.left) / rect.width - 0.5;
      hoverCursorY = (e.clientY - rect.top) / rect.height - 0.5;
      updateNdc(e.clientX, e.clientY);

      if (isDragging) {
        const dx = e.clientX - lastX;
        const dy = e.clientY - lastY;
        dragDistance += Math.hypot(dx, dy);
        lastX = e.clientX;
        lastY = e.clientY;

        yawVel = dx * 0.0085;
        pitchVel = dy * 0.0065;
        targetAnglesRef.current.yaw += yawVel;
        targetAnglesRef.current.pitch = THREE.MathUtils.clamp(
          targetAnglesRef.current.pitch + pitchVel,
          -0.45,
          0.9,
        );

        if (dragDistance > 6) {
          propsRef.current.onUserInteract();
        }
        return;
      }

      // Hover Raycast
      raycaster.setFromCamera(pointerNdc, camera);
      const hits = raycaster.intersectObjects(rootGroup.children, true);
      const hitModule = hits[0]?.object?.userData?.module as HeroModuleId | undefined;
      coreHovered = hitModule === 'core';
      dom.style.cursor = hitModule ? 'pointer' : 'grab';
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer already released
      }
      dom.style.cursor = coreHovered ? 'pointer' : 'grab';

      // Click (not drag) -> raycast target module or dock/undock orange cube
      if (dragDistance < 6) {
        updateNdc(e.clientX, e.clientY);
        raycaster.setFromCamera(pointerNdc, camera);
        const hits = raycaster.intersectObjects(rootGroup.children, true);
        const hitModule = hits[0]?.object?.userData?.module as HeroModuleId | undefined;
        if (hitModule) {
          propsRef.current.onUserInteract();
          if (hitModule === 'core') {
            propsRef.current.onToggleDock();
          } else {
            propsRef.current.onSelectModule(hitModule);
          }
        }
      }
    };

    const onPointerLeave = () => {
      hoverCursorX = 0;
      hoverCursorY = 0;
      coreHovered = false;
      if (!isDragging) dom.style.cursor = 'grab';
    };

    dom.style.cursor = 'grab';
    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('pointerleave', onPointerLeave);

    const onResize = () => {
      const nw = container.clientWidth || 520;
      const nh = container.clientHeight || 480;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    // =========================================================================
    // 60FPS ANIMATION LOOP
    // =========================================================================
    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { isDocked: docked, isExploded: exploded } = propsRef.current;

      // Inertial momentum decay after drag release
      if (!isDragging) {
        targetAnglesRef.current.yaw += yawVel;
        targetAnglesRef.current.pitch = THREE.MathUtils.clamp(
          targetAnglesRef.current.pitch + pitchVel,
          -0.45,
          0.9,
        );
        yawVel *= 0.91;
        pitchVel *= 0.91;
      }

      // Subtle cursor offset + gentle calm breathing on idle
      const desiredYaw =
        targetAnglesRef.current.yaw + (isDragging ? 0 : hoverCursorX * 0.18);
      const desiredPitch =
        targetAnglesRef.current.pitch + (isDragging ? 0 : hoverCursorY * 0.12);

      curYaw += (desiredYaw - curYaw) * 0.085;
      curPitch += (desiredPitch - curPitch) * 0.085;
      rootGroup.rotation.y = curYaw;
      rootGroup.rotation.x = curPitch;

      // Assembly Exploded vs Unified Positions
      const baseTargetY = exploded ? -1.04 : -0.56;
      const flTarget = exploded ? [-0.32, 0.2, 0.3] : [0, 0, 0];
      const rrTarget = exploded ? [0.34, 0.24, -0.34] : [0, 0, 0];
      const pcbScale = exploded ? 1 : 0.001;

      baseGroup.position.y += (baseTargetY - baseGroup.position.y) * 0.1;
      frontLeftGroup.position.x += (flTarget[0] - frontLeftGroup.position.x) * 0.1;
      frontLeftGroup.position.y += (flTarget[1] - frontLeftGroup.position.y) * 0.1;
      frontLeftGroup.position.z += (flTarget[2] - frontLeftGroup.position.z) * 0.1;

      rearRightGroup.position.x += (rrTarget[0] - rearRightGroup.position.x) * 0.1;
      rearRightGroup.position.y += (rrTarget[1] - rearRightGroup.position.y) * 0.1;
      rearRightGroup.position.z += (rrTarget[2] - rearRightGroup.position.z) * 0.1;

      const nextPcbScale = THREE.MathUtils.lerp(pcbGroup.scale.x, pcbScale, 0.1);
      pcbGroup.scale.setScalar(nextPcbScale);
      pcbGroup.position.y = Math.sin(t * 2.0) * 0.02 + 0.08;

      // Floating vs Magnetically Docked Orange Core Cube
      let coreTargetX = 0.6;
      let coreTargetY = 0.98 + Math.sin(t * 2.2) * 0.055;
      let coreTargetZ = 0.6;

      if (exploded) {
        coreTargetX = 0.96;
        coreTargetY = 1.42 + Math.sin(t * 2.2) * 0.05;
        coreTargetZ = 0.96;
      } else if (docked) {
        coreTargetX = 0.56;
        coreTargetY = 0.42;
        coreTargetZ = 0.56;
      }

      coreCubeGroup.position.x += (coreTargetX - coreCubeGroup.position.x) * 0.11;
      coreCubeGroup.position.y += (coreTargetY - coreCubeGroup.position.y) * 0.11;
      coreCubeGroup.position.z += (coreTargetZ - coreCubeGroup.position.z) * 0.11;

      const hoverScale = coreHovered ? 1.05 : 1.0;
      const curScale = THREE.MathUtils.lerp(coreCubeGroup.scale.x, hoverScale, 0.14);
      coreCubeGroup.scale.setScalar(curScale);

      // Laser guide fade when docked or exploded
      const desiredLaserOpacity = docked || exploded ? 0.0 : 0.36 + Math.sin(t * 3) * 0.12;
      laserMat.opacity += (desiredLaserOpacity - laserMat.opacity) * 0.12;

      // Dock energy pulse ripple
      dockPulseRef.current *= 0.93;
      const pulse = dockPulseRef.current;
      orangeCoreMat.emissiveIntensity = 0.12 + pulse * 0.85;
      coreGlowLight.intensity = (docked ? 5.6 : 3.8) + pulse * 4.5;
      orangeGlowMat.emissiveIntensity = 2.0 + pulse * 2.6 + Math.sin(t * 2.4) * 0.25;

      // Subtle living activity flicker on network & NVMe LEDs
      portLeds.forEach((led, idx) => {
        const mat = led.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.3 + Math.max(0, Math.sin(t * 4.2 + idx * 1.9)) * 1.4 + pulse * 2;
      });
      nvmeLeds.forEach((led, idx) => {
        const mat = led.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 1.2 + Math.max(0, Math.cos(t * 3.6 + idx * 2.1)) * 1.5;
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      dom.removeEventListener('pointerdown', onPointerDown);
      dom.removeEventListener('pointermove', onPointerMove);
      dom.removeEventListener('pointerup', onPointerUp);
      dom.removeEventListener('pointercancel', onPointerUp);
      dom.removeEventListener('pointerleave', onPointerLeave);

      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach((m) => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      brushedTex.dispose();
      envRT.dispose();
      renderer.dispose();
      if (dom.parentNode === container) {
        container.removeChild(dom);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <img
          src="/visuals/hero-monolith-4k.webp"
          alt="PROJECT BOX Monolito 4K"
          className="w-[90%] h-[90%] object-contain"
        />
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full relative" />;
};
