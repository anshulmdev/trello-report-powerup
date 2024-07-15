import React from 'react';
import { ExclamationCircleIcon } from '@heroicons/react/24/solid';

const ErrorDialog = ({ error, onClose }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md">
                <div className="flex items-center mb-4">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-500 mr-2" />
                    <h3 className="text-xl font-bold text-red-700">Error</h3>
                </div>
                <p className="mb-4">{error}</p>
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
                {error.includes('timeout') && (
                    <a 
                        href="mailto:info@apilabz.com"
                        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block mr-2"
                    >
                        Email Us
                    </a>
                )}
                <button 
                    onClick={onClose}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-block"
                >
                    Close
                </button>
            </div>
        </div>
    );
};

export default ErrorDialog;