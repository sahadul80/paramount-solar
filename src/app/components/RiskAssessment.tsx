// components/Sections/RiskAssessment.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiAlertTriangle, FiCheckCircle, FiClock, FiTrendingDown, FiShield, FiActivity, FiBarChart2, FiFilter } from 'react-icons/fi';
import { RiskItem } from '../types/types';
import { useState, useMemo } from 'react';

interface RiskAssessmentProps {
  data: RiskItem[];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const RiskAssessment: React.FC<RiskAssessmentProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [expandedRisk, setExpandedRisk] = useState<string | null>(null);

  // Filter risks based on selections
  const filteredRisks = useMemo(() => {
    return data.filter(risk => {
      const statusMatch = selectedStatus === 'all' || risk.status === selectedStatus;
      const categoryMatch = selectedCategory === 'all' || risk.category.toString() === selectedCategory;
      return statusMatch && categoryMatch;
    });
  }, [data, selectedStatus, selectedCategory]);

  // Calculate risk statistics
  const riskStats = useMemo(() => {
    const total = data.length;
    const critical = data.filter(r => r.category === 1).length;
    const medium = data.filter(r => r.category === 2).length;
    const low = data.filter(r => r.category === 3).length;
    const open = data.filter(r => r.status === 'open').length;
    const inProgress = data.filter(r => r.status === 'in-progress').length;
    const closed = data.filter(r => r.status === 'closed').length;

    return {
      total,
      critical,
      medium,
      low,
      open,
      inProgress,
      closed,
      criticalPercentage: total > 0 ? (critical / total) * 100 : 0
    };
  }, [data]);

  const getRiskIcon = (category: number) => {
    const baseClasses = "w-6 h-6 sm:w-8 sm:h-8";
    switch (category) {
      case 1: 
        return <FiAlertTriangle className={`${baseClasses} text-red-500`} />;
      case 2: 
        return <FiClock className={`${baseClasses} text-yellow-500`} />;
      case 3: 
        return <FiCheckCircle className={`${baseClasses} text-green-500`} />;
      default: 
        return <FiAlertTriangle className={`${baseClasses} text-gray-500`} />;
    }
  };

  const getRiskColor = (category: number) => {
    switch (category) {
      case 1: return 'bg-red-500';
      case 2: return 'bg-yellow-500';
      case 3: return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getRiskGradient = (category: number) => {
    switch (category) {
      case 1: return 'from-red-500 to-orange-500';
      case 2: return 'from-yellow-500 to-amber-500';
      case 3: return 'from-green-500 to-emerald-500';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClass = "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium";
    switch (status) {
      case 'open': 
        return `${baseClass} bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300`;
      case 'closed': 
        return `${baseClass} bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300`;
      case 'in-progress': 
        return `${baseClass} bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300`;
      default: 
        return `${baseClass} bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return <FiAlertTriangle className="w-3 h-3 mr-1" />;
      case 'closed': return <FiCheckCircle className="w-3 h-3 mr-1" />;
      case 'in-progress': return <FiClock className="w-3 h-3 mr-1" />;
      default: return <FiAlertTriangle className="w-3 h-3 mr-1" />;
    }
  };

  const getCategoryLabel = (category: number) => {
    switch (category) {
      case 1: return 'Critical';
      case 2: return 'Medium';
      case 3: return 'Low';
      default: return 'Unknown';
    }
  };

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

  const getGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 gap-4";
      case 'detailed':
        return "grid grid-cols-1 lg:grid-cols-2 gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 gap-6";
    }
  };

  const toggleExpand = (riskId: string) => {
    setExpandedRisk(expandedRisk === riskId ? null : riskId);
  };

  return (
    <section id="risks" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
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
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center mr-3">
              <FiAlertTriangle className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Risk Assessment
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive risk analysis and mitigation strategies for project success
          </p>
        </motion.div>

        {/* Risk Statistics */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
        >
          {/* Total Risks */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Risks</h3>
              <FiActivity className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {riskStats.total}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Identified risks
            </div>
          </motion.div>

          {/* Critical Risks */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Critical</h3>
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {riskStats.critical}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {riskStats.criticalPercentage.toFixed(0)}% of total
            </div>
          </motion.div>

          {/* In Progress */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">In Progress</h3>
              <FiClock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {riskStats.inProgress}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Being addressed
            </div>
          </motion.div>

          {/* Closed Risks */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Closed</h3>
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {riskStats.closed}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Successfully mitigated
            </div>
          </motion.div>
        </motion.div>

        {/* Risk Matrix for Detailed Variant */}
        {variant === 'detailed' && (
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800 mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
              <FiBarChart2 className="w-5 h-5 text-orange-500 mr-2" />
              Risk Matrix Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{riskStats.critical}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Critical Risks</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Requires immediate attention</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{riskStats.medium}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Medium Risks</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Monitor closely</div>
              </div>
              <div className="text-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">{riskStats.low}</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Low Risks</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Acceptable level</div>
              </div>
            </div>
          </motion.div>
        )}{/* Filters */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6 mb-6 lg:mb-8"
        >
          <div className="flex flex-row items-center justify-between p-2">
            <div className="flex items-center w-auto">
              <FiFilter className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Risks</h3>
            </div>
            <div className="flex flex-row justify-between w-auto gap-4">
              {/* Status Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Status
                </label>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="open">Open</option>
                  <option value="in-progress">In Progress</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Category
                </label>
                <select 
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Categories</option>
                  <option value="1">Critical</option>
                  <option value="2">Medium</option>
                  <option value="3">Low</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Risks Grid */}
        <div className={getGridClass()}>
          <AnimatePresence>
            {filteredRisks.length > 0 ? (
              filteredRisks.map((risk, index) => (
                <motion.div
                  key={risk.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div 
                    className={`p-4 cursor-pointer ${expandedRisk === risk.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                    onClick={() => toggleExpand(risk.id)}
                  >
                    {/* Risk Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 bg-gradient-to-br ${getRiskGradient(risk.category)} rounded-lg flex items-center justify-center`}>
                          {getRiskIcon(risk.category)}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {getCategoryLabel(risk.category)} Risk
                          </h3>
                          <span className={getStatusBadge(risk.status)}>
                            {getStatusIcon(risk.status)}
                            {risk.status.charAt(0).toUpperCase() + risk.status.slice(1)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Risk Description */}
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {risk.description}
                    </p>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedRisk === risk.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4"
                        >
                          {/* Mitigation Strategy */}
                          {risk.mitigation && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
                                <FiShield className="w-4 h-4 text-blue-500 mr-2" />
                                Mitigation Strategy
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
                                {risk.mitigation}
                              </p>
                            </div>
                          )}

                          {/* Action Items for Detailed Variant */}
                          {variant === 'detailed' && risk.status === 'open' && (
                            <div className="mt-4">
                              <button className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Assign Mitigation Action
                              </button>
                            </div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div 
                className="col-span-full text-center py-12"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <FiCheckCircle className="w-12 h-12 text-green-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Risks Found
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  No risks match the current filter criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Risk Summary for Compact Variant */}
        {variant === 'compact' && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <FiTrendingDown className="w-4 h-4 mr-2" />
              View Detailed Risk Report
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default RiskAssessment;