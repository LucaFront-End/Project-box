import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import { createHardwareTextureSet, HardwareTextureSet } from './pbrTextures';

export type Product3DKind =
  | 'cctv'
  | 'access'
  | 'switch'
  | 'solar'
  | 'server'
  | 'radio';

export interface ProductSlider3DProps {
  kind: Product3DKind;
  /** Unique slide identifier (SKU + index) so re-selecting or advancing always triggers the 3D transition */
  slideKey: string;
  /** Fires once when the user starts dragging the 3D model */
  onInteract?: () => void;
  fallbackImage?: string;
  fallbackAlt?: string;
  className?: string;
}

export function resolveProduct3DKind(sku: string, verticalId: string): Product3DKind {
  const s = sku.toUpperCase();
  if (s.includes('ZKT') || s.includes('SPEEDFACE') || s.includes('ACCESS')) return 'access';
  if (s.includes('SYN') || s.includes('RACK') || s.includes('NAS') || s.includes('DELL'))
    return 'server';
  if (s.includes('HYT') || s.includes('MOT') || s.includes('RADIO') || verticalId === 'radiocom')
    return 'radio';
  if (s.includes('INV') || s.includes('BATT') || s.includes('SOLAR') || verticalId === 'energia')
    return 'solar';
  if (s.includes('USW') || s.includes('SFP') || s.includes('SW') || verticalId === 'redes')
    return 'switch';
  if (verticalId === 'computo') return 'server';
  return 'cctv';
}

function easeOutCubic(t: number): number {
  return 1 - Math.pow(1 - t, 3);
}

function easeInCubic(t: number): number {
  return t * t * t;
}

function disposeGroup(root: THREE.Object3D) {
  root.traverse((obj) => {
    if (obj instanceof THREE.Mesh) {
      obj.geometry?.dispose();
    }
  });
}

