import React, { useState, useEffect } from 'react';
import ReportTypeSelector from './ReportTypeSelector';
import TokenInput from './TokenInput';
import { validateToken, generateReport } from '../services/apiLabzService';
import { getCardData } from '../services/trelloService';

const PowerUp = () => {
    const [token, setToken] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [credits, setCredits] = useState(0);
    const [reportType, setReportType] = useState('');
    const [report, setReport] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

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
        setReportType(type);
        const t = window.TrelloPowerUp.iframe();
        const cardData = await getCardData(t);
        try {
            const generatedReport = await generateReport(token, type, cardData, question);
            setReport(generatedReport);
        } catch (error) {
            setError('Error generating report. Please try again.');
        }
        setLoading(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!isTokenValid) {
        return <TokenInput onSubmit={handleTokenSubmit} error={error} />;
    }

    if (!reportType) {
        return <ReportTypeSelector onSelect={handleReportTypeSelect} credits={credits} />;
    }

    return (
        <div className="p-8">
            <h2 className="text-3xl font-bold mb-6">Generated Report</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {report ? (
                <iframe src={report} title="Generated Report" className="w-full h-screen border border-gray-300 rounded-lg" />
            ) : (
                <p className="text-gray-600">Generating report...</p>
            )}
        </div>
    );
};

export default PowerUp;