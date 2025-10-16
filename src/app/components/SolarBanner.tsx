"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type DisplayMode = 'dawn' | 'day' | 'dusk' | 'night' | 'sun' | 'moon' | 'auto';

interface ModeConfig {
  hasSun: boolean;
  hasMoon: boolean;
  sunIntensity: number;
  moonIntensity: number;
  reflectionColor: string;
  duration: number;
  bodyClass: string;
}

interface SolarBannerProps {
  onModeChange?: (mode: string) => void;
}

export default function SolarBanner({ onModeChange }: SolarBannerProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [currentMode, setCurrentMode] = useState<DisplayMode>('auto');
  const [modeConfig, setModeConfig] = useState<ModeConfig>({
    hasSun: true,
    hasMoon: false,
    sunIntensity: 0.8,
    moonIntensity: 0.2,
    reflectionColor: 'rgba(255, 255, 255, 0.5)',
    duration: 15,
    bodyClass: "gradient-day"
  });

  const gridRef = useRef<HTMLDivElement>(null);
  const animationRef = useRef<number>(0);
  const targetRotate = useRef({ x: 0, y: 0 });
  const currentRotate = useRef({ x: 0, y: 0 });

  const modeConfigs: Record<DisplayMode, ModeConfig> = useMemo(() => ({
    dawn: { hasSun: true, hasMoon: false, sunIntensity: 0.6, moonIntensity: 0, reflectionColor: 'rgba(255, 180, 100, 0.8)', duration: 12, bodyClass: "gradient-dawn" },
    day: { hasSun: true, hasMoon: false, sunIntensity: 1, moonIntensity: 0, reflectionColor: 'rgba(255,255,200,1)', duration: 10, bodyClass: "gradient-day" },
    dusk: { hasSun: true, hasMoon: false, sunIntensity: 0.5, moonIntensity: 0.2, reflectionColor: 'rgba(255,120,120,0.8)', duration: 14, bodyClass: "gradient-dusk" },
    night: { hasSun: false, hasMoon: true, sunIntensity: 0, moonIntensity: 0.6, reflectionColor: 'rgba(180,200,255,0.6)', duration: 20, bodyClass: "gradient-night" },
    sun: { hasSun: true, hasMoon: false, sunIntensity: 1, moonIntensity: 0, reflectionColor: 'rgba(255,255,150,1)', duration: 8, bodyClass: "gradient-sun" },
    moon: { hasSun: false, hasMoon: true, sunIntensity: 0, moonIntensity: 0.8, reflectionColor: 'rgba(160,180,255,0.8)', duration: 18, bodyClass: "gradient-moon" },
    auto: { hasSun: true, hasMoon: false, sunIntensity: 0.8, moonIntensity: 0.2, reflectionColor: 'rgba(255,255,255,0.7)', duration: 15, bodyClass: "gradient-day" }
  }), []);

  useEffect(() => {
    const checkSize = () => setIsMobile(window.innerWidth < 768);
    checkSize();
    window.addEventListener("resize", checkSize);
    return () => window.removeEventListener("resize", checkSize);
  }, []);

  // Smooth animation loop
  useEffect(() => {
    const animate = () => {
      const grid = gridRef.current;
      if (!grid) return;

      // Smooth interpolation (lerp)
      currentRotate.current.x += (targetRotate.current.x - currentRotate.current.x) * 0.1;
      currentRotate.current.y += (targetRotate.current.y - currentRotate.current.y) * 0.1;

      // Apply smooth transform
      grid.style.transform = `rotateX(${currentRotate.current.x}deg) rotateY(${currentRotate.current.y}deg) scale(1.02)`;

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  // 🌀 Smooth Tilt + Glare effect
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const handleMove = (e: MouseEvent) => {
      const rect = grid.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const maxDeg = 24;
      const rotateX = ((y - centerY) / centerY) * maxDeg;
      const rotateY = ((x - centerX) / centerX) * -maxDeg;

      // Update target values (will be smoothly interpolated in animation loop)
      targetRotate.current = { x: rotateX, y: rotateY };

      // Glare direction (this can stay direct as it's less critical)
      const angle = Math.atan2(y - centerY, x - centerX) * (180 / Math.PI);
      grid.style.setProperty("--glare-angle", `${angle}deg`);
    };

    const handleLeave = () => {
      // Smoothly return to center
      targetRotate.current = { x: 0, y: 0 };
      grid.style.setProperty("--glare-angle", "120deg");
    };

    grid.addEventListener("mousemove", handleMove);
    grid.addEventListener("mouseleave", handleLeave);

    return () => {
      grid.removeEventListener("mousemove", handleMove);
      grid.removeEventListener("mouseleave", handleLeave);
    };
  }, []);

  // Auto mode updater
  useEffect(() => {
    if (currentMode !== 'auto') return;
    const updateAuto = () => {
      const hour = new Date().getHours();
      let auto: DisplayMode = 'day';
      if (hour >= 5 && hour < 7) auto = 'dawn';
      else if (hour >= 7 && hour < 17) auto = 'day';
      else if (hour >= 17 && hour < 19) auto = 'dusk';
      else auto = 'night';
      setModeConfig(modeConfigs[auto]);
      if (onModeChange) onModeChange(auto);
      document.body.className = modeConfigs[auto].bodyClass;
    };
    updateAuto();
    const interval = setInterval(updateAuto, 300000);
    return () => clearInterval(interval);
  }, [currentMode, modeConfigs, onModeChange]);

  // Manual mode updater
  useEffect(() => {
    if (currentMode !== 'auto') {
      setModeConfig(modeConfigs[currentMode]);
      document.body.className = modeConfigs[currentMode].bodyClass;
      if (onModeChange) onModeChange(currentMode);
    }
  }, [currentMode, modeConfigs, onModeChange]);

  const { cols, rows, panels } = useMemo(() => {
    const cols = isMobile ? 11 : 15;
    const rows = 4;
    const total = cols * rows;
    const line1 = "PARAMOUNT".split("");
    const line2 = "SOLAR".split("");
    const line1Start = Math.floor((cols - line1.length) / 2);
    const line2Start = Math.floor((cols - line2.length) / 2);

    return {
      cols, rows,
      panels: Array.from({ length: total }, (_, i) => {
        const row = Math.floor(i / cols);
        const col = i % cols;
        let letter = "";
        if (row === 1 && col >= line1Start && col < line1Start + line1.length) {
          letter = line1[col - line1Start];
        } else if (row === 2 && col >= line2Start && col < line2Start + line2.length) {
          letter = line2[col - line2Start];
        }
        return { id: i, row, col, letter };
      })
    };
  }, [isMobile]);

  return (
    <div className="solar-banner-container mt-2">
      {/* Reflections */}
      <AnimatePresence>
        {modeConfig.hasSun && (
          <motion.div
            className="sun-reflection-track"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: modeConfig.duration, repeat: Infinity, ease: "linear" }}
            style={{
              background: `linear-gradient(var(--glare-angle, 120deg), transparent, ${modeConfig.reflectionColor}, transparent)`,
              opacity: modeConfig.sunIntensity
            }}
          />
        )}
        {modeConfig.hasMoon && (
          <motion.div
            className="moon-reflection-track"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: modeConfig.duration + 5, repeat: Infinity, ease: "linear" }}
            style={{
              background: `linear-gradient(var(--glare-angle, 120deg), transparent, ${modeConfig.reflectionColor}, transparent)`,
              opacity: modeConfig.moonIntensity
            }}
          />
        )}
      </AnimatePresence>

      {/* Grid */}
      <div
        ref={gridRef}
        className="solar-grid w-auto h-auto"
        style={{
          gridTemplateColumns: `repeat(${cols}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          transform: "rotateX(0deg) rotateY(0deg) scale(1)", // Initial state
        }}
      >
        {panels.map(({ id, letter, row, col }) => {
          const delay = (row + col) * 0.08;
          return (
            <motion.div
              key={id}
              className="solar-panel"
              style={{
                width: isMobile ? "clamp(1.8rem, 2vw, 1.8rem)" : "clamp(3rem, 4vw, 5rem)",
                height: isMobile ? "clamp(1.8rem, 2vw, 1.8rem)" : "clamp(3rem, 4vw, 5rem)",
              }}
              animate={{
                opacity: [0.9, 1, 0.9],
                scale: [0.96, 1.04, 0.96],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
                delay,
              }}
            >
              <div className="panel-base-color" />
              <div className="glass-overlay" />
              {letter && (
                <motion.span
                  className="letter-3d"
                  style={{
                    color: "#fff",
                    textShadow: `0 0 10px ${modeConfig.reflectionColor}, 0 0 20px ${modeConfig.reflectionColor}`,
                  }}
                  animate={{
                    opacity: [0.6, 0.8, 1, 0.8, 0.6],
                    scale: [0.9, 1.05, 0.9],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: delay * 1.2,
                  }}
                >
                  {letter}
                </motion.span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Floating Shadow */}
      <div className="solar-grid-shadow" />
    </div>
  );
}