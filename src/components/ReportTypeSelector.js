import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { DocumentTextIcon, ChartBarIcon, CreditCardIcon } from '@heroicons/react/24/solid';

const ReportTypeSelector = ({ onSelect, credits }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (type) => {
        onSelect(type, question);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg overflow-hidden"
        >
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-3xl font-bold">Generate AI Report</h2>
                    <div className="flex items-center">
                        <CreditCardIcon className="h-6 w-6 text-green-500 mr-2" />
                        <span className="text-lg font-semibold">Credits: {credits}</span>
                    </div>
                </div>
                <div className="mb-6">
                    <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                        What would you like to know about your data?
                    </label>
                    <textarea
                        id="question"
                        rows="4"
                        className="focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                        placeholder="Enter your question here"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                    ></textarea>
                </div>
                <div className="space-y-4">
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubmit('text')} 
                        className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
                    >
                        <DocumentTextIcon className="h-6 w-6 mr-2" />
                        Generate Text Report
                    </motion.button>
                    <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSubmit('graphic')} 
                        className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded flex items-center justify-center"
                    >
                        <ChartBarIcon className="h-6 w-6 mr-2" />
                        Generate Graphic Report
                    </motion.button>
                </div>
            </div>
        </motion.div>
    );
};

export default ReportTypeSelector;