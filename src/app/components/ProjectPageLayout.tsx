"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import {
  FiMenu,
  FiX,
  FiHome,
  FiFileText,
  FiTrendingUp,
  FiAlertTriangle,
  FiDollarSign,
  FiMapPin,
  FiUsers,
  FiCalendar,
  FiAward,
} from "react-icons/fi";

interface ProjectLayoutProps {
  children: React.ReactNode;
}

export const ProjectLayout: React.FC<ProjectLayoutProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("overview");

  // Close sidebar when clicking on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Update active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        'overview', 'market', 'participants', 'technical', 
        'energy', 'schedule', 'risks', 'permits', 'financials'
      ];
      
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element && scrollPosition >= element.offsetTop) {
          setActiveSection(section);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigation = [
    { name: "Project Overview", href: "#overview", icon: FiHome, id: "overview" },
    { name: "Power Market", href: "#market", icon: FiTrendingUp, id: "market" },
    { name: "Participants", href: "#participants", icon: FiUsers, id: "participants" },
    { name: "Technical Specs", href: "#technical", icon: FiFileText, id: "technical" },
    { name: "Energy Yield", href: "#energy", icon: FiTrendingUp, id: "energy" },
    { name: "Project Schedule", href: "#schedule", icon: FiCalendar, id: "schedule" },
    { name: "Risk Assessment", href: "#risks", icon: FiAlertTriangle, id: "risks" },
    { name: "Permits & Clearances", href: "#permits", icon: FiAward, id: "permits" },
    { name: "Financial Analysis", href: "#financials", icon: FiDollarSign, id: "financials" },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              {isSidebarOpen ? (
                <FiX className="w-5 h-5" />
              ) : (
                <FiMenu className="w-5 h-5" />
              )}
            </button>
            <div className="flex flex-col">
              <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Pabna Solar
              </span>
              <span className="text-xs text-gray-500 dark:text-gray-400">100 MW Project</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <FiMapPin className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-600 dark:text-gray-300">Bangladesh</span>
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            {/* Mobile Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
              onClick={() => setIsSidebarOpen(false)}
            />
            
            {/* Sidebar Panel */}
            <motion.nav
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 h-full z-50 flex flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-xl w-80 lg:w-64 lg:static lg:translate-x-0"
            >
              {/* Sidebar Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col">
                  <motion.span
                    className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    Pabna Solar
                  </motion.span>
                  <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    100 MW Solar Power Project
                  </span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Project Info */}
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                      <FiMapPin className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Location</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Pabna, Bangladesh</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                      <FiTrendingUp className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold">Capacity</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">100 MW AC</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-1">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      onClick={handleNavClick}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                        activeSection === item.id
                          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                          : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                      }`}
                    >
                      <item.icon 
                        className={`w-5 h-5 transition-colors ${
                          activeSection === item.id 
                            ? "text-blue-600 dark:text-blue-400" 
                            : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                        }`} 
                      />
                      <span className="font-medium">{item.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gray-200 dark:border-gray-700">
                <div className="text-center">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                    Project Status
                  </div>
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">
                      Under Development
                    </span>
                  </div>
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar (always visible on desktop) */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-full z-30 flex-col bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64">
        {/* Sidebar Header */}
        <div className="flex items-center space-x-3 p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <FiHome className="w-5 h-5 text-white" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Pabna Solar
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">100 MW Project</span>
          </div>
        </div>

        {/* Project Info */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
                <FiMapPin className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Location</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pabna, Bangladesh</div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-lg flex items-center justify-center">
                <FiTrendingUp className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-semibold">Capacity</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">100 MW AC</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4 space-y-1">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  activeSection === item.id
                    ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <item.icon 
                  className={`w-5 h-5 transition-colors ${
                    activeSection === item.id 
                      ? "text-blue-600 dark:text-blue-400" 
                      : "text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300"
                  }`} 
                />
                <span className="font-medium">{item.name}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 dark:border-gray-700">
          <div className="text-center">
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Project Status
            </div>
            <div className="flex items-center justify-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                Under Development
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        isSidebarOpen ? "lg:ml-64" : "lg:ml-64"
      }`}>
        {/* Mobile spacing */}
        <div className="lg:hidden h-16"></div>
        
        {/* Content */}
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
};