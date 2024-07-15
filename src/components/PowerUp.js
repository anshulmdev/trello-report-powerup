import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeftIcon, PrinterIcon, DocumentArrowDownIcon, CreditCardIcon, ArrowTopRightOnSquareIcon, ClockIcon, ExclamationCircleIcon } from '@heroicons/react/24/solid';
import ReportTypeSelector from './ReportTypeSelector';
import TokenInput from './TokenInput';
import ProgressDialog from './ProgressDialog';
import HistoryTable from './HistoryTable';
import { validateToken, generateReport, createUser } from '../services/apiLabzService';
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

    const handleReportTypeSelect = async (type, question) => {
        setLoading(true);
        setShowProgress(true);
        setReportType(type);
        const t = window.TrelloPowerUp.iframe();
        const cardData = await getCardData(t);
        setCharacters(JSON.stringify(cardData).length);
        try {
            const generatedReport = await generateReport(token, type, cardData, question);
            const latestTokenInfo = await validateToken(token);
            
            if (latestTokenInfo.isValid) {
                const creditsUsed = credits - latestTokenInfo.credits;
                if (creditsUsed > 0) {
                    toast.info(`${creditsUsed} credits used`);
                }
                setCredits(latestTokenInfo.credits);
                localStorage.setItem('apiLabzToken', token);
            }
            
            if (type === 'text') {
                setReport(generatedReport);
                setReportUrl('');
            } else {
                setReportUrl(generatedReport.fileURL);
                setReport('');
            }
            
            // Save to history
            const newHistoryItem = {
                date: new Date().toISOString(),
                type,
                question,
                reportUrl: type === 'text' ? '' : generatedReport.fileURL
            };
            const updatedHistory = [newHistoryItem, ...history];
            setHistory(updatedHistory);
            localStorage.setItem('reportHistory', JSON.stringify(updatedHistory));
        } catch (error) {
            if (error.message === 'Request timeout from server end') {
                setError('Request timeout from server end. Please try again later.');
            } else if (error.message.includes('Insufficient credits')) {
                setError('Insufficient credits. Please add more credits to continue.');
            } else {
                setError('Error generating report. Please try again.');
            }
        }
        setLoading(false);
        setShowProgress(false);
    };

    const handleBack = () => {
        setReportType('');
        setReport('');
        setReportUrl('');
        setError('');
    };

    const handlePrint = () => {
        if (reportUrl) {
            window.open(reportUrl, '_blank');
        } else if (report) {
            const printWindow = window.open('', '_blank');
            printWindow.document.write(report);
            printWindow.document.close();
            printWindow.print();
        }
    };

    const handleSave = () => {
        const content = reportUrl || report;
        const blob = new Blob([content], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const toggleHistory = () => {
        setShowHistory(!showHistory);
    };

    const renderErrorDialog = () => (
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
                    onClick={() => setError('')}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded inline-block"
                >
                    Close
                </button>
            </div>
        </div>
    );

    if (loading) {
        return <ProgressDialog characters={characters} />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <ToastContainer />
            {!isTokenValid ? (
                <TokenInput onSubmit={handleTokenSubmit} error={error} />
            ) : !reportType ? (
                <>
                    <ReportTypeSelector onSelect={handleReportTypeSelect} credits={credits} />
                    {history.length > 0 && (
                        <button 
                            onClick={toggleHistory}
                            className="mt-4 bg-gray-500 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded flex items-center w-full justify-center"
                        >
                            <ClockIcon className="h-5 w-5 mr-2" />
                            {showHistory ? 'Hide History' : 'Show History'}
                        </button>
                    )}
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
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="bg-white rounded-lg overflow-hidden"
                >
                    <div className="p-6">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                            <h2 className="text-3xl font-bold mb-2 sm:mb-0">Generated Report</h2>
                            <div className="flex items-center space-x-4">
                                <div className="flex items-center">
                                    <CreditCardIcon className="h-6 w-6 text-green-500 mr-2" />
                                    <span className="text-lg font-semibold">Credits: {credits}</span>
                                </div>
                                <button 
                                    onClick={handleBack}
                                    className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded flex items-center"
                                >
                                    <ChevronLeftIcon className="h-5 w-5 mr-2" />
                                    Back
                                </button>
                            </div>
                        </div>
                        {error && <p className="text-red-500 mb-4">{error}</p>}
                        {(reportUrl || report) && (
                            <div className="mb-6 flex justify-center">
                                <a 
                                    href={reportUrl || '#'}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                    onClick={(e) => {
                                        if (!reportUrl) {
                                            e.preventDefault();
                                            const newWindow = window.open('', '_blank');
                                            newWindow.document.write(report);
                                            newWindow.document.close();
                                        }
                                    }}
                                >
                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                                    Open Report in New Tab
                                </a>
                            </div>
                        )}
                        {(reportUrl || report) && !error && (
                            <motion.div 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5 }}
                                className="border border-gray-300 rounded-lg p-4 bg-white"
                            >
                                <div className="flex justify-end space-x-2 mb-4">
                                    <button onClick={handlePrint} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                        <PrinterIcon className="h-5 w-5 mr-2" />
                                        Print
                                    </button>
                                    <button onClick={handleSave} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center">
                                        <DocumentArrowDownIcon className="h-5 w-5 mr-2" />
                                        Save
                                    </button>
                                </div>
                                <div 
                                    className="overflow-auto"
                                    style={{maxHeight: 'calc(100vh - 300px)'}}
                                >
                                    {reportType === 'text' ? (
                                        <div dangerouslySetInnerHTML={{ __html: report }} />
                                    ) : (
                                        <iframe
                                            src={reportUrl}
                                            title="Graphical Report"
                                            width="100%"
                                            height="500px"
                                            className="border-none"
                                        />
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </div>
                </motion.div>
            )}
            {showProgress && (
                <ProgressDialog characters={characters} />
            )}
            {error && renderErrorDialog()}
        </div>
    );
};

export default PowerUp;