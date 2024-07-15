import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, CreditCardIcon, ArrowDownTrayIcon } from '@heroicons/react/24/solid';
import ReportTypeSelector from './ReportTypeSelector';

const MainContent = ({ 
    reportType, 
    credits, 
    onReportTypeSelect, 
    report,
    reportUrl,
    handleBack, 
    handleDownload
}) => {
    return (
        <>
            {!reportType ? (
                <ReportTypeSelector onSelect={onReportTypeSelect} credits={credits} />
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
                        <div className="mt-6">
                            <button
                                onClick={handleDownload}
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md flex items-center justify-center w-full"
                            >
                                <ArrowDownTrayIcon className="h-6 w-6 mr-2" />
                                Download Report
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </>
    );
};

export default MainContent;