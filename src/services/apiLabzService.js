const API_URL = 'https://hub.apilabz.com';

export const validateToken = async (token) => {
    try {
        const response = await fetch(`${API_URL}/user/token`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            return { isValid: true, credits: data.credits };
        } else {
            const errorData = await response.json();
            if (errorData.error === 'Invalid token') {
                console.log("Token not valid");
                return { isValid: false, shouldOpenDialog: true };
            } else {
                throw new Error('Error validating token');
            }
        }
    } catch (error) {
        console.error('Error validating token:', error);
        return { isValid: false, errorMessage: 'Error validating token. Please try again.' };
    }
};

export const createUser = async (userEmail, userName) => {
    try {
        const response = await fetch(`${API_URL}/user/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: userEmail,
                name: userName,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            return { token: data.token, credits: data.credits };
        } else {
            const errorData = await response.json();
            if (errorData.error === 'Internal Server Error') {
                return { shouldOpenDialog: true };
            } else {
                throw new Error('Error creating user');
            }
        }
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const generateReport = async (token, type, data, question) => {
    const url = type === 'text' ? `${API_URL}/module/5001` : `${API_URL}/module/1025`;
    const formattingPrompt = `
    - Think Very carefully, Take as long as you need.
    - Work as a Professional Data Analyst which can summarize data in well formatted html
    - Final output should completely in html format with Headings, Paragraphs, Bullet Points and Table
    - Final output should be in html only. Do not print extra lines like "Here is a simple summary in HTML format with headings, paragraphs, bullet points, and a table:"
    - Do not print records table. print only summary and analysis
    - Work like a Project Manager and Scrum Master, You are getting Task data with titles, description, dates etc - Write a proper summary and evaluation
    `;
    
    const postData = type === 'text' 
        ? { prompt: `${formattingPrompt} ${question}` }
        : { rawData: JSON.stringify(data), instruction: `${question} <FinalOutput>Generate a small HTML report with only two charts in same vertical line. And below it nice one table of statistics. Apply proper: shadow, border, margin, colors etc</FinalOutput>` };

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 120000); // 120 seconds timeout

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData),
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error from API: ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        return result.response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timeout from server end');
        }
        console.error('Error generating report:', error);
        throw error;
    }
};