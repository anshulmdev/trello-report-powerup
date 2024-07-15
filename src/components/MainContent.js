import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, CreditCardIcon, ClockIcon } from '@heroicons/react/24/solid';
import ReportTypeSelector from './ReportTypeSelector';
import HistoryTable from './HistoryTable';
import ReportDisplay from './ReportDisplay';

const MainContent = ({ 
    reportType, 
    credits, 
    onReportTypeSelect, 
    history, 
    showHistory, 
    toggleHistory, 
    report, 
    reportUrl, 
    handleBack, 
    handlePrint, 
    handleSave 
}) => {
    return (
        <>
            {!reportType ? (
                <>
                    <ReportTypeSelector onSelect={onReportTypeSelect} credits={credits} />
                    {history.length > 0 && (
                        <button 
                            onClick={toggleHistory}
                            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center w-full"
                        >
                            <ClockIcon className="h-5 w-5 mr-2" />
                            {showHistory ? 'Hide History' : 'Show History'}
                        </button>
                    )}
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HistoryTable history={history} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-3xl font-bold mb-2 sm:mb-0">Generated Report</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <CreditCardIcon className="h-6 w-6 text-green-500 mr-2" />
                                    <span className="text-lg font-semibold">Credits: {credits}</span>
                                </div>
                                <button 
                                    onClick={handleBack}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 mr-2" />
                                    Back
                                </button>
                            </div>
                        </div>
                        <ReportDisplay 
                            reportType={reportType}
                            report={report}
                            reportUrl={reportUrl}
                            handlePrint={handlePrint}
                            handleSave={handleSave}
                        />
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default MainContent;