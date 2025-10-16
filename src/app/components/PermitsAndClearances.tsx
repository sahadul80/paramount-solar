// components/Sections/PermitsAndClearances.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiFileText, FiCheck, FiClock, FiAlertCircle, FiAlertTriangle, FiDownload, FiSearch, FiFilter, FiCalendar, FiAward, FiMapPin } from 'react-icons/fi';
import { useState, useMemo } from 'react';

interface Permit {
  id: string;
  description: string;
  authority: string;
  status: 'approved' | 'pending' | 'submitted' | 'not-started';
  submissionDate?: string | null;
  approvalDate?: string | null;
  referenceNumber?: string | null;
  priority?: 'high' | 'medium' | 'low';
  category?: string;
  estimatedTimeline?: string;
  documents?: string[];
}

interface PermitsAndClearancesProps {
  data: Permit[];
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const PermitsAndClearances: React.FC<PermitsAndClearancesProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedPermit, setExpandedPermit] = useState<string | null>(null);

  // Filter permits based on selections
  const filteredPermits = useMemo(() => {
    return data.filter(permit => {
      const statusMatch = selectedStatus === 'all' || permit.status === selectedStatus;
      const categoryMatch = selectedCategory === 'all' || permit.category === selectedCategory;
      const searchMatch = searchTerm === '' || 
        permit.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        permit.authority.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (permit.referenceNumber && permit.referenceNumber.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return statusMatch && categoryMatch && searchMatch;
    });
  }, [data, selectedStatus, selectedCategory, searchTerm]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalPermits = data.length;
    const approved = data.filter(p => p.status === 'approved').length;
    const pending = data.filter(p => p.status === 'pending').length;
    const submitted = data.filter(p => p.status === 'submitted').length;
    const notStarted = data.filter(p => p.status === 'not-started').length;
    const approvalRate = totalPermits > 0 ? (approved / totalPermits) * 100 : 0;
    
    // Calculate critical path (high priority pending)
    const criticalPending = data.filter(p => p.priority === 'high' && p.status !== 'approved').length;

    return {
      totalPermits,
      approved,
      pending,
      submitted,
      notStarted,
      approvalRate,
      criticalPending
    };
  }, [data]);

  const getStatusIcon = (status: Permit['status']) => {
    const baseClasses = "w-4 h-4 sm:w-5 sm:h-5";
    switch (status) {
      case 'approved': 
        return <FiCheck className={`${baseClasses} text-green-500`} />;
      case 'pending': 
        return <FiClock className={`${baseClasses} text-yellow-500`} />;
      case 'submitted': 
        return <FiFileText className={`${baseClasses} text-blue-500`} />;
      case 'not-started': 
        return <FiAlertTriangle className={`${baseClasses} text-gray-500`} />;
      default: 
        return <FiFileText className={`${baseClasses} text-gray-500`} />;
    }
  };

  const getStatusColor = (status: Permit['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'submitted': return 'bg-blue-500';
      case 'not-started': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusGradient = (status: Permit['status']) => {
    switch (status) {
      case 'approved': return 'from-green-500 to-emerald-500';
      case 'pending': return 'from-yellow-500 to-amber-500';
      case 'submitted': return 'from-blue-500 to-cyan-500';
      case 'not-started': return 'from-gray-400 to-gray-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getStatusText = (status: Permit['status']) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
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

  const toggleExpand = (permitId: string) => {
    setExpandedPermit(expandedPermit === permitId ? null : permitId);
  };

  // Get unique categories for filter
  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(data.map(p => p.category).filter(Boolean)));
    return uniqueCategories as string[];
  }, [data]);

  return (
    <section id="permits" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
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
              <FiFileText className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Permits & Clearances
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive tracking of all regulatory approvals and compliance requirements
          </p>
        </motion.div>

        {/* Summary Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
        >
          {/* Total Permits */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Total Permits</h3>
              <FiFileText className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.totalPermits}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Required for project
            </div>
          </motion.div>

          {/* Approved */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Approved</h3>
              <FiCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.approved}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {stats.approvalRate.toFixed(0)}% completion
            </div>
          </motion.div>

          {/* Pending */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Pending</h3>
              <FiClock className="w-5 h-5 text-yellow-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.pending}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Awaiting approval
            </div>
          </motion.div>

          {/* Critical */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Critical</h3>
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.criticalPending}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              High priority pending
            </div>
          </motion.div>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6 mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center">
              <FiFilter className="w-5 h-5 text-gray-400 mr-2" />
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filter Permits</h3>
            </div>
            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              {/* Search */}
              <div className="relative">
                <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search permits..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64"
                />
              </div>

              {/* Status Filter */}
              <div>
                <select 
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="submitted">Submitted</option>
                  <option value="pending">Pending</option>
                  <option value="not-started">Not Started</option>
                </select>
              </div>

              {/* Category Filter */}
              {categories.length > 0 && (
                <div>
                  <select 
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="all">All Categories</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Critical Alert */}
        {stats.criticalPending > 0 && (
          <motion.div 
            variants={itemVariants}
            className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-xl p-4 lg:p-6 border border-red-200 dark:border-red-800 mb-6 lg:mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                <FiAlertCircle className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Critical Permits Pending
                </h3>
                <p className="text-gray-700 dark:text-gray-300">
                  {stats.criticalPending} high-priority permits are still pending approval. 
                  These include essential approvals required for project commissioning and operation.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Permits Grid */}
        <div className={getGridClass()}>
          <AnimatePresence>
            {filteredPermits.length > 0 ? (
              filteredPermits.map((permit, index) => (
                <motion.div
                  key={permit.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1, type: "spring", stiffness: 300 }}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-300"
                  whileHover={{ y: -2 }}
                >
                  <div 
                    className={`p-4 lg:p-6 cursor-pointer ${expandedPermit === permit.id ? 'bg-gray-50 dark:bg-gray-700/50' : ''}`}
                    onClick={() => toggleExpand(permit.id)}
                  >
                    {/* Permit Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`w-10 h-10 bg-gradient-to-br ${getStatusGradient(permit.status)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                          {getStatusIcon(permit.status)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                            {permit.description}
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(permit.status)} text-white`}>
                              {getStatusText(permit.status)}
                            </span>
                            {permit.priority && (
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(permit.priority)}`}>
                                {permit.priority.charAt(0).toUpperCase() + permit.priority.slice(1)} Priority
                              </span>
                            )}
                            {permit.category && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                {permit.category}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Authority and Reference */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiMapPin className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600 dark:text-gray-300">
                          {permit.authority}
                        </span>
                      </div>
                      {permit.referenceNumber && (
                        <div className="flex items-center space-x-2">
                          <FiAward className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-mono text-gray-600 dark:text-gray-300">
                            {permit.referenceNumber}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                      <div className="flex items-center space-x-2">
                        <FiCalendar className="w-4 h-4" />
                        <span>
                          {permit.submissionDate ? `Submitted: ${permit.submissionDate}` : 'Not submitted'}
                        </span>
                      </div>
                      {permit.approvalDate && (
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          Approved: {permit.approvalDate}
                        </span>
                      )}
                    </div>

                    {/* Expandable Content */}
                    <AnimatePresence>
                      {expandedPermit === permit.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200 dark:border-gray-600 pt-4 mt-4"
                        >
                          {/* Estimated Timeline */}
                          {permit.estimatedTimeline && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Estimated Timeline
                              </h4>
                              <p className="text-sm text-gray-600 dark:text-gray-300">
                                {permit.estimatedTimeline}
                              </p>
                            </div>
                          )}

                          {/* Documents */}
                          {permit.documents && permit.documents.length > 0 && (
                            <div className="mb-4">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                                Related Documents
                              </h4>
                              <div className="space-y-2">
                                {permit.documents.map((doc, docIndex) => (
                                  <div key={docIndex} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                    <span className="text-sm text-gray-600 dark:text-gray-300">{doc}</span>
                                    <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300">
                                      <FiDownload className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Buttons */}
                          <div className="flex space-x-3">
                            {permit.status === 'not-started' && (
                              <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Start Application
                              </button>
                            )}
                            {permit.status === 'pending' && (
                              <button className="flex-1 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                Follow Up
                              </button>
                            )}
                            {variant === 'detailed' && (
                              <button className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
                                View Details
                              </button>
                            )}
                          </div>
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
                <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  No Permits Found
                </h4>
                <p className="text-gray-500 dark:text-gray-400">
                  No permits match the current filter criteria.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Progress Summary for Detailed Variant */}
        {variant === 'detailed' && (
          <motion.div 
            variants={itemVariants}
            className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">
              Permit Approval Progress
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600 dark:text-gray-300">Overall Progress</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stats.approvalRate.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                  style={{ width: `${stats.approvalRate}%` }}
                ></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.approved}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Approved</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{stats.submitted}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Submitted</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.pending}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Pending</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.notStarted}</div>
                  <div className="text-xs text-gray-600 dark:text-gray-300">Not Started</div>
                </div>
              </div>
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
              <FiDownload className="w-4 h-4 mr-2" />
              Download Permit Status Report
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PermitsAndClearances;