import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BATCH_STUDENTS, Student } from '../data/students';
import {
  Play,
  Pause,
  Grid,
  Layers,
  ExternalLink,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';

interface PhotoRing3DProps {
  onSelectStudent: (student: Student) => void;
}

export const PhotoRing3D: React.FC<PhotoRing3DProps> = ({ onSelectStudent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [isStaticMode, setIsStaticMode] = useState<boolean>(false);
  const [webGlSupported, setWebGlSupported] = useState<boolean>(true);
  const [hoveredStudent, setHoveredStudent] = useState<Student | null>(null);

  // References for animation state
  const isPlayingRef = useRef<boolean>(true);
  const isDraggingRef = useRef<boolean>(false);
  const isHoveredRef = useRef<boolean>(false);
  const previousPointerXRef = useRef<number>(0);
  const pointerStartPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Orbit angle tracking
  const rotationAngleRef = useRef<number>(0);
  const targetAngleRef = useRef<number | null>(null);
  const currentRotationVelocityRef = useRef<number>(0.0022);

  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    orbitGroup: THREE.Group;
    cardMeshes: THREE.Mesh[];
    orbitTubeMat: THREE.MeshStandardMaterial;
    orbitOuterLineMat: THREE.LineBasicMaterial;
    photonBeads: THREE.Mesh[];
    nebulaMesh: THREE.Mesh;
    spotlight: THREE.SpotLight;
    particleSystem: THREE.Points;
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
  } | null>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, []);

  // Generate high-resolution procedural canvas textures for each of the 12 brothers
  const createStudentCardTexture = useCallback((student: Student): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 700;
    const ctx = canvas.getContext('2d')!;

    const roundRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) => {
      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + w, y, x + w, y + h, r);
      ctx.arcTo(x + w, y + h, x, y + h, r);
      ctx.arcTo(x, y + h, x, y, r);
      ctx.arcTo(x, y + w, x, y, r);
      ctx.closePath();
    };

    // Deep Midnight luxury glass gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 700);
    bgGrad.addColorStop(0, '#10224d');
    bgGrad.addColorStop(0.3, '#0b1633');
    bgGrad.addColorStop(0.7, '#070d1c');
    bgGrad.addColorStop(1, '#040711');
    ctx.fillStyle = bgGrad;
    roundRect(10, 10, 492, 680, 28);
    ctx.fill();

    // Outer thick antique gold frame
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#D4AF37';
    roundRect(10, 10, 492, 680, 28);
    ctx.stroke();

    // Secondary inner champagne hairline border
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(245, 229, 184, 0.5)';
    roundRect(18, 18, 476, 664, 22);
    ctx.stroke();

    // Corner luxury gold diamonds
    ctx.fillStyle = '#D4AF37';
    const corners = [
      [28, 28],
      [484, 28],
      [28, 672],
      [484, 672],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3.5, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top Header: MUST BS MLT BOYS
    ctx.fillStyle = '#F5E5B8';
    ctx.font = '700 17px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('MUST · FA23 · BS MLT', 256, 56);

    // Roll number pill badge
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    roundRect(166, 70, 180, 28, 6);
    ctx.fill();
    ctx.strokeStyle = '#D4AF37';
    ctx.lineWidth = 1;
    roundRect(166, 70, 180, 28, 6);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.font = '600 14px monospace';
    ctx.fillText(student.rollNo, 256, 89);

    // Circular portrait badge
    const centerX = 256;
    const centerY = 245;
    const radius = 125;

    // Deep radial backing
    const circleGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      10,
      centerX,
      centerY,
      radius
    );
    circleGrad.addColorStop(0, '#1c336b');
    circleGrad.addColorStop(0.7, '#0B1530');
    circleGrad.addColorStop(1, '#050a17');
    ctx.fillStyle = circleGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    // Glowing border ring
    ctx.lineWidth = 3.5;
    ctx.strokeStyle = '#D4AF37';
    ctx.stroke();

    // Stylized Monogram Initials
    ctx.fillStyle = '#F8F5EE';
    ctx.font = '700 70px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(student.initials, centerX, centerY - 12);

    // Nickname tag
    ctx.fillStyle = '#F5E5B8';
    ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`"${student.nickname}"`, centerX, centerY + 46);

    ctx.textBaseline = 'alphabetic';

    // Student Name
    ctx.fillStyle = '#F8F5EE';
    ctx.font = '700 32px "Cinzel", Georgia, serif';
    ctx.fillText(student.name, 256, 440);

    // Batch Role
    ctx.fillStyle = '#D4AF37';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.batchRole, 256, 472);

    // Divider line with gold diamond
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 500);
    ctx.lineTo(422, 500);
    ctx.stroke();

    ctx.fillStyle = '#D4AF37';
    ctx.beginPath();
    ctx.moveTo(256, 495);
    ctx.lineTo(261, 500);
    ctx.lineTo(256, 505);
    ctx.lineTo(251, 500);
    ctx.closePath();
    ctx.fill();

    // 2027 Farewell Motto
    ctx.fillStyle = '#A3B3D9';
    ctx.font = 'italic 15px "Cormorant Garamond", Georgia, serif';
    ctx.fillText('Class of 2027 · Legacy of 12 Brothers', 256, 532);

    // Focus specialty
    ctx.fillStyle = '#F5E5B8';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.specialtyInterest, 256, 564);

    // Bottom Action CTA
    ctx.fillStyle = 'rgba(212, 175, 55, 0.2)';
    roundRect(70, 610, 372, 42, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.55)';
    ctx.lineWidth = 1;
    roundRect(70, 610, 372, 42, 8);
    ctx.stroke();

    ctx.fillStyle = '#F5E5B8';
    ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CLICK TO VIEW 2027 MEMORY PROFILE', 256, 636);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Check if custom user photograph is provided
    const img = new Image();
    img.src = student.photoUrl;
    img.onload = () => {
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius - 2, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(
        img,
        centerX - radius,
        centerY - radius,
        radius * 2,
        radius * 2
      );
      ctx.restore();

      ctx.lineWidth = 3.5;
      ctx.strokeStyle = '#D4AF37';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      texture.needsUpdate = true;
    };

    return texture;
  }, []);

  // Atmospheric Nebula Texture Generator
  const createAtmosphericNebulaTexture = useCallback((): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d')!;

    // Cosmic deep blue radial gradient with soft gold coronal edge
    const grad = ctx.createRadialGradient(512, 512, 60, 512, 512, 512);
    grad.addColorStop(0, 'rgba(42, 98, 220, 0.75)');
    grad.addColorStop(0.25, 'rgba(24, 60, 160, 0.5)');
    grad.addColorStop(0.55, 'rgba(15, 34, 100, 0.3)');
    grad.addColorStop(0.75, 'rgba(212, 175, 55, 0.15)'); // Golden stardust ring
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1024, 1024);

    // Stardust sparkles
    for (let i = 0; i < 110; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 420;
      const x = 512 + Math.cos(angle) * dist;
      const y = 512 + Math.sin(angle) * dist;
      const r = Math.random() * 2 + 0.5;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fillStyle = Math.random() > 0.4 ? 'rgba(245, 229, 184, 0.9)' : 'rgba(120, 190, 255, 0.9)';
      ctx.fill();
    }

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);

  // Initialize Three.js scene
  useEffect(() => {
    if (isStaticMode) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    try {
      const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
      if (!gl) {
        setWebGlSupported(false);
        setIsStaticMode(true);
        return;
      }
    } catch {
      setWebGlSupported(false);
      setIsStaticMode(true);
      return;
    }

    const width = container.clientWidth;
    const height = container.clientHeight || 620;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030713, 0.028);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    camera.position.set(0, 3.4, 13.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;

    // 2. Deep Blue Space Atmospheric Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xf5e5b8, 2.6);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x4d7cff, 1.8);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    // Deep space back ambient light (glow behind ring)
    const spaceBackLight = new THREE.PointLight(0x1945a0, 5.5, 34);
    spaceBackLight.position.set(0, 0, -4);
    scene.add(spaceBackLight);

    // Warm Solar Center Point Light
    const solarCenterLight = new THREE.PointLight(0xd4af37, 3.2, 22);
    solarCenterLight.position.set(0, 0, 0);
    scene.add(solarCenterLight);

    // Front Spotlight on currently focused brother
    const spotlight = new THREE.SpotLight(0xd4af37, 4.5, 26, Math.PI / 4, 0.5);
    spotlight.position.set(0, 5, 12);
    spotlight.target.position.set(0, 0, 4);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // 3. Volumetric Ambient Atmospheric Nebula Glow Mesh behind the ring
    const nebulaGeo = new THREE.PlaneGeometry(24, 18);
    const nebulaMat = new THREE.MeshBasicMaterial({
      map: createAtmosphericNebulaTexture(),
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const nebulaMesh = new THREE.Mesh(nebulaGeo, nebulaMat);
    nebulaMesh.position.set(0, 0.4, -4.5);
    scene.add(nebulaMesh);

    // 4. Orbit Group with Diagonal Tilt
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = 0.38;
    orbitGroup.rotation.z = -0.12;
    scene.add(orbitGroup);

    // 5. Glowing Gold Pulsing Orbit Rings
    const radiusX = 6.8;
    const radiusZ = 4.6;

    // Primary Glowing Tube Orbit Ring
    const curvePoints: THREE.Vector3[] = [];
    const segments = 160;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      curvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * radiusX,
          0,
          Math.sin(theta) * radiusZ
        )
      );
    }
    const orbitCurve = new THREE.CatmullRomCurve3(curvePoints, true);
    const orbitTubeGeo = new THREE.TubeGeometry(orbitCurve, 140, 0.03, 8, true);
    const orbitTubeMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37,
      emissive: 0xb8903c,
      emissiveIntensity: 0.75,
      roughness: 0.15,
      metalness: 0.95,
    });
    const orbitGlowTube = new THREE.Mesh(orbitTubeGeo, orbitTubeMat);
    orbitGroup.add(orbitGlowTube);

    // Secondary Outer Starlight Orbit Line
    const outerCurvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      outerCurvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * (radiusX + 0.65),
          0,
          Math.sin(theta) * (radiusZ + 0.48)
        )
      );
    }
    const outerGeo = new THREE.BufferGeometry().setFromPoints(outerCurvePoints);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xf5e5b8,
      transparent: true,
      opacity: 0.35,
    });
    const outerLine = new THREE.Line(outerGeo, outerMat);
    orbitGroup.add(outerLine);

    // Traveling Golden Photon Beads on the Orbit
    const photonBeads: THREE.Mesh[] = [];
    const beadGeo = new THREE.SphereGeometry(0.08, 12, 12);
    const beadMat = new THREE.MeshBasicMaterial({
      color: 0xfff3d1,
      transparent: true,
      opacity: 0.9,
    });
    const beadCount = 6;
    for (let i = 0; i < beadCount; i++) {
      const bead = new THREE.Mesh(beadGeo, beadMat);
      orbitGroup.add(bead);
      photonBeads.push(bead);
    }

    // 6. Starlight / Golden Nebula Particle Field
    const particleCount = 280;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 28;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 22;
    }
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xf5e5b8,
      size: 0.095,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 7. 12 High-Res Portrait Card Meshes
    const cardMeshes: THREE.Mesh[] = [];
    const cardWidth = 1.45;
    const cardHeight = 1.98;
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

    BATCH_STUDENTS.forEach((student, index) => {
      const texture = createStudentCardTexture(student);
      const cardMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.22,
        metalness: 0.2,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(cardGeometry, cardMaterial);
      mesh.userData = { student, index };

      const theta = (index / BATCH_STUDENTS.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(theta) * radiusX,
        0,
        Math.sin(theta) * radiusZ
      );

      orbitGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      orbitGroup,
      cardMeshes,
      orbitTubeMat,
      orbitOuterLineMat: outerMat,
      photonBeads,
      nebulaMesh,
      spotlight,
      particleSystem,
      raycaster,
      pointer,
    };

    // 8. Animation Loop
    let animationFrameId: number;

    const tick = () => {
      const clockTime = performance.now() * 0.001;

      // Subtle Pulsing Gold Gradient on Orbit Line
      const pulse = 0.7 + Math.sin(clockTime * 1.8) * 0.35;
      orbitTubeMat.emissiveIntensity = pulse;
      const goldHue = 0.11 + Math.sin(clockTime * 0.8) * 0.015;
      orbitTubeMat.emissive.setHSL(goldHue, 0.85, 0.45 + pulse * 0.12);

      // Outer line subtle opacity breathing
      outerMat.opacity = 0.22 + Math.sin(clockTime * 2.2 + 0.8) * 0.18;

      // Atmospheric Nebula breathing & gentle rotation
      nebulaMesh.rotation.z += 0.0003;
      const nebulaScale = 1.0 + Math.sin(clockTime * 0.9) * 0.035;
      nebulaMesh.scale.set(nebulaScale, nebulaScale, 1);

      // Animate Traveling Golden Photon Beads along the orbit curve
      photonBeads.forEach((bead, i) => {
        const beadT = (clockTime * 0.08 + i / beadCount) % 1;
        const beadTheta = beadT * Math.PI * 2;
        bead.position.set(
          Math.cos(beadTheta) * radiusX,
          Math.sin(beadTheta * 2) * 0.06,
          Math.sin(beadTheta * radiusZ) * 0.1 + Math.sin(beadTheta) * radiusZ
        );
        const beadScale = 0.8 + Math.sin(clockTime * 3 + i) * 0.3;
        bead.scale.set(beadScale, beadScale, beadScale);
      });

      // Smooth interpolation to target angle if user clicked "Next", "Previous" or a card
      if (targetAngleRef.current !== null) {
        const diff = targetAngleRef.current - rotationAngleRef.current;
        if (Math.abs(diff) > 0.002) {
          rotationAngleRef.current += diff * 0.08;
        } else {
          rotationAngleRef.current = targetAngleRef.current;
          targetAngleRef.current = null;
        }
      } else if (isPlayingRef.current && !isDraggingRef.current) {
        const targetSpeed = isHoveredRef.current ? 0.0006 : 0.0022;
        currentRotationVelocityRef.current +=
          (targetSpeed - currentRotationVelocityRef.current) * 0.06;
        rotationAngleRef.current += currentRotationVelocityRef.current;
      } else if (!isPlayingRef.current && !isDraggingRef.current) {
        currentRotationVelocityRef.current *= 0.92;
        rotationAngleRef.current += currentRotationVelocityRef.current;
      }

      // Calculate which brother is in front center
      const total = cardMeshes.length;
      let closestToFrontIndex = 0;
      let maxZ = -999;

      cardMeshes.forEach((mesh, index) => {
        const theta =
          (index / total) * Math.PI * 2 + rotationAngleRef.current;
        const x = Math.cos(theta) * radiusX;
        const z = Math.sin(theta) * radiusZ;
        const y = Math.sin(theta * 2) * 0.18; // soft harmonic floating wave

        mesh.position.set(x, y, z);
        mesh.quaternion.copy(camera.quaternion);

        // Find closest front card
        if (z > maxZ) {
          maxZ = z;
          closestToFrontIndex = index;
        }

        // Depth scaling: front cards scale up, back cards scale down
        const depth = (z + radiusZ) / (2 * radiusZ); // 0 (back) to 1 (front)
        const scale = THREE.MathUtils.lerp(0.8, 1.18, depth);
        mesh.scale.set(scale, scale, 1);

        const mat = mesh.material as THREE.MeshStandardMaterial;
        mat.opacity = THREE.MathUtils.lerp(0.42, 1.0, depth);
      });

      // Update current front brother in state if changed
      if (closestToFrontIndex !== currentIndex && !isDraggingRef.current) {
        setCurrentIndex(closestToFrontIndex);
      }

      particleSystem.rotation.y += 0.0004;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 620;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      cardMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      orbitTubeGeo.dispose();
      orbitTubeMat.dispose();
      outerGeo.dispose();
      outerMat.dispose();
      beadGeo.dispose();
      beadMat.dispose();
      nebulaGeo.dispose();
      nebulaMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [createStudentCardTexture, createAtmosphericNebulaTexture, isStaticMode]);

  // Rotate smoothly to bring a specific student index to front center
  const rotateToIndex = (targetIndex: number) => {
    const total = BATCH_STUDENTS.length;
    const targetTheta = Math.PI / 2 - (targetIndex / total) * Math.PI * 2;
    const current = rotationAngleRef.current;
    const diff = ((targetTheta - current) % (Math.PI * 2) + Math.PI * 3) % (Math.PI * 2) - Math.PI;
    targetAngleRef.current = current + diff;
    setCurrentIndex(targetIndex);
  };

  const handleNextBrother = () => {
    const next = (currentIndex + 1) % BATCH_STUDENTS.length;
    rotateToIndex(next);
  };

  const handlePrevBrother = () => {
    const prev = (currentIndex - 1 + BATCH_STUDENTS.length) % BATCH_STUDENTS.length;
    rotateToIndex(prev);
  };

  // Pointer Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousPointerXRef.current = e.clientX;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
    targetAngleRef.current = null; // cancel programmatic rotation
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sceneRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    isHoveredRef.current = true;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    sceneRef.current.pointer.set(x, y);

    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousPointerXRef.current;
      previousPointerXRef.current = e.clientX;
      const sensitivity = 0.0055;
      rotationAngleRef.current += deltaX * sensitivity;
      currentRotationVelocityRef.current = deltaX * 0.0014;
    } else {
      sceneRef.current.raycaster.setFromCamera(
        sceneRef.current.pointer,
        sceneRef.current.camera
      );
      const intersects = sceneRef.current.raycaster.intersectObjects(
        sceneRef.current.cardMeshes
      );
      if (intersects.length > 0) {
        const top = intersects[0];
        const student = (top.object as THREE.Mesh).userData.student;
        setHoveredStudent(student);
        canvas.style.cursor = 'pointer';
      } else {
        setHoveredStudent(null);
        canvas.style.cursor = isDraggingRef.current ? 'grabbing' : 'grab';
      }
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sceneRef.current) return;
    isDraggingRef.current = false;

    const dx = e.clientX - pointerStartPosRef.current.x;
    const dy = e.clientY - pointerStartPosRef.current.y;
    const distance = Math.hypot(dx, dy);

    if (distance < 7) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      sceneRef.current.pointer.set(x, y);
      sceneRef.current.raycaster.setFromCamera(
        sceneRef.current.pointer,
        sceneRef.current.camera
      );

      const intersects = sceneRef.current.raycaster.intersectObjects(
        sceneRef.current.cardMeshes
      );
      if (intersects.length > 0) {
        const closest = intersects[0];
        const mesh = closest.object as THREE.Mesh;
        const student: Student = mesh.userData.student;
        const index: number = mesh.userData.index;

        rotateToIndex(index);
      }
    }
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
    setHoveredStudent(null);
  };

  const selectedStudent = BATCH_STUDENTS[currentIndex];

  return (
    <section
      id="the-ring"
      aria-label="3D Rotating Photo Ring"
      className="relative w-full min-h-[760px] lg:min-h-[840px] bg-[var(--bg-primary)] flex flex-col items-center justify-between overflow-hidden py-10 px-4 select-none border-y border-[var(--border-gold)] transition-colors duration-400"
    >
      {/* Ambient Glowing Atmospheric Glow Behind Ring in Deep Blue Space */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[580px] bg-gradient-to-r from-[#0c2256]/50 via-[#183a82]/40 to-[#0c2256]/50 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[360px] bg-[var(--accent-gold)]/15 rounded-full blur-[100px] pointer-events-none animate-orbit-pulse" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[220px] bg-[#4378ff]/20 rounded-full blur-[70px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-2 px-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-gold)] text-xs font-cinzel text-[var(--accent-gold)] uppercase tracking-widest mb-2 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
          <span>Deep Space Orbit · 12 Brothers Celestial Ring</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F8F5EE] tracking-tight">
          The FA23 Celestial Ring
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[var(--accent-champagne)]/90 font-editorial italic max-w-xl mx-auto">
          Immersed in deep blue space with pulsing golden gravitational resonance. Click any brother to spotlight his legacy.
        </p>
      </div>

      {/* 3D Canvas / Static Viewport */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-[490px] sm:h-[540px] md:h-[580px] flex items-center justify-center my-auto"
      >
        {!isStaticMode && webGlSupported ? (
          <>
            <canvas
              ref={canvasRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              className="w-full h-full cursor-grab active:cursor-grabbing touch-none focus:outline-none"
              aria-label="Interactive 3D elliptical photo ring of 12 BS MLT students in deep blue space"
            />

            {/* Quick Next/Prev floating arrows over canvas */}
            <button
              onClick={handlePrevBrother}
              aria-label="Previous Brother"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--bg-secondary)]/90 border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-[#030713] hover:bg-[var(--accent-gold)] flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextBrother}
              aria-label="Next Brother"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[var(--bg-secondary)]/90 border border-[var(--border-gold)] text-[var(--accent-champagne)] hover:text-[#030713] hover:bg-[var(--accent-gold)] flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        ) : (
          /* Attractive Static Portrait Grid Fallback */
          <div className="w-full h-full overflow-y-auto px-4 py-6 scrollbar-thin">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[var(--accent-gold)] bg-[var(--bg-secondary)] px-3 py-1 rounded border border-[var(--border-gold)]">
                Static Roster Grid Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BATCH_STUDENTS.map((student, idx) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    onSelectStudent(student);
                  }}
                  className={`p-3.5 rounded-xl bg-[var(--bg-secondary)]/90 border transition-all duration-200 cursor-pointer text-center flex flex-col items-center hover:scale-105 ${
                    currentIndex === idx
                      ? 'border-[var(--accent-gold)] ring-2 ring-[var(--accent-gold)]/50 bg-[var(--bg-card)]'
                      : 'border-[var(--border-gold)] hover:border-[var(--accent-gold)]'
                  }`}
                >
                  <StudentAvatar student={student} size="md" className="mb-2" />
                  <div className="text-xs font-mono text-[var(--accent-gold)]">
                    {student.rollNo}
                  </div>
                  <div className="text-xs font-bold font-cinzel text-[#F8F5EE] mt-1 line-clamp-1">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-[var(--accent-champagne)]/70 line-clamp-1 mt-0.5">
                    "{student.nickname}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover quick tip tooltip */}
        {hoveredStudent && !isStaticMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[var(--bg-secondary)]/95 border border-[var(--border-gold-focus)] text-xs font-medium text-[var(--accent-champagne)] shadow-2xl pointer-events-none animate-in fade-in duration-150">
            Click to spotlight <span className="font-bold text-white">{hoveredStudent.name}</span> ({hoveredStudent.rollNo})
          </div>
        )}
      </div>

      {/* Floating Bottom Control & Active Spotlight HUD Dock */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-[var(--bg-secondary)]/95 border border-[var(--border-gold)] rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 gold-box-glow transition-colors duration-300">
          {/* Active selection info */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <StudentAvatar student={selectedStudent} size="md" className="shrink-0 ring-2 ring-[var(--accent-gold)]" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-[var(--accent-gold)] font-mono">
                <span>{selectedStudent.rollNo}</span>
                <span aria-hidden="true">·</span>
                <span className="font-editorial italic text-[var(--accent-champagne)] text-xs">
                  "{selectedStudent.nickname}"
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[10px] uppercase font-cinzel text-white/70">
                  Brother {currentIndex + 1} of 12
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-[#F8F5EE] truncate">
                {selectedStudent.name}
              </h3>
              <p className="text-xs text-[var(--accent-champagne)]/80 truncate max-w-xs sm:max-w-md">
                {selectedStudent.batchRole}
              </p>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
            {/* Step Left */}
            <button
              onClick={handlePrevBrother}
              aria-label="Previous brother"
              className="p-2.5 rounded-lg text-[var(--accent-champagne)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-gold)] hover:border-[var(--accent-gold)] transition-colors focus:outline-none cursor-pointer"
              title="Previous Brother"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Step Right */}
            <button
              onClick={handleNextBrother}
              aria-label="Next brother"
              className="p-2.5 rounded-lg text-[var(--accent-champagne)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-gold)] hover:border-[var(--accent-gold)] transition-colors focus:outline-none cursor-pointer"
              title="Next Brother"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View Full Profile Button */}
            <button
              onClick={() => onSelectStudent(selectedStudent)}
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#030713] bg-gradient-to-r from-[var(--accent-gold)] to-[var(--accent-champagne)] hover:brightness-110 rounded-lg shadow-md transition-all flex items-center gap-1.5 focus:outline-none cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause */}
            {!isStaticMode && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause 3D rotation' : 'Play 3D rotation'}
                className="p-2.5 rounded-lg text-[var(--accent-champagne)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-gold)] hover:border-[var(--accent-gold)] transition-colors focus:outline-none cursor-pointer"
                title={isPlaying ? 'Pause Rotation' : 'Resume Rotation'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
            )}

            {/* Reset Angle */}
            {!isStaticMode && (
              <button
                onClick={() => rotateToIndex(0)}
                aria-label="Reset ring angle"
                className="p-2.5 rounded-lg text-[var(--accent-champagne)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border border-[var(--border-gold)] hover:border-[var(--accent-gold)] transition-colors focus:outline-none cursor-pointer"
                title="Reset to Adil Javed (#001)"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Toggle Static / 3D */}
            <button
              onClick={() => setIsStaticMode(!isStaticMode)}
              aria-label={isStaticMode ? 'Switch to 3D Orbit View' : 'Switch to Static Grid View'}
              className={`p-2.5 rounded-lg border transition-colors focus:outline-none cursor-pointer ${
                isStaticMode
                  ? 'bg-[var(--accent-gold)] text-[#030713] border-[var(--accent-gold)]'
                  : 'text-[var(--accent-champagne)] bg-[var(--bg-primary)]/80 hover:bg-[var(--bg-primary)] border-[var(--border-gold)] hover:border-[var(--accent-gold)]'
              }`}
              title={isStaticMode ? 'Switch to 3D Orbit' : 'Switch to Static Grid'}
            >
              {isStaticMode ? <Layers className="w-4 h-4" /> : <Grid className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
