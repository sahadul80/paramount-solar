"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CardProps {
  title: string;
  fullDesc: string;
  isOpen: boolean;
  onClick: () => void;
  collapsedHeight: number;
  expandedHeight: number;
  shrinkFactor: number;
}

const Card: React.FC<CardProps> = ({
  title,
  fullDesc,
  isOpen,
  onClick,
  collapsedHeight,
  expandedHeight,
  shrinkFactor,
}) => (
  <motion.div
    layout
    onClick={onClick}
    className={`about-card ${isOpen ? "about-card-open" : "about-card-closed"}`}
    animate={{
      scale: isOpen ? 1 : shrinkFactor,
      y: isOpen ? 0 : 10,
      transition: { type: "spring", stiffness: 200, damping: 20 },
    }}
    style={{ height: isOpen ? expandedHeight : collapsedHeight }}
    whileHover={{
      scale: isOpen ? 1.02 : shrinkFactor * 1.04,
      transition: { duration: 0.3 },
    }}
  >
    <div className="about-card-header">
      <h3 className={`about-card-title ${isOpen ? "about-card-title-open" : "about-card-title-closed"}`}>
        {title}
      </h3>
      {isOpen ? (
        <ChevronUp className="about-card-icon" />
      ) : (
        <ChevronDown className="about-card-icon" />
      )}
    </div>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="about-card-content"
        >
          <div className="about-card-description">
            {fullDesc.split("\n").map((line, idx) => (
              <p key={idx} className={line.startsWith("•") ? "about-card-list-item" : "about-card-text"}>
                {line.startsWith("•") && (
                  <span className="about-card-bullet">•</span>
                )}
                <span>{line.startsWith("•") ? line.slice(1) : line}</span>
              </p>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

const sections = [
  {
    title: "Company Overview",
    fullDesc:
      "Paramount Solar Ltd. harnesses the power of the sun to generate clean, reliable, and affordable electricity. Focused on utility-scale solar power generation, we contribute significantly to the national grid and help bridge the electricity gap across Bangladesh.",
  },
  {
    title: "What We Do",
    fullDesc:
      "• Solar Power Project Development: Identify, design, and implement large-scale solar power plants sustainably.\n" +
      "• EPC Services: Engineering, Procurement, and Construction for seamless project execution.\n" +
      "• Grid Integration: Enhance energy security and reliability by integrating solar power into the national grid.\n" +
      "• Sustainable Impact: Promote green energy adoption and reduce greenhouse gas emissions.\n" +
      "• Operation & Maintenance: Provide end-to-end asset management to ensure long-term performance and efficiency.",
  },
  {
    title: "Our Purpose",
    fullDesc:
      "Delivering innovative solar energy solutions to make clean, reliable, and affordable power the global standard—driving sustainability, reducing carbon emissions, and enabling a greener future for all.",
  },
];

const About: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleClick = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const collapsedHeight = isMobile ? 70 : 80;
  const expandedHeight = isMobile ? 340 : 300;
  const shrinkFactor = 0.95;

  return (
    <div className="about-container">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="about-header"
      >
        <h1 className="about-title">
          About Paramount Solar
        </h1>
      </motion.div>

      {/* About Cards */}
      <div className="about-content">
        <motion.div className="about-cards">
          {sections.map((section, index) => (
            <Card
              key={index}
              title={section.title}
              fullDesc={section.fullDesc}
              isOpen={openIndex === index}
              onClick={() => handleClick(index)}
              collapsedHeight={collapsedHeight}
              expandedHeight={expandedHeight}
              shrinkFactor={openIndex !== null && openIndex !== index ? shrinkFactor : 1}
            />
          ))}
        </motion.div>
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="about-stats"
      >
        {[
          { number: "50+", label: "Projects" },
          { number: "100MW+", label: "Capacity" },
          { number: "25k+", label: "Homes Powered" },
          { number: "50k+", label: "CO2 Reduced" },
        ].map((stat, index) => (
          <motion.div
            key={index}
            className="about-stat-item"
            whileHover={{ scale: 1.05, y: -4 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            <div className="about-stat-number">{stat.number}</div>
            <div className="about-stat-label">{stat.label}</div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default About;