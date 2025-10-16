// components/Sections/PowerMarketOverview.tsx
"use client"
import { motion } from 'framer-motion';
import { FiTrendingUp, FiPieChart, FiBarChart2, FiTarget, FiZap, FiBattery, FiWind, FiSun } from 'react-icons/fi';

interface MarketData {
  totalInstalledCapacity: number;
  renewableCapacity: number;
  solarCapacity: number;
  demandProjection: {
    year: number;
    peakDemand: number;
  }[];
  energyMix: {
    source: string;
    percentage: number;
    capacity: number;
  }[];
  policyTargets: {
    year: number;
    renewableTarget: number;
    solarTarget: number;
  }[];
}

interface PowerMarketOverviewProps {
  data: MarketData;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

const getSourceIcon = (source: string) => {
  switch (source.toLowerCase()) {
    case 'solar':
      return <FiSun className="text-yellow-500" />;
    case 'wind':
      return <FiWind className="text-blue-400" />;
    case 'hydro':
      return <FiZap className="text-blue-500" />;
    case 'thermal':
      return <FiBattery className="text-red-500" />;
    default:
      return <FiZap className="text-gray-500" />;
  }
};

export const PowerMarketOverview: React.FC<PowerMarketOverviewProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
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

  // Responsive grid configuration
  const getMetricsGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4";
      case 'detailed':
        return "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6";
      default:
        return "grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8";
    }
  };

  const getDataGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6";
      case 'detailed':
        return "grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8";
      default:
        return "grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8";
    }
  };

  const getCardPadding = () => {
    switch (variant) {
      case 'compact':
        return "p-4 lg:p-6";
      case 'detailed':
        return "p-6 lg:p-8";
      default:
        return "p-6 lg:p-8";
    }
  };

  return (
    <section 
      id="market" 
      className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}
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
          className="text-center mb-8 lg:mb-12"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-3 lg:mb-4">
            Power Market Overview
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive analysis of installed capacity, energy mix, and future projections
          </p>
        </motion.div>

        {/* Key Metrics */}
        <motion.div 
          variants={itemVariants}
          className={`${getMetricsGridClass()} mb-8 lg:mb-12`}
        >
          {/* Total Installed Capacity */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`${getCardPadding()} flex flex-col items-center text-center`}>
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiTrendingUp className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                {data.totalInstalledCapacity} GW
              </div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">
                Total Installed Capacity
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +12% from last year
              </div>
            </div>
          </motion.div>

          {/* Renewable Capacity */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className={`${getCardPadding()} flex flex-col items-center text-center`}>
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiPieChart className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                {data.renewableCapacity} MW
              </div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">
                Renewable Capacity
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +25% growth
              </div>
            </div>
          </motion.div>

          {/* Solar Capacity */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <div className={`${getCardPadding()} flex flex-col items-center text-center`}>
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiBarChart2 className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                {data.solarCapacity} MW
              </div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">
                Solar Capacity
              </div>
              <div className="mt-2 text-xs text-green-600 dark:text-green-400 flex items-center">
                <FiTrendingUp className="w-3 h-3 mr-1" />
                +45% growth
              </div>
            </div>
          </motion.div>

          {/* Renewable Target */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
            whileHover={{ y: -4, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <div className={`${getCardPadding()} flex flex-col items-center text-center`}>
              <div className="w-12 h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mb-3 lg:mb-4 group-hover:scale-110 transition-transform duration-300">
                <FiTarget className="w-6 h-6 lg:w-7 lg:h-7 text-white" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-1 lg:mb-2">
                20%
              </div>
              <div className="text-xs lg:text-sm text-gray-600 dark:text-gray-300 font-medium">
                2030 Renewable Target
              </div>
              <div className="mt-2 text-xs text-blue-600 dark:text-blue-400 flex items-center">
                <FiTarget className="w-3 h-3 mr-1" />
                On track
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Data Grid */}
        <motion.div 
          variants={itemVariants}
          className={`${getDataGridClass()} mb-8 lg:mb-12`}
        >
          {/* Energy Mix */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className={`${getCardPadding()} h-full`}>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center">
                <FiPieChart className="w-5 h-5 lg:w-6 lg:h-6 text-blue-500 mr-2" />
                Energy Mix
              </h3>
              <div className="space-y-4 lg:space-y-5">
                {data.energyMix.map((source, index) => (
                  <motion.div 
                    key={source.source}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2 lg:space-x-3">
                        {getSourceIcon(source.source)}
                        <span className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-200">
                          {source.source}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">
                          {source.percentage}%
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:inline">
                          ({source.capacity} MW)
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">
                      <motion.div 
                        className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600"
                        initial={{ width: 0 }}
                        animate={{ width: `${source.percentage}%` }}
                        transition={{ duration: 1, delay: index * 0.2 }}
                        style={{
                          background: source.source.toLowerCase() === 'solar' 
                            ? 'linear-gradient(to right, #f59e0b, #ea580c)'
                            : source.source.toLowerCase() === 'wind'
                            ? 'linear-gradient(to right, #60a5fa, #3b82f6)'
                            : source.source.toLowerCase() === 'hydro'
                            ? 'linear-gradient(to right, #06b6d4, #0ea5e9)'
                            : 'linear-gradient(to right, #8b5cf6, #7c3aed)'
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Demand Projection */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            whileHover={{ y: -2 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className={`${getCardPadding()} h-full`}>
              <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center">
                <FiTrendingUp className="w-5 h-5 lg:w-6 lg:h-6 text-green-500 mr-2" />
                Demand Projection
              </h3>
              <div className="space-y-4 lg:space-y-5">
                {data.demandProjection.map((projection, index) => {
                  const maxDemand = Math.max(...data.demandProjection.map(p => p.peakDemand));
                  const percentage = (projection.peakDemand / maxDemand) * 100;
                  
                  return (
                    <motion.div 
                      key={projection.year}
                      className="space-y-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm lg:text-base font-medium text-gray-700 dark:text-gray-200">
                          {projection.year}
                        </span>
                        <span className="text-sm lg:text-base font-bold text-gray-900 dark:text-white">
                          {projection.peakDemand.toLocaleString()} MW
                        </span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 lg:h-3 overflow-hidden">
                          <motion.div 
                            className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-600"
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400 w-10 text-right">
                          +{Math.round((percentage / 100) * 50)}%
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
              
              {/* Additional insights for detailed variant */}
              {variant === 'detailed' && (
                <motion.div 
                  className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start space-x-2">
                    <FiZap className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        Growth Insight
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                        Projected annual growth rate of 7-9% driven by industrial expansion and urbanization.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>

        {/* Policy Targets (Visible in detailed variant) */}
        {variant === 'detailed' && (
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-xl p-6 lg:p-8 border border-purple-200 dark:border-purple-800"
          >
            <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white mb-4 lg:mb-6 flex items-center">
              <FiTarget className="w-5 h-5 lg:w-6 lg:h-6 text-purple-500 mr-2" />
              Policy Targets & Roadmap
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {data.policyTargets.map((target, index) => (
                <motion.div 
                  key={target.year}
                  className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm border border-gray-100 dark:border-gray-700"
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="text-center">
                    <div className="text-2xl lg:text-3xl font-bold text-purple-600 dark:text-purple-400 mb-1">
                      {target.year}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Target Year
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span>Renewable Target:</span>
                        <span className="font-bold text-green-600 dark:text-green-400">
                          {target.renewableTarget}%
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-xs">
                        <span>Solar Target:</span>
                        <span className="font-bold text-yellow-600 dark:text-yellow-400">
                          {target.solarTarget}%
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PowerMarketOverview;