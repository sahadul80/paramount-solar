"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Article {
  id: number;
  title: string;
  description: string;
  content: string;
  author: string;
  date: string;
  category: string;
  image: string;
}

export default function Gallery() {
  const [currentArticle, setCurrentArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const autoScrollRef = useRef<NodeJS.Timeout | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Generate fallback articles
  const generateFallbackArticles = (): Article[] =>
    Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      title: `Solar Project ${i + 1}`,
      description: `Innovative solar technology transforming renewable energy landscape.`,
      content: `This project showcases cutting-edge solar technology that significantly improves energy efficiency and reduces costs. Our team has implemented advanced photovoltaic systems with smart monitoring and automated maintenance features.`,
      author: "Solar Engineering Team",
      date: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String(
        (i % 28) + 1
      ).padStart(2, "0")}`,
      category: ["Photovoltaic", "Solar Thermal", "Grid Integration", "Storage"][i % 4],
      image: `/api/placeholder/800/500?text=Solar+${i + 1}`,
    }));

  // Fetch articles
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/articles");
        if (response.ok) {
          const data = await response.json();
          setArticles(data.articles || generateFallbackArticles());
        } else throw new Error("API failed");
      } catch {
        setArticles(generateFallbackArticles());
      } finally {
        setLoading(false);
      }
    };
    fetchArticles();
  }, []);

  // Function to scroll to a specific card
  const scrollToIndex = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const cardWidth = container.querySelector<HTMLElement>(".gallery-card")?.offsetWidth || 0;
    container.scrollTo({
      left: index * (cardWidth + 24),
      behavior: "smooth",
    });
  };

  // Auto-scroll logic
  useEffect(() => {
    if (loading || articles.length === 0) return;

    const startAutoScroll = () => {
      autoScrollRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % articles.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 5000);
    };

    startAutoScroll();

    return () => {
      if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    };
  }, [loading, articles]);

  // Manual scroll stops auto-scroll temporarily
  const handleManualScroll = () => {
    if (autoScrollRef.current) clearInterval(autoScrollRef.current);
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);

    restartTimeoutRef.current = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      const cardWidth = container.querySelector<HTMLElement>(".gallery-card")?.offsetWidth || 0;

      autoScrollRef.current = setInterval(() => {
        setActiveIndex((prev) => {
          const nextIndex = (prev + 1) % articles.length;
          scrollToIndex(nextIndex);
          return nextIndex;
        });
      }, 1000);
    }, 1500);
  };

  // Swipe for mobile modal navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50) handleNext();
    else if (distance < -50) handlePrev();
  };

  const handleNext = () => {
    if (!currentArticle) return;
    const currentIndex = articles.findIndex((a) => a.id === currentArticle.id);
    const nextIndex = (currentIndex + 1) % articles.length;
    setCurrentArticle(articles[nextIndex]);
  };

  const handlePrev = () => {
    if (!currentArticle) return;
    const currentIndex = articles.findIndex((a) => a.id === currentArticle.id);
    const prevIndex = (currentIndex - 1 + articles.length) % articles.length;
    setCurrentArticle(articles[prevIndex]);
  };

  if (loading) {
    return (
      <div className="gallery-loading">
        <h2 className="gallery-title">Solar Projects</h2>
        <div className="gallery-loading-grid">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="gallery-loading-card" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-container">
      {/* Header */}
      <div className="gallery-header">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="gallery-title"
        >
          Solar Projects Gallery
        </motion.h2>
      </div>

      {/* Cards */}
      <div className="gallery-cards-container">
        <motion.div
          ref={scrollContainerRef}
          className="gallery-cards-scroll"
          onScroll={handleManualScroll}
          onTouchStart={handleManualScroll}
          onWheel={handleManualScroll}
        >
          {articles.map((article, index) => (
            <motion.div
              key={article.id}
              className={`gallery-card ${index === activeIndex ? 'gallery-card-active' : 'gallery-card-inactive'}`}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => setCurrentArticle(article)}
            >
              <div className="gallery-card-inner">
                <div className="gallery-card-image">
                  <div
                    className="gallery-card-bg"
                    style={{ backgroundImage: `url(${article.image})` }}
                  />
                  <div className="gallery-card-category">
                    {article.category}
                  </div>
                </div>
                <div className="gallery-card-content">
                  <h3 className="gallery-card-title">
                    {article.title}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Info */}
      <div className="gallery-info">
        Auto-swapping active every 5 seconds • Click to view details
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {currentArticle && (
          <motion.div
            className="gallery-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCurrentArticle(null)}
          >
            <motion.div
              ref={modalRef}
              className="gallery-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              {/* Close */}
              <button
                onClick={() => setCurrentArticle(null)}
                className="gallery-modal-close"
              >
                <svg
                  className="gallery-modal-close-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>

              {/* Navigation */}
              <button
                onClick={handlePrev}
                className="z-10 gallery-modal-nav gallery-modal-prev"
              >
                <svg
                  className="gallery-modal-nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={handleNext}
                className="gallery-modal-nav gallery-modal-next"
              >
                <svg
                  className="gallery-modal-nav-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Image */}
              <div className="gallery-modal-image">
                <motion.img
                  src={currentArticle.image}
                  alt={currentArticle.title}
                  className="gallery-modal-img"
                  initial={{ scale: 1.1 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <div className="gallery-modal-gradient" />
              </div>

              {/* Content */}
              <div className="gallery-modal-content">
                <div className="gallery-modal-header">
                  <span className="gallery-modal-category">
                    {currentArticle.category}
                  </span>
                  <span className="gallery-modal-date">{currentArticle.date}</span>
                </div>
                <h1 className="gallery-modal-title">{currentArticle.title}</h1>
                <p className="gallery-modal-description">{currentArticle.description}</p>
                <p className="gallery-modal-text">{currentArticle.content}</p>
                <div className="gallery-modal-footer">
                  <span>By {currentArticle.author}</span>
                  <span>
                    {articles.findIndex((a) => a.id === currentArticle.id) + 1} / {articles.length}
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}