"use client";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { motion } from "framer-motion";
import { Suspense, useRef, useState, useEffect, useMemo } from "react";
import * as THREE from "three";
import Loader from "./Loader";

// Main 3D Model Component
function PCModel() {
  // Load your GLB model using useGLTF from drei for efficient caching
  const { scene } = useGLTF("/models/MainModel.glb");
  // Adjust position, rotation, or scale here if your model needs it
  return <primitive object={scene} position={[0, -0.3, 0]} />;
}

// Final, clean, robust Magnifying Lens Overlay
function MagnifyingLensOverlay({ isHovered, mousePosition, containerRect, modelGroupRef, gl, scene, camera }) {
  const lensDiameter = 160;
  const zoomFov = 7;
  const zoomOffset = 0.28;
  const renderRes = 256;
  const dpr = window.devicePixelRatio || 1;

  const lensCamera = useMemo(() => new THREE.PerspectiveCamera(zoomFov, 1, 0.1, 100), [zoomFov]);
  const renderTarget = useMemo(() => new THREE.WebGLRenderTarget(renderRes, renderRes), [renderRes]);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const domCanvasRef = useRef(null);
  const offscreenCanvasRef = useRef(null);

  useEffect(() => {
    if (!gl || !scene || !camera) return;
    let running = true;
    let modelBoundingBox = null;
    if (modelGroupRef.current) {
      modelBoundingBox = new THREE.Box3().setFromObject(modelGroupRef.current);
    }
    const draw = () => {
      if (!running) return;
      if (
        isHovered &&
        containerRect &&
        mousePosition.x !== null &&
        mousePosition.y !== null &&
        modelGroupRef.current
      ) {
        const normalizedX = (mousePosition.x / containerRect.width) * 2 - 1;
        const normalizedY = -(mousePosition.y / containerRect.height) * 2 + 1;
        raycaster.setFromCamera(new THREE.Vector2(normalizedX, normalizedY), camera);
        let intersectionPoint = null;
        const intersects = raycaster.intersectObjects(modelGroupRef.current.children, true);
        if (intersects.length > 0) {
          intersectionPoint = intersects[0].point;
        } else if (modelBoundingBox) {
          const ray = raycaster.ray;
          intersectionPoint = modelBoundingBox.clampPoint(ray.origin.clone().add(ray.direction.clone().multiplyScalar(2)), new THREE.Vector3());
        }
        if (intersectionPoint) {
          const camPos = intersectionPoint.clone().add(
            raycaster.ray.direction.clone().multiplyScalar(-zoomOffset)
          );
          lensCamera.position.copy(camPos);
          lensCamera.lookAt(intersectionPoint);
          lensCamera.updateProjectionMatrix();
          gl.setRenderTarget(renderTarget);
          gl.render(scene, lensCamera);
          gl.setRenderTarget(null);
          const pixels = new Uint8Array(4 * renderRes * renderRes);
          gl.readRenderTargetPixels(renderTarget, 0, 0, renderRes, renderRes, pixels);
          const offCtx = offscreenCanvasRef.current.getContext('2d');
          const imageData = offCtx.createImageData(renderRes, renderRes);
          for (let y = 0; y < renderRes; y++) {
            for (let x = 0; x < renderRes; x++) {
              const srcIdx = 4 * (x + (renderRes - 1 - y) * renderRes);
              const dstIdx = 4 * (x + y * renderRes);
              imageData.data[dstIdx] = pixels[srcIdx];
              imageData.data[dstIdx + 1] = pixels[srcIdx + 1];
              imageData.data[dstIdx + 2] = pixels[srcIdx + 2];
              imageData.data[dstIdx + 3] = pixels[srcIdx + 3];
            }
          }
          offCtx.putImageData(imageData, 0, 0);
          const domCtx = domCanvasRef.current.getContext('2d');
          domCtx.setTransform(1, 0, 0, 1, 0, 0);
          domCtx.clearRect(0, 0, lensDiameter * dpr, lensDiameter * dpr);
          domCtx.save();
          domCtx.beginPath();
          domCtx.arc((lensDiameter * dpr) / 2, (lensDiameter * dpr) / 2, (lensDiameter * dpr) / 2, 0, 2 * Math.PI);
          domCtx.closePath();
          domCtx.clip();
          domCtx.drawImage(
            offscreenCanvasRef.current,
            0, 0, renderRes, renderRes,
            0, 0, lensDiameter * dpr, lensDiameter * dpr
          );
          domCtx.restore();
          domCanvasRef.current.style.opacity = 1;
        } else {
          domCanvasRef.current.style.opacity = 0;
        }
        domCanvasRef.current.style.left = (containerRect.left + mousePosition.x - lensDiameter / 2) + 'px';
        domCanvasRef.current.style.top = (containerRect.top + mousePosition.y - lensDiameter / 2) + 'px';
      } else {
        domCanvasRef.current && (domCanvasRef.current.style.opacity = 0);
      }
      requestAnimationFrame(draw);
    };
    requestAnimationFrame(draw);
    return () => {
      running = false;
    };
  }, [isHovered, mousePosition, containerRect, modelGroupRef, gl, scene, camera, lensDiameter, zoomFov, zoomOffset, renderRes, dpr]);

  useEffect(() => {
    if (domCanvasRef.current) {
      domCanvasRef.current.width = lensDiameter * dpr;
      domCanvasRef.current.height = lensDiameter * dpr;
      domCanvasRef.current.style.width = lensDiameter + 'px';
      domCanvasRef.current.style.height = lensDiameter + 'px';
    }
    if (offscreenCanvasRef.current) {
      offscreenCanvasRef.current.width = renderRes;
      offscreenCanvasRef.current.height = renderRes;
    }
  }, [lensDiameter, renderRes, dpr]);

  return (
    <>
      <canvas ref={offscreenCanvasRef} style={{ display: 'none' }} />
      <canvas
        ref={domCanvasRef}
        style={{
          position: 'fixed',
          pointerEvents: 'none',
          left: '-9999px',
          top: '-9999px',
          borderRadius: '50%',
          boxShadow: '0 4px 24px 0 rgba(80,80,255,0.25), 0 0 0 4px rgba(255,255,255,0.15)',
          border: '2px solid rgba(180,200,255,0.5)',
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(2px)',
          zIndex: 1000,
          opacity: 0,
          transition: 'opacity 0.2s',
        }}
      />
    </>
  );
}

