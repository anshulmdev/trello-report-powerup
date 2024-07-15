import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const TokenInput = ({ onSubmit, error: initialError }) => {
    const [token, setToken] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(initialError);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('https://hub.apilabz.com/user/token', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                onSubmit(token, data.credits);
            } else {
                const errorData = await response.json();
                setError(errorData.error || 'Invalid token');
            }
        } catch (error) {
            console.error('Error validating token:', error);
            setError('Error validating token. Please try again.');
        }

        setLoading(false);
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-8 rounded-lg shadow-md max-w-md mx-auto"
        >
            <h2 className="text-2xl font-bold mb-6">API Labz Authentication</h2>
            <div className="mb-6">
                <p className="text-gray-600 mb-4">To get your API token, follow these steps:</p>
                <ol className="list-decimal list-inside text-gray-600">
                    <li className="mb-2">Go to <a href="https://apilabz.com/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">apilabz.com</a> and log in via Google.</li>
                    <li className="mb-2">Navigate to your <a href="https://apilabz.com/profile" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">profile page</a>.</li>
                    <li>Copy the API token and paste it below.</li>
                </ol>
            </div>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-4">
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your API Labz token
                    </label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <KeyIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                        </div>
                        <input 
                            id="token"
                            type="text" 
                            value={token} 
                            onChange={(e) => setToken(e.target.value)} 
                            placeholder="Enter token"
                            className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                    </div>
                </div>
                <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    disabled={loading}
                >
                    {loading ? 'Validating...' : 'Save Token'}
                </motion.button>
            </form>
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <ExclamationCircleIcon className="h-5 w-5 inline ml-2" />
                </div>
            )}
        </motion.div>
    );
};

export default TokenInput;