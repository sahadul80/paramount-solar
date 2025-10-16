// components/Sections/ProjectSchedule.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiCalendar, FiCheckCircle, FiClock, FiAlertTriangle, FiTrendingUp, FiFlag, FiMap, FiBarChart2, FiChevronDown, FiChevronRight, FiPlay, FiPause, FiSquare } from 'react-icons/fi';
import { useState } from 'react';

interface Milestone {
  id: string;
  name: string;
  plannedDate: string;
  actualDate?: string;
  status: 'completed' | 'in-progress' | 'delayed' | 'upcoming';
  description: string;
  dependencies?: string[];
  progress?: number;
  critical?: boolean;
  duration?: number; // in days
  startDate?: string;
  endDate?: string;
  subTasks?: Milestone[];
}

interface ProjectScheduleProps {
  data: {
    milestones: Milestone[];
    overallProgress: number;
    criticalPath: string[];
    nextMilestones: Milestone[];
    projectStart: string;
    projectEnd: string;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ProjectSchedule: React.FC<ProjectScheduleProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [selectedView, setSelectedView] = useState<'timeline' | 'gantt'>('timeline');

  const toggleExpand = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const getStatusIcon = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': 
        return <FiCheckCircle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'in-progress': 
        return <FiClock className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'delayed': 
        return <FiAlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />;
      case 'upcoming': 
        return <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />;
      default: 
        return <FiCalendar className="w-4 h-4 sm:w-5 sm:h-5" />;
    }
  };

  const getStatusColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in-progress': return 'bg-blue-500';
      case 'delayed': return 'bg-red-500';
      case 'upcoming': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  const getStatusBgColor = (status: Milestone['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-50 dark:bg-green-900/10 border-l-green-500';
      case 'in-progress': return 'bg-blue-50 dark:bg-blue-900/10 border-l-blue-500';
      case 'delayed': return 'bg-red-50 dark:bg-red-900/10 border-l-red-500';
      case 'upcoming': return 'bg-gray-50 dark:bg-gray-700/50 border-l-gray-400';
      default: return 'bg-gray-50 dark:bg-gray-700/50 border-l-gray-400';
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

  const getTimelineLayout = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 gap-4";
      case 'detailed':
        return "grid grid-cols-1 lg:grid-cols-2 gap-8";
      default:
        return "grid grid-cols-1 gap-6";
    }
  };

  // Calculate days remaining or completed
  const calculateTimelineStats = () => {
    const completed = data.milestones.filter(m => m.status === 'completed').length;
    const delayed = data.milestones.filter(m => m.status === 'delayed').length;
    const inProgress = data.milestones.filter(m => m.status === 'in-progress').length;
    
    return { completed, delayed, inProgress };
  };

  const stats = calculateTimelineStats();

  // Recursive component for rendering milestone tree
  const MilestoneTreeNode: React.FC<{ 
    milestone: Milestone; 
    level: number;
    index: number;
    isLast: boolean;
  }> = ({ milestone, level, index, isLast }) => {
    const isExpanded = expandedItems.has(milestone.id);
    const hasChildren = milestone.subTasks && milestone.subTasks.length > 0;
    const paddingLeft = level * 24;

    return (
      <div className="relative">
        {/* Vertical line */}
        {level > 0 && (
          <div 
            className="absolute top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"
            style={{ left: `${paddingLeft - 12}px` }}
          />
        )}
        
        {/* Horizontal line */}
        {level > 0 && (
          <div 
            className="absolute top-4 w-3 h-0.5 bg-gray-300 dark:bg-gray-600"
            style={{ left: `${paddingLeft - 12}px` }}
          />
        )}

        <motion.div
          className={`flex space-x-4 p-4 rounded-lg border-l-4 ${getStatusBgColor(milestone.status)} mb-2`}
          style={{ marginLeft: `${paddingLeft}px` }}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          whileHover={{ scale: 1.01 }}
        >
          {/* Expand/Collapse Button */}
          {hasChildren && (
            <button
              onClick={() => toggleExpand(milestone.id)}
              className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              {isExpanded ? (
                <FiChevronDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              ) : (
                <FiChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              )}
            </button>
          )}

          {/* Status Indicator */}
          <div className="flex-shrink-0">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              milestone.status === 'completed' ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400' :
              milestone.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
              milestone.status === 'delayed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
              'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
            }`}>
              {getStatusIcon(milestone.status)}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-2">
              <div className="flex items-center flex-wrap gap-2">
                <h4 className="text-base font-semibold text-gray-900 dark:text-white">
                  {milestone.name}
                </h4>
                {milestone.critical && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">
                    <FiFlag className="w-3 h-3 mr-1" />
                    Critical
                  </span>
                )}
                {milestone.duration && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <FiClock className="w-3 h-3 mr-1" />
                    {milestone.duration}d
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-2 text-sm mt-1 sm:mt-0">
                {milestone.startDate && milestone.endDate && (
                  <span className="text-gray-500 dark:text-gray-400">
                    {milestone.startDate} - {milestone.endDate}
                  </span>
                )}
                <span className="text-gray-500 dark:text-gray-400">
                  {milestone.actualDate ? `Completed: ${milestone.actualDate}` : `Planned: ${milestone.plannedDate}`}
                </span>
              </div>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {milestone.description}
            </p>

            {/* Progress Bar for In-Progress Items */}
            {milestone.status === 'in-progress' && milestone.progress !== undefined && (
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{milestone.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${milestone.progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {/* Dependencies */}
            {milestone.dependencies && milestone.dependencies.length > 0 && (
              <div className="flex flex-wrap gap-1">
                <span className="text-xs text-gray-500 dark:text-gray-400">Depends on:</span>
                {milestone.dependencies.map((dep, depIndex) => (
                  <span 
                    key={depIndex}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                  >
                    {dep}
                  </span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Child milestones */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {milestone.subTasks!.map((child, childIndex) => (
                <MilestoneTreeNode
                  key={child.id}
                  milestone={child}
                  level={level + 1}
                  index={childIndex}
                  isLast={childIndex === milestone.subTasks!.length - 1}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Gantt Chart View Component
  const GanttChartView: React.FC = () => {
    // Mock date range for the project
    const projectStart = new Date('2024-01-01');
    const projectEnd = new Date('2024-12-31');
    const totalDays = Math.ceil((projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));

    const getDatePosition = (dateStr: string) => {
      const date = new Date(dateStr);
      const daysFromStart = Math.ceil((date.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24));
      return (daysFromStart / totalDays) * 100;
    };

    const getDurationWidth = (startDate: string, endDate: string) => {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const durationDays = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      return (durationDays / totalDays) * 100;
    };

    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white">Gantt Chart View</h4>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {projectStart.toLocaleDateString()} - {projectEnd.toLocaleDateString()}
          </div>
        </div>
        
        <div className="relative">
          {/* Timeline header */}
          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
            <span>Q1</span>
            <span>Q2</span>
            <span>Q3</span>
            <span>Q4</span>
          </div>
          
          {/* Timeline bar */}
          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-6"></div>
          
          {/* Milestone bars */}
          <div className="space-y-3">
            {data.milestones.slice(0, 6).map((milestone, index) => (
              <div key={milestone.id} className="flex items-center space-x-4">
                <div className="w-32 text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                  {milestone.name}
                </div>
                <div className="flex-1 relative">
                  {milestone.startDate && milestone.endDate && (
                    <div
                      className={`h-6 rounded-full ${
                        milestone.status === 'completed' ? 'bg-green-500' :
                        milestone.status === 'in-progress' ? 'bg-blue-500' :
                        milestone.status === 'delayed' ? 'bg-red-500' :
                        'bg-gray-400'
                      }`}
                      style={{
                        marginLeft: `${getDatePosition(milestone.startDate)}%`,
                        width: `${getDurationWidth(milestone.startDate, milestone.endDate)}%`
                      }}
                    >
                      <div className="flex items-center justify-center h-full text-xs text-white font-medium">
                        {milestone.duration || '?'}d
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="schedule" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
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
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mr-3">
              <FiCalendar className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Project Schedule
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Interactive timeline with hierarchical task structure and duration tracking
          </p>
        </motion.div>

        {/* Overview Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8 lg:mb-12"
        >
          {/* Overall Progress */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Overall Progress</h3>
              <FiTrendingUp className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {data.overallProgress}%
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${data.overallProgress}%` }}
              ></div>
            </div>
          </motion.div>

          {/* Completed Milestones */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Completed</h3>
              <FiCheckCircle className="w-5 h-5 text-green-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.completed}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              of {data.milestones.length} milestones
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
              <FiClock className="w-5 h-5 text-blue-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.inProgress}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Active milestones
            </div>
          </motion.div>

          {/* Delayed */}
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 lg:p-6"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, delay: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-300">Delayed</h3>
              <FiAlertTriangle className="w-5 h-5 text-red-500" />
            </div>
            <div className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white">
              {stats.delayed}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Requiring attention
            </div>
          </motion.div>
        </motion.div>

        {/* View Toggle for Detailed Variant */}
        {variant === 'detailed' && (
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-6"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedView('timeline')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'timeline'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiMap className="w-4 h-4 mr-2" />
                Timeline Tree
              </button>
              <button
                onClick={() => setSelectedView('gantt')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'gantt'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiBarChart2 className="w-4 h-4 mr-2" />
                Gantt Chart
              </button>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <div className={getTimelineLayout()}>
          {/* Timeline Section */}
          <motion.div 
            variants={itemVariants}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
          >
            <div className={`${getCardPadding()} border-b border-gray-200 dark:border-gray-700`}>
              <div className="flex items-center justify-between">
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiMap className="w-5 h-5 text-blue-500 mr-2" />
                  {selectedView === 'timeline' ? 'Project Timeline Tree' : 'Gantt Chart'}
                </h3>
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {data.projectStart} - {data.projectEnd}
                </div>
              </div>
            </div>

            <div className="max-h-96 lg:max-h-[500px] overflow-y-auto">
              <div className={getCardPadding()}>
                <AnimatePresence mode="wait">
                  {selectedView === 'timeline' ? (
                    <motion.div
                      key="timeline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-2">
                        {data.milestones.map((milestone, index) => (
                          <MilestoneTreeNode
                            key={milestone.id}
                            milestone={milestone}
                            level={0}
                            index={index}
                            isLast={index === data.milestones.length - 1}
                          />
                        ))}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="gantt"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <GanttChartView />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* Next Milestones & Critical Path */}
          <div className="space-y-6 lg:space-y-8">
            {/* Next Milestones */}
            <motion.div 
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
            >
              <div className={`${getCardPadding()} border-b border-gray-200 dark:border-gray-700`}>
                <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <FiFlag className="w-5 h-5 text-green-500 mr-2" />
                  Next Critical Milestones
                </h3>
              </div>
              <div className={getCardPadding()}>
                <div className="space-y-4">
                  {data.nextMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.id}
                      className="flex items-center space-x-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        milestone.status === 'in-progress' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' :
                        milestone.status === 'delayed' ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' :
                        'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-400'
                      }`}>
                        {getStatusIcon(milestone.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {milestone.name}
                          </h4>
                          <span className="text-xs text-gray-500 dark:text-gray-400 sm:ml-2">
                            {milestone.plannedDate}
                          </span>
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-300 mt-1 truncate">
                          {milestone.description}
                        </p>
                        {milestone.duration && (
                          <div className="flex items-center mt-1">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Duration: {milestone.duration} days
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Critical Path */}
            {variant === 'detailed' && (
              <motion.div 
                variants={itemVariants}
                className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 rounded-xl p-6 border border-orange-200 dark:border-orange-800"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                  <FiBarChart2 className="w-5 h-5 text-orange-500 mr-2" />
                  Critical Path Analysis
                </h3>
                <div className="space-y-2">
                  {data.criticalPath.map((path, index) => (
                    <div key={index} className="flex items-center space-x-3 text-sm">
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-gray-700 dark:text-gray-200">{path}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-4 p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <p className="text-xs text-orange-800 dark:text-orange-300">
                    These milestones are critical to the project timeline. Any delays will impact the overall completion date.
                  </p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Download Button for Compact Variant */}
        {variant === 'compact' && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <FiCalendar className="w-4 h-4 mr-2" />
              Download Project Schedule
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectSchedule;