import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { VerticalId } from '../../types/commerce';
import { createHardwareTextureSet } from './pbrTextures';

export type Product3DKind =
  | 'cctv'
  | 'access'
  | 'switch'
  | 'solar'
  | 'server'
  | 'radio';

export function resolveProduct3DKind(
  sku: string,
  verticalId: VerticalId,
): Product3DKind {
  const s = sku.toUpperCase();
  if (s.startsWith('ZKT-') || s.startsWith('ACC-')) return 'access';
  if (verticalId === 'seguridad') return 'cctv';
  if (verticalId === 'redes') return 'switch';
  if (verticalId === 'energia') return 'solar';
  if (verticalId === 'radiocom') return 'radio';
  return 'server';
}

interface ProductModel3DProps {
  kind: Product3DKind;
  isExploded?: boolean;
  onInteract?: () => void;
  fallbackImage: string;
  fallbackAlt: string;
}

interface ExplodeTarget {
  obj: THREE.Object3D;
  rest: THREE.Vector3;
  exploded: THREE.Vector3;
}

function addTorxBolt(
  parent: THREE.Object3D,
  x: number,
  y: number,
  z: number,
  mat: THREE.Material,
  rotX = 0,
  rotZ = 0,
): void {
  const bolt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.018, 6),
    mat,
  );
  bolt.position.set(x, y, z);
  bolt.rotation.set(rotX, 0, rotZ);
  parent.add(bolt);
}

