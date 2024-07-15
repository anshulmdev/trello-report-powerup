import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TokenInput from './TokenInput';
import ProgressDialog from './ProgressDialog';
import ErrorDialog from './ErrorDialog';
import MainContent from './MainContent';
import InitialLoading from './InitialLoading';
import { validateToken, generateReport, createUser } from '../services/apiLabzService';
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
        const initializeApp = async () => {
            const storedToken = localStorage.getItem('apiLabzToken');
            if (storedToken) {
                setToken(storedToken);
                await checkToken(storedToken);
            } else {
                await createTrellUser();
            }
            setLoading(false);
        };

        initializeApp();
    }, []);

    const createTrellUser = async () => {
        try {
            const result = await createUser('example@email.com', 'Example User');
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
        try {
            const t = window.TrelloPowerUp.iframe();
            const cardData = await getCardData(t);
            setCharacters(JSON.stringify(cardData).length);
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
                setReport(generatedReport[0].text);
                setReportUrl('');
            } else {
                setReportUrl(generatedReport.fileURL);
                setReport('');
            }
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

    const handleDownload = () => {
        if (reportType === 'text') {
            const blob = new Blob([report], { type: 'text/html' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'report.html';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else if (reportType === 'graphic') {
            window.open(reportUrl, '_blank');
        }
    };

    if (loading && !showProgress) {
        return <InitialLoading />;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <ToastContainer />
            {!isTokenValid ? (
                <TokenInput onSubmit={handleTokenSubmit} error={error} />
            ) : (
                <MainContent 
                    reportType={reportType}
                    credits={credits}
                    onReportTypeSelect={handleReportTypeSelect}
                    report={report}
                    reportUrl={reportUrl}
                    handleBack={handleBack}
                    handleDownload={handleDownload}
                />
            )}
            {showProgress && (
                <ProgressDialog characters={characters} />
            )}
            {error && (
                <ErrorDialog 
                    error={error} 
                    onClose={() => setError('')} 
                />
            )}
        </div>
    );
};

export default PowerUp;