function createStudioSoftboxEnvironment(renderer: THREE.WebGLRenderer): THREE.Texture {
  const envScene = new THREE.Scene();
  envScene.background = new THREE.Color(0x0b0d12);

  const panels: {
    rgb: [number, number, number];
    pos: [number, number, number];
    size: [number, number];
  }[] = [
    // Overhead wide white key softbox
    { rgb: [3.2, 3.2, 3.2], pos: [0, 7.5, 2.5], size: [11, 4.5] },
    // Front-left cool studio reflector
    { rgb: [2.4, 2.6, 3.0], pos: [-8, 3.2, 4.5], size: [4.5, 8] },
    // Back-right warm accent strip
    { rgb: [2.6, 2.2, 1.9], pos: [8.5, 2.8, -5.0], size: [5.0, 7.0] },
    // Rear top rim strip
    { rgb: [2.4, 2.6, 2.9], pos: [0, 5.5, -8.5], size: [12, 2.2] },
    // Soft lower bounce plane
    { rgb: [0.85, 0.9, 0.95], pos: [0, -6.5, 0], size: [14, 14] },
  ];

  const tempGeos: THREE.BufferGeometry[] = [];
  const tempMats: THREE.Material[] = [];

  for (const p of panels) {
    const geo = new THREE.PlaneGeometry(p.size[0], p.size[1]);
    const color = new THREE.Color().setRGB(p.rgb[0], p.rgb[1], p.rgb[2], THREE.LinearSRGBColorSpace);
    const mat = new THREE.MeshBasicMaterial({
      color,
      toneMapped: false,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(p.pos[0], p.pos[1], p.pos[2]);
    mesh.lookAt(0, 0, 0);
    envScene.add(mesh);
    tempGeos.push(geo);
    tempMats.push(mat);
  }

  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileCubemapShader();
  const envRT = pmrem.fromScene(envScene, 0.03);

  tempGeos.forEach((g) => g.dispose());
  tempMats.forEach((m) => m.dispose());
  pmrem.dispose();

  return envRT.texture;
}

function makeMaterialLibrary() {
  const textures: HardwareTextureSet = createHardwareTextureSet();

  const obsidianAnodized = new THREE.MeshPhysicalMaterial({
    color: 0x16181e,
    metalness: 0.82,
    roughness: 0.3,
    roughnessMap: textures.brushedMetal,
    bumpMap: textures.beadBlastedBump,
    bumpScale: 0.004,
    clearcoat: 0.34,
    clearcoatRoughness: 0.24,
    envMapIntensity: 1.55,
  });

  const darkTitanium = new THREE.MeshPhysicalMaterial({
    color: 0x2c303a,
    metalness: 0.9,
    roughness: 0.25,
    roughnessMap: textures.brushedMetal,
    bumpMap: textures.beadBlastedBump,
    bumpScale: 0.003,
    clearcoat: 0.26,
    envMapIntensity: 1.65,
  });

  const titaniumSilver = new THREE.MeshPhysicalMaterial({
    color: 0xd0d5de,
    metalness: 0.93,
    roughness: 0.2,
    roughnessMap: textures.brushedMetal,
    bumpMap: textures.brushedMetal,
    bumpScale: 0.003,
    clearcoat: 0.22,
    clearcoatRoughness: 0.16,
    envMapIntensity: 1.7,
  });

  const radialMachinedMetal = new THREE.MeshPhysicalMaterial({
    color: 0x3b404c,
    metalness: 0.92,
    roughness: 0.24,
    bumpMap: textures.radialLatheBump,
    bumpScale: 0.007,
    envMapIntensity: 1.8,
  });

  const architecturalWhite = new THREE.MeshPhysicalMaterial({
    color: 0xf4f5f8,
    metalness: 0.08,
    roughness: 0.22,
    bumpMap: textures.beadBlastedBump,
    bumpScale: 0.002,
    clearcoat: 0.58,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.45,
  });

  const copperAccent = new THREE.MeshPhysicalMaterial({
    color: 0xf26f1d,
    metalness: 0.68,
    roughness: 0.22,
    roughnessMap: textures.brushedMetal,
    clearcoat: 0.54,
    clearcoatRoughness: 0.14,
    envMapIntensity: 1.65,
  });

  const stainlessSteel = new THREE.MeshPhysicalMaterial({
    color: 0xe2e6ee,
    metalness: 0.96,
    roughness: 0.15,
    envMapIntensity: 1.85,
  });

  const mattePolymer = new THREE.MeshStandardMaterial({
    color: 0x101216,
    metalness: 0.06,
    roughness: 0.82,
    bumpMap: textures.beadBlastedBump,
    bumpScale: 0.005,
    envMapIntensity: 0.9,
  });

  const darkRecess = new THREE.MeshStandardMaterial({
    color: 0x050608,
    metalness: 0.22,
    roughness: 0.88,
    envMapIntensity: 0.6,
  });

  const knurledAluminum = new THREE.MeshStandardMaterial({
    color: 0x262a33,
    metalness: 0.88,
    roughness: 0.3,
    bumpMap: textures.knurledMetal,
    bumpScale: 0.02,
    envMapIntensity: 1.55,
  });

  const brassMetal = new THREE.MeshStandardMaterial({
    color: 0xd9a838,
    metalness: 0.94,
    roughness: 0.2,
    envMapIntensity: 1.75,
  });

  const perforatedGrill = new THREE.MeshStandardMaterial({
    color: 0x1a1c22,
    map: textures.perforatedAlbedo,
    bumpMap: textures.perforatedBump,
    bumpScale: 0.018,
    metalness: 0.72,
    roughness: 0.38,
    envMapIntensity: 1.4,
  });

  const rj45BankMat = new THREE.MeshStandardMaterial({
    map: textures.rj45BankAlbedo,
    bumpMap: textures.rj45BankBump,
    bumpScale: 0.022,
    metalness: 0.65,
    roughness: 0.34,
    envMapIntensity: 1.5,
  });

  const lensInteriorMat = new THREE.MeshStandardMaterial({
    map: textures.lensOpticsPro,
    roughness: 0.18,
    metalness: 0.35,
    emissive: new THREE.Color(0x0c192c),
    emissiveMap: textures.lensOpticsPro,
    emissiveIntensity: 0.22,
    envMapIntensity: 1.6,
  });

  const sapphireLens = new THREE.MeshPhysicalMaterial({
    color: 0x09162d,
    metalness: 0.08,
    roughness: 0.02,
    transparent: true,
    opacity: 0.42,
    clearcoat: 1.0,
    clearcoatRoughness: 0.02,
    reflectivity: 1.0,
    ior: 1.77,
    iridescence: 0.95,
    iridescenceIOR: 1.38,
    envMapIntensity: 2.35,
  });

  const sapphireOpaque = new THREE.MeshPhysicalMaterial({
    color: 0x0a1324,
    metalness: 0.12,
    roughness: 0.04,
    clearcoat: 1.0,
    clearcoatRoughness: 0.03,
    reflectivity: 1.0,
    ior: 1.77,
    iridescence: 0.9,
    envMapIntensity: 2.15,
  });

  const switchScreenMat = new THREE.MeshStandardMaterial({
    map: textures.switchOledTex,
    emissiveMap: textures.switchOledTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.85,
    roughness: 0.14,
    metalness: 0.08,
  });

  const inverterScreenMat = new THREE.MeshStandardMaterial({
    map: textures.inverterOledTex,
    emissiveMap: textures.inverterOledTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.82,
    roughness: 0.14,
    metalness: 0.08,
  });

  const radioScreenMat = new THREE.MeshStandardMaterial({
    map: textures.radioLcdTex,
    emissiveMap: textures.radioLcdTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.78,
    roughness: 0.18,
    metalness: 0.1,
  });

  const biometricScreenMat = new THREE.MeshStandardMaterial({
    map: textures.biometricUiTex,
    emissiveMap: textures.biometricUiTex,
    emissive: new THREE.Color(0xffffff),
    emissiveIntensity: 0.84,
    roughness: 0.12,
    metalness: 0.08,
  });

  const cyanLed = new THREE.MeshStandardMaterial({
    color: 0x38bdf8,
    emissive: new THREE.Color(0x0ea5e9),
    emissiveIntensity: 2.2,
    roughness: 0.18,
  });

  const emeraldLed = new THREE.MeshStandardMaterial({
    color: 0x34d399,
    emissive: new THREE.Color(0x10b981),
    emissiveIntensity: 1.95,
    roughness: 0.18,
  });

  const warmLed = new THREE.MeshStandardMaterial({
    color: 0xfef3c7,
    emissive: new THREE.Color(0xfbbf24),
    emissiveIntensity: 1.8,
    roughness: 0.18,
  });

  const crimsonKey = new THREE.MeshPhysicalMaterial({
    color: 0xdc2626,
    metalness: 0.25,
    roughness: 0.34,
    clearcoat: 0.4,
    envMapIntensity: 1.3,
  });

  const emeraldKey = new THREE.MeshPhysicalMaterial({
    color: 0x16a34a,
    metalness: 0.25,
    roughness: 0.34,
    clearcoat: 0.4,
    envMapIntensity: 1.3,
  });

  const aoShadowMat = new THREE.MeshBasicMaterial({
    map: textures.softShadowAO,
    transparent: true,
    opacity: 0.22,
    depthWrite: false,
  });

  const allMats: THREE.Material[] = [
    obsidianAnodized,
    darkTitanium,
    titaniumSilver,
    radialMachinedMetal,
    architecturalWhite,
    copperAccent,
    stainlessSteel,
    mattePolymer,
    darkRecess,
    knurledAluminum,
    brassMetal,
    perforatedGrill,
    rj45BankMat,
    lensInteriorMat,
    sapphireLens,
    sapphireOpaque,
    switchScreenMat,
    inverterScreenMat,
    radioScreenMat,
    biometricScreenMat,
    cyanLed,
    emeraldLed,
    warmLed,
    crimsonKey,
    emeraldKey,
    aoShadowMat,
  ];

  return {
    obsidianAnodized,
    darkTitanium,
    titaniumSilver,
    radialMachinedMetal,
    architecturalWhite,
    copperAccent,
    stainlessSteel,
    mattePolymer,
    darkRecess,
    knurledAluminum,
    brassMetal,
    perforatedGrill,
    rj45BankMat,
    lensInteriorMat,
    sapphireLens,
    sapphireOpaque,
    switchScreenMat,
    inverterScreenMat,
    radioScreenMat,
    biometricScreenMat,
    cyanLed,
    emeraldLed,
    warmLed,
    crimsonKey,
    emeraldKey,
    aoShadowMat,
    dispose: () => {
      textures.dispose();
      allMats.forEach((m) => m.dispose());
    },
  };
}

type MatLib = ReturnType<typeof makeMaterialLibrary>;

function buildCctvCamera(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Stepped die-cast base mounting flange via LatheGeometry (y: -1.04 .. -0.84)
  const basePts = [
    new THREE.Vector2(0.0, -1.04),
    new THREE.Vector2(1.06, -1.04),
    new THREE.Vector2(1.08, -1.0),
    new THREE.Vector2(1.06, -0.9),
    new THREE.Vector2(0.98, -0.84),
    new THREE.Vector2(0.86, -0.84),
  ];
  const baseFlange = new THREE.Mesh(
    new THREE.LatheGeometry(basePts, 64),
    mats.titaniumSilver
  );
  root.add(baseFlange);

  // Weatherproof matte EPDM compression gasket sitting cleanly at y = -0.832
  const gasket = new THREE.Mesh(
    new THREE.CylinderGeometry(0.95, 0.97, 0.025, 64),
    mats.mattePolymer
  );
  gasket.position.y = -0.825;
  root.add(gasket);

  // 4x Recessed stainless steel Torx mounting screws around base flange
  for (let i = 0; i < 4; i++) {
    const a = (i * Math.PI) / 2 + Math.PI / 4;
    const bx = Math.cos(a) * 0.96;
    const bz = Math.sin(a) * 0.96;

    const washer = new THREE.Mesh(
      new THREE.CylinderGeometry(0.048, 0.048, 0.016, 20),
      mats.darkRecess
    );
    washer.position.set(bx, -0.835, bz);
    root.add(washer);

    const screwHead = new THREE.Mesh(
      new THREE.CylinderGeometry(0.034, 0.034, 0.026, 6),
      mats.stainlessSteel
    );
    screwHead.position.set(bx, -0.822, bz);
    root.add(screwHead);
  }

  // Sculpted outer aluminum armor turret collar via LatheGeometry (y: -0.81 .. -0.34)
  const skirtPts = [
    new THREE.Vector2(0.84, -0.81),
    new THREE.Vector2(0.96, -0.78),
    new THREE.Vector2(1.0, -0.58),
    new THREE.Vector2(0.95, -0.38),
    new THREE.Vector2(0.89, -0.34),
    new THREE.Vector2(0.83, -0.36),
  ];
  const outerSkirt = new THREE.Mesh(
    new THREE.LatheGeometry(skirtPts, 64),
    mats.architecturalWhite
  );
  root.add(outerSkirt);

  // Anodized dark isolation ring cleanly separating skirt from gimbal sphere (y: -0.36)
  const isolationRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.85, 0.024, 16, 64),
    mats.obsidianAnodized
  );
  isolationRing.rotation.x = Math.PI / 2;
  isolationRing.position.y = -0.35;
  root.add(isolationRing);

  // Gimbal Optical Ball Assembly centered at y = 0.02
  const gimbal = new THREE.Group();
  gimbal.position.set(0, 0.02, 0);
  gimbal.rotation.x = -0.14;
  root.add(gimbal);

  const gimbalSphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.8, 64, 48),
    mats.architecturalWhite
  );
  gimbal.add(gimbalSphere);

  // Machined satin obsidian front optical shroud plate sitting cleanly proud of sphere
  const frontCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.56, 0.62, 0.14, 56),
    mats.obsidianAnodized
  );
  frontCollar.rotation.x = Math.PI / 2;
  frontCollar.position.z = 0.61;
  gimbal.add(frontCollar);

  // Stepped CNC Optical Lens Barrel using LatheGeometry rotated forward
  const barrelProfile = [
    new THREE.Vector2(0.38, 0.0),
    new THREE.Vector2(0.49, 0.0),
    new THREE.Vector2(0.49, 0.16),
    new THREE.Vector2(0.45, 0.24),
    new THREE.Vector2(0.45, 0.34),
    new THREE.Vector2(0.4, 0.36),
    new THREE.Vector2(0.37, 0.22),
  ];
  const lensBarrel = new THREE.Mesh(
    new THREE.LatheGeometry(barrelProfile, 64),
    mats.radialMachinedMetal
  );
  lensBarrel.rotation.x = Math.PI / 2;
  lensBarrel.position.z = 0.66;
  gimbal.add(lensBarrel);

  // Recessed dark baffle ring + Pro Multi-Element Lens Interior (1024x1024 laser-etched optics)
  const lensInterior = new THREE.Mesh(
    new THREE.CircleGeometry(0.365, 64),
    mats.lensInteriorMat
  );
  lensInterior.position.z = 0.905;
  gimbal.add(lensInterior);

  // Curved transparent sapphire front optical glass dome (strictly proud of lensInterior >= 0.02)
  const frontGlass = new THREE.Mesh(
    new THREE.SphereGeometry(0.37, 48, 32, 0, Math.PI * 2, 0, Math.PI * 0.28),
    mats.sapphireLens
  );
  frontGlass.rotation.x = Math.PI / 2;
  frontGlass.position.z = 0.7;
  gimbal.add(frontGlass);

  // Signature anodized copper chamfer accent ring around leading bezel (z = 1.018)
  const copperRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.425, 0.022, 20, 64),
    mats.copperAccent
  );
  copperRing.position.z = 1.018;
  gimbal.add(copperRing);

  // Dual ColorVu supplemental warm-white LED emitter pods flanking lens collar
  [-0.45, 0.45].forEach((x) => {
    const podHousing = new THREE.Mesh(
      new THREE.CylinderGeometry(0.088, 0.098, 0.09, 28),
      mats.darkTitanium
    );
    podHousing.rotation.x = Math.PI / 2;
    podHousing.position.set(x, -0.24, 0.67);
    gimbal.add(podHousing);

    const reflector = new THREE.Mesh(
      new THREE.CylinderGeometry(0.068, 0.056, 0.02, 24),
      mats.stainlessSteel
    );
    reflector.rotation.x = Math.PI / 2;
    reflector.position.set(x, -0.24, 0.718);
    gimbal.add(reflector);

    const ledChip = new THREE.Mesh(
      new THREE.CylinderGeometry(0.044, 0.044, 0.014, 24),
      mats.warmLed
    );
    ledChip.rotation.x = Math.PI / 2;
    ledChip.position.set(x, -0.24, 0.732);
    gimbal.add(ledChip);
  });

  // Micro pinhole acoustic audio mic slit & top telemetry status LED
  const micRecess = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.02, 16),
    mats.darkRecess
  );
  micRecess.rotation.x = Math.PI / 2;
  micRecess.position.set(0, -0.44, 0.688);
  gimbal.add(micRecess);

  const statusLed = new THREE.Mesh(
    new THREE.CylinderGeometry(0.022, 0.022, 0.022, 16),
    mats.cyanLed
  );
  statusLed.rotation.x = Math.PI / 2;
  statusLed.position.set(0, 0.56, 0.578);
  gimbal.add(statusLed);

  // Rear waterproof armored RJ45 PoE pigtail + IP67 gland coupler (visible on 360 rotation)
  const rearGland = new THREE.Mesh(
    new THREE.CylinderGeometry(0.075, 0.085, 0.14, 24),
    mats.knurledAluminum
  );
  rearGland.rotation.x = Math.PI / 2;
  rearGland.position.set(0, -0.92, -0.78);
  root.add(rearGland);

  const cableCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, -0.92, -0.84),
    new THREE.Vector3(-0.14, -1.04, -1.06),
    new THREE.Vector3(-0.34, -1.18, -0.92),
  ]);
  const pigtail = new THREE.Mesh(
    new THREE.TubeGeometry(cableCurve, 24, 0.044, 14, false),
    mats.mattePolymer
  );
  root.add(pigtail);

  const rj45Boot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.068, 0.056, 0.22, 20),
    mats.obsidianAnodized
  );
  rj45Boot.rotation.set(0.35, -0.4, 0.45);
  rj45Boot.position.set(-0.38, -1.21, -0.88);
  root.add(rj45Boot);

  root.scale.setScalar(1.12);
  root.rotation.set(0.18, -0.46, 0);
  return root;
}

