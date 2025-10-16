// components/Sections/EnergyYield.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { FiTrendingUp, FiBarChart2, FiInfo, FiZap, FiSun, FiCalendar } from 'react-icons/fi';

interface EnergyYieldData {
  firstYear: {
    p50: { generation: number; cufDC: number; cufAC: number };
    p75: { generation: number; cufDC: number; cufAC: number };
    p90: { generation: number; cufDC: number; cufAC: number };
    p99: { generation: number; cufDC: number; cufAC: number };
  };
  degradation: {
    firstYear: number;
    subsequentYears: number;
  };
  assumptions: string[];
}

interface EnergyYieldProps {
  data: EnergyYieldData;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const EnergyYield: React.FC<EnergyYieldProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [selectedPOE, setSelectedPOE] = useState<'p50' | 'p75' | 'p90' | 'p99'>('p50');
  const [selectedView, setSelectedView] = useState<'table' | 'chart'>('table');

  const currentData = data.firstYear[selectedPOE];
  
  // Calculate generation for different years based on degradation
  const calculateYearlyGeneration = (baseGeneration: number, year: number) => {
    if (year === 1) return baseGeneration;
    // Apply first year degradation for year 2 onwards
    const afterFirstYear = baseGeneration * (1 - data.degradation.firstYear / 100);
    // Apply subsequent years degradation
    return afterFirstYear * Math.pow(1 - data.degradation.subsequentYears / 100, year - 1);
  };

  const yearlyData = [1, 5, 10, 15, 20, 25].map(year => ({
    year,
    generation: Math.round(calculateYearlyGeneration(currentData.generation, year)),
    cufDC: currentData.cufDC * Math.pow(1 - data.degradation.subsequentYears / 100, year - 1),
    cufAC: currentData.cufAC * Math.pow(1 - data.degradation.subsequentYears / 100, year - 1),
    cumulative: Array.from({ length: year }, (_, i) => 
      calculateYearlyGeneration(currentData.generation, i + 1)
    ).reduce((sum, gen) => sum + gen, 0) / 1000
  }));

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

