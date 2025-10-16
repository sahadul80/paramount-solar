"use client";

import { useEffect, useState, lazy, Suspense, useRef } from "react";
import { motion, animate, useSpring } from "framer-motion";
import SolarBanner from "./components/SolarBanner";

// Lazy-loaded sections
const About = lazy(() => import("./components/About"));
const Gallery = lazy(() => import("./components/Gallery"));
const ParamountLoader = lazy(() => import("./components/Loader"));

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<string>("about");
  const [scrollProgress, setScrollProgress] = useState(0);
  const [menuVisible, setMenuVisible] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionObserversRef = useRef<IntersectionObserver[]>([]);
  const prevScrollY = useRef<number>(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isNavVisible, setIsNavVisible] = useState(true);

  const sections = ["about", "gallery"];

  const smoothScrollProgress = useSpring(scrollProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.01
  });

  useEffect(() => setIsClient(true), []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Loader
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setMenuVisible(true);
      setIsInitialLoad(false);
      setTimeout(() => {
        const aboutSection = document.getElementById("about");
        if (aboutSection && scrollContainerRef.current) {
          scrollContainerRef.current.scrollTo({
            top: aboutSection.offsetTop - 100,
            behavior: "smooth"
          });
        }
      }, 100);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  // Scroll handling
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      if (!container || isScrollingRef.current) return;
      const currentScrollY = container.scrollTop;

      if (Math.abs(currentScrollY - prevScrollY.current) > 5) {
        const direction = currentScrollY > prevScrollY.current ? "down" : "up";
        setScrollDirection(direction);
        setIsNavVisible(isInitialLoad || direction === "up" || currentScrollY < 100);
        setDropdownOpen(false);
      }
      prevScrollY.current = currentScrollY;

      const docHeight = container.scrollHeight - container.clientHeight || 1;
      setScrollProgress(Math.min(100, Math.max(0, (currentScrollY / docHeight) * 100)));

      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

      scrollTimeoutRef.current = setTimeout(() => {
        const containerRect = container.getBoundingClientRect();
        let closestSection = activeSection;
        let minDistance = Infinity;

        sections.forEach((id) => {
          const section = document.getElementById(id);
          if (section) {
            const rect = section.getBoundingClientRect();
            const distance = Math.abs(rect.top - containerRect.top);
            if (distance < minDistance) {
              minDistance = distance;
              closestSection = id;
            }
          }
        });

        setActiveSection(closestSection);
      }, 150);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [activeSection, isInitialLoad]);

  // Intersection Observer for section detection
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    sectionObserversRef.current.forEach((observer) => observer.disconnect());
    sectionObserversRef.current = [];

    sections.forEach((id) => {
      const section = document.getElementById(id);
      if (!section) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        {
          root: container,
          rootMargin: "-10% 0px -10% 0px",
          threshold: [0.3, 0.5, 0.7]
        }
      );

      observer.observe(section);
      sectionObserversRef.current.push(observer);
    });

    return () => sectionObserversRef.current.forEach((observer) => observer.disconnect());
  }, []);

  // Smooth scroll to section on menu click
  const scrollToSection = (id: string) => {
    const container = scrollContainerRef.current;
    const section = document.getElementById(id) as HTMLElement | null;

    if (container && section) {
      isScrollingRef.current = true;
      setDropdownOpen(false);

      const targetScroll = section.offsetTop - 100;
      animate(container.scrollTop, targetScroll, {
        type: "spring",
        stiffness: 100,
        damping: 20,
        mass: 0.5,
        onUpdate: (value) => (container.scrollTop = value),
        onComplete: () => {
          isScrollingRef.current = false;
          setActiveSection(id);
        }
      });
    }
  };

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <Suspense fallback={null}>
          <ParamountLoader />
        </Suspense>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Navigation */}
      <motion.nav
        ref={dropdownRef}
        animate={{
          y: isNavVisible && menuVisible ? 0 : scrollDirection === "down" ? -100 : 0,
          opacity: menuVisible && isNavVisible ? 1 : 0
        }}
        initial={{ y: -100, opacity: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 22, mass: 0.7 }}
        className="fixed top-0 left-0 right-0 z-50 p-1"
      >
        <div className="mx-auto w-full max-w-6xl">
          <div className="relative">
            {/* Nav bar */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-full rounded-2xl backdrop-blur-xl bg-secondary border border-primary shadow-2xl p-2 cursor-pointer select-none flex items-center justify-between gap-4 group hover:bg-tertiary transition-all"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full ${
                    activeSection === "about"
                      ? "bg-accent-primary shadow-lg"
                      : "bg-accent-secondary shadow-lg"
                  } transition-all`}
                />
                <div className="text-base font-semibold tracking-tight text-primary">
                  {activeSection === "about" ? "About Us" : "Project Gallery"}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="hidden sm:block text-sm text-tertiary group-hover:text-secondary transition-colors">
                  {dropdownOpen ? "Close menu" : "Open menu"}
                </div>
                <motion.div
                  animate={{ rotate: dropdownOpen ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors border border-primary/10"
                >
                  <svg
                    className="w-5 h-5 text-secondary group-hover:text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.div>
              </div>
            </motion.div>

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={
                dropdownOpen
                  ? { opacity: 1, y: 8, scale: 1, pointerEvents: "auto" }
                  : { opacity: 0, y: -10, scale: 0.95, pointerEvents: "none" }
              }
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="absolute top-full left-0 right-0"
            >
              <div className="rounded-2xl backdrop-blur-xl bg-secondary border border-primary shadow-2xl overflow-hidden">
                {sections.map((id, index) => (
                  <motion.button
                    key={id}
                    whileHover={{
                      backgroundColor: "var(--bg-tertiary)",
                      borderLeftColor: "var(--accent-primary)"
                    }}
                    whileTap={{ scale: 0.98 }}
                    onClick={(e) => {
                      e.stopPropagation();
                      scrollToSection(id);
                    }}
                    className={`w-full text-left p-2 transition-all flex items-center justify-between gap-4 border-primary/10 ${
                      index < sections.length - 1 ? "border-b" : ""
                    } ${
                      activeSection === id
                        ? "bg-primary/15 text-primary border-l-4 border-l-accent-primary"
                        : "text-secondary hover:text-primary border-l-4 border-l-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          activeSection === id
                            ? "bg-accent-primary"
                            : "bg-primary/40"
                        } transition-colors`}
                      />
                      <div className="font-medium text-base capitalize">
                        {id === "about" ? "About Us" : "Project Gallery"}
                      </div>
                    </div>
                    <div
                      className={`text-sm p-1 rounded-full border ${
                        activeSection === id
                          ? "bg-primary/20 text-primary border-accent-primary/30"
                          : "bg-primary/10 text-secondary border-primary/20"
                      }`}
                    >
                      {activeSection === id ? "Active" : "View"}
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-primary/10 z-40">
        <motion.div
          className="h-full bg-accent-primary shadow-lg"
          style={{ width: `${smoothScrollProgress}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 30 }}
        />
      </div>

      {/* Scrollable container */}
      <div
        id="scroll-container"
        ref={scrollContainerRef}
        className="flex flex-col items-center justify-start h-full w-full overflow-auto relative z-10"
        style={{ scrollBehavior: "smooth" }}
      >
        {/* About Section */}
        <section
          id="about"
          className="flex flex-col justify-start items-center"
        >
          <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.5, 0.75, 1], delay: 0.1 }}
          >
            <Suspense
              fallback={
                <div className="text-center text-tertiary">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary/70 mb-4"></div>
                  <div>Loading About...</div>
                </div>
              }
            >
              <section className="w-auto h-auto flex items-center justify-center mt-12">
                <div className="w-auto max-w-6xl text-center z-10">
                  <SolarBanner />
                </div>
              </section>
              <About />
            </Suspense>
          </motion.div>
        </section>

        {/* Gallery Section */}
        <section
          id="gallery"
          className="h-full w-full flex flex-col justify-center items-center"
        >
          <motion.div
            className="w-full max-w-6xl"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
            viewport={{ once: true, margin: "-100px" }}
          >
            <Suspense
              fallback={
                <div className="text-center py-20 text-tertiary">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary/70 mb-4"></div>
                  <div>Loading Gallery...</div>
                </div>
              }
            >
              <Gallery />
            </Suspense>
          </motion.div>
        </section>
      </div>
    </div>
  );
}