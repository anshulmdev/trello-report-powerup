import React, { useState } from 'react';

const ReportTypeSelector = ({ onSelect, credits }) => {
    const [question, setQuestion] = useState('');

    const handleSubmit = (type) => {
        onSelect(type, question);
    };

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Generate a Report</h2>
            <p className="text-gray-600 mb-4">Available credits: {credits}</p>
            <div className="mb-4">
                <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                    What would you like to know about your data?
                </label>
                <textarea
                    id="question"
                    rows="3"
                    className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    placeholder="Enter your question here"
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                ></textarea>
            </div>
            <div className="space-x-4">
                <button 
                    onClick={() => handleSubmit('text')} 
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate Text Report
                </button>
                <button 
                    onClick={() => handleSubmit('graphic')} 
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                >
                    Generate Graphic Report
                </button>
            </div>
        </div>
    );
};

export default ReportTypeSelector;