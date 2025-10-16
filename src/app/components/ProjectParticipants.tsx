// components/Sections/ProjectParticipants.tsx
"use client"
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiCheckCircle, FiBriefcase, FiZap, FiHome, FiTruck, FiShield } from 'react-icons/fi';

interface Participant {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: 'verified' | 'pending';
  experience?: string;
  projectsCompleted?: number;
  rating?: number;
}

interface ProjectParticipantsProps {
  data: {
    projectCompany?: Participant;
    moduleManufacturer?: Participant;
    inverterManufacturer?: Participant;
    epcContractor?: Participant;
    omContractor?: Participant;
    powerPurchaser?: Participant;
    transmissionUtility?: Participant;
  };
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

export const ProjectParticipants: React.FC<ProjectParticipantsProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const participants = [
    { 
      key: 'projectCompany', 
      label: 'Project Company', 
      icon: FiHome,
      color: 'from-blue-500 to-cyan-500'
    },
    { 
      key: 'moduleManufacturer', 
      label: 'Module Manufacturer', 
      icon: FiAward,
      color: 'from-yellow-500 to-orange-500'
    },
    { 
      key: 'inverterManufacturer', 
      label: 'Inverter Manufacturer', 
      icon: FiZap,
      color: 'from-purple-500 to-pink-500'
    },
    { 
      key: 'epcContractor', 
      label: 'EPC Contractor', 
      icon: FiBriefcase,
      color: 'from-green-500 to-teal-500'
    },
    { 
      key: 'omContractor', 
      label: 'O&M Contractor', 
      icon: FiUsers,
      color: 'from-indigo-500 to-blue-500'
    },
    { 
      key: 'powerPurchaser', 
      label: 'Power Purchaser', 
      icon: FiCheckCircle,
      color: 'from-emerald-500 to-green-500'
    },
    { 
      key: 'transmissionUtility', 
      label: 'Transmission Utility', 
      icon: FiShield,
      color: 'from-gray-500 to-gray-700'
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

  // Safe data access with fallbacks
  const getParticipantData = (key: string): Participant | null => {
    const participant = data[key as keyof typeof data];
    return participant || null;
  };

  // Filter out participants with no data
  const validParticipants = participants.filter(participant => 
    getParticipantData(participant.key)
  );

  const getGridClass = () => {
    switch (variant) {
      case 'compact':
        return "grid grid-cols-1 sm:grid-cols-2 gap-4";
      case 'detailed':
        return "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6";
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

  if (validParticipants.length === 0) {
    return (
      <section id="participants" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Project Participants
          </h2>
          <p className="text-gray-500 dark:text-gray-400">No participant data available</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id="participants" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
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
            Project Participants
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Key stakeholders and partners involved in the project development and operation
          </p>
        </motion.div>

        {/* Participants Grid */}
        <div className={getGridClass()}>
          {validParticipants.map((participant, index) => {
            const dataItem = getParticipantData(participant.key);
            if (!dataItem) return null;

            return (
              <motion.div
                key={participant.key}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
              >
                <div className={`${getCardPadding()} h-full flex flex-col`}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${participant.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                        <participant.icon className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">
                          {dataItem.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {participant.label}
                        </p>
                      </div>
                    </div>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      dataItem.status === 'verified' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {dataItem.status === 'verified' ? (
                        <>
                          <FiCheckCircle className="w-3 h-3 mr-1" />
                          Verified
                        </>
                      ) : (
                        'Pending'
                      )}
                    </div>
                  </div>

                  {/* Role */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-200 ml-2">{dataItem.role}</span>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow">
                    {dataItem.description}
                  </p>

                  {/* Additional Info for Detailed Variant */}
                  {variant === 'detailed' && (
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {dataItem.experience && (
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Experience</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{dataItem.experience}</div>
                        </div>
                      )}
                      {dataItem.projectsCompleted && (
                        <div className="text-center p-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                          <div className="text-xs text-gray-500 dark:text-gray-400">Projects</div>
                          <div className="text-sm font-semibold text-gray-900 dark:text-white">{dataItem.projectsCompleted}+</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Rating for Detailed Variant */}
                  {variant === 'detailed' && dataItem.rating && (
                    <div className="flex items-center mb-4">
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-3 h-3 rounded-full ${
                              i < Math.floor(dataItem.rating!)
                                ? 'bg-yellow-400'
                                : 'bg-gray-300 dark:bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">
                        {dataItem.rating}/5
                      </span>
                    </div>
                  )}

                  {/* Capabilities */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Capabilities & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dataItem.capabilities.map((capability, capIndex) => (
                        <motion.span
                          key={capIndex}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.5 + capIndex * 0.1 }}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {capability}
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Button for Compact Variant */}
                  {variant === 'compact' && (
                    <button className="mt-4 w-full py-2 text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg transition-colors duration-200">
                      Contact Partner
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Summary for Detailed Variant */}
        {variant === 'detailed' && (
          <motion.div 
            className="mt-8 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                  Partnership Summary
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {validParticipants.length} key partners working together to ensure project success
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {validParticipants.filter(p => getParticipantData(p.key)?.status === 'verified').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Verified Partners</div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default ProjectParticipants;