function buildSwitch1U(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Brushed CNC Titanium 1U Unibody Chassis (W=2.92, H=0.38, D=1.34)
  const chassis = new THREE.Mesh(
    new RoundedBoxGeometry(2.92, 0.38, 1.34, 4, 0.032),
    mats.titaniumSilver
  );
  root.add(chassis);

  // Front recessed shadow gap collar + recessed dark anodized faceplate
  const recessShadow = new THREE.Mesh(
    new THREE.BoxGeometry(2.84, 0.31, 0.02),
    mats.darkRecess
  );
  recessShadow.position.z = 0.668;
  root.add(recessShadow);

  const faceplate = new THREE.Mesh(
    new RoundedBoxGeometry(2.8, 0.28, 0.024, 3, 0.012),
    mats.darkTitanium
  );
  faceplate.position.z = 0.684;
  root.add(faceplate);

  // Precision CNC Rackmount Ears with oblong slotted mounts & stainless hex bolts
  [-1.535, 1.535].forEach((x) => {
    const ear = new THREE.Mesh(
      new RoundedBoxGeometry(0.15, 0.38, 0.065, 3, 0.014),
      mats.obsidianAnodized
    );
    ear.position.set(x, 0, 0.65);
    root.add(ear);

    [-0.105, 0.105].forEach((ey) => {
      const bolt = new THREE.Mesh(
        new THREE.CylinderGeometry(0.026, 0.026, 0.022, 6),
        mats.stainlessSteel
      );
      bolt.rotation.x = Math.PI / 2;
      bolt.position.set(x, ey, 0.692);
      root.add(bolt);
    });
  });

  // Left 1.3" LCM Touchscreen Bezel & Recessed OLED (z = 0.70 .. 0.715)
  const lcmBezel = new THREE.Mesh(
    new RoundedBoxGeometry(0.36, 0.22, 0.02, 2, 0.014),
    mats.obsidianAnodized
  );
  lcmBezel.position.set(-1.17, 0, 0.702);
  root.add(lcmBezel);

  const lcmScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.305, 0.16),
    mats.switchScreenMat
  );
  lcmScreen.position.set(-1.17, 0, 0.715);
  root.add(lcmScreen);

  // Two Shielded 16-Port RJ45 Banks (Upper Row = ports 1..16, Lower Row = ports 17..32/48)
  // Using high-res procedural RJ45 albedo + bump map with gold pins + stainless EMI shields
  [-0.064, 0.064].forEach((py, rowIdx) => {
    const bankBacking = new THREE.Mesh(
      new THREE.BoxGeometry(1.74, 0.104, 0.018),
      mats.darkRecess
    );
    bankBacking.position.set(-0.08, py, 0.7);
    root.add(bankBacking);

    const rj45Strip = new THREE.Mesh(
      new THREE.PlaneGeometry(1.72, 0.096),
      mats.rj45BankMat
    );
    rj45Strip.position.set(-0.08, py, 0.713);
    root.add(rj45Strip);

    // Subtle Etherlighting LED light pipes cleanly above every port slot
    for (let c = 0; c < 16; c++) {
      const lx = -0.885 + c * 0.1075;
      if (c % 5 !== 4) {
        const etherLed = new THREE.Mesh(
          new THREE.BoxGeometry(0.056, 0.008, 0.01),
          c < 6
            ? mats.cyanLed
            : c < 11
              ? rowIdx === 0
                ? mats.emeraldLed
                : mats.copperAccent
              : mats.cyanLed
        );
        etherLed.position.set(lx, py + 0.051, 0.714);
        root.add(etherLed);
      }
    }
  });

  // 4x 10G SFP+ Optical Uplinks on right (x = 0.90..1.31) with protruding copper transceivers + pull-bails
  for (let i = 0; i < 4; i++) {
    const px = 0.9 + i * 0.132;
    const sfpCage = new THREE.Mesh(
      new THREE.BoxGeometry(0.1, 0.125, 0.028),
      mats.stainlessSteel
    );
    sfpCage.position.set(px, 0, 0.706);
    root.add(sfpCage);

    const sfpWell = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 0.095, 0.016),
      mats.darkRecess
    );
    sfpWell.position.set(px, 0, 0.718);
    root.add(sfpWell);

    if (i < 2) {
      const transceiver = new THREE.Mesh(
        new RoundedBoxGeometry(0.076, 0.084, 0.095, 2, 0.008),
        mats.copperAccent
      );
      transceiver.position.set(px, 0, 0.752);
      root.add(transceiver);

      const bail = new THREE.Mesh(
        new THREE.BoxGeometry(0.068, 0.016, 0.025),
        mats.stainlessSteel
      );
      bail.position.set(px, -0.025, 0.806);
      root.add(bail);
    }
  }

  // Top perforated airflow cover & countersunk perimeter Torx screws (y = 0.194)
  const topPerforation = new THREE.Mesh(
    new THREE.BoxGeometry(2.54, 0.01, 0.96),
    mats.perforatedGrill
  );
  topPerforation.position.set(0, 0.193, -0.04);
  root.add(topPerforation);

  for (const sx of [-1.2, 0, 1.2]) {
    for (const sz of [-0.54, 0.48]) {
      const topScrew = new THREE.Mesh(
        new THREE.CylinderGeometry(0.02, 0.02, 0.012, 12),
        mats.darkTitanium
      );
      topScrew.position.set(sx, 0.196, sz);
      root.add(topScrew);
    }
  }

  // Side CNC cooling louvers strictly outside ±1.46
  [-1.47, 1.47].forEach((x) => {
    for (let k = -3; k <= 3; k++) {
      const slot = new THREE.Mesh(
        new THREE.BoxGeometry(0.018, 0.19, 0.08),
        mats.obsidianAnodized
      );
      slot.position.set(x, 0, k * 0.14);
      root.add(slot);
    }
  });

  // Rear 360 Detail: IEC C14 AC Inlet & Redundant DC USP-RPS connector (z = -0.68)
  const iecHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.16, 0.03),
    mats.obsidianAnodized
  );
  iecHousing.position.set(-0.98, 0, -0.678);
  root.add(iecHousing);

  const rpsSocket = new THREE.Mesh(
    new RoundedBoxGeometry(0.32, 0.18, 0.036, 2, 0.01),
    mats.darkTitanium
  );
  rpsSocket.position.set(0.95, 0, -0.68);
  root.add(rpsSocket);

  root.rotation.set(0.3, -0.5, 0.05);
  return root;
}

function buildSolarInverter(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Structural obsidian inner mid-chassis: W=1.64, H=2.14, D=0.40
  const innerChassis = new THREE.Mesh(
    new RoundedBoxGeometry(1.64, 2.14, 0.4, 5, 0.06),
    mats.obsidianAnodized
  );
  root.add(innerChassis);

  // Architectural pearl-white outer die-cast cowling proud of front face with crisp shadow gap
  const frontCowling = new THREE.Mesh(
    new RoundedBoxGeometry(1.68, 2.1, 0.14, 5, 0.07),
    mats.architecturalWhite
  );
  frontCowling.position.set(0, 0, 0.19);
  root.add(frontCowling);

  // 17 Deep Extruded Rear Aluminum Heatsink Fins strictly behind z = -0.20
  for (let i = -8; i <= 8; i++) {
    const fin = new THREE.Mesh(
      new THREE.BoxGeometry(0.032, 1.94, 0.18),
      mats.darkTitanium
    );
    fin.position.set(i * 0.095, 0, -0.29);
    root.add(fin);
  }

  // Rear anodized steel wall mounting bracket ears at top & bottom (visible on 360 rotation)
  [-0.92, 0.92].forEach((by) => {
    const bracket = new THREE.Mesh(
      new THREE.BoxGeometry(1.78, 0.12, 0.04),
      mats.titaniumSilver
    );
    bracket.position.set(0, by, -0.21);
    root.add(bracket);
  });

  // Recessed Glossy Obsidian Upper Display Visor (z = 0.262, proud of cowling 0.26)
  const visorFrame = new THREE.Mesh(
    new RoundedBoxGeometry(1.38, 0.92, 0.024, 3, 0.045),
    mats.obsidianAnodized
  );
  visorFrame.position.set(0, 0.44, 0.266);
  root.add(visorFrame);

  // Crisp High-DPI Solar Energy-Flow HUD OLED strictly proud of visor (z = 0.284)
  const oledPanel = new THREE.Mesh(
    new THREE.PlaneGeometry(1.16, 0.72),
    mats.inverterScreenMat
  );
  oledPanel.position.set(0, 0.44, 0.284);
  root.add(oledPanel);

  // Signature machined copper trim accent bar beneath visor (z = 0.268)
  const copperAccentStrip = new THREE.Mesh(
    new RoundedBoxGeometry(1.38, 0.042, 0.022, 2, 0.01),
    mats.copperAccent
  );
  copperAccentStrip.position.set(0, -0.1, 0.268);
  root.add(copperAccentStrip);

  // 4x Capacitive touch ring controls below copper strip
  [-0.36, -0.12, 0.12, 0.36].forEach((cx) => {
    const touchRing = new THREE.Mesh(
      new THREE.TorusGeometry(0.044, 0.008, 12, 32),
      mats.darkTitanium
    );
    touchRing.position.set(cx, -0.26, 0.27);
    root.add(touchRing);
  });

  // Central Glowing Emerald Leaf / Operating Status Halo (y = -0.58)
  const statusHalo = new THREE.Mesh(
    new THREE.TorusGeometry(0.095, 0.015, 16, 48),
    mats.emeraldLed
  );
  statusHalo.position.set(0, -0.58, 0.272);
  root.add(statusHalo);

  // Left-Flank Rotary Lockable DC Isolator Switch (x = -0.84)
  const isolatorPlate = new THREE.Mesh(
    new RoundedBoxGeometry(0.04, 0.28, 0.26, 2, 0.02),
    mats.obsidianAnodized
  );
  isolatorPlate.position.set(-0.835, -0.24, 0.02);
  root.add(isolatorPlate);

  const isolatorDial = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.09, 0.05, 28),
    mats.darkTitanium
  );
  isolatorDial.rotation.z = Math.PI / 2;
  isolatorDial.position.set(-0.87, -0.24, 0.02);
  root.add(isolatorDial);

  const isolatorLever = new THREE.Mesh(
    new RoundedBoxGeometry(0.045, 0.16, 0.042, 2, 0.01),
    mats.crimsonKey
  );
  isolatorLever.rotation.x = 0.4;
  isolatorLever.position.set(-0.905, -0.24, 0.02);
  root.add(isolatorLever);

  // Bottom DC/AC Conduit Manifold (MC4 PV pairs + Knurled AC glands + Brass Earth Lug)
  const mc4Xs = [-0.56, -0.34, 0.34, 0.56];
  mc4Xs.forEach((x, i) => {
    const mc4Barrel = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.046, 0.17, 20),
      i % 2 === 0 ? mats.copperAccent : mats.mattePolymer
    );
    mc4Barrel.position.set(x, -1.15, 0.04);
    root.add(mc4Barrel);

    const mc4Nut = new THREE.Mesh(
      new THREE.CylinderGeometry(0.056, 0.056, 0.045, 6),
      mats.darkTitanium
    );
    mc4Nut.position.set(x, -1.095, 0.04);
    root.add(mc4Nut);
  });

  // Heavy central AC Grid / Backup Waterproof Knurled Glands + BMS Circular Port
  [-0.1, 0.1].forEach((x) => {
    const acGland = new THREE.Mesh(
      new THREE.CylinderGeometry(0.065, 0.065, 0.15, 24),
      mats.knurledAluminum
    );
    acGland.position.set(x, -1.14, 0.04);
    root.add(acGland);
  });

  const brassEarthLug = new THREE.Mesh(
    new THREE.CylinderGeometry(0.028, 0.028, 0.09, 6),
    mats.brassMetal
  );
  brassEarthLug.position.set(0.68, -1.1, -0.1);
  root.add(brassEarthLug);

  root.rotation.set(0.12, -0.44, 0);
  return root;
}

