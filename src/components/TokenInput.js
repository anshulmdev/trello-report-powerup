import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { KeyIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';

const TokenInput = ({ onSubmit, error }) => {
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(token);
    };

    const handleCreateUser = () => {
        window.open("https://apilabz.com/", "_blank");
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-8 max-w-md mx-auto bg-white shadow-lg rounded-lg"
        >
            <h2 className="text-3xl font-bold mb-6">API Labz Authentication</h2>
            <form onSubmit={handleSubmit} className="mb-6">
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
                >
                    Submit
                </motion.button>
            </form>
            <p className="text-center mb-4">Don't have a token?</p>
            <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleCreateUser}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Create new user
            </motion.button>
            {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                >
                    <strong className="font-bold">Error: </strong>
                    <span className="block sm:inline">{error}</span>
                    <ExclamationCircleIcon className="h-5 w-5 inline ml-2" />
                </motion.div>
            )}
        </motion.div>
    );
};

export default TokenInput;