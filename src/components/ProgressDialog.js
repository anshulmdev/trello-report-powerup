import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const ProgressDialog = ({ characters }) => {
    const [progress, setProgress] = useState(0);
    const totalSeconds = Math.max(Math.ceil(characters / 100), 1); // Ensure at least 1 second

    useEffect(() => {
        const timer = setInterval(() => {
            setProgress((prevProgress) => {
                const newProgress = prevProgress + 1;
                if (newProgress >= totalSeconds) {
                    clearInterval(timer);
                }
                return newProgress;
            });
        }, 1000);

        return () => {
            clearInterval(timer);
        };
    }, [totalSeconds]);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
                <h3 className="text-2xl font-bold mb-4">Generating Report</h3>
                <p className="mb-4">Estimated time: {totalSeconds} seconds</p>
                <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-blue-500"
                        initial={{ width: 0 }}
                        animate={{ width: `${(progress / totalSeconds) * 100}%` }}
                        transition={{ duration: 0.5 }}
                    />
                </div>
                <p className="mt-2 text-sm text-gray-600">
                    {progress < totalSeconds ? `${progress} seconds elapsed...` : 'Finalizing report...'}
                </p>
            </div>
        </div>
    );
};

export default ProgressDialog;