function buildDmrRadio(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Rugged ergonomic obsidian chassis (W=0.84, H=1.86, D=0.38)
  const chassis = new THREE.Mesh(
    new RoundedBoxGeometry(0.84, 1.86, 0.38, 5, 0.075),
    mats.obsidianAnodized
  );
  root.add(chassis);

  // Side matte elastomer anti-slip grip rails flanking left & right edges
  [-0.415, 0.415].forEach((x) => {
    const gripRail = new THREE.Mesh(
      new RoundedBoxGeometry(0.036, 1.38, 0.24, 3, 0.016),
      mats.mattePolymer
    );
    gripRail.position.set(x, -0.1, 0);
    root.add(gripRail);
  });

  // Left Oversized Textured Copper-Orange PTT Key + 2 Programmable Side Keys
  const pttButton = new THREE.Mesh(
    new RoundedBoxGeometry(0.052, 0.42, 0.16, 3, 0.02),
    mats.copperAccent
  );
  pttButton.position.set(-0.435, 0.34, 0.02);
  root.add(pttButton);

  [-0.02, -0.2].forEach((y) => {
    const progKey = new THREE.Mesh(
      new RoundedBoxGeometry(0.04, 0.12, 0.12, 2, 0.015),
      mats.darkTitanium
    );
    progKey.position.set(-0.432, y, 0.02);
    root.add(progKey);
  });

  // Right Accessory Port Dust Shield with Knurled Brass Thumbscrew
  const accCover = new THREE.Mesh(
    new RoundedBoxGeometry(0.032, 0.56, 0.2, 2, 0.016),
    mats.darkTitanium
  );
  accCover.position.set(0.428, 0.12, 0);
  root.add(accCover);

  const thumbScrew = new THREE.Mesh(
    new THREE.CylinderGeometry(0.042, 0.042, 0.03, 24),
    mats.brassMetal
  );
  thumbScrew.rotation.z = Math.PI / 2;
  thumbScrew.position.set(0.45, -0.06, 0);
  root.add(thumbScrew);

  // Top Machined Aluminum Crown Guard + Tri-color Status Collar
  const topCrown = new THREE.Mesh(
    new RoundedBoxGeometry(0.76, 0.08, 0.32, 3, 0.025),
    mats.darkTitanium
  );
  topCrown.position.y = 0.93;
  root.add(topCrown);

  // Stepped Helical UHF Whip Antenna via LatheGeometry at top-right (x = 0.24)
  const antennaProfile = [
    new THREE.Vector2(0.082, 0.0),
    new THREE.Vector2(0.086, 0.14),
    new THREE.Vector2(0.068, 0.18),
    new THREE.Vector2(0.058, 0.28),
    new THREE.Vector2(0.042, 0.96),
    new THREE.Vector2(0.03, 1.06),
    new THREE.Vector2(0.0, 1.08),
  ];
  const whipAntenna = new THREE.Mesh(
    new THREE.LatheGeometry(antennaProfile, 32),
    mats.mattePolymer
  );
  whipAntenna.position.set(0.24, 0.96, 0);
  root.add(whipAntenna);

  const antennaCollar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.088, 0.03, 28),
    mats.brassMetal
  );
  antennaCollar.position.set(0.24, 0.975, 0);
  root.add(antennaCollar);

  // Dual Diamond-Knurled CNC Rotary Knobs (Volume & Channel) + Recessed Copper Emergency Key
  [-0.22, 0.01].forEach((x, idx) => {
    const rTop = idx === 0 ? 0.068 : 0.078;
    const knob = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop, rTop + 0.01, 0.2, 32),
      mats.knurledAluminum
    );
    knob.position.set(x, 1.05, 0);
    root.add(knob);

    const knobCap = new THREE.Mesh(
      new THREE.CylinderGeometry(rTop - 0.008, rTop - 0.008, 0.018, 32),
      mats.radialMachinedMetal
    );
    knobCap.position.set(x, 1.158, 0);
    root.add(knobCap);
  });

  const emergencyKey = new THREE.Mesh(
    new RoundedBoxGeometry(0.11, 0.04, 0.09, 2, 0.01),
    mats.copperAccent
  );
  emergencyKey.position.set(-0.11, 0.975, 0.1);
  root.add(emergencyKey);

  // Upper Micro-Perforated Acoustic Speaker Chamber (z = 0.20)
  const speakerChamber = new THREE.Mesh(
    new RoundedBoxGeometry(0.66, 0.44, 0.022, 3, 0.032),
    mats.perforatedGrill
  );
  speakerChamber.position.set(0, 0.62, 0.198);
  root.add(speakerChamber);

  // Color Tactical DMR LCD Bezel & High-DPI Screen (y = 0.12, z = 0.198 -> 0.214)
  const lcdBezel = new THREE.Mesh(
    new RoundedBoxGeometry(0.66, 0.46, 0.02, 2, 0.025),
    mats.darkRecess
  );
  lcdBezel.position.set(0, 0.12, 0.198);
  root.add(lcdBezel);

  const lcdScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.56, 0.37),
    mats.radioScreenMat
  );
  lcdScreen.position.set(0, 0.12, 0.213);
  root.add(lcdScreen);

  // Navigation Cluster: Metallic D-Pad Ring + Copper Select Key + Call/End Tactical Keys
  const dPadRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.092, 0.026, 14, 36),
    mats.titaniumSilver
  );
  dPadRing.position.set(0, -0.23, 0.204);
  root.add(dPadRing);

  const dPadCenter = new THREE.Mesh(
    new THREE.CylinderGeometry(0.048, 0.048, 0.024, 24),
    mats.copperAccent
  );
  dPadCenter.rotation.x = Math.PI / 2;
  dPadCenter.position.set(0, -0.23, 0.208);
  root.add(dPadCenter);

  const callKey = new THREE.Mesh(
    new RoundedBoxGeometry(0.15, 0.085, 0.026, 2, 0.015),
    mats.emeraldKey
  );
  callKey.position.set(-0.22, -0.23, 0.204);
  root.add(callKey);

  const endKey = new THREE.Mesh(
    new RoundedBoxGeometry(0.15, 0.085, 0.026, 2, 0.015),
    mats.crimsonKey
  );
  endKey.position.set(0.22, -0.23, 0.204);
  root.add(endKey);

  // Sculpted 3x4 Contoured DTMF Numeric Keypad (y = -0.40 .. -0.78)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 3; col++) {
      const kx = (col - 1) * 0.2;
      const ky = -0.4 - row * 0.122;
      const key = new THREE.Mesh(
        new RoundedBoxGeometry(0.155, 0.088, 0.028, 3, 0.016),
        mats.darkTitanium
      );
      key.position.set(kx, ky, 0.204);
      root.add(key);
    }
  }

  // Rear Li-Ion Battery Pack Seam & Belt Clip Mount (z = -0.20)
  const batteryPack = new THREE.Mesh(
    new RoundedBoxGeometry(0.68, 1.18, 0.04, 3, 0.03),
    mats.mattePolymer
  );
  batteryPack.position.set(0, -0.24, -0.195);
  root.add(batteryPack);

  const beltClip = new THREE.Mesh(
    new RoundedBoxGeometry(0.28, 0.64, 0.045, 2, 0.016),
    mats.darkTitanium
  );
  beltClip.position.set(0, 0.16, -0.225);
  root.add(beltClip);

  root.position.y = -0.22;
  root.rotation.set(0.14, -0.46, 0);
  return root;
}