// Main Hero3d Component
export default function Hero3d() {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: null, y: null });
  // Ref for the div containing the Canvas, used to calculate relative mouse positions
  const modelContainerRef = useRef(null);
  // Ref to hold the group containing the GLTF model for efficient raycasting
  // This group will contain the PCModel primitive.
  const modelGroupRef = useRef();
  // State to store the bounding rectangle of the canvas container, used for mouse coordinate normalization.
  const [containerRect, setContainerRect] = useState(null);
  // R3F context refs
  const glRef = useRef();
  const sceneRef = useRef();
  const cameraRef = useRef();

  // Effect to get the initial dimensions of the 3D model container
  useEffect(() => {
    if (modelContainerRef.current) {
      setContainerRect(modelContainerRef.current.getBoundingClientRect());
    }
    // Update container dimensions on window resize for accurate mouse tracking
    const handleResize = () => {
      if (modelContainerRef.current) {
        setContainerRect(modelContainerRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mouse move handler to update mousePosition state
  const handleMouseMove = (event) => {
    if (!modelContainerRef.current) return;
    const rect = modelContainerRef.current.getBoundingClientRect();
    setMousePosition({
      x: event.clientX - rect.left, // X coordinate relative to the container
      y: event.clientY - rect.top,  // Y coordinate relative to the container
    });
  };

  // Mouse enter/leave handlers to toggle hovered state
  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePosition({ x: null, y: null }); // Reset mouse position when leaving the container
  };

  return (
    <div className="relative w-full h-auto lg:h-[94vh] overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-video3.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Left Text Section */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="p-4 lg:p-6 w-full lg:w-1/3 flex flex-col items-center justify-center text-center space-y-1 lg:space-y-4"
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-semibold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Get your Perfect PC today.
          </h2>
          <p className="text-gray-300 text-sm sm:text-base mb-10">
            Choose from our prebuild section OR Build your own
          </p>
          <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
            <a href="workstations">
              <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-5 py-2 rounded-md text-sm hover:from-indigo-500 hover:to-purple-500 transition duration-300">
                Pre-Built
              </button>
            </a>
            <a href="pc-builder">
              <button className="bg-gradient-to-r from-cyan-500 to-green-400 text-white px-5 py-2 rounded-md text-sm hover:from-green-400 hover:to-cyan-500 transition duration-300">
                Build it yourself!
              </button>
            </a>
          </div>
          <a
            href="https://youtube.com/shorts/0_8FqIOhwCM?si=nHV4gQhcQ7zKLGh4"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="mt-2 border border-purple-500 px-4 py-2 rounded-md font-bold text-purple-400 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent text-sm transition duration-300">
              Watch Video
            </button>
          </a>
        </motion.div>


        {/* Right Text Section */}
        <motion.div
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="p-4 lg:p-6 w-full lg:w-1/3 flex flex-col items-center lg:items-start justify-center text-center lg:text-left space-y-4"
        >
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent mb-2">
              Pre-Built.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base text-center lg:text-left">
              Computers that are already assembled and prebuilt by manufacturers, rather than building one's own computer from scratch.
            </p>
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold bg-gradient-to-r from-green-500 to-cyan-700 bg-clip-text text-transparent mb-2">
              Build it yourself.
            </h2>
            <p className="text-gray-300 text-sm sm:text-base text-center lg:text-left">
              Main advantages of building your own computer is flexibility and customization. You have full control over the selection of each component.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Magnifier overlay rendered OUTSIDE Canvas */}
      <MagnifyingLensOverlay
        isHovered={isHovered}
        mousePosition={mousePosition}
        containerRect={containerRect}
        modelGroupRef={modelGroupRef}
        gl={glRef.current}
        scene={sceneRef.current}
        camera={cameraRef.current}
      />

      {/* Features Section */}
      <section className="pt-5 pb-10 px-4">
        <style>{`
          .animated-gradient {
            background: linear-gradient(-45deg, #2E003E, #7F7FFF, #2E003E, #000);
            background-size: 400% 400%;
            animation: gradientShift 15s ease infinite;
          }
          @keyframes gradientShift {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}</style>

        <div className="animated-gradient text-white py-6 px-4 rounded-xl shadow-xl backdrop-blur-md bg-black/60 max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center text-center sm:text-left gap-6 sm:gap-0 sm:divide-x divide-gray-600">
            {[
              {
                icon: "🚚",
                title: "Fastest Shipping",
                text: "Get your PCs Delivered Swiftly with our Shipping Partner.",
              },
              {
                icon: "🛍️",
                title: "After Sales Service",
                text: "Support that Sticks with you, even After the Purchase.",
              },
              {
                icon: "💬",
                title: "Support 24/7",
                text: "Contact us 24/7 hours a day.",
              },
              {
                icon: "✅",
                title: "100% Secure Payment",
                text: "Experience safe, encrypted, and reliable payment options.",
              },
            ].map((item, idx) => (
              <div key={idx} className="sm:w-1/4 px-4">
                <div className="text-2xl mb-1">{item.icon}</div>
                <h3 className="font-bold text-base sm:text-lg mb-1">
                  {item.title}
                </h3>
                <p className="text-xs sm:text-sm text-gray-300">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}