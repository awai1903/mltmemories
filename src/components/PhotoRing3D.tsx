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
    orbitGlowLine: THREE.Line;
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
    ctx.strokeStyle = '#C8A45D';
    roundRect(10, 10, 492, 680, 28);
    ctx.stroke();

    // Secondary inner champagne hairline border
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = 'rgba(231, 211, 155, 0.45)';
    roundRect(18, 18, 476, 664, 22);
    ctx.stroke();

    // Corner luxury gold diamonds
    ctx.fillStyle = '#C8A45D';
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
    ctx.fillStyle = '#E7D39B';
    ctx.font = '700 17px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('MUST · FA23 · BS MLT', 256, 56);

    // Roll number pill badge
    ctx.fillStyle = 'rgba(200, 164, 93, 0.18)';
    roundRect(166, 70, 180, 28, 6);
    ctx.fill();
    ctx.strokeStyle = '#C8A45D';
    ctx.lineWidth = 1;
    roundRect(166, 70, 180, 28, 6);
    ctx.stroke();

    ctx.fillStyle = '#C8A45D';
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
    ctx.strokeStyle = '#C8A45D';
    ctx.stroke();

    // Stylized Monogram Initials
    ctx.fillStyle = '#F5F0E5';
    ctx.font = '700 70px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(student.initials, centerX, centerY - 12);

    // Nickname tag
    ctx.fillStyle = '#E7D39B';
    ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(`"${student.nickname}"`, centerX, centerY + 46);

    ctx.textBaseline = 'alphabetic';

    // Student Name
    ctx.fillStyle = '#F5F0E5';
    ctx.font = '700 32px "Cinzel", Georgia, serif';
    ctx.fillText(student.name, 256, 440);

    // Batch Role
    ctx.fillStyle = '#C8A45D';
    ctx.font = '600 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.batchRole, 256, 472);

    // Divider line with gold diamond
    ctx.strokeStyle = 'rgba(200, 164, 93, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(90, 500);
    ctx.lineTo(422, 500);
    ctx.stroke();

    ctx.fillStyle = '#C8A45D';
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
    ctx.fillStyle = '#E7D39B';
    ctx.font = '500 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.specialtyInterest, 256, 564);

    // Bottom Action CTA
    ctx.fillStyle = 'rgba(200, 164, 93, 0.18)';
    roundRect(70, 610, 372, 42, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 164, 93, 0.5)';
    ctx.lineWidth = 1;
    roundRect(70, 610, 372, 42, 8);
    ctx.stroke();

    ctx.fillStyle = '#E7D39B';
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
      ctx.strokeStyle = '#C8A45D';
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.stroke();
      texture.needsUpdate = true;
    };

    return texture;
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
    scene.fog = new THREE.FogExp2(0x070d1c, 0.03);

    const camera = new THREE.PerspectiveCamera(46, width / height, 0.1, 100);
    // Adjusted camera distance for cinematic view
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
    renderer.toneMappingExposure = 1.2;

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe7d39b, 2.5);
    keyLight.position.set(6, 12, 10);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7395d9, 1.6);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    // Front Spotlight on currently focused brother
    const spotlight = new THREE.SpotLight(0xc8a45d, 4, 25, Math.PI / 4, 0.5);
    spotlight.position.set(0, 5, 12);
    spotlight.target.position.set(0, 0, 4);
    scene.add(spotlight);
    scene.add(spotlight.target);

    // 3. Orbit Group with Diagonal Tilt
    const orbitGroup = new THREE.Group();
    orbitGroup.rotation.x = 0.38;
    orbitGroup.rotation.z = -0.12;
    scene.add(orbitGroup);

    // 4. Glowing Gold Orbit Rings
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
    const orbitTubeGeo = new THREE.TubeGeometry(orbitCurve, 120, 0.025, 8, true);
    const orbitTubeMat = new THREE.MeshStandardMaterial({
      color: 0xc8a45d,
      emissive: 0x9e7e39,
      emissiveIntensity: 0.6,
      roughness: 0.2,
      metalness: 0.9,
    });
    const orbitGlowTube = new THREE.Mesh(orbitTubeGeo, orbitTubeMat);
    orbitGroup.add(orbitGlowTube);

    // Secondary Outer Fine Line
    const outerCurvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      outerCurvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * (radiusX + 0.6),
          0,
          Math.sin(theta) * (radiusZ + 0.45)
        )
      );
    }
    const outerGeo = new THREE.BufferGeometry().setFromPoints(outerCurvePoints);
    const outerMat = new THREE.LineBasicMaterial({
      color: 0xe7d39b,
      transparent: true,
      opacity: 0.3,
    });
    const outerLine = new THREE.Line(outerGeo, outerMat);
    orbitGroup.add(outerLine);

    // 5. Starlight / Golden Nebula Particle Field
    const particleCount = 240;
    const particleGeo = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 26;
      particlePositions[i + 1] = (Math.random() - 0.5) * 14;
      particlePositions[i + 2] = (Math.random() - 0.5) * 20;
    }
    particleGeo.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMat = new THREE.PointsMaterial({
      color: 0xe7d39b,
      size: 0.09,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 6. 12 High-Res Portrait Card Meshes
    const cardMeshes: THREE.Mesh[] = [];
    const cardWidth = 1.45;
    const cardHeight = 1.98;
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

    BATCH_STUDENTS.forEach((student, index) => {
      const texture = createStudentCardTexture(student);
      const cardMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.25,
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
      orbitGlowLine: outerLine,
      spotlight,
      particleSystem,
      raycaster,
      pointer,
    };

    // 7. Animation Loop
    let animationFrameId: number;

    const tick = () => {
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

    // 8. Resize Handler
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
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [createStudentCardTexture, isStaticMode]);

  // Rotate smoothly to bring a specific student index to front center
  const rotateToIndex = (targetIndex: number) => {
    const total = BATCH_STUDENTS.length;
    // Front center corresponds to theta = Math.PI / 2
    // We want: (targetIndex / total) * 2PI + rotationAngle = Math.PI / 2 + 2PI * k
    const targetTheta = Math.PI / 2 - (targetIndex / total) * Math.PI * 2;
    // Find closest rotation angle matching targetTheta
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

    // If it's a tap/click rather than drag
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

        // Smoothly rotate clicked brother to the front
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
      className="relative w-full min-h-[760px] lg:min-h-[820px] bg-[#070D1C] flex flex-col items-center justify-between overflow-hidden py-10 px-4 select-none border-y border-[#C8A45D]/20"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#122450]/45 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[300px] bg-[#C8A45D]/15 rounded-full blur-[90px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-2 px-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B1530] border border-[#C8A45D]/30 text-xs font-cinzel text-[#C8A45D] uppercase tracking-widest mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#C8A45D]" />
          <span>Interactive 3D Orbit · 12 Brothers</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
          The FA23 Celestial Ring
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#E7D39B]/90 font-editorial italic max-w-xl mx-auto">
          Drag horizontally to spin the ring, or use the navigation arrows below. Click any card to bring that brother straight into the spotlight.
        </p>
      </div>

      {/* 3D Canvas / Static Viewport */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-[480px] sm:h-[530px] md:h-[570px] flex items-center justify-center my-auto"
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
              aria-label="Interactive 3D elliptical photo ring of 12 BS MLT students"
            />

            {/* Quick Next/Prev floating arrows over canvas */}
            <button
              onClick={handlePrevBrother}
              aria-label="Previous Brother"
              className="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0B1530]/90 border border-[#C8A45D]/50 text-[#E7D39B] hover:text-[#070D1C] hover:bg-[#C8A45D] flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <button
              onClick={handleNextBrother}
              aria-label="Next Brother"
              className="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-[#0B1530]/90 border border-[#C8A45D]/50 text-[#E7D39B] hover:text-[#070D1C] hover:bg-[#C8A45D] flex items-center justify-center transition-all shadow-xl cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        ) : (
          /* Attractive Static Portrait Grid Fallback */
          <div className="w-full h-full overflow-y-auto px-4 py-6 scrollbar-thin">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C8A45D] bg-[#0B1530] px-3 py-1 rounded border border-[#C8A45D]/30">
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
                  className={`p-3.5 rounded-xl bg-[#0B1530]/90 border transition-all duration-200 cursor-pointer text-center flex flex-col items-center hover:scale-105 ${
                    currentIndex === idx
                      ? 'border-[#C8A45D] ring-2 ring-[#C8A45D]/50 bg-[#122450]'
                      : 'border-[#C8A45D]/25 hover:border-[#C8A45D]/70'
                  }`}
                >
                  <StudentAvatar student={student} size="md" className="mb-2" />
                  <div className="text-xs font-mono text-[#C8A45D]">
                    {student.rollNo}
                  </div>
                  <div className="text-xs font-bold font-cinzel text-[#F5F0E5] mt-1 line-clamp-1">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-[#E7D39B]/70 line-clamp-1 mt-0.5">
                    "{student.nickname}"
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover quick tip tooltip */}
        {hoveredStudent && !isStaticMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0B1530]/95 border border-[#C8A45D]/70 text-xs font-medium text-[#E7D39B] shadow-2xl pointer-events-none animate-in fade-in duration-150">
            Click to spotlight <span className="font-bold text-white">{hoveredStudent.name}</span> ({hoveredStudent.rollNo})
          </div>
        )}
      </div>

      {/* Floating Bottom Control & Active Spotlight HUD Dock */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-[#0B1530]/95 border border-[#C8A45D]/40 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 gold-box-glow">
          {/* Active selection info */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <StudentAvatar student={selectedStudent} size="md" className="shrink-0 ring-2 ring-[#C8A45D]" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-[#C8A45D] font-mono">
                <span>{selectedStudent.rollNo}</span>
                <span aria-hidden="true">·</span>
                <span className="font-editorial italic text-[#E7D39B] text-xs">
                  "{selectedStudent.nickname}"
                </span>
                <span aria-hidden="true">·</span>
                <span className="text-[10px] uppercase font-cinzel text-white/70">
                  Brother {currentIndex + 1} of 12
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-[#F5F0E5] truncate">
                {selectedStudent.name}
              </h3>
              <p className="text-xs text-[#E7D39B]/80 truncate max-w-xs sm:max-w-md">
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
              className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none cursor-pointer"
              title="Previous Brother"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Step Right */}
            <button
              onClick={handleNextBrother}
              aria-label="Next brother"
              className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none cursor-pointer"
              title="Next Brother"
            >
              <ChevronRight className="w-4 h-4" />
            </button>

            {/* View Full Profile Button */}
            <button
              onClick={() => onSelectStudent(selectedStudent)}
              className="px-4 py-2.5 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-md transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause */}
            {!isStaticMode && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause 3D rotation' : 'Play 3D rotation'}
                className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none cursor-pointer"
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
                className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none cursor-pointer"
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
                  ? 'bg-[#C8A45D] text-[#070D1C] border-[#C8A45D]'
                  : 'text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border-[#C8A45D]/30 hover:border-[#C8A45D]'
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