function buildBiometricTerminal(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Bead-Blasted CNC Titanium Unibody Frame (W=1.18, H=2.18, D=0.22)
  const frame = new THREE.Mesh(
    new RoundedBoxGeometry(1.18, 2.18, 0.22, 5, 0.085),
    mats.titaniumSilver
  );
  root.add(frame);

  // Continuous Satin Jet-Black Front Sapphire Face strictly proud (z = 0.116)
  const frontGlass = new THREE.Mesh(
    new RoundedBoxGeometry(1.08, 2.08, 0.02, 4, 0.055),
    mats.sapphireOpaque
  );
  frontGlass.position.z = 0.114;
  root.add(frontGlass);

  // Twin Stereo Optical/IR Facial Cameras flanking Micro-Dot Flood Emitter (y = 0.72)
  [-0.22, 0.22].forEach((x) => {
    const trim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.098, 0.098, 0.024, 36),
      mats.darkTitanium
    );
    trim.rotation.x = Math.PI / 2;
    trim.position.set(x, 0.73, 0.128);
    root.add(trim);

    const opticalCore = new THREE.Mesh(
      new THREE.CircleGeometry(0.068, 32),
      mats.lensInteriorMat
    );
    opticalCore.position.set(x, 0.73, 0.142);
    root.add(opticalCore);

    const sapphireCap = new THREE.Mesh(
      new THREE.SphereGeometry(0.072, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.28),
      mats.sapphireLens
    );
    sapphireCap.rotation.x = Math.PI / 2;
    sapphireCap.position.set(x, 0.73, 0.1);
    root.add(sapphireCap);
  });

  // Central IR Flood Illuminator + Micro Speaker Slit
  const floodWindow = new THREE.Mesh(
    new RoundedBoxGeometry(0.11, 0.16, 0.016, 2, 0.016),
    mats.darkRecess
  );
  floodWindow.position.set(0, 0.73, 0.128);
  root.add(floodWindow);

  const speakerSlit = new THREE.Mesh(
    new RoundedBoxGeometry(0.28, 0.018, 0.01, 2, 0.006),
    mats.perforatedGrill
  );
  speakerSlit.position.set(0, 0.92, 0.128);
  root.add(speakerSlit);

  // 5" Architectural IPS Touchscreen (y = 0.04, z = 0.13)
  const displayScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.86, 1.06),
    mats.biometricScreenMat
  );
  displayScreen.position.set(0, 0.04, 0.132);
  root.add(displayScreen);

  // Glowing Cyan Ultrasonic Palm / Fingerprint Sensor Ring (y = -0.68)
  const sensorRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.135, 0.018, 18, 48),
    mats.cyanLed
  );
  sensorRing.position.set(0, -0.68, 0.136);
  root.add(sensorRing);

  const sensorPad = new THREE.Mesh(
    new THREE.CylinderGeometry(0.118, 0.118, 0.016, 36),
    mats.sapphireOpaque
  );
  sensorPad.rotation.x = Math.PI / 2;
  sensorPad.position.set(0, -0.68, 0.13);
  root.add(sensorPad);

  // Subtle copper NFC proximity bar near bottom
  const nfcStrip = new THREE.Mesh(
    new RoundedBoxGeometry(0.36, 0.02, 0.012, 2, 0.006),
    mats.copperAccent
  );
  nfcStrip.position.set(0, -0.92, 0.132);
  root.add(nfcStrip);

  // Rear Flush Wall-Mount Bracket & Concealed PoE Raceway (visible on 360 rotation)
  const wallPlate = new THREE.Mesh(
    new RoundedBoxGeometry(0.84, 1.62, 0.06, 3, 0.02),
    mats.obsidianAnodized
  );
  wallPlate.position.set(0, 0, -0.135);
  root.add(wallPlate);

  const cableRaceway = new THREE.Mesh(
    new THREE.CylinderGeometry(0.085, 0.085, 0.1, 24),
    mats.knurledAluminum
  );
  cableRaceway.rotation.x = Math.PI / 2;
  cableRaceway.position.set(0, -0.45, -0.18);
  root.add(cableRaceway);

  root.rotation.set(0.12, -0.44, 0);
  return root;
}

