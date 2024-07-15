import React, { useState, useEffect } from 'react';
import ReportTypeSelector from './ReportTypeSelector';
import TokenInput from './TokenInput';
import { validateToken, createUser, generateReport } from '../services/apiLabzService';
import { getCardData } from '../services/trelloService';

const PowerUp = () => {
    const [token, setToken] = useState('');
    const [isTokenValid, setIsTokenValid] = useState(false);
    const [credits, setCredits] = useState(0);
    const [reportType, setReportType] = useState('');
    const [report, setReport] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const storedToken = localStorage.getItem('apiLabzToken');
        if (storedToken) {
            setToken(storedToken);
            checkToken(storedToken);
        }
    }, []);

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
        const result = await validateToken(newToken);
        if (result.isValid) {
            setToken(newToken);
            setIsTokenValid(true);
            setCredits(result.credits);
            localStorage.setItem('apiLabzToken', newToken);
        } else {
            setError(result.errorMessage || 'Invalid token. Please try again.');
        }
    };

    const handleCreateUser = async () => {
        const t = window.TrelloPowerUp.iframe();
        const member = await t.member('all');
        const result = await createUser(member.email, member.fullName);
        if (result.token) {
            setToken(result.token);
            setIsTokenValid(true);
            setCredits(result.credits);
            localStorage.setItem('apiLabzToken', result.token);
        } else {
            setError(result.errorMessage || 'Error creating user. Please try again.');
        }
    };

    const handleReportTypeSelect = async (type) => {
        setReportType(type);
        const t = window.TrelloPowerUp.iframe();
        const cardData = await getCardData(t);
        try {
            const generatedReport = await generateReport(token, type, cardData);
            setReport(generatedReport);
        } catch (error) {
            setError('Error generating report. Please try again.');
        }
    };

    if (!isTokenValid) {
        return <TokenInput onSubmit={handleTokenSubmit} onCreateUser={handleCreateUser} error={error} />;
    }

    if (!reportType) {
        return <ReportTypeSelector onSelect={handleReportTypeSelect} credits={credits} />;
    }

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Generated Report</h2>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            {report ? (
                <iframe src={report} title="Generated Report" className="w-full h-96 border border-gray-300" />
            ) : (
                <p className="text-gray-600">Generating report...</p>
            )}
        </div>
    );
};

export default PowerUp;