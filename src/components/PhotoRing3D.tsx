import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { BATCH_STUDENTS, Student } from '../data/students';
import { Play, Pause, Grid, Layers, ExternalLink, RotateCcw } from 'lucide-react';
import { StudentAvatar } from './StudentAvatar';

interface PhotoRing3DProps {
  onSelectStudent: (student: Student) => void;
}

export const PhotoRing3D: React.FC<PhotoRing3DProps> = ({ onSelectStudent }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [selectedStudent, setSelectedStudent] = useState<Student>(BATCH_STUDENTS[0]);
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
  const rotationAngleRef = useRef<number>(0);
  const targetRotationVelocityRef = useRef<number>(0.0025);
  const currentRotationVelocityRef = useRef<number>(0.0025);
  const sceneRef = useRef<{
    renderer: THREE.WebGLRenderer;
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    orbitGroup: THREE.Group;
    cardMeshes: THREE.Mesh[];
    raycaster: THREE.Raycaster;
    pointer: THREE.Vector2;
  } | null>(null);

  // Sync state to ref
  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Check reduced motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mediaQuery.matches) {
      setIsPlaying(false);
      isPlayingRef.current = false;
    }
  }, []);

  // Procedurally generate a pristine card texture for each student
  const createStudentCardTexture = useCallback((student: Student): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 680;
    const ctx = canvas.getContext('2d')!;

    // Rounded rectangle helper
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
      ctx.arcTo(x, y, x + w, y, r);
      ctx.closePath();
    };

    // Deep midnight gradient background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 680);
    bgGrad.addColorStop(0, '#0f1c3f');
    bgGrad.addColorStop(0.5, '#0B1530');
    bgGrad.addColorStop(1, '#070D1C');
    ctx.fillStyle = bgGrad;
    roundRect(10, 10, 492, 660, 24);
    ctx.fill();

    // Outer gold border
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#C8A45D';
    roundRect(10, 10, 492, 660, 24);
    ctx.stroke();

    // Inner subtle gold border
    ctx.lineWidth = 1;
    ctx.strokeStyle = 'rgba(231, 211, 155, 0.35)';
    roundRect(18, 18, 476, 644, 18);
    ctx.stroke();

    // Corner decorative accents
    ctx.fillStyle = '#C8A45D';
    const corners = [
      [28, 28],
      [484, 28],
      [28, 652],
      [484, 652],
    ];
    corners.forEach(([cx, cy]) => {
      ctx.beginPath();
      ctx.arc(cx, cy, 3, 0, Math.PI * 2);
      ctx.fill();
    });

    // Top University Header
    ctx.fillStyle = '#E7D39B';
    ctx.font = '600 16px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('MUST · FA23 · BS MLT', 256, 55);

    // Roll number tag
    ctx.fillStyle = '#C8A45D';
    ctx.font = '600 14px monospace';
    ctx.fillText(student.rollNo, 256, 78);

    // Central circular portrait badge
    const centerX = 256;
    const centerY = 240;
    const radius = 130;

    // Glowing circle frame
    const circleGrad = ctx.createRadialGradient(
      centerX,
      centerY,
      10,
      centerX,
      centerY,
      radius
    );
    circleGrad.addColorStop(0, '#1a2e63');
    circleGrad.addColorStop(1, '#070D1C');
    ctx.fillStyle = circleGrad;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineWidth = 3;
    ctx.strokeStyle = '#C8A45D';
    ctx.stroke();

    // Monogram Initials
    ctx.fillStyle = '#F5F0E5';
    ctx.font = '700 72px "Cinzel", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(student.initials, centerX, centerY - 10);

    // Sub-icon label
    ctx.fillStyle = '#C8A45D';
    ctx.font = '500 14px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('BS MLT BROTHERHOOD', centerX, centerY + 58);

    // Student Name
    ctx.textBaseline = 'alphabetic';
    ctx.fillStyle = '#F5F0E5';
    ctx.font = '700 32px "Cinzel", Georgia, serif';
    ctx.fillText(student.name, 256, 440);

    // Role / Title
    ctx.fillStyle = '#E7D39B';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(student.batchRole, 256, 475);

    // Divider line with diamond
    ctx.strokeStyle = 'rgba(200, 164, 93, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(100, 505);
    ctx.lineTo(412, 505);
    ctx.stroke();

    ctx.fillStyle = '#C8A45D';
    ctx.beginPath();
    ctx.moveTo(256, 500);
    ctx.lineTo(261, 505);
    ctx.lineTo(256, 510);
    ctx.lineTo(251, 505);
    ctx.closePath();
    ctx.fill();

    // Specialty / Focus
    ctx.fillStyle = '#A3B3D9';
    ctx.font = 'italic 16px "Cormorant Garamond", Georgia, serif';
    ctx.fillText(student.specialtyInterest, 256, 540);

    // Bottom Badge
    ctx.fillStyle = 'rgba(200, 164, 93, 0.15)';
    roundRect(80, 590, 352, 40, 8);
    ctx.fill();
    ctx.strokeStyle = 'rgba(200, 164, 93, 0.4)';
    ctx.lineWidth = 1;
    roundRect(80, 590, 352, 40, 8);
    ctx.stroke();

    ctx.fillStyle = '#E7D39B';
    ctx.font = '600 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CLICK TO VIEW FULL PROFILE', 256, 615);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Check if custom real photo exists, and overlay it if available
    const img = new Image();
    img.src = student.photoUrl;
    img.onload = () => {
      // Draw actual photo inside the circular clipping path
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
      // redraw border
      ctx.lineWidth = 3;
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

    // Probe WebGL
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
    const height = container.clientHeight || 580;

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x070d1c, 0.035);

    const camera = new THREE.PerspectiveCamera(48, width / height, 0.1, 100);
    camera.position.set(0, 3.2, 12.8);
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
    renderer.toneMappingExposure = 1.15;

    // 2. Lighting Rig
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xe7d39b, 2.2);
    keyLight.position.set(5, 10, 8);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0x7395d9, 1.4);
    fillLight.position.set(-6, -4, -6);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xc8a45d, 3, 20);
    rimLight.position.set(0, -2, 2);
    scene.add(rimLight);

    // 3. Main Orbit Group (Tilted in 3D Space)
    const orbitGroup = new THREE.Group();
    // Elegant diagonal tilt
    orbitGroup.rotation.x = 0.38;
    orbitGroup.rotation.z = -0.14;
    scene.add(orbitGroup);

    // 4. Glowing Gold Orbit Ring Curve
    const radiusX = 6.4;
    const radiusZ = 4.2;

    const curvePoints: THREE.Vector3[] = [];
    const segments = 120;
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
    const orbitGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const orbitMaterial = new THREE.LineBasicMaterial({
      color: 0xc8a45d,
      transparent: true,
      opacity: 0.65,
      linewidth: 2,
    });
    const orbitLine = new THREE.Line(orbitGeometry, orbitMaterial);
    orbitGroup.add(orbitLine);

    // Secondary subtle outer orbit ring
    const outerCurvePoints: THREE.Vector3[] = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      outerCurvePoints.push(
        new THREE.Vector3(
          Math.cos(theta) * (radiusX + 0.5),
          0,
          Math.sin(theta) * (radiusZ + 0.35)
        )
      );
    }
    const outerOrbitGeometry = new THREE.BufferGeometry().setFromPoints(outerCurvePoints);
    const outerOrbitMaterial = new THREE.LineBasicMaterial({
      color: 0xe7d39b,
      transparent: true,
      opacity: 0.25,
    });
    const outerOrbitLine = new THREE.Line(outerOrbitGeometry, outerOrbitMaterial);
    orbitGroup.add(outerOrbitLine);

    // 5. Star / Golden Particle Dust
    const particleCount = 180;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 22;
      particlePositions[i + 1] = (Math.random() - 0.5) * 12;
      particlePositions[i + 2] = (Math.random() - 0.5) * 16;
    }
    particleGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(particlePositions, 3)
    );
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xc8a45d,
      size: 0.08,
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
    });
    const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particleSystem);

    // 6. Create 12 Portrait Cards
    const cardMeshes: THREE.Mesh[] = [];
    const cardWidth = 1.35;
    const cardHeight = 1.8;
    const cardGeometry = new THREE.PlaneGeometry(cardWidth, cardHeight);

    BATCH_STUDENTS.forEach((student, index) => {
      const texture = createStudentCardTexture(student);
      const cardMaterial = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.3,
        metalness: 0.2,
        transparent: true,
        side: THREE.DoubleSide,
      });

      const mesh = new THREE.Mesh(cardGeometry, cardMaterial);
      mesh.userData = { student, index };

      // Initial angle
      const theta = (index / BATCH_STUDENTS.length) * Math.PI * 2;
      mesh.position.set(
        Math.cos(theta) * radiusX,
        0,
        Math.sin(theta) * radiusZ
      );

      orbitGroup.add(mesh);
      cardMeshes.push(mesh);
    });

    // 7. Raycaster for picking
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    sceneRef.current = {
      renderer,
      scene,
      camera,
      orbitGroup,
      cardMeshes,
      raycaster,
      pointer,
    };

    // 8. Animation & Render Loop
    let animationFrameId: number;

    const tick = () => {
      // Apply rotation speed
      if (isPlayingRef.current && !isDraggingRef.current) {
        // If hovered, slow down by 75%
        const targetSpeed = isHoveredRef.current ? 0.0006 : 0.0022;
        currentRotationVelocityRef.current +=
          (targetSpeed - currentRotationVelocityRef.current) * 0.08;
      } else if (!isPlayingRef.current && !isDraggingRef.current) {
        currentRotationVelocityRef.current *= 0.92;
      }

      rotationAngleRef.current += currentRotationVelocityRef.current;

      // Update positions along elliptical orbit
      const totalStudents = cardMeshes.length;
      cardMeshes.forEach((mesh, index) => {
        const theta =
          (index / totalStudents) * Math.PI * 2 + rotationAngleRef.current;
        const x = Math.cos(theta) * radiusX;
        const z = Math.sin(theta) * radiusZ;
        const y = Math.sin(theta * 2) * 0.15; // subtle wave

        mesh.position.set(x, y, z);

        // Keep cards oriented toward the camera with slight organic sway
        mesh.quaternion.copy(camera.quaternion);

        // Scale & Opacity based on Z depth in camera view
        // Cards in front (lower Z or higher screen Z) get full prominence
        const depth = (z + radiusZ) / (2 * radiusZ); // 0 (far) to 1 (near)
        const scaleFactor = THREE.MathUtils.lerp(0.82, 1.15, depth);
        mesh.scale.set(scaleFactor, scaleFactor, 1);

        const material = mesh.material as THREE.MeshStandardMaterial;
        material.opacity = THREE.MathUtils.lerp(0.48, 1.0, depth);
      });

      // Slowly rotate background particle stars
      particleSystem.rotation.y += 0.0004;

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(tick);
    };

    tick();

    // 9. Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 580;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      // Clean up WebGL resources
      cardMeshes.forEach((mesh) => {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach((m) => m.dispose());
        } else {
          mesh.material.dispose();
        }
      });
      orbitGeometry.dispose();
      orbitMaterial.dispose();
      outerOrbitGeometry.dispose();
      outerOrbitMaterial.dispose();
      particleGeometry.dispose();
      particleMaterial.dispose();
      renderer.dispose();
      sceneRef.current = null;
    };
  }, [createStudentCardTexture, isStaticMode]);

  // Pointer & Drag Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    isDraggingRef.current = true;
    previousPointerXRef.current = e.clientX;
    pointerStartPosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!sceneRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Hover state update
    isHoveredRef.current = true;

    // Update normalized pointer coordinates for raycasting
    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    sceneRef.current.pointer.set(x, y);

    // If dragging, adjust rotation angle directly
    if (isDraggingRef.current) {
      const deltaX = e.clientX - previousPointerXRef.current;
      previousPointerXRef.current = e.clientX;
      const sensitivity = 0.005;
      rotationAngleRef.current += deltaX * sensitivity;
      currentRotationVelocityRef.current = deltaX * 0.0012;
    } else {
      // Raycast on hover for tooltip or highlight
      sceneRef.current.raycaster.setFromCamera(
        sceneRef.current.pointer,
        sceneRef.current.camera
      );
      const intersects = sceneRef.current.raycaster.intersectObjects(
        sceneRef.current.cardMeshes
      );
      if (intersects.length > 0) {
        const topIntersect = intersects[0];
        const student = (topIntersect.object as THREE.Mesh).userData.student;
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

    // Calculate movement distance to distinguish click from drag
    const dx = e.clientX - pointerStartPosRef.current.x;
    const dy = e.clientY - pointerStartPosRef.current.y;
    const distance = Math.hypot(dx, dy);

    // Threshold check (under 6 pixels = intentional tap/click)
    if (distance < 6) {
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
        // Pick the closest front card
        const closest = intersects[0];
        const student: Student = (closest.object as THREE.Mesh).userData.student;
        setSelectedStudent(student);
      }
    }
  };

  const handlePointerLeave = () => {
    isDraggingRef.current = false;
    isHoveredRef.current = false;
    setHoveredStudent(null);
  };

  const resetRotation = () => {
    rotationAngleRef.current = 0;
    currentRotationVelocityRef.current = 0.0025;
    setIsPlaying(true);
  };

  return (
    <section
      id="the-ring"
      aria-label="3D Rotating Photo Ring"
      className="relative w-full min-h-[720px] lg:min-h-[780px] bg-[#070D1C] flex flex-col items-center justify-between overflow-hidden py-10 px-4 select-none border-y border-[#C8A45D]/15"
    >
      {/* Background ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-[#102047]/40 rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[250px] bg-[#C8A45D]/10 rounded-full blur-[80px] pointer-events-none" />

      {/* Section Header */}
      <div className="relative z-10 text-center max-w-3xl mx-auto mb-2 px-4">
        <div className="text-xs tracking-[0.25em] uppercase font-semibold text-[#C8A45D] mb-2 font-cinzel">
          Signature Interactive Archive
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-cinzel font-bold text-[#F5F0E5] tracking-tight">
          The 12 Brothers Orbit
        </h2>
        <p className="mt-2 text-sm sm:text-base text-[#E7D39B]/80 font-editorial italic max-w-xl mx-auto">
          Drag horizontally to rotate the batch ring. Hover to decelerate. Click any portrait to inspect.
        </p>
      </div>

      {/* 3D Viewport or Static View */}
      <div
        ref={containerRef}
        className="relative w-full max-w-6xl h-[460px] sm:h-[500px] md:h-[540px] flex items-center justify-center my-auto"
      >
        {!isStaticMode && webGlSupported ? (
          <canvas
            ref={canvasRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerLeave}
            className="w-full h-full cursor-grab active:cursor-grabbing touch-none focus:outline-none"
            aria-label="Interactive 3D elliptical photo ring of 12 BS MLT students"
          />
        ) : (
          /* Attractive Static Portrait Grid Fallback */
          <div className="w-full h-full overflow-y-auto px-4 py-6 scrollbar-thin">
            <div className="text-center mb-6">
              <span className="text-xs uppercase tracking-widest text-[#C8A45D] bg-[#0B1530] px-3 py-1 rounded border border-[#C8A45D]/30">
                Static Roster View Active
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {BATCH_STUDENTS.map((student) => (
                <div
                  key={student.id}
                  onClick={() => {
                    setSelectedStudent(student);
                    onSelectStudent(student);
                  }}
                  className={`p-3 rounded-xl bg-[#0B1530]/80 border transition-all duration-200 cursor-pointer text-center flex flex-col items-center hover:scale-105 ${
                    selectedStudent.id === student.id
                      ? 'border-[#C8A45D] ring-2 ring-[#C8A45D]/40 bg-[#102047]'
                      : 'border-[#C8A45D]/25 hover:border-[#C8A45D]/60'
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
                    {student.batchRole}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Hover quick tip tooltip */}
        {hoveredStudent && !isStaticMode && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full bg-[#0B1530]/90 border border-[#C8A45D]/50 text-xs font-medium text-[#E7D39B] shadow-xl pointer-events-none animate-in fade-in duration-150">
            Click to inspect <span className="font-bold text-white">{hoveredStudent.name}</span> ({hoveredStudent.rollNo})
          </div>
        )}
      </div>

      {/* Floating Bottom Control & Selected Student HUD Dock */}
      <div className="relative z-20 w-full max-w-4xl mx-auto mt-4 px-4">
        <div className="bg-[#0B1530]/90 border border-[#C8A45D]/30 rounded-2xl p-4 sm:p-5 backdrop-blur-md shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 gold-box-glow">
          {/* Active selection info */}
          <div className="flex items-center gap-3.5 w-full sm:w-auto text-left">
            <StudentAvatar student={selectedStudent} size="md" className="shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[11px] text-[#C8A45D] font-mono">
                <span>{selectedStudent.rollNo}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans text-[#E7D39B]/80 truncate">
                  {selectedStudent.labStation}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-cinzel font-bold text-[#F5F0E5] truncate">
                {selectedStudent.name}
              </h3>
              <p className="text-xs text-[#E7D39B]/70 truncate max-w-xs sm:max-w-md">
                {selectedStudent.batchRole}
              </p>
            </div>
          </div>

          {/* Interactive Action Buttons */}
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
            {/* View Profile Button */}
            <button
              onClick={() => onSelectStudent(selectedStudent)}
              className="px-4 py-2 text-xs font-semibold uppercase tracking-wider text-[#070D1C] bg-gradient-to-r from-[#C8A45D] to-[#E7D39B] hover:brightness-110 rounded-lg shadow-md transition-all flex items-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
            >
              <span>View Profile</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>

            {/* Play/Pause Button */}
            {!isStaticMode && (
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                aria-label={isPlaying ? 'Pause 3D rotation' : 'Play 3D rotation'}
                className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
                title={isPlaying ? 'Pause Rotation' : 'Resume Rotation'}
              >
                {isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4" />
                )}
              </button>
            )}

            {/* Reset Angle Button */}
            {!isStaticMode && (
              <button
                onClick={resetRotation}
                aria-label="Reset ring angle"
                className="p-2.5 rounded-lg text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border border-[#C8A45D]/30 hover:border-[#C8A45D] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer"
                title="Reset Orbit Angle"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            )}

            {/* Toggle Static / 3D Grid */}
            <button
              onClick={() => setIsStaticMode(!isStaticMode)}
              aria-label={isStaticMode ? 'Switch to 3D Orbit View' : 'Switch to Static Grid View'}
              className={`p-2.5 rounded-lg border transition-colors focus:outline-none focus:ring-2 focus:ring-[#C8A45D] cursor-pointer ${
                isStaticMode
                  ? 'bg-[#C8A45D] text-[#070D1C] border-[#C8A45D]'
                  : 'text-[#E7D39B] bg-[#070D1C]/80 hover:bg-[#070D1C] border-[#C8A45D]/30 hover:border-[#C8A45D]'
              }`}
              title={isStaticMode ? 'Switch to 3D Orbit' : 'Switch to Static Grid'}
            >
              {isStaticMode ? (
                <Layers className="w-4 h-4" />
              ) : (
                <Grid className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