function buildRackServer2U(mats: MatLib): THREE.Group {
  const root = new THREE.Group();

  // Brushed 2U Steel/Aluminum Chassis (W=2.84, H=0.72, D=1.52)
  const chassis = new THREE.Mesh(
    new RoundedBoxGeometry(2.84, 0.72, 1.52, 4, 0.032),
    mats.titaniumSilver
  );
  root.add(chassis);

  // Heavy Curved Steel Rackmount Ears + Knurled Spring Thumbscrews (x = ±1.48)
  [-1.485, 1.485].forEach((x) => {
    const earPlate = new THREE.Mesh(
      new RoundedBoxGeometry(0.13, 0.72, 0.06, 3, 0.015),
      mats.obsidianAnodized
    );
    earPlate.position.set(x, 0, 0.74);
    root.add(earPlate);

    const handleBar = new THREE.Mesh(
      new RoundedBoxGeometry(0.052, 0.56, 0.12, 3, 0.022),
      mats.stainlessSteel
    );
    handleBar.position.set(x + (x < 0 ? -0.02 : 0.02), 0, 0.81);
    root.add(handleBar);

    [-0.24, 0.24].forEach((ty) => {
      const thumbscrew = new THREE.Mesh(
        new THREE.CylinderGeometry(0.028, 0.028, 0.04, 20),
        mats.knurledAluminum
      );
      thumbscrew.rotation.x = Math.PI / 2;
      thumbscrew.position.set(x, ty, 0.785);
      root.add(thumbscrew);
    });
  });

  // Recessed Dark Drive Cage Backplane (z = 0.764)
  const bayCavity = new THREE.Mesh(
    new THREE.BoxGeometry(2.68, 0.6, 0.02),
    mats.darkRecess
  );
  bayCavity.position.z = 0.764;
  root.add(bayCavity);

  // 8x Individual NVMe / SAS Hot-Swap Caddies with Micro-Perforated Airflow Face & Copper Latch
  for (let i = 0; i < 8; i++) {
    const cx = -1.14 + i * 0.295;

    const caddyBody = new THREE.Mesh(
      new RoundedBoxGeometry(0.265, 0.54, 0.036, 2, 0.012),
      mats.obsidianAnodized
    );
    caddyBody.position.set(cx, 0, 0.79);
    root.add(caddyBody);

    // Honeycomb perforated center bay panel
    const caddyVent = new THREE.Mesh(
      new THREE.PlaneGeometry(0.22, 0.3),
      mats.perforatedGrill
    );
    caddyVent.position.set(cx, 0.03, 0.812);
    root.add(caddyVent);

    // Sculpted brushed pull handle bar + Lock cylinder + Copper Hot-Swap Thumb Latch
    const topHandle = new THREE.Mesh(
      new THREE.BoxGeometry(0.22, 0.052, 0.02),
      mats.darkTitanium
    );
    topHandle.position.set(cx, 0.21, 0.816);
    root.add(topHandle);

    const releaseLatch = new THREE.Mesh(
      new RoundedBoxGeometry(0.095, 0.05, 0.024, 2, 0.008),
      mats.copperAccent
    );
    releaseLatch.position.set(cx - 0.055, -0.2, 0.816);
    root.add(releaseLatch);

    const lockPin = new THREE.Mesh(
      new THREE.CylinderGeometry(0.018, 0.018, 0.018, 16),
      mats.stainlessSteel
    );
    lockPin.rotation.x = Math.PI / 2;
    lockPin.position.set(cx + 0.075, -0.2, 0.816);
    root.add(lockPin);

    // Drive Status + NVMe I/O LEDs
    const led = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.056, 0.014),
      i % 3 === 2 ? mats.emeraldLed : mats.cyanLed
    );
    led.position.set(cx + 0.092, 0.21, 0.818);
    root.add(led);
  }

  // Right Control Column: Power Ring, Telemetry LEDs, USB 3.2 Front Recess
  const powerRing = new THREE.Mesh(
    new THREE.TorusGeometry(0.048, 0.012, 14, 32),
    mats.cyanLed
  );
  powerRing.position.set(1.24, 0.16, 0.786);
  root.add(powerRing);

  const usbRecess = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.1, 0.016),
    mats.darkRecess
  );
  usbRecess.position.set(1.24, -0.14, 0.784);
  root.add(usbRecess);

  // Top CNC Perforated Chassis Lid + Countersunk Fasteners (y = 0.366)
  const topLid = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.012, 1.08),
    mats.perforatedGrill
  );
  topLid.position.set(0, 0.366, -0.06);
  root.add(topLid);

  // Rear 360 Detail: Twin Redundant Hot-Swap PSUs + 3 Cooling Fan Modules (z = -0.768)
  [-0.96, 0.96].forEach((px) => {
    const psuBody = new THREE.Mesh(
      new RoundedBoxGeometry(0.62, 0.54, 0.04, 2, 0.012),
      mats.darkTitanium
    );
    psuBody.position.set(px, 0, -0.768);
    root.add(psuBody);

    const psuLoop = new THREE.Mesh(
      new THREE.TorusGeometry(0.065, 0.012, 12, 24),
      mats.copperAccent
    );
    psuLoop.position.set(px + 0.18, 0, -0.802);
    root.add(psuLoop);

    const psuStatus = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.05, 0.016),
      mats.emeraldLed
    );
    psuStatus.position.set(px - 0.22, 0.16, -0.794);
    root.add(psuStatus);
  });

  for (const fx of [-0.42, 0, 0.42]) {
    const fanGrill = new THREE.Mesh(
      new THREE.CircleGeometry(0.18, 28),
      mats.perforatedGrill
    );
    fanGrill.rotation.y = Math.PI;
    fanGrill.position.set(fx, 0, -0.774);
    root.add(fanGrill);
  }

  root.rotation.set(0.25, -0.48, 0.04);
  return root;
}

function buildHardwareMesh(kind: Product3DKind, mats: MatLib): THREE.Group {
  switch (kind) {
    case 'cctv':
      return buildCctvCamera(mats);
    case 'switch':
      return buildSwitch1U(mats);
    case 'solar':
      return buildSolarInverter(mats);
    case 'radio':
      return buildDmrRadio(mats);
    case 'access':
      return buildBiometricTerminal(mats);
    case 'server':
    default:
      return buildRackServer2U(mats);
  }
}

interface ActiveModelSlot {
  wrapper: THREE.Group;
  model: THREE.Group;
  basePitch: number;
  baseYaw: number;
  baseRoll: number;
  phase: 'entering' | 'idle' | 'exiting';
  progress: number;
}

