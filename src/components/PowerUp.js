import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeftIcon, PrinterIcon, DocumentArrowDownIcon, CreditCardIcon, ArrowTopRightOnSquareIcon } from '@heroicons/react/24/solid';
import ReportTypeSelector from './ReportTypeSelector';
import TokenInput from './TokenInput';
import ProgressDialog from './ProgressDialog';
import { validateToken, generateReport } from '../services/apiLabzService';
import { getCardData } from '../services/trelloService';

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

    useEffect(() => {
        const storedToken = localStorage.getItem('apiLabzToken');
        if (storedToken) {
            setToken(storedToken);
            checkToken(storedToken);
        } else {
            setLoading(false);
        }
    }, []);

    const checkToken = async (tokenToCheck) => {
        setLoading(true);
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
        setLoading(false);
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
            if (type === 'text') {
                setReport(generatedReport);
            } else {
                setReportUrl(generatedReport.fileURL);
                setReport(generatedReport.html);
            }
        } catch (error) {
            setError('Error generating report. Please try again.');
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
        const printContent = `
            <html>
                <head>
                    <title>Print Report</title>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        @media print {
                            body { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
                        }
                    </style>
                </head>
                <body>${report}</body>
            </html>
        `;
        const iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
        iframe.contentDocument.write(printContent);
        iframe.contentDocument.close();
        iframe.contentWindow.print();
        document.body.removeChild(iframe);
    };

    const handleSave = () => {
        const blob = new Blob([report], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'report.html';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-lg font-semibold text-gray-700">Loading... Please wait</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            {!isTokenValid ? (
                <TokenInput onSubmit={handleTokenSubmit} error={error} />
            ) : !reportType ? (
                <ReportTypeSelector onSelect={handleReportTypeSelect} credits={credits} />
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
                        {reportUrl && (
                            <div className="mb-6 flex justify-center">
                                <a 
                                    href={reportUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center"
                                >
                                    <ArrowTopRightOnSquareIcon className="h-5 w-5 mr-2" />
                                    Open Report in New Tab
                                </a>
                            </div>
                        )}
                        {report && (
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
                                            srcDoc={report}
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
        </div>
    );
};

export default PowerUp;