  const getMetricsGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 gap-4";
      case 'detailed':
        return "grid grid-cols-1 lg:grid-cols-2 gap-6";
      default:
        return "grid grid-cols-1 lg:grid-cols-2 gap-6";
    }
  };

  const poeOptions = [
    { value: 'p50', label: 'P50 (50% Probability)', description: 'Most likely scenario' },
    { value: 'p75', label: 'P75 (75% Probability)', description: 'Conservative estimate' },
    { value: 'p90', label: 'P90 (90% Probability)', description: 'Very conservative' },
    { value: 'p99', label: 'P99 (99% Probability)', description: 'Worst case scenario' },
  ];

  return (
    <section id="energy" className={`w-auto m-4 ${className}`}>
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
          <div className="flex items-center justify-center p-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Energy Yield Assessment
            </h2>
          </div>
        </motion.div>

        {/* Main Content Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
        >
          <div className={getCardPadding()}>
            {/* Controls Header */}
            <div className="flex flex-row lg:items-center justify-between m-2 p-2">
              <div className="flex-1">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white">
                  Projection Analysis
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {poeOptions.find(opt => opt.value === selectedPOE)?.description}
                </p>
              </div>
              
              <div className="flex flex-row justify-between">
                {/* POE Selector */}
                <div className="flex-1 p-2 sm:flex-none">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Probability of Exceedance
                  </label>
                  <select 
                    value={selectedPOE} 
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedPOE(e.target.value as 'p50' | 'p75' | 'p90' | 'p99')}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {poeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* View Toggle for Detailed Variant */}
                {variant === 'detailed' && (
                  <div className="flex-1 p-2 sm:flex-none">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      View Mode
                    </label>
                    <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <button
                        onClick={() => setSelectedView('table')}
                        className={`flex-1 text-sm font-medium rounded-md transition-colors p-1 ${
                          selectedView === 'table'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Table
                      </button>
                      <button
                        onClick={() => setSelectedView('chart')}
                        className={`flex-1 text-sm font-medium rounded-md transition-colors p-1 ${
                          selectedView === 'chart'
                            ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                            : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                        }`}
                      >
                        Chart
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Key Metrics */}
            <div className={getMetricsGridClass()}>
              {/* First Year Generation */}
              <motion.div
                className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 lg:p-6 border border-green-100 dark:border-green-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                    <FiZap className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-green-800 dark:text-green-300 bg-green-200 dark:bg-green-800/30 p-2 rounded-full">
                      {selectedPOE.toUpperCase()}
                    </div>
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {currentData.generation.toLocaleString()} MWh
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  First Year Generation
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-600 dark:text-green-400">
                      {currentData.cufDC}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">DC CUF</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {currentData.cufAC}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">AC CUF</div>
                  </div>
                </div>
              </motion.div>

              {/* Degradation Metrics */}
              <motion.div
                className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 lg:p-6 border border-blue-100 dark:border-blue-800"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-medium text-blue-800 dark:text-blue-300 bg-blue-200 dark:bg-blue-800/30 px-2 py-1 rounded-full">
                      Annual
                    </div>
                  </div>
                </div>
                <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {data.degradation.firstYear}% / {data.degradation.subsequentYears}%
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Degradation (1st Year / Subsequent)
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-lg font-bold text-orange-600 dark:text-orange-400">
                      {((1 - Math.pow(1 - data.degradation.subsequentYears / 100, 25)) * 100).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">25-year Total</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-purple-600 dark:text-purple-400">
                      {(currentData.generation * 25 * 0.8).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">Lifetime MWh</div>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Projection Content */}
            <div className="mt-6 lg:mt-8">
              <AnimatePresence mode="wait">
                {selectedView === 'table' || variant !== 'detailed' ? (
                  <motion.div
                    key="table"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 lg:p-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                      <FiCalendar className="w-5 h-5 text-blue-500 mr-2" />
                      25-Year Energy Projection ({selectedPOE.toUpperCase()})
                    </h4>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full min-w-full">
                        <thead>
                          <tr className="border-b border-gray-200 dark:border-gray-600">
                            <th className="text-left py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Year</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Generation (MWh)</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">DC CUF (%)</th>
                            <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">AC CUF (%)</th>
                            {variant !== 'compact' && (
                              <th className="text-right py-3 px-4 text-sm font-semibold text-gray-900 dark:text-white">Cumulative (GWh)</th>
                            )}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                          {yearlyData.map((yearData, index) => (
                            <motion.tr
                              key={yearData.year}
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: index * 0.05 }}
                              className="hover:bg-white dark:hover:bg-gray-600/50 transition-colors"
                            >
                              <td className="py-3 px-4 text-sm font-medium text-gray-900 dark:text-white">
                                Year {yearData.year}
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-900 dark:text-white">
                                {yearData.generation.toLocaleString()}
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-300">
                                {yearData.cufDC.toFixed(2)}%
                              </td>
                              <td className="py-3 px-4 text-sm text-right text-gray-600 dark:text-gray-300">
                                {yearData.cufAC.toFixed(2)}%
                              </td>
                              {variant !== 'compact' && (
                                <td className="py-3 px-4 text-sm text-right font-semibold text-green-600 dark:text-green-400">
                                  {yearData.cumulative.toFixed(0)}
                                </td>
                              )}
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="chart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6"
                  >
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
                      Generation Trend Visualization
                    </h4>
                    <div className="h-64 flex items-end justify-between space-x-2">
                      {yearlyData.map((yearData, index) => {
                        const maxGen = Math.max(...yearlyData.map(d => d.generation));
                        const height = (yearData.generation / maxGen) * 200;
                        
                        return (
                          <motion.div
                            key={yearData.year}
                            className="flex-1 flex flex-col items-center"
                            initial={{ scaleY: 0 }}
                            animate={{ scaleY: 1 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <div 
                              className="w-full bg-gradient-to-t from-green-500 to-emerald-600 rounded-t-lg relative group"
                              style={{ height: `${height}px` }}
                            >
                              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded py-1 px-2 whitespace-nowrap">
                                {yearData.generation.toLocaleString()} MWh
                              </div>
                            </div>
                            <div className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                              Y{yearData.year}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Assumptions Section */}
            {(variant === 'detailed' || variant === 'default') && (
              <motion.div 
                className="mt-6 lg:mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiInfo className="w-5 h-5 text-blue-500 mr-2" />
                  Key Assumptions & Methodology
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.assumptions.map((assumption, index) => (
                    <motion.div
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + index * 0.1 }}
                    >
                      <div className="w-6 h-6 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FiSun className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                      </div>
                      <span className="text-sm text-gray-700 dark:text-gray-200">
                        {assumption}
                      </span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Download Button for Compact Variant */}
            {variant === 'compact' && (
              <motion.div 
                className="mt-6 text-center"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                  <FiBarChart2 className="w-4 h-4 mr-2" />
                  Download Full Energy Report
                </button>
              </motion.div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default EnergyYield;