export const ProductSlider3D: React.FC<ProductSlider3DProps> = ({
  kind,
  slideKey,
  onInteract,
  fallbackImage,
  fallbackAlt = 'Hardware 3D',
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const sceneRefs = useRef<{
    stageRoot: THREE.Group;
    mats: MatLib;
    currentSlot: ActiveModelSlot | null;
    exitingSlots: ActiveModelSlot[];
  } | null>(null);

  const dragStateRef = useRef({
    isDragging: false,
    lastX: 0,
    lastY: 0,
    velX: 0,
    velY: 0,
    userYawOffset: 0,
    userPitchOffset: 0,
    notified: false,
  });

  // One-time transparent HDR Softbox WebGL Studio Setup
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: 'high-performance',
      });
    } catch {
      setWebglFailed(true);
      return;
    }

    const width = container.clientWidth || 640;
    const height = container.clientHeight || 580;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);

    const dom = renderer.domElement;
    dom.style.width = '100%';
    dom.style.height = '100%';
    dom.style.display = 'block';
    dom.style.touchAction = 'pan-y';
    container.innerHTML = '';
    container.appendChild(dom);

    const scene = new THREE.Scene();

    // Custom HDR Studio Softbox Cubemap for rich contrast & reflections
    const envTex = createStudioSoftboxEnvironment(renderer);
    scene.environment = envTex;

    const camera = new THREE.PerspectiveCamera(30, width / height, 0.1, 100);
    camera.position.set(0, 0.34, 5.85);
    camera.lookAt(0, -0.06, 0);

    // High-contrast 3-Point KeyShot Lighting Rig
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.45);
    keyLight.position.set(4.5, 7.4, 5.2);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(2048, 2048);
    keyLight.shadow.camera.near = 1;
    keyLight.shadow.camera.far = 18;
    const sc = 3.5;
    keyLight.shadow.camera.left = -sc;
    keyLight.shadow.camera.right = sc;
    keyLight.shadow.camera.top = sc;
    keyLight.shadow.camera.bottom = -sc;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.normalBias = 0.015;
    keyLight.shadow.radius = 4;
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xd8e8ff, 1.25);
    rimLight.position.set(-5.4, 3.4, -4.4);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xfff4e8, 0.55);
    fillLight.position.set(1.2, -3.2, 4.2);
    scene.add(fillLight);

    const mats = makeMaterialLibrary();

    // Dual-layer transparent contact shadow floor (directional shadow + soft Gaussian AO disc)
    const shadowPlaneGeo = new THREE.PlaneGeometry(12, 12);
    const shadowPlaneMat = new THREE.ShadowMaterial({ opacity: 0.14 });
    const shadowPlane = new THREE.Mesh(shadowPlaneGeo, shadowPlaneMat);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.position.y = -1.48;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const aoDiscGeo = new THREE.PlaneGeometry(3.4, 3.4);
    const aoDisc = new THREE.Mesh(aoDiscGeo, mats.aoShadowMat);
    aoDisc.rotation.x = -Math.PI / 2;
    aoDisc.position.set(0, -1.475, 0);
    scene.add(aoDisc);

    const stageRoot = new THREE.Group();
    scene.add(stageRoot);

    sceneRefs.current = {
      stageRoot,
      mats,
      currentSlot: null,
      exitingSlots: [],
    };

    // Pointer Drag-to-Orbit Controls (vertical page scroll preserved)
    const onPointerDown = (e: PointerEvent) => {
      if (e.button !== 0 && e.pointerType === 'mouse') return;
      const ds = dragStateRef.current;
      ds.isDragging = true;
      ds.lastX = e.clientX;
      ds.lastY = e.clientY;
      ds.velX = 0;
      ds.velY = 0;
      if (!ds.notified) {
        ds.notified = true;
        onInteract?.();
      }
      dom.setPointerCapture?.(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent) => {
      const ds = dragStateRef.current;
      if (!ds.isDragging) return;
      const dx = e.clientX - ds.lastX;
      const dy = e.clientY - ds.lastY;
      ds.lastX = e.clientX;
      ds.lastY = e.clientY;
      ds.velX = dx * 0.0085;
      ds.velY = dy * 0.0055;
      ds.userYawOffset += ds.velX;
      ds.userPitchOffset = THREE.MathUtils.clamp(ds.userPitchOffset + ds.velY, -0.52, 0.52);
    };

    const onPointerUp = (e: PointerEvent) => {
      dragStateRef.current.isDragging = false;
      try {
        dom.releasePointerCapture?.(e.pointerId);
      } catch {
        // Ignore if pointer already released
      }
    };

    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    const onResize = () => {
      if (!container) return;
      const w = container.clientWidth || 640;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', onResize);

    // Animation Loop
    let rafId = 0;
    let prevTime = performance.now();

    const tick = (now: number) => {
      const dt = Math.min((now - prevTime) / 1000, 0.05);
      prevTime = now;
      const refs = sceneRefs.current;
      const ds = dragStateRef.current;

      if (!ds.isDragging) {
        ds.userYawOffset += ds.velX;
        ds.userPitchOffset = THREE.MathUtils.clamp(ds.userPitchOffset + ds.velY, -0.52, 0.52);
        ds.velX *= 0.91;
        ds.velY *= 0.91;
        // Subtle ambient studio turntable
        ds.userYawOffset += dt * 0.16;
      }

      if (refs) {
        // Animate Exiting Models: Drop downward + slight forward pitch + shrink
        for (let i = refs.exitingSlots.length - 1; i >= 0; i--) {
          const slot = refs.exitingSlots[i];
          slot.progress += dt / 0.48;
          if (slot.progress >= 1) {
            refs.stageRoot.remove(slot.wrapper);
            disposeGroup(slot.wrapper);
            refs.exitingSlots.splice(i, 1);
            continue;
          }
          const e = easeInCubic(slot.progress);
          slot.wrapper.position.y = -3.8 * e;
          slot.wrapper.position.z = -0.35 * e;
          slot.wrapper.rotation.x = 0.28 * e;
          const scOut = 1 - 0.22 * e;
          slot.wrapper.scale.setScalar(scOut);
        }

        // Animate Incoming / Active Model: Sweep in from right (x: +4.8 -> 0)
        const active = refs.currentSlot;
        if (active) {
          if (active.phase === 'entering') {
            active.progress = Math.min(1, active.progress + dt / 0.62);
            const e = easeOutCubic(active.progress);
            active.wrapper.position.x = 4.8 * (1 - e);
            active.wrapper.position.y = 0.22 * (1 - e) + Math.sin(now * 0.0016) * 0.05;
            active.wrapper.rotation.z = -0.06 * (1 - e);
            active.wrapper.scale.setScalar(0.86 + 0.14 * e);
            if (active.progress >= 1) {
              active.phase = 'idle';
            }
          } else {
            active.wrapper.position.x = 0;
            active.wrapper.position.y = Math.sin(now * 0.0016) * 0.05;
            active.wrapper.rotation.z = 0;
            active.wrapper.scale.setScalar(1);
          }

          active.model.rotation.y = active.baseYaw + ds.userYawOffset;
          active.model.rotation.x = active.basePitch + ds.userPitchOffset;
          active.model.rotation.z = active.baseRoll;
        }
      }

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      dom.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', onResize);

      if (sceneRefs.current) {
        if (sceneRefs.current.currentSlot) {
          disposeGroup(sceneRefs.current.currentSlot.wrapper);
        }
        sceneRefs.current.exitingSlots.forEach((s) => disposeGroup(s.wrapper));
        sceneRefs.current.mats.dispose();
        sceneRefs.current = null;
      }

      shadowPlaneGeo.dispose();
      shadowPlaneMat.dispose();
      aoDiscGeo.dispose();
      envTex.dispose();
      renderer.dispose();
    };
  }, []);

  // Trigger Outgoing Drop + Incoming Right-Entry Slide Transition on slide change
  useEffect(() => {
    const refs = sceneRefs.current;
    if (!refs) return;

    const isFirstMount = refs.currentSlot === null;

    if (refs.currentSlot) {
      const prev = refs.currentSlot;
      prev.phase = 'exiting';
      prev.progress = 0;
      refs.exitingSlots.push(prev);
      refs.currentSlot = null;
    }

    dragStateRef.current.userYawOffset = 0;
    dragStateRef.current.userPitchOffset = 0;
    dragStateRef.current.velX = 0;
    dragStateRef.current.velY = 0;

    const model = buildHardwareMesh(kind, refs.mats);
    model.traverse((obj) => {
      if (obj instanceof THREE.Mesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });

    const wrapper = new THREE.Group();
    wrapper.add(model);

    if (isFirstMount) {
      wrapper.position.set(0, 0, 0);
    } else {
      wrapper.position.set(4.8, 0.22, 0);
      wrapper.scale.setScalar(0.86);
    }

    refs.stageRoot.add(wrapper);

    refs.currentSlot = {
      wrapper,
      model,
      basePitch: model.rotation.x,
      baseYaw: model.rotation.y,
      baseRoll: model.rotation.z,
      phase: isFirstMount ? 'idle' : 'entering',
      progress: isFirstMount ? 1 : 0,
    };
  }, [kind, slideKey]);

  if (webglFailed) {
    return (
      <div className={`relative w-full h-full flex items-center justify-center ${className}`}>
        {fallbackImage && (
          <img
            src={fallbackImage}
            alt={fallbackAlt}
            className="max-h-full w-auto object-contain drop-shadow-2xl"
          />
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full select-none cursor-grab active:cursor-grabbing ${className}`}
      aria-label={fallbackAlt}
    />
  );
};

export default ProductSlider3D;
