import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, PrinterIcon, DocumentArrowDownIcon, CreditCardIcon, ArrowTopRightOnSquareIcon, ClockIcon } from '@heroicons/react/24/solid';
import ReportTypeSelector from './ReportTypeSelector';
import TokenInput from './TokenInput';
import ProgressDialog from './ProgressDialog';
import HistoryTable from './HistoryTable';
import { validateToken, generateReport, getLatestCredits, createUser } from '../services/apiLabzService';
import { getCardData } from '../services/trelloService';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const PowerUp = () => {
    const [token, setToken] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [credits, setCredits] = useState(0);
    const [reportType, setReportType] = useState('');
    const [report, setReport] = useState('');
    const [reportUrl, setReportUrl] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showProgress, setShowProgress] = useState(false);
    const [characters, setCharacters] = useState(0);
    const [showHistory, setShowHistory] = useState(false);
    const [history, setHistory] = useState([]);

    useEffect(() => {
        const initializeApp = async () => {
            const storedToken = localStorage.getItem('apiLabzToken');
            if (storedToken) {
                setToken(storedToken);
                await checkToken(storedToken);
            } else {
                await createTrelloUser();
            }
            const storedHistory = JSON.parse(localStorage.getItem('reportHistory') || '[]');
            setHistory(storedHistory);
            setLoading(false);
        };

        initializeApp();
    }, []);

    const createTrelloUser = async () => {
        try {
            const t = window.TrelloPowerUp.iframe();
            const member = await t.member('all');
            const result = await createUser(member.email, member.fullName);
            if (result.token) {
                setToken(result.token);
                setIsTokenValid(true);
                setCredits(result.credits);
                localStorage.setItem('apiLabzToken', result.token);
            } else {
                setError('Error creating user. Please enter your token manually.');
            }
        } catch (error) {
            console.error('Error creating Trello user:', error);
            setError('Error creating user. Please enter your token manually.');
        }
    };

    const checkToken = async (tokenToCheck) => {
        const result = await validateToken(tokenToCheck);
        if (result.isValid) {
            setIsTokenValid(true);
            setCredits(result.credits);
        } else {
            setIsTokenValid(false);
            if (result.errorMessage) {
                setError(result.errorMessage);
            }
        }
    };

    const handleTokenSubmit = async (newToken) => {
        setLoading(true);
        const result = await validateToken(newToken);
        if (result.isValid) {
            setToken(newToken);
            setIsTokenValid(true);
            setCredits(result.credits);
            localStorage.setItem('apiLabzToken', newToken);
        } else {
            setError(result.errorMessage || 'Invalid token. Please try again.');
        }
        setLoading(false);
    };

    // ... (rest of the component remains the same)

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <ToastContainer />
            {!isTokenValid ? (
                <TokenInput onSubmit={handleTokenSubmit} error={error} />
            ) : !reportType ? (
                <>
                    <ReportTypeSelector onSelect={handleReportTypeSelect} credits={credits} />
                    <button 
                        onClick={toggleHistory}
                        className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                    >
                        <ClockIcon className="h-5 w-5 mr-2" />
                        {showHistory ? 'Hide History' : 'Show History'}
                    </button>
                    <AnimatePresence>
                        {showHistory && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <HistoryTable history={history} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </>
            ) : (
                // ... (rest of the JSX remains the same)
            )}
            {showProgress && (
                <ProgressDialog characters={characters} />
            )}
        </div>
    );
};

export default PowerUp;