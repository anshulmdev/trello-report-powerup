import React, { useState } from 'react';

const TokenInput = ({ onSubmit, onCreateUser, error }) => {
    const [token, setToken] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(token);
    };

    return (
        <div className="p-4">
            <form onSubmit={handleSubmit} className="mb-4">
                <h2 className="text-2xl font-bold mb-4">Enter your API Labz token</h2>
                <input 
                    type="text" 
                    value={token} 
                    onChange={(e) => setToken(e.target.value)} 
                    placeholder="Enter token"
                    className="border border-gray-300 p-2 w-full mb-2"
                />
                <button 
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Submit
                </button>
            </form>
            <p className="mb-2">Don't have a token? 
                <button 
                    onClick={onCreateUser}
                    className="ml-2 text-blue-500 hover:text-blue-700"
                >
                    Create new user
                </button>
            </p>
            {error && <p className="text-red-500">{error}</p>}
        </div>
    );
};

export default TokenInput;