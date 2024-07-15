import React from 'react';

const ReportTypeSelector = ({ onSelect, credits }) => {
    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">What kind of report do you want?</h2>
            <p className="text-gray-600 mb-4">Available credits: {credits}</p>
            <button 
                onClick={() => onSelect('text')} 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
            >
                Text Report
            </button>
            <button 
                onClick={() => onSelect('graphic')} 
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Graphic Report
            </button>
        </div>
    );
};

export default ReportTypeSelector;