export const ProductModel3D: React.FC<ProductModel3DProps> = ({
  kind,
  isExploded = false,
  onInteract,
  fallbackImage,
  fallbackAlt,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const propsRef = useRef({ kind, isExploded, onInteract });
  propsRef.current = { kind, isExploded, onInteract };

  const prevKindRef = useRef<Product3DKind>(kind);
  const switchScaleRef = useRef(1);

  useEffect(() => {
    if (prevKindRef.current !== kind) {
      switchScaleRef.current = 0.85;
      prevKindRef.current = kind;
    }
  }, [kind]);

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

    const width = container.clientWidth || 460;
    const height = container.clientHeight || 360;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.22;
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
    camera.position.set(0, 0.28, 5.25);
    camera.lookAt(0, 0, 0);

    // Apple Keynote Procedural Studio HDRI Environment
    const pmrem = new THREE.PMREMGenerator(renderer);
    const roomEnv = new RoomEnvironment();
    const envRT = pmrem.fromScene(roomEnv, 0.04);
    scene.environment = envRT.texture;
    roomEnv.dispose();
    pmrem.dispose();

    // High-Res 2048 Studio Lighting Rig + Warm Orange Bounce Light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.35);
    keyLight.position.set(4.2, 7.2, 4.8);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    keyLight.shadow.camera.left = -2.8;
    keyLight.shadow.camera.right = 2.8;
    keyLight.shadow.camera.top = 2.8;
    keyLight.shadow.camera.bottom = -2.8;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xdbeafe, 1.05);
    rimLight.position.set(-5.0, 3.6, -4.4);
    scene.add(rimLight);

    const warmFill = new THREE.DirectionalLight(0xfff1e6, 0.72);
    warmFill.position.set(1.5, -2.5, 4.2);
    scene.add(warmFill);

    const orangeAccentLight = new THREE.PointLight(0xea6b1a, 2.8, 4.6, 1.6);
    orangeAccentLight.position.set(0.6, 0.5, 1.4);
    scene.add(orangeAccentLight);

    // Real Ground Contact Shadow Floor
    const floorGeo = new THREE.PlaneGeometry(9, 9);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.15 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.16;
    floor.receiveShadow = true;
    scene.add(floor);

    // High-Resolution Procedural PBR Textures
    const tex = createHardwareTextureSet();

    const obsidianMat = new THREE.MeshPhysicalMaterial({
      color: 0x151519,
      metalness: 0.8,
      roughness: 0.34,
      roughnessMap: tex.brushedMetal,
      bumpMap: tex.brushedMetal,
      bumpScale: 0.005,
      clearcoat: 0.28,
      clearcoatRoughness: 0.28,
      envMapIntensity: 1.35,
    });

    const titaniumMat = new THREE.MeshPhysicalMaterial({
      color: 0x33353e,
      metalness: 0.9,
      roughness: 0.26,
      roughnessMap: tex.brushedMetal,
      clearcoat: 0.32,
      envMapIntensity: 1.5,
    });

    const knurledMat = new THREE.MeshPhysicalMaterial({
      color: 0x2a2c34,
      metalness: 0.9,
      roughness: 0.36,
      bumpMap: tex.knurledMetal,
      bumpScale: 0.025,
      envMapIntensity: 1.45,
    });

    const grilleMat = new THREE.MeshPhysicalMaterial({
      map: tex.perforatedAlbedo,
      bumpMap: tex.perforatedBump,
      bumpScale: 0.024,
      metalness: 0.75,
      roughness: 0.38,
      envMapIntensity: 1.2,
    });

    const silverMat = new THREE.MeshPhysicalMaterial({
      color: 0xd4d8e0,
      metalness: 0.94,
      roughness: 0.2,
      roughnessMap: tex.brushedMetal,
      clearcoat: 0.25,
      envMapIntensity: 1.45,
    });

    const satinWhiteMat = new THREE.MeshPhysicalMaterial({
      color: 0xf4f4f7,
      metalness: 0.08,
      roughness: 0.24,
      clearcoat: 0.5,
      clearcoatRoughness: 0.16,
      envMapIntensity: 1.15,
    });

    const orangeMat = new THREE.MeshPhysicalMaterial({
      color: 0xea6b1a,
      metalness: 0.58,
      roughness: 0.25,
      roughnessMap: tex.brushedMetal,
      clearcoat: 0.55,
      emissive: new THREE.Color(0xea6b1a),
      emissiveIntensity: 0.16,
      envMapIntensity: 1.5,
    });

    const orangeGlowMat = new THREE.MeshStandardMaterial({
      color: 0xff822e,
      emissive: new THREE.Color(0xea6b1a),
      emissiveIntensity: 2.3,
      roughness: 0.18,
      metalness: 0.2,
    });

    const greenLedMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      emissive: new THREE.Color(0x10b981),
      emissiveIntensity: 1.8,
      roughness: 0.2,
    });

    const copperMat = new THREE.MeshPhysicalMaterial({
      color: 0xd97736,
      metalness: 0.92,
      roughness: 0.22,
      envMapIntensity: 1.4,
    });

    const sapphireGlassMat = new THREE.MeshPhysicalMaterial({
      color: 0x091020,
      metalness: 0.12,
      roughness: 0.03,
      clearcoat: 1.0,
      clearcoatRoughness: 0.03,
      reflectivity: 1.0,
      ior: 1.77,
      transparent: true,
      opacity: 0.68,
      envMapIntensity: 2.4,
    });

    const opticalInteriorMat = new THREE.MeshStandardMaterial({
      map: tex.opticalCoating,
      roughness: 0.15,
      metalness: 0.5,
      emissive: new THREE.Color(0x0c1b36),
      emissiveIntensity: 0.45,
    });

    const solarWaferMat = new THREE.MeshPhysicalMaterial({
      map: tex.solarAlbedo,
      roughnessMap: tex.solarRoughness,
      metalness: 0.35,
      roughness: 0.12,
      clearcoat: 1.0,
      clearcoatRoughness: 0.05,
      envMapIntensity: 1.85,
    });

    const oledMat = new THREE.MeshStandardMaterial({
      map: tex.oledScreen,
      emissiveMap: tex.oledScreen,
      emissive: new THREE.Color(0xffffff),
      emissiveIntensity: 1.25,
      roughness: 0.08,
      metalness: 0.1,
    });

    const cavityMat = new THREE.MeshStandardMaterial({
      color: 0x050507,
      roughness: 0.92,
      metalness: 0.15,
    });

    const rootGroup = new THREE.Group();
    scene.add(rootGroup);

    const explodeTargets: ExplodeTarget[] = [];
    const registerExplode = (
      obj: THREE.Object3D,
      rx: number,
      ry: number,
      rz: number,
      ex: number,
      ey: number,
      ez: number,
    ) => {
      obj.position.set(rx, ry, rz);
      explodeTargets.push({
        obj,
        rest: new THREE.Vector3(rx, ry, rz),
        exploded: new THREE.Vector3(ex, ey, ez),
      });
    };

    const models: Record<Product3DKind, THREE.Group> = {
      cctv: new THREE.Group(),
      access: new THREE.Group(),
      switch: new THREE.Group(),
      solar: new THREE.Group(),
      server: new THREE.Group(),
      radio: new THREE.Group(),
    };

    // =========================================================================
    // 1. CCTV: Sculpted Lathe Bell Turret 4K ColorVu + Diamond-Knurled Lens
    // =========================================================================
    {
      const g = models.cctv;

      // Mounting Base Flange + 3 Stainless Hex Bolts + Rear Grommet
      const flange = new THREE.Group();
      const baseRing = new THREE.Mesh(
        new THREE.CylinderGeometry(1.06, 1.14, 0.14, 64),
        titaniumMat,
      );
      baseRing.castShadow = true;
      baseRing.receiveShadow = true;
      flange.add(baseRing);

      const rubberSeal = new THREE.Mesh(
        new THREE.CylinderGeometry(1.08, 1.08, 0.03, 64),
        cavityMat,
      );
      rubberSeal.position.y = -0.075;
      flange.add(rubberSeal);

      for (let i = 0; i < 3; i++) {
        const ang = (i / 3) * Math.PI * 2 + 0.4;
        addTorxBolt(
          flange,
          Math.cos(ang) * 0.94,
          0.075,
          Math.sin(ang) * 0.94,
          silverMat,
        );
      }
      registerExplode(flange, 0, -0.82, 0, 0, -1.16, 0);
      g.add(flange);

      // Sculpted LatheGeometry Bell Housing Shroud
      const shroudPts = [
        new THREE.Vector2(1.05, 0),
        new THREE.Vector2(1.04, 0.14),
        new THREE.Vector2(0.95, 0.34),
        new THREE.Vector2(0.88, 0.56),
        new THREE.Vector2(0.8, 0.56),
        new THREE.Vector2(0.88, 0.12),
      ];
      const shroudMesh = new THREE.Mesh(
        new THREE.LatheGeometry(shroudPts, 64),
        obsidianMat,
      );
      shroudMesh.castShadow = true;
      shroudMesh.receiveShadow = true;
      registerExplode(shroudMesh, 0, -0.74, 0, 0, -0.78, 0);
      g.add(shroudMesh);

      // Internal Optical Sensor PCB (visible in Exploded 3D)
      const sensorPcb = new THREE.Group();
      const board = new THREE.Mesh(
        new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32),
        titaniumMat,
      );
      board.rotation.x = Math.PI / 2;
      sensorPcb.add(board);
      const cmos = new THREE.Mesh(
        new RoundedBoxGeometry(0.32, 0.24, 0.06, 2, 0.015),
        copperMat,
      );
      cmos.position.z = 0.04;
      sensorPcb.add(cmos);
      registerExplode(sensorPcb, 0, 0.08, 0.1, 0, 0.08, 0.42);
      g.add(sensorPcb);

      // Gimballed Matte-Obsidian Sphere Core
      const sphereCore = new THREE.Group();
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.86, 56, 42),
        obsidianMat,
      );
      sphere.castShadow = true;
      sphereCore.add(sphere);

      // Side Gimbal Pivot Screws
      for (const sx of [-0.85, 0.85]) {
        addTorxBolt(sphereCore, sx, 0, 0, silverMat, 0, Math.PI / 2);
      }
      registerExplode(sphereCore, 0, 0.08, 0, 0, -0.05, -0.2);
      g.add(sphereCore);

      // Diamond-Knurled CNC Lens Barrel + Multi-Coated Sapphire Stack
      const lensStack = new THREE.Group();
      const knurledRing = new THREE.Mesh(
        new THREE.CylinderGeometry(0.59, 0.63, 0.26, 56),
        knurledMat,
      );
      knurledRing.rotation.x = Math.PI / 2;
      knurledRing.castShadow = true;
      lensStack.add(knurledRing);

      const silverChamfer = new THREE.Mesh(
        new THREE.TorusGeometry(0.57, 0.016, 14, 64),
        silverMat,
      );
      silverChamfer.position.z = 0.125;
      lensStack.add(silverChamfer);

      const orangeHalo = new THREE.Mesh(
        new THREE.TorusGeometry(0.51, 0.022, 16, 64),
        orangeGlowMat,
      );
      orangeHalo.position.z = 0.135;
      lensStack.add(orangeHalo);

      const deepHood = new THREE.Mesh(
        new THREE.CylinderGeometry(0.46, 0.43, 0.18, 48, 1, true),
        cavityMat,
      );
      deepHood.rotation.x = Math.PI / 2;
      deepHood.position.z = 0.08;
      lensStack.add(deepHood);

      // Multi-Coated Fresnel Interior Optics
      const innerOptic = new THREE.Mesh(
        new THREE.CircleGeometry(0.42, 48),
        opticalInteriorMat,
      );
      innerOptic.position.z = 0.02;
      lensStack.add(innerOptic);

      // 3 Micro Auxiliary IR / ColorVu Warm Fill Lenses inside Bezel
      for (const [ax, ay] of [
        [-0.36, 0.24],
        [0.36, 0.24],
        [0, -0.4],
      ]) {
        const micro = new THREE.Mesh(
          new THREE.CylinderGeometry(0.055, 0.055, 0.04, 24),
          orangeMat,
        );
        micro.rotation.x = Math.PI / 2;
        micro.position.set(ax, ay, 0.11);
        lensStack.add(micro);
      }

      // Outer Convex Sapphire Crystal Lens
      const crystalDome = new THREE.Mesh(
        new THREE.SphereGeometry(0.44, 48, 28, 0, Math.PI * 2, 0, Math.PI * 0.36),
        sapphireGlassMat,
      );
      crystalDome.rotation.x = Math.PI / 2;
      crystalDome.position.z = -0.11;
      lensStack.add(crystalDome);

      registerExplode(lensStack, 0, 0.12, 0.72, 0, 0.16, 1.38);
      g.add(lensStack);
    }

    // =========================================================================
    // 2. ACCESS: ZKTeco Monolithic Facial + Palm Terminal with OLED UI
    // =========================================================================
    {
      const g = models.access;

      // Machined Aluminum Rear Wall Mount Plate with Torx Fasteners
      const mountPlate = new THREE.Group();
      const plate = new THREE.Mesh(
        new RoundedBoxGeometry(0.9, 1.66, 0.09, 4, 0.03),
        silverMat,
      );
      plate.castShadow = true;
      mountPlate.add(plate);
      for (const [bx, by] of [
        [-0.34, 0.68],
        [0.34, 0.68],
        [-0.34, -0.68],
        [0.34, -0.68],
      ]) {
        addTorxBolt(mountPlate, bx, by, -0.048, titaniumMat, Math.PI / 2);
      }
      registerExplode(mountPlate, 0, 0, -0.22, 0, 0, -0.78);
      g.add(mountPlate);

      // Internal Neural SoC Board (revealed on Explode)
      const socBoard = new THREE.Group();
      const pcb = new THREE.Mesh(
        new RoundedBoxGeometry(0.84, 1.56, 0.05, 2, 0.02),
        titaniumMat,
      );
      socBoard.add(pcb);
      const npuChip = new THREE.Mesh(
        new RoundedBoxGeometry(0.36, 0.36, 0.08, 2, 0.02),
        copperMat,
      );
      npuChip.position.z = 0.04;
      socBoard.add(npuChip);
      registerExplode(socBoard, 0, 0, -0.02, 0, 0, 0.06);
      g.add(socBoard);

      // Main Anodized Obsidian Monolith Chassis with Side Light Pipes
      const bodyGroup = new THREE.Group();
      const chassis = new THREE.Mesh(
        new RoundedBoxGeometry(1.04, 1.88, 0.24, 5, 0.065),
        obsidianMat,
      );
      chassis.castShadow = true;
      chassis.receiveShadow = true;
      bodyGroup.add(chassis);

      // Side Status Light Pipes (#EA6B1A)
      for (const sx of [-0.525, 0.525]) {
        const pipe = new THREE.Mesh(
          new RoundedBoxGeometry(0.022, 1.24, 0.045, 2, 0.01),
          orangeGlowMat,
        );
        pipe.position.set(sx, 0.05, 0);
        bodyGroup.add(pipe);
      }
      registerExplode(bodyGroup, 0, 0, 0, 0, 0, -0.22);
      g.add(bodyGroup);

      // Front Sapphire Glass + Dual Cameras + Micro-Perforated Speaker + NFC Plate
      const frontGlass = new THREE.Group();
      const frame = new THREE.Mesh(
        new RoundedBoxGeometry(0.94, 1.76, 0.05, 4, 0.04),
        titaniumMat,
      );
      frontGlass.add(frame);

      const oledDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(0.82, 0.88),
        oledMat,
      );
      oledDisplay.position.set(0, -0.02, 0.03);
      frontGlass.add(oledDisplay);

      // Dual Optical + IR Depth Lenses at Top
      for (const lx of [-0.2, 0.2]) {
        const bezel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.105, 0.115, 0.05, 32),
          knurledMat,
        );
        bezel.rotation.x = Math.PI / 2;
        bezel.position.set(lx, 0.65, 0.022);
        frontGlass.add(bezel);

        const optic = new THREE.Mesh(
          new THREE.CircleGeometry(0.08, 32),
          opticalInteriorMat,
        );
        optic.position.set(lx, 0.65, 0.048);
        frontGlass.add(optic);
      }

      // Micro-Perforated Speaker Grille + NFC / Palm Zone
      const grille = new THREE.Mesh(
        new RoundedBoxGeometry(0.76, 0.24, 0.025, 2, 0.015),
        grilleMat,
      );
      grille.position.set(0, -0.66, 0.025);
      frontGlass.add(grille);

      const nfcRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.07, 0.01, 12, 32),
        orangeGlowMat,
      );
      nfcRing.position.set(0, -0.66, 0.04);
      frontGlass.add(nfcRing);

      registerExplode(frontGlass, 0, 0, 0.14, 0, 0, 0.72);
      g.add(frontGlass);
    }

    // =========================================================================
    // 3. SWITCH: Brushed Aluminum 48P 10G Rack Switch + Fiber Patch + Wi-Fi 7
    // =========================================================================
    const switchPortLeds: THREE.Mesh[] = [];
    {
      const g = models.switch;

      // Bottom Chassis Tray + Ports + OLED + Side Cooling Louvers
      const trayGroup = new THREE.Group();
      const lowerChassis = new THREE.Mesh(
        new RoundedBoxGeometry(2.38, 0.28, 1.38, 4, 0.035),
        silverMat,
      );
      lowerChassis.castShadow = true;
      lowerChassis.receiveShadow = true;
      trayGroup.add(lowerChassis);

      // Slotted Rackmount Ears + Stainless Bolts
      for (const sx of [-1.26, 1.26]) {
        const ear = new THREE.Mesh(
          new RoundedBoxGeometry(0.16, 0.34, 0.05, 2, 0.01),
          silverMat,
        );
        ear.position.set(sx, 0.02, 0.66);
        trayGroup.add(ear);
        addTorxBolt(trayGroup, sx, 0.1, 0.69, titaniumMat, Math.PI / 2);
        addTorxBolt(trayGroup, sx, -0.06, 0.69, titaniumMat, Math.PI / 2);
      }

      // Side Airflow Louvers (10 slots per side)
      for (const sx of [-1.195, 1.195]) {
        for (let l = 0; l < 10; l++) {
          const vent = new THREE.Mesh(
            new THREE.BoxGeometry(0.02, 0.16, 0.045),
            cavityMat,
          );
          vent.position.set(sx, 0.02, -0.45 + l * 0.1);
          trayGroup.add(vent);
        }
      }

      // Front Recessed Dark Fascia + OLED Touchscreen + 16 RJ45 + 4 SFP+
      const fascia = new THREE.Mesh(
        new RoundedBoxGeometry(2.18, 0.24, 0.04, 2, 0.015),
        obsidianMat,
      );
      fascia.position.set(0, 0.02, 0.69);
      trayGroup.add(fascia);

      const switchOled = new THREE.Mesh(
        new THREE.PlaneGeometry(0.28, 0.15),
        oledMat,
      );
      switchOled.position.set(-0.88, 0.02, 0.715);
      trayGroup.add(switchOled);

      for (let col = 0; col < 8; col++) {
        const px = -0.58 + col * 0.155;
        for (const py of [-0.035, 0.07]) {
          const rj45 = new THREE.Mesh(
            new THREE.BoxGeometry(0.11, 0.075, 0.04),
            cavityMat,
          );
          rj45.position.set(px, py, 0.7);
          trayGroup.add(rj45);
        }
        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.03, 0.022, 0.02),
          col % 2 === 0 ? greenLedMat.clone() : orangeGlowMat.clone(),
        );
        led.position.set(px, 0.12, 0.712);
        switchPortLeds.push(led);
        trayGroup.add(led);
      }

      // 4 SFP+ Optical Cages + Inserted Fiber Transceiver
      for (let s = 0; s < 4; s++) {
        const sx = 0.68 + s * 0.125;
        const cage = new THREE.Mesh(
          new THREE.BoxGeometry(0.095, 0.12, 0.045),
          titaniumMat,
        );
        cage.position.set(sx, 0.02, 0.7);
        trayGroup.add(cage);
      }
      const sfpPlug = new THREE.Mesh(
        new RoundedBoxGeometry(0.085, 0.09, 0.18, 2, 0.01),
        silverMat,
      );
      sfpPlug.position.set(0.93, 0.02, 0.78);
      trayGroup.add(sfpPlug);

      registerExplode(trayGroup, 0, -0.32, 0, 0, -0.64, 0);
      g.add(trayGroup);

      // Internal PCB & Copper Heatpipe Assembly (Visible on Explode)
      const internalPcb = new THREE.Group();
      const board = new THREE.Mesh(
        new RoundedBoxGeometry(2.08, 0.04, 1.12, 2, 0.015),
        titaniumMat,
      );
      internalPcb.add(board);
      const heatsink = new THREE.Mesh(
        new RoundedBoxGeometry(0.56, 0.09, 0.56, 2, 0.02),
        copperMat,
      );
      heatsink.position.set(-0.2, 0.06, 0);
      internalPcb.add(heatsink);
      registerExplode(internalPcb, 0, -0.24, 0, 0, -0.02, 0);
      g.add(internalPcb);

      // Brushed Aluminum Top Lid
      const topLid = new THREE.Mesh(
        new RoundedBoxGeometry(2.38, 0.06, 1.38, 3, 0.02),
        silverMat,
      );
      topLid.castShadow = true;
      registerExplode(topLid, 0, -0.15, 0, 0, 0.36, 0);
      g.add(topLid);

      // Sculpted LatheGeometry Wi-Fi 7 Dish + Glowing Fiber Optical Patch Cable
      const apGroup = new THREE.Group();
      const dishPts = [
        new THREE.Vector2(0, -0.06),
        new THREE.Vector2(0.42, -0.06),
        new THREE.Vector2(0.68, 0.02),
        new THREE.Vector2(0.7, 0.06),
        new THREE.Vector2(0.32, 0.11),
        new THREE.Vector2(0, 0.11),
      ];
      const apBody = new THREE.Mesh(
        new THREE.LatheGeometry(dishPts, 56),
        satinWhiteMat,
      );
      apBody.castShadow = true;
      apGroup.add(apBody);

      const apHalo = new THREE.Mesh(
        new THREE.TorusGeometry(0.28, 0.015, 14, 56),
        orangeGlowMat,
      );
      apHalo.rotation.x = Math.PI / 2;
      apHalo.position.y = 0.112;
      apGroup.add(apHalo);

      registerExplode(apGroup, 0.34, 0.34, -0.08, 0.38, 0.92, 0.05);
      g.add(apGroup);

      // Glowing Signal Orange Fiber Optic Patch Cable connecting Switch SFP+ -> AP
      const fiberCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0.93, -0.3, 0.86),
        new THREE.Vector3(1.18, -0.28, 1.06),
        new THREE.Vector3(1.16, 0.04, 0.56),
        new THREE.Vector3(0.56, 0.28, 0.18),
      ]);
      const fiberCable = new THREE.Mesh(
        new THREE.TubeGeometry(fiberCurve, 40, 0.018, 12, false),
        orangeGlowMat,
      );
      registerExplode(fiberCable, 0, 0, 0, 0, 0.25, 0.1);
      g.add(fiberCable);
    }

    // =========================================================================
    // 4. SOLAR: Hybrid Inverter + 3-Tier LiFePO4 + Monocrystalline Solar Wafer
    // =========================================================================
    {
      const g = models.solar;

      // Hybrid Inverter with Side Cooling Fins + OLED Power Gauge + MC4 Glands
      const inverter = new THREE.Group();
      const invChassis = new THREE.Mesh(
        new RoundedBoxGeometry(0.84, 1.18, 0.34, 5, 0.06),
        satinWhiteMat,
      );
      invChassis.castShadow = true;
      inverter.add(invChassis);

      for (const sx of [-0.42, 0.42]) {
        for (let f = 0; f < 8; f++) {
          const fin = new THREE.Mesh(
            new THREE.BoxGeometry(0.04, 0.88, 0.02),
            titaniumMat,
          );
          fin.position.set(sx, 0, -0.11 + f * 0.032);
          inverter.add(fin);
        }
      }

      const invOled = new THREE.Mesh(
        new THREE.PlaneGeometry(0.56, 0.28),
        oledMat,
      );
      invOled.position.set(0, 0.18, 0.174);
      inverter.add(invOled);

      const invRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.095, 0.015, 14, 36),
        orangeGlowMat,
      );
      invRing.position.set(0, -0.22, 0.175);
      inverter.add(invRing);

      // Bottom DC/AC Terminal Glands
      for (const gx of [-0.22, -0.07, 0.07, 0.22]) {
        const gland = new THREE.Mesh(
          new THREE.CylinderGeometry(0.032, 0.032, 0.09, 16),
          copperMat,
        );
        gland.position.set(gx, -0.62, 0);
        inverter.add(gland);
      }

      registerExplode(inverter, -0.7, -0.22, 0.18, -1.14, -0.1, 0.38);
      g.add(inverter);

      // 3-Tier Interlocking LiFePO4 Lithium Modules with Carry Handles & Charge Bars
      for (let tier = 0; tier < 3; tier++) {
        const mod = new THREE.Group();
        const box = new THREE.Mesh(
          new RoundedBoxGeometry(0.94, 0.3, 0.58, 4, 0.045),
          obsidianMat,
        );
        box.castShadow = true;
        box.receiveShadow = true;
        mod.add(box);

        const chargeBar = new THREE.Mesh(
          new RoundedBoxGeometry(0.52, 0.04, 0.03, 2, 0.01),
          orangeGlowMat,
        );
        chargeBar.position.set(0, 0, 0.295);
        mod.add(chargeBar);

        for (const sx of [-0.475, 0.475]) {
          const handle = new THREE.Mesh(
            new RoundedBoxGeometry(0.03, 0.08, 0.24, 2, 0.01),
            silverMat,
          );
          handle.position.set(sx, 0, 0);
          mod.add(handle);
        }

        const baseY = -0.66 + tier * 0.34;
        const expY = -0.84 + tier * 0.56;
        registerExplode(mod, 0.52, baseY, 0.18, 0.72, expY, 0.32);
        g.add(mod);
      }

      // Sculpted Copper Power Conduit linking Inverter -> Battery Bank
      const conduitCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-0.28, -0.58, 0.18),
        new THREE.Vector3(-0.08, -0.62, 0.32),
        new THREE.Vector3(0.06, -0.44, 0.26),
      ]);
      const conduit = new THREE.Mesh(
        new THREE.TubeGeometry(conduitCurve, 28, 0.022, 12, false),
        orangeMat,
      );
      registerExplode(conduit, 0, 0, 0, 0, 0.1, 0.18);
      g.add(conduit);

      // Framed Monocrystalline Half-Cut Bifacial Solar Panel
      const panel = new THREE.Group();
      const frame = new THREE.Mesh(
        new RoundedBoxGeometry(1.62, 1.38, 0.065, 3, 0.02),
        titaniumMat,
      );
      frame.castShadow = true;
      panel.add(frame);

      const waferSurface = new THREE.Mesh(
        new THREE.PlaneGeometry(1.5, 1.26),
        solarWaferMat,
      );
      waferSurface.position.z = 0.036;
      panel.add(waferSurface);

      panel.rotation.x = -0.22;
      registerExplode(panel, 0, 0.24, -0.52, 0, 0.48, -1.04);
      g.add(panel);
    }

    // =========================================================================
    // 5. SERVER: Micro-Perforated Edge Compute Enclosure + 4 Hot-Swap NVMe
    // =========================================================================
    const serverLeds: THREE.Mesh[] = [];
    {
      const g = models.server;

      const chassisGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(1.82, 1.06, 1.56, 4, 0.06),
        obsidianMat,
      );
      body.castShadow = true;
      body.receiveShadow = true;
      chassisGroup.add(body);

      // Side Micro-Perforated Airflow Mesh Panels
      for (const sx of [-0.915, 0.915]) {
        const meshPanel = new THREE.Mesh(
          new THREE.PlaneGeometry(1.22, 0.72),
          grilleMat,
        );
        meshPanel.position.set(sx, 0, 0);
        meshPanel.rotation.y = sx > 0 ? Math.PI / 2 : -Math.PI / 2;
        chassisGroup.add(meshPanel);
      }

      // Brushed Silver Front Trim Frame
      const bezelFrame = new THREE.Mesh(
        new RoundedBoxGeometry(1.78, 1.0, 0.04, 3, 0.02),
        silverMat,
      );
      bezelFrame.position.set(0, 0, 0.77);
      chassisGroup.add(bezelFrame);

      const darkBayRecess = new THREE.Mesh(
        new THREE.BoxGeometry(1.64, 0.86, 0.05),
        cavityMat,
      );
      darkBayRecess.position.set(0, 0, 0.775);
      chassisGroup.add(darkBayRecess);

      registerExplode(chassisGroup, 0, -0.18, 0, 0, -0.34, 0);
      g.add(chassisGroup);

      // Internal Motherboard + Dual Finned Heatsinks (revealed on Explode)
      const mobo = new THREE.Group();
      const moboPlate = new THREE.Mesh(
        new RoundedBoxGeometry(1.48, 0.05, 1.24, 2, 0.015),
        titaniumMat,
      );
      mobo.add(moboPlate);
      for (const hx of [-0.36, 0.36]) {
        const hs = new THREE.Mesh(
          new RoundedBoxGeometry(0.42, 0.2, 0.42, 2, 0.02),
          silverMat,
        );
        hs.position.set(hx, 0.12, -0.1);
        mobo.add(hs);
      }
      const moboTrace = new THREE.Mesh(
        new THREE.BoxGeometry(0.96, 0.02, 0.03),
        orangeGlowMat,
      );
      moboTrace.position.set(0, 0.03, 0.25);
      mobo.add(moboTrace);
      registerExplode(mobo, 0, -0.12, 0, 0, 0.34, 0);
      g.add(mobo);

      // Brushed Top Lid
      const topLid = new THREE.Mesh(
        new RoundedBoxGeometry(1.8, 0.08, 1.54, 3, 0.025),
        titaniumMat,
      );
      registerExplode(topLid, 0, 0.38, 0, 0, 0.96, 0);
      g.add(topLid);

      // 4 Perforated Hot-Swap NVMe Sleds with Silver Latches & Orange Tabs
      for (let i = 0; i < 4; i++) {
        const sled = new THREE.Group();
        const tray = new THREE.Mesh(
          new RoundedBoxGeometry(0.32, 0.72, 1.24, 3, 0.025),
          titaniumMat,
        );
        sled.add(tray);

        const perfFace = new THREE.Mesh(
          new THREE.PlaneGeometry(0.27, 0.56),
          grilleMat,
        );
        perfFace.position.set(0, 0.02, 0.625);
        sled.add(perfFace);

        const latch = new THREE.Mesh(
          new RoundedBoxGeometry(0.24, 0.1, 0.045, 2, 0.015),
          silverMat,
        );
        latch.position.set(0, -0.22, 0.63);
        sled.add(latch);

        const orangeTab = new THREE.Mesh(
          new THREE.BoxGeometry(0.06, 0.06, 0.05),
          orangeMat,
        );
        orangeTab.position.set(0.09, -0.22, 0.632);
        sled.add(orangeTab);

        const led = new THREE.Mesh(
          new THREE.BoxGeometry(0.045, 0.035, 0.025),
          i % 2 === 0 ? orangeGlowMat.clone() : greenLedMat.clone(),
        );
        led.position.set(-0.08, 0.26, 0.63);
        serverLeds.push(led);
        sled.add(led);

        const sx = -0.57 + i * 0.38;
        registerExplode(
          sled,
          sx,
          -0.18,
          0.22,
          sx,
          -0.12 + (i % 2) * 0.08,
          0.78 + i * 0.14,
        );
        g.add(sled);
      }
    }

    // =========================================================================
    // 6. RADIO: Ruggedized DMR Transceiver with Knurled Dials & OLED Wave
    // =========================================================================
    {
      const g = models.radio;

      // Multi-Faceted Obsidian Chassis + Side Elastomer Grip Ribs + PTT Key
      const bodyGroup = new THREE.Group();
      const body = new THREE.Mesh(
        new RoundedBoxGeometry(0.78, 1.48, 0.34, 5, 0.075),
        obsidianMat,
      );
      body.castShadow = true;
      bodyGroup.add(body);

      // Titanium Side Reinforcement Rails
      for (const sx of [-0.39, 0.39]) {
        const rail = new THREE.Mesh(
          new RoundedBoxGeometry(0.03, 1.12, 0.18, 2, 0.01),
          titaniumMat,
        );
        rail.position.set(sx, -0.05, 0);
        bodyGroup.add(rail);
      }

      // 8 Tactile Grip Ribs on Right Flank
      for (let r = 0; r < 6; r++) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(0.04, 0.04, 0.22),
          cavityMat,
        );
        rib.position.set(0.39, -0.45 + r * 0.12, 0);
        bodyGroup.add(rib);
      }

      // Textured Signal Orange PTT Side Key
      const ptt = new THREE.Mesh(
        new RoundedBoxGeometry(0.065, 0.36, 0.16, 2, 0.02),
        orangeMat,
      );
      ptt.position.set(-0.4, 0.12, 0);
      bodyGroup.add(ptt);

      registerExplode(bodyGroup, 0, -0.16, 0, 0, -0.16, 0);
      g.add(bodyGroup);

      // Rear Snap-On Lithium Battery Pack
      const battery = new THREE.Mesh(
        new RoundedBoxGeometry(0.68, 1.16, 0.16, 4, 0.04),
        titaniumMat,
      );
      battery.castShadow = true;
      registerExplode(battery, 0, -0.24, -0.2, 0, -0.24, -0.72);
      g.add(battery);

      // Front Micro-Perforated Speaker Grille + OLED Display + Tactile Keys
      const frontDeck = new THREE.Group();
      const speakerGrille = new THREE.Mesh(
        new RoundedBoxGeometry(0.62, 0.36, 0.03, 2, 0.015),
        grilleMat,
      );
      speakerGrille.position.y = 0.42;
      frontDeck.add(speakerGrille);

      const displayGlass = new THREE.Mesh(
        new RoundedBoxGeometry(0.62, 0.52, 0.035, 2, 0.02),
        sapphireGlassMat,
      );
      displayGlass.position.y = -0.06;
      frontDeck.add(displayGlass);

      const oledDisplay = new THREE.Mesh(
        new THREE.PlaneGeometry(0.54, 0.42),
        oledMat,
      );
      oledDisplay.position.set(0, -0.06, 0.019);
      frontDeck.add(oledDisplay);

      // Minimalist Tactile Navigation Keys below Screen
      for (const kx of [-0.18, 0, 0.18]) {
        const key = new THREE.Mesh(
          new RoundedBoxGeometry(0.14, 0.08, 0.03, 2, 0.01),
          titaniumMat,
        );
        key.position.set(kx, -0.44, 0.012);
        frontDeck.add(key);
      }

      registerExplode(frontDeck, 0, -0.14, 0.17, 0, -0.14, 0.68);
      g.add(frontDeck);

      // Top Deck: Tapered UHF Antenna + Dual Diamond-Knurled Dials + Emergency Key
      const topDeck = new THREE.Group();
      const antennaCollar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.085, 0.09, 0.14, 32),
        knurledMat,
      );
      antennaCollar.position.set(-0.22, 0.06, 0);
      topDeck.add(antennaCollar);

      const antennaMast = new THREE.Mesh(
        new THREE.CylinderGeometry(0.034, 0.07, 0.88, 24),
        obsidianMat,
      );
      antennaMast.position.set(-0.22, 0.54, 0);
      antennaMast.castShadow = true;
      topDeck.add(antennaMast);

      for (const dx of [0.06, 0.26]) {
        const dial = new THREE.Mesh(
          new THREE.CylinderGeometry(0.075, 0.085, 0.16, 32),
          knurledMat,
        );
        dial.position.set(dx, 0.08, 0);
        topDeck.add(dial);
      }

      const emergencyBtn = new THREE.Mesh(
        new THREE.CylinderGeometry(0.045, 0.045, 0.05, 24),
        orangeGlowMat,
      );
      emergencyBtn.position.set(-0.08, 0.025, 0.06);
      topDeck.add(emergencyBtn);

      registerExplode(topDeck, 0, 0.58, 0, 0, 1.12, 0);
      g.add(topDeck);
    }

    (Object.keys(models) as Product3DKind[]).forEach((k) => {
      models[k].visible = k === propsRef.current.kind;
      rootGroup.add(models[k]);
    });

    // =========================================================================
    // 360° INERTIAL DRAG-TO-ORBIT + IDLE TURNTABLE
    // =========================================================================
    let curYaw = -0.58;
    let curPitch = 0.28;
    let targetYaw = curYaw;
    let targetPitch = curPitch;
    let yawVel = 0;
    let pitchVel = 0;
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let hoverX = 0;
    let hoverY = 0;

    rootGroup.rotation.order = 'YXZ';

    const dom = renderer.domElement;
    dom.style.cursor = 'grab';

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      dom.setPointerCapture(e.pointerId);
      dom.style.cursor = 'grabbing';
      propsRef.current.onInteract?.();
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = dom.getBoundingClientRect();
      hoverX = (e.clientX - rect.left) / rect.width - 0.5;
      hoverY = (e.clientY - rect.top) / rect.height - 0.5;

      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;

      yawVel = dx * 0.0095;
      pitchVel = dy * 0.0065;
      targetYaw += yawVel;
      targetPitch = THREE.MathUtils.clamp(targetPitch + pitchVel, -0.35, 0.72);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        dom.releasePointerCapture(e.pointerId);
      } catch {
        // Ignore if pointer already released
      }
      dom.style.cursor = 'grab';
    };

    const onPointerLeave = () => {
      hoverX = 0;
      hoverY = 0;
    };

    dom.addEventListener('pointerdown', onPointerDown);
    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerup', onPointerUp);
    dom.addEventListener('pointercancel', onPointerUp);
    dom.addEventListener('pointerleave', onPointerLeave);

    const onResize = () => {
      const nw = container.clientWidth || 460;
      const nh = container.clientHeight || 360;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', onResize);

    let rafId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      const { kind: activeKind, isExploded: exploded } = propsRef.current;

      (Object.keys(models) as Product3DKind[]).forEach((k) => {
        models[k].visible = k === activeKind;
      });
      switchScaleRef.current = THREE.MathUtils.lerp(
        switchScaleRef.current,
        1.0,
        0.12,
      );
      rootGroup.scale.setScalar(switchScaleRef.current);

      if (!isDragging) {
        targetYaw += 0.0032 + yawVel;
        targetPitch = THREE.MathUtils.clamp(targetPitch + pitchVel, -0.35, 0.72);
        yawVel *= 0.91;
        pitchVel *= 0.91;
      }

      const desiredYaw = targetYaw + (isDragging ? 0 : hoverX * 0.16);
      const desiredPitch = targetPitch + (isDragging ? 0 : hoverY * 0.1);
      curYaw += (desiredYaw - curYaw) * 0.09;
      curPitch += (desiredPitch - curPitch) * 0.09;

      rootGroup.rotation.y = curYaw;
      rootGroup.rotation.x = curPitch;
      rootGroup.position.y = Math.sin(t * 1.8) * 0.028;

      for (const item of explodeTargets) {
        const dest = exploded ? item.exploded : item.rest;
        item.obj.position.lerp(dest, 0.11);
      }

      switchPortLeds.forEach((led, idx) => {
        const m = led.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity =
          1.3 + Math.max(0, Math.sin(t * 4.4 + idx * 1.7)) * 1.6;
      });
      serverLeds.forEach((led, idx) => {
        const m = led.material as THREE.MeshStandardMaterial;
        m.emissiveIntensity =
          1.3 + Math.max(0, Math.cos(t * 3.8 + idx * 2.1)) * 1.6;
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
      tex.dispose();
      envRT.dispose();
      renderer.dispose();
      if (dom.parentNode === container) {
        container.removeChild(dom);
      }
    };
  }, []);

  if (webglFailed) {
    return (
      <div className="w-full h-full flex items-center justify-center p-6">
        <img
          src={fallbackImage}
          alt={fallbackAlt}
          className="w-full max-h-[280px] object-contain"
        />
      </div>
    );
  }

  return <div ref={mountRef} className="w-full h-full relative" />;
};
