import React from 'react';

const InitialLoading = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-lg font-semibold text-gray-700">Loading...</p>
        </div>
    );
};

export default InitialLoading;