import React from 'react';
import { motion } from 'framer-motion';
import { PrinterIcon, DocumentArrowDownIcon } from '@heroicons/react/24/solid';

const ReportDisplay = ({ reportType, report, reportUrl, handlePrint, handleSave }) => {
    return (
        <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="border border-gray-300 rounded-lg p-4 bg-white"
        >
            {reportType === 'graphic' && (
                <div className="mb-6 flex justify-center">
                    <a 
                        href={reportUrl}
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                    >
                        Open Report in New Tab
                    </a>
                </div>
            )}
            <div className="flex justify-end space-x-2 mb-4">
                <button onClick={handlePrint} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <PrinterIcon className="h-5 w-5 mr-2" />
                    Print
                </button>
                <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                    <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                    Save
                </button>
            </div>
            <div 
                className="overflow-auto"
                style={{maxHeight: 'calc(100vh - 300px)'}}
            >
                {reportType === 'text' ? (
                    <div dangerouslySetInnerHTML={{ __html: report }} />
                ) : (
                    <iframe
                        src={reportUrl}
                        title="Graphical Report"
                        width="100%"
                        height="500px"
                        className="border-none"
                    />
                )}
            </div>
        </motion.div>
    );
};

export default ReportDisplay;