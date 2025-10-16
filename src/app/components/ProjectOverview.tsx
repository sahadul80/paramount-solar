"use client"
import { motion } from 'framer-motion';
import { FiMapPin, FiZap, FiCalendar, FiDollarSign, FiStar, FiAward, FiTarget, FiClock } from 'react-icons/fi';
import { ProjectData } from '../types/types';

interface ProjectOverviewProps {
  data: ProjectData['executiveSummary'];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ProjectOverview: React.FC<ProjectOverviewProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const metrics = [
    {
      icon: FiZap,
      label: 'Capacity',
      value: data.capacity,
      description: 'Installed Power Capacity',
      color: 'from-yellow-500 to-orange-500',
      trend: '+15%',
    },
    {
      icon: FiMapPin,
      label: 'Location',
      value: data.location,
      description: 'Project Site',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: FiCalendar,
      label: 'Technology',
      value: data.technology,
      description: 'Energy Technology',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: FiDollarSign,
      label: 'PPA Tariff',
      value: 'USD 0.1195/kWh',
      description: 'Power Purchase Agreement',
      color: 'from-purple-500 to-pink-500',
      trend: 'Competitive',
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

  const getMetricsGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-2 gap-3 lg:gap-4";
      case 'detailed':
        return "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6";
      default:
        return "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8";
    }
  };

  const getCardPadding = () => {
    switch (variant) {
      case 'compact':
        return "p-4";
      case 'detailed':
        return "p-6";
      default:
        return "p-6";
    }
  };

  const getMetricValueSize = () => {
    switch (variant) {
      case 'compact':
        return "text-lg lg:text-xl";
      case 'detailed':
        return "text-xl lg:text-xl";
      default:
        return "text-lg lg:text-xl";
    }
  };

  return (
    <section 
      id="overview" 
      className={`w-full max-w-[100vw] m-2 p-2 ${className}`}
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full"
      >
        {/* Section Header */}
        <motion.div 
          variants={itemVariants}
          className="text-center"
        >
          <h2 className="text-xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white m=4">
            Project Overview
          </h2>
        </motion.div>

        {/* Metrics Grid */}
        <motion.div 
          variants={itemVariants}
          className={`${getMetricsGridClass()} m-4`}
        >
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ 
                y: variant === 'compact' ? -2 : -4, 
                scale: variant === 'compact' ? 1.01 : 1.02 
              }}
              transition={{ 
                delay: index * 0.1,
                type: "spring", 
                stiffness: 300 
              }}
            >
              <div className={`${getCardPadding()} flex flex-col h-full`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`w-10 h-10 lg:w-12 lg:h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <metric.icon className="w-5 h-5 lg:w-6 lg:h-6 text-white" />
                  </div>
                  {metric.trend && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      {metric.trend}
                    </span>
                  )}
                </div>
                
                <div className="flex-grow">
                  <div className={`font-bold text-gray-900 dark:text-white mb-1 ${getMetricValueSize()}`}>
                    {metric.value}
                  </div>
                  <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                    {metric.label}
                  </div>
                  {variant !== 'compact' && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {metric.description}
                    </div>
                  )}
                </div>

                {/* Progress indicator for detailed variant */}
                {variant === 'detailed' && metric.label === 'Capacity' && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                      <span>Construction Progress</span>
                      <span>65%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full"
                        style={{ width: '65%' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Key Highlights */}
        <motion.div 
          className="m-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -2 }}
          transition={{ 
            delay: 0.4,
            type: "spring", 
            stiffness: 300 
          }}
        >
          <div className={`${getCardPadding} m-2`}>
            <div className="flex items-center">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mr-3">
                <FiStar className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                Key Highlights
              </h3>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 m-2">
              {data.keyHighlights.map((highlight, index) => (
                <motion.div
                  key={index}
                  className="flex items-start p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <div className="w-6 h-6 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiAward className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                  </div>
                  <span className="text-sm lg:text-base text-gray-700 dark:text-gray-200">
                    {highlight}
                  </span>
                </motion.div>
              ))}
            </div>

            {/* Additional project info for detailed variant */}
            {variant === 'detailed' && (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 p-1 border-t border-gray-100 dark:border-gray-700 flex justify-between max-w-[100vw]"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                <div className="flex items-center border rounded-lg p-1">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center border-r">
                    <FiTarget className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">Under Construction</div>
                  </div>
                </div>

                <div className="flex items-center border rounded-lg p-1">
                  <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center border-r">
                    <FiClock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Timeline</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">Q4 2024</div>
                  </div>
                </div>

                <div className="flex items-center border rounded-lg p-1">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center border-r">
                    <FiZap className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400">CO₂ Reduction</div>
                    <div className="text-base font-semibold text-gray-900 dark:text-white">45,000 t/year</div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Call to Action for Compact Variant */}
        {variant === 'compact' && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <FiTarget className="w-4 h-4 mr-2" />
              View Full Project Details
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectOverview;