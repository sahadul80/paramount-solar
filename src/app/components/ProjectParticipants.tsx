// components/Sections/ProjectParticipants.tsx
"use client"
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { FiUsers, FiAward, FiCheckCircle, FiBriefcase, FiZap, FiHome, FiTruck, FiShield, FiX, FiMail, FiPhone, FiGlobe } from 'react-icons/fi';
import { useState } from 'react';

interface Participant {
  name: string;
  role: string;
  description: string;
  capabilities: string[];
  status: 'verified' | 'pending';
  experience?: string;
  projectsCompleted?: number;
  rating?: number;
  contact?: {
    email?: string;
    phone?: string;
    website?: string;
  };
  additionalInfo?: string;
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
  const [expandedParticipant, setExpandedParticipant] = useState<string | null>(null);

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

  const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 25,
        stiffness: 300
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      transition: {
        duration: 0.2
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

  const handleCardClick = (participantKey: string) => {
    setExpandedParticipant(participantKey);
  };

  const handleCloseModal = () => {
    setExpandedParticipant(null);
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

  const selectedParticipant = expandedParticipant ? getParticipantData(expandedParticipant) : null;
  const selectedParticipantInfo = expandedParticipant ? participants.find(p => p.key === expandedParticipant) : null;

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
          className="text-center flex items-center"
        >
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white m-4">
            Project Participants
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl m-2">
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden group cursor-pointer"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300, delay: index * 0.1 }}
                onClick={() => handleCardClick(participant.key)}
              >
                <div className={`${getCardPadding()} h-full flex flex-col`}>
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-auto h-auto p-2 bg-gradient-to-br ${participant.color} rounded-lg flex items-center justify-center group-hover:scale-108 transition-transform duration-300`}>
                        <participant.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 dark:text-white text-lg">
                          {dataItem.name}
                        </h4>
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
                  <div className="m-2">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Role:</span>
                    <span className="text-sm text-gray-700 dark:text-gray-200 ml-2">{dataItem.role}</span>
                  </div>

                  {/* Description (Truncated) */}
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 flex-grow line-clamp-3">
                    {dataItem.description}
                  </p>

                  {/* Capabilities (Limited display) */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
                      Key Capabilities
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {dataItem.capabilities.slice(0, 3).map((capability, capIndex) => (
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
                      {dataItem.capabilities.length > 3 && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                          +{dataItem.capabilities.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Click hint */}
                  <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      Click for full details
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Modal for Expanded View */}
        <AnimatePresence>
          {expandedParticipant && selectedParticipant && selectedParticipantInfo && (
            <motion.div
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 m-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseModal}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-[100vw] max-h-[100vh] overflow-y-auto"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="relative p-6 border-b border-gray-200 dark:border-gray-700">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`p-4 bg-gradient-to-br ${selectedParticipantInfo.color} rounded-xl flex items-center justify-center`}>
                        <selectedParticipantInfo.icon className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                          {selectedParticipant.name}
                        </h3>
                        <p className="text-lg text-gray-600 dark:text-gray-300">
                          {selectedParticipantInfo.label}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleCloseModal}
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <FiX className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                    </button>
                  </div>
                  
                  <div className="flex items-center space-x-4 mt-4">
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      selectedParticipant.status === 'verified' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
                    }`}>
                      {selectedParticipant.status === 'verified' ? (
                        <>
                          <FiCheckCircle className="w-4 h-4 mr-2" />
                          Verified Partner
                        </>
                      ) : (
                        'Pending Verification'
                      )}
                    </div>
                    
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      Role: {selectedParticipant.role}
                    </div>
                  </div>
                </div>

                {/* Modal Body */}
                <div className="p-6 space-y-6">
                  {/* Description */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      About
                    </h4>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                      {selectedParticipant.description}
                    </p>
                  </div>

                  {/* Additional Information */}
                  {(selectedParticipant.experience || selectedParticipant.projectsCompleted || selectedParticipant.rating) && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {selectedParticipant.experience && (
                        <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {selectedParticipant.experience}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Experience</div>
                        </div>
                      )}
                      {selectedParticipant.projectsCompleted && (
                        <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {selectedParticipant.projectsCompleted}+
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">Projects Completed</div>
                        </div>
                      )}
                      {selectedParticipant.rating && (
                        <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {selectedParticipant.rating}/5
                          </div>
                          <div className="flex justify-center space-x-1 mt-1">
                            {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-2 h-2 rounded-full ${
                                    i < Math.floor(selectedParticipant.rating ?? 0)
                                      ? 'bg-yellow-400'
                                      : 'bg-gray-300 dark:bg-gray-600'
                                  }`}
                                />
                              ))}
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300 mt-1">Rating</div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Capabilities */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Capabilities & Expertise
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedParticipant.capabilities.map((capability, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-3 py-2 rounded-full text-sm bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300"
                        >
                          {capability}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Contact Information */}
                  {selectedParticipant.contact && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Contact Information
                      </h4>
                      <div className="space-y-2">
                        {selectedParticipant.contact.email && (
                          <div className="flex items-center space-x-3">
                            <FiMail className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedParticipant.contact.email}</span>
                          </div>
                        )}
                        {selectedParticipant.contact.phone && (
                          <div className="flex items-center space-x-3">
                            <FiPhone className="w-5 h-5 text-gray-400" />
                            <span className="text-gray-600 dark:text-gray-300">{selectedParticipant.contact.phone}</span>
                          </div>
                        )}
                        {selectedParticipant.contact.website && (
                          <div className="flex items-center space-x-3">
                            <FiGlobe className="w-5 h-5 text-gray-400" />
                            <a 
                              href={selectedParticipant.contact.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 dark:text-blue-400 hover:underline"
                            >
                              {selectedParticipant.contact.website}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Info */}
                  {selectedParticipant.additionalInfo && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                        Additional Information
                      </h4>
                      <p className="text-gray-600 dark:text-gray-300">
                        {selectedParticipant.additionalInfo}
                      </p>
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 rounded-b-2xl">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={handleCloseModal}
                      className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                    >
                      Close
                    </button>
                    <button className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                      <FiMail className="w-4 h-4" />
                      <span>Contact Partner</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

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