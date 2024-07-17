import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TokenInput from './TokenInput';
import ProgressDialog from './ProgressDialog';
import ErrorDialog from './ErrorDialog';
import MainContent from './MainContent';
import InitialLoading from './InitialLoading';
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
        const initializeApp = async () => {
            const storedToken = localStorage.getItem('apiLabzToken');
            if (storedToken) {
                setToken(storedToken);
                await checkToken(storedToken);
            }
            setLoading(false);
        };

        initializeApp();
    }, []);

    const checkToken = async (tokenToCheck) => {
        const result = await validateToken(tokenToCheck);
        if (result.isValid) {
            setIsTokenValid(true);
            setCredits(result.credits);
        } else {
            setIsTokenValid(false);
            localStorage.removeItem('apiLabzToken');
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
            toast.error(result.errorMessage || 'Invalid token. Please try again.');
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
            } else {
                throw new Error('Token became invalid during report generation');
            }
            
            if (type === 'text') {
                setReport(generatedReport[0].text);
                setReportUrl('');
            } else {
                setReportUrl(generatedReport.fileURL);
                setReport('');
            }
        } catch (error) {
            toast.error(error.message || 'An error occurred while generating the report. Please try again.');
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
                <TokenInput onSubmit={handleTokenSubmit} />
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