import React, { useState } from 'react';

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
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">API Labz Authentication</h2>
            <form onSubmit={handleSubmit} className="mb-6">
                <div className="mb-4">
                    <label htmlFor="token" className="block text-sm font-medium text-gray-700 mb-2">
                        Enter your API Labz token
                    </label>
                    <input 
                        id="token"
                        type="text" 
                        value={token} 
                        onChange={(e) => setToken(e.target.value)} 
                        placeholder="Enter token"
                        className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                    />
                </div>
                <button 
                    type="submit"
                    className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </form>
            <p className="text-center mb-4">Don't have a token?</p>
            <button 
                onClick={handleCreateUser}
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Create new user
            </button>
            {error && <p className="mt-4 text-red-500">{error}</p>}
        </div>
    );
};

export default TokenInput;