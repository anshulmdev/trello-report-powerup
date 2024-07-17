import React from 'react';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';

const ErrorDialog = ({ error, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <InformationCircleIcon className="h-6 w-6 text-blue-500 mr-2" />
                        <h3 className="text-xl font-bold text-blue-700">Important Information</h3>
                    </div>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                        <XMarkIcon className="h-6 w-6" />
                    </button>
                </div>
                <p className="mb-4 text-gray-600">{error}</p>
                {error.includes('Insufficient credits') && (
                    <a 
                        href="https://apilabz.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block mr-2"
                    >
                        Add Credits
                    </a>
                )}
                {error.includes('timed out') && (
                    <a 
                        href="mailto:info@apilabz.com"
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-block mr-2"
                    >
                        Contact Support
                    </a>
                )}
                <button 
                    onClick={onClose}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-block"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorDialog;