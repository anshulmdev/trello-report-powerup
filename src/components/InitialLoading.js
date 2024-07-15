import React from 'react';

const InitialLoading = () => {
    return (
        <div className="fixed inset-0 bg-white flex justify-center items-center z-50">
            <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
            </div>
        </div>
    );
};

export default InitialLoading;