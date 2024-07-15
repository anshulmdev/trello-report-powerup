import React, { useState } from 'react';

const ReportTypeSelector = ({ onSelect, credits }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (type) => {
        onSelect(type, question);
    };

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Generate a Report</h2>
            <p className="text-gray-600 mb-6">Available credits: {credits}</p>
            <div className="mb-6">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to know about your data?
                </label>
                <textarea
                    id="question"
                    rows="4"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md p-2"
                    placeholder="Enter your question here"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                ></textarea>
            </div>
            <div className="space-y-4">
                <button 
                    onClick={() => handleSubmit('text')} 
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded"
                >
                    Generate Text Report
                </button>
                <button 
                    onClick={() => handleSubmit('graphic')} 
                    className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-4 rounded"
                >
                    Generate Graphic Report
                </button>
            </div>
        </div>
    );
};

export default ReportTypeSelector;