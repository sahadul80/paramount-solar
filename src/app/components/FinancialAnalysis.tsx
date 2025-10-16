// components/Sections/FinancialAnalysis.tsx
"use client"
import { motion, AnimatePresence } from 'framer-motion';
import { FiDollarSign, FiPieChart, FiTrendingUp, FiBarChart2, FiCalendar, FiTarget, FiZap, FiActivity, FiAward, FiPercent } from 'react-icons/fi';
import { useState, useMemo } from 'react';

interface FinancialAssumptions {
  operationYears?: number;
  degradationRate?: number;
  inflationRate?: number;
  discountRate?: number;
  debtInterest?: number;
  taxRate?: number;
  insuranceCost?: number;
  omCost?: number;
  [key: string]: string | number | undefined;
}

interface FinancialsData {
  totalCost: number;
  costPerMW: number;
  tariff: number;
  assumptions: FinancialAssumptions;
  debtEquity?: string;
  loanTerm?: string;
}

interface FinancialAnalysisProps {
  data: FinancialsData;
  className?: string;
  variant?: 'default' | 'compact' | 'detailed';
}

// Move this function outside the component to avoid dependency issues
function getAssumptionDescription(key: string): string {
  const descriptions: Record<string, string> = {
    'operationYears': 'Project operational lifetime',
    'degradationRate': 'Annual panel efficiency degradation',
    'inflationRate': 'Annual inflation assumption',
    'discountRate': 'Discount rate for NPV calculation',
    'debtInterest': 'Average interest rate on debt',
    'taxRate': 'Corporate tax rate applied',
    'insuranceCost': 'Annual insurance as % of CAPEX',
    'omCost': 'Annual operation and maintenance cost'
  };
  return descriptions[key] || 'Financial assumption';
}

export const FinancialAnalysis: React.FC<FinancialAnalysisProps> = ({ 
  data, 
  className = "",
  variant = "default"
}) => {
  const [selectedView, setSelectedView] = useState<'overview' | 'metrics' | 'assumptions'>('overview');

  // Calculate additional financial metrics - move all useMemo hooks to top level
  const financialMetrics = useMemo(() => {
    if (!data) return null;
    
    const totalCost = data.totalCost || 0;
    const costPerMW = data.costPerMW || 0;
    const tariff = data.tariff || 0;
    
    // Mock calculations for demonstration
    const estimatedRevenue = totalCost * 1.8; // Simple multiplier
    const paybackPeriod = 8.5; // years
    const npv = totalCost * 1.2; // Net Present Value
    const irr = 12.5; // Internal Rate of Return

    return {
      totalCost,
      costPerMW,
      tariff,
      estimatedRevenue,
      paybackPeriod,
      npv,
      irr,
      debtEquity: data.debtEquity || '70/30',
      loanTerm: data.loanTerm || '15 years'
    };
  }, [data]);

  // Format assumptions for display - moved to top level
  const formattedAssumptions = useMemo(() => {
    if (!data?.assumptions) return [];
    return Object.entries(data.assumptions).map(([key, value]) => ({
      key: key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase()),
      value: value?.toString() || '',
      description: getAssumptionDescription(key)
    }));
  }, [data?.assumptions]);

  // Early return after all hooks
  if (!data || !financialMetrics) {
    return (
      <section id="financials" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
        <div className="text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Financial Analysis
          </h2>
          <p className="text-gray-500 dark:text-gray-400">Financial data not available</p>
        </div>
      </section>
    );
  }

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
        return "grid grid-cols-1 lg:grid-cols-3 gap-6";
      default:
        return "grid grid-cols-1 md:grid-cols-3 gap-6";
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

  const primaryMetrics = [
    {
      icon: FiDollarSign,
      label: 'Total Project Cost',
      value: `USD ${(financialMetrics.totalCost / 1000000).toFixed(2)} Mn`,
      subvalue: `USD ${financialMetrics.costPerMW.toFixed(2)}/MWp`,
      description: 'Total capital expenditure',
      color: 'from-blue-500 to-cyan-500',
      trend: '+5.2% vs budget'
    },
    {
      icon: FiTrendingUp,
      label: 'PPA Tariff',
      value: `USD ${financialMetrics.tariff}/kWh`,
      subvalue: 'Fixed for 25 years',
      description: 'Power Purchase Agreement',
      color: 'from-green-500 to-emerald-500',
      trend: 'Competitive rate'
    },
    {
      icon: FiPieChart,
      label: 'Debt/Equity Ratio',
      value: financialMetrics.debtEquity,
      subvalue: financialMetrics.loanTerm,
      description: 'Financing structure',
      color: 'from-purple-500 to-pink-500',
      trend: 'Industry standard'
    }
  ];

  const secondaryMetrics = [
    {
      icon: FiBarChart2,
      label: 'Estimated Revenue',
      value: `USD ${(financialMetrics.estimatedRevenue / 1000000).toFixed(2)} Mn`,
      subvalue: '25-year lifetime',
      description: 'Total projected revenue',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: FiCalendar,
      label: 'Payback Period',
      value: `${financialMetrics.paybackPeriod} years`,
      subvalue: 'Project breakeven',
      description: 'Time to recover investment',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      icon: FiTarget,
      label: 'IRR',
      value: `${financialMetrics.irr}%`,
      subvalue: 'Internal Rate of Return',
      description: 'Project profitability',
      color: 'from-teal-500 to-green-500'
    }
  ];

  return (
    <section id="financials" className={`w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 ${className}`}>
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
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mr-3">
              <FiTrendingUp className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">
              Financial Analysis
            </h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Comprehensive financial metrics, projections, and investment analysis
          </p>
        </motion.div>

        {/* View Toggle for Detailed Variant */}
        {variant === 'detailed' && (
          <motion.div 
            variants={itemVariants}
            className="flex justify-center mb-6 lg:mb-8"
          >
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-1 flex">
              <button
                onClick={() => setSelectedView('overview')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'overview'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiBarChart2 className="w-4 h-4 mr-2" />
                Overview
              </button>
              <button
                onClick={() => setSelectedView('metrics')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'metrics'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiActivity className="w-4 h-4 mr-2" />
                Key Metrics
              </button>
              <button
                onClick={() => setSelectedView('assumptions')}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  selectedView === 'assumptions'
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <FiTarget className="w-4 h-4 mr-2" />
                Assumptions
              </button>
            </div>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {(selectedView === 'overview' || variant !== 'detailed') && (
            <motion.div
              key="overview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Primary Financial Metrics */}
              <motion.div 
                variants={itemVariants}
                className={getGridClass()}
              >
                {primaryMetrics.map((metric, index) => (
                  <motion.div
                    key={metric.label}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden group"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    transition={{ 
                      delay: index * 0.1,
                      type: "spring", 
                      stiffness: 300 
                    }}
                  >
                    <div className={`${getCardPadding()} flex flex-col h-full`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                          <metric.icon className="w-6 h-6 text-white" />
                        </div>
                        {metric.trend && (
                          <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                            {metric.trend}
                          </span>
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                          {metric.value}
                        </div>
                        <div className="text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                          {metric.label}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                          {metric.description}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {metric.subvalue}
                        </div>
                      </div>

                      {/* Progress indicator for detailed variant */}
                      {variant === 'detailed' && metric.label === 'Total Project Cost' && (
                        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                          <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1">
                            <span>Budget Utilization</span>
                            <span>87%</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-cyan-500 h-2 rounded-full"
                              style={{ width: '87%' }}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Secondary Metrics for Detailed Variant */}
              {variant === 'detailed' && (
                <motion.div 
                  variants={itemVariants}
                  className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 lg:mt-8"
                >
                  {secondaryMetrics.map((metric, index) => (
                    <motion.div
                      key={metric.label}
                      className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`w-10 h-10 bg-gradient-to-br ${metric.color} rounded-lg flex items-center justify-center`}>
                          <metric.icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
                            {metric.label}
                          </h4>
                          <p className="text-xs text-gray-600 dark:text-gray-300">
                            {metric.description}
                          </p>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {metric.value}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-300">
                        {metric.subvalue}
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Financial Highlights */}
              <motion.div 
                variants={itemVariants}
                className="mt-6 lg:mt-8"
              >
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div className={`${getCardPadding()} border-b border-gray-200 dark:border-gray-700`}>
                    <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                      <FiAward className="w-5 h-5 text-blue-500 mr-2" />
                      Financial Highlights
                    </h3>
                  </div>
                  <div className={getCardPadding()}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
                      <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                        <FiTrendingUp className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">USD {((financialMetrics.npv - financialMetrics.totalCost) / 1000000).toFixed(1)} Mn</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Net Profit</div>
                      </div>
                      <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                        <FiPercent className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">{financialMetrics.irr}%</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">IRR</div>
                      </div>
                      <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                        <FiZap className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
                        <div className="text-xl font-bold text-gray-900 dark:text-white">1.8x</div>
                        <div className="text-sm text-gray-600 dark:text-gray-300">Revenue/Cost Ratio</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {selectedView === 'metrics' && variant === 'detailed' && (
            <motion.div
              key="metrics"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Detailed Financial Metrics */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                <motion.div 
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Investment Metrics</h3>
                  <div className="space-y-4">
                    {[...primaryMetrics, ...secondaryMetrics].map((metric, index) => (
                      <div key={metric.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-br ${metric.color} rounded flex items-center justify-center`}>
                            <metric.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">{metric.label}</span>
                        </div>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  variants={itemVariants}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6"
                >
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Cash Flow Analysis</h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Annual Revenue', value: `USD ${(financialMetrics.estimatedRevenue / 25 / 1000000).toFixed(1)} Mn` },
                      { label: 'O&M Costs', value: `USD ${(financialMetrics.totalCost * 0.02 / 1000000).toFixed(1)} Mn/yr` },
                      { label: 'Debt Service', value: `USD ${(financialMetrics.totalCost * 0.7 * 0.06 / 1000000).toFixed(1)} Mn/yr` },
                      { label: 'Net Cash Flow', value: `USD ${(financialMetrics.estimatedRevenue / 25 * 0.3 / 1000000).toFixed(1)} Mn/yr` },
                    ].map((item, index) => (
                      <div key={item.label} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <span className="text-sm text-gray-700 dark:text-gray-200">{item.label}</span>
                        <span className="text-sm font-bold text-gray-900 dark:text-white">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {selectedView === 'assumptions' && variant === 'detailed' && (
            <motion.div
              key="assumptions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Key Assumptions */}
              <motion.div 
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden"
              >
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg lg:text-xl font-bold text-gray-900 dark:text-white flex items-center">
                    <FiTarget className="w-5 h-5 text-blue-500 mr-2" />
                    Key Financial Assumptions
                  </h3>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {formattedAssumptions.map((assumption, index) => (
                      <motion.div
                        key={assumption.key}
                        className="flex flex-col p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <span className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                          {assumption.key}
                        </span>
                        <span className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">
                          {assumption.value}
                        </span>
                        <span className="text-xs text-gray-600 dark:text-gray-300">
                          {assumption.description}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download Button for Compact Variant */}
        {variant === 'compact' && (
          <motion.div 
            className="mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <button className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200">
              <FiDollarSign className="w-4 h-4 mr-2" />
              Download Financial Report
            </button>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default FinancialAnalysis;