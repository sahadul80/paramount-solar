// components/Sections/TechnicalSpecs.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiSettings, FiSun, FiRefreshCw, FiDatabase, FiZap, FiGrid, FiCpu, FiBarChart2 } from 'react-icons/fi';
import { ProjectData, TechnicalSpec } from '../types/types';
import { useState } from 'react';

interface TechnicalSpecsProps {
  data: ProjectData['technicalSpecs'];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const TechnicalSpecs: React.FC<TechnicalSpecsProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [activeTab, setActiveTab] = useState<'modules' | 'inverters' | 'transformers' | 'system'>('modules');

  const tabs = [
    { 
      id: 'modules' as const, 
      label: 'PV Modules', 
      icon: FiSun,
      color: 'from-yellow-500 to-orange-500',
      description: 'Solar panel specifications and performance data'
    },
    { 
      id: 'inverters' as const, 
      label: 'Inverters', 
      icon: FiRefreshCw,
      color: 'from-blue-500 to-cyan-500',
      description: 'Power conversion and inversion systems'
    },
    { 
      id: 'transformers' as const, 
      label: 'Transformers', 
      icon: FiDatabase,
      color: 'from-purple-500 to-pink-500',
      description: 'Voltage transformation and distribution'
    },
    { 
      id: 'system' as const, 
      label: 'System Overview', 
      icon: FiGrid,
      color: 'from-green-500 to-teal-500',
      description: 'Overall system configuration and performance'
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  const tabContentVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.3 }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: { duration: 0.2 }
    }
  };

  const getGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 gap-3";
      case 'detailed':
        return "grid grid-cols-1 lg:grid-cols-2 gap-4";
      default:
        return "grid grid-cols-1 gap-4";
    }
  };

  const getTabStyle = (tabId: string) => {
    const baseClasses = "flex items-center space-x-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200";
    const activeClasses = "bg-white dark:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700";
    const inactiveClasses = "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800/50";
    
    return `${baseClasses} ${activeTab === tabId ? activeClasses : inactiveClasses}`;
  };

  const renderSpecCard = (spec: TechnicalSpec, index: number) => (
    <motion.div
      key={spec.parameter}
      className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {spec.parameter}
        </span>
      </div>
      <div className="flex items-baseline justify-between">
        <span className="text-lg font-bold text-gray-900 dark:text-white">
          {spec.value}
        </span>
        {spec.unit && (
          <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">
            {spec.unit}
          </span>
        )}
      </div>
    </motion.div>
  );

  const renderSpecTable = (specs: TechnicalSpec[]) => (
    <div className={getGridClass()}>
      {specs.map((spec, index) => renderSpecCard(spec, index))}
    </div>
  );

  const getCurrentSpecs = () => {
    switch (activeTab) {
      case 'modules':
        return data?.modules ?? [];
      case 'inverters':
        return data?.inverters ?? [];
      case 'transformers':
        return data?.transformers ?? [];
      default:
        return [];
    }
  };

  const getTabLayout = () => {
    switch (variant) {
      case 'compact':
        return "flex space-x-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-lg";
      case 'detailed':
        return "grid grid-cols-2 lg:grid-cols-4 gap-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-xl";
      default:
        return "flex space-x-2 p-2 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-x-auto";
    }
  };

  return (
    <section id="technical" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Section Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center mb-8 lg:mb-12"
        >
          <div className="flex items-center justify-center mb-3 lg:mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
              <FiSettings className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Technical Specifications
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Detailed technical parameters and performance specifications for all system components
          </p>
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          {/* Tabs Header */}
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className={getTabLayout()}>
              {tabs.map((tab) => {
                const specs = getCurrentSpecs();
                const hasData = specs.length > 0;
                
                return (
                  <motion.button
                    key={tab.id}
                    className={getTabStyle(tab.id)}
                    onClick={() => setActiveTab(tab.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className={`w-8 h-8 bg-gradient-to-br ${tab.color} rounded-lg flex items-center justify-center`}>
                      <tab.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-left flex-grow">
                      <div className="font-semibold text-sm">
                        {tab.label}
                      </div>
                      {variant === 'detailed' && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {specs.length} specs
                        </div>
                      )}
                    </div>
                    {hasData && variant !== 'compact' && (
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6 lg:p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                variants={tabContentVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="space-y-6"
              >
                {/* Tab Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      {tabs.find(tab => tab.id === activeTab)?.label}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                      {tabs.find(tab => tab.id === activeTab)?.description}
                    </p>
                  </div>
                  
                  {variant === 'detailed' && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {getCurrentSpecs().length}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">Parameters</div>
                    </div>
                  )}
                </div>

                {/* Specifications */}
                {getCurrentSpecs().length > 0 ? (
                  renderSpecTable(getCurrentSpecs())
                ) : (
                  <motion.div 
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <FiCpu className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                      No Data Available
                    </h4>
                    <p className="text-gray-500 dark:text-gray-400">
                      Technical specifications for {tabs.find(tab => tab.id === activeTab)?.label} are not available.
                    </p>
                  </motion.div>
                )}

                {/* Performance Metrics for Detailed Variant */}
                {variant === 'detailed' && activeTab === 'system' && (
                  <motion.div 
                    className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <FiZap className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">94.5%</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">System Efficiency</div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <FiBarChart2 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">25+</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">Year Lifespan</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                      <FiSun className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">1,650</div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">kWh/kWp Yield</div>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Additional Info for Compact Variant */}
        {variant === 'compact' && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <FiSettings className="w-4 h-4 mr-2" />
              Download Full Technical Data
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default TechnicalSpecs;