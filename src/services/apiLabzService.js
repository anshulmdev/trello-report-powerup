const API_URL = 'https://hub.apilabz.com';

const handleApiError = (error) => {
    if (error.name === 'AbortError') {
        return { error: 'Request timed out. Please try again.' };
    }
    if (error.response) {
        switch (error.response.status) {
            case 401:
                return { error: 'Unauthorized. Please check your API token.' };
            case 403:
                return { error: 'Access forbidden. Please check your permissions.' };
            case 404:
                return { error: 'Resource not found. Please try again later.' };
            case 429:
                return { error: 'Too many requests. Please try again later.' };
            case 500:
            case 502:
            case 503:
            case 504:
                return { error: 'Server error. Please try again later.' };
            default:
                return { error: 'An unexpected error occurred. Please try again.' };
        }
    }
    return { error: 'Network error. Please check your internet connection.' };
};

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
            return handleApiError({ response });
        }
    } catch (error) {
        return handleApiError(error);
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
            return handleApiError({ response });
        }
    } catch (error) {
        return handleApiError(error);
    }
};

export const generateReport = async (token, type, data, question) => {
    const url = type === 'text' ? `${API_URL}/module/5001` : `${API_URL}/module/1025`;
    const formattingPrompt = `
    <StrictInstructions>Provide Statistics on attached Data Only, Do not hallucinate or create false statistics.</StrictInstructions>
    <Instructions>
    - Think Very carefully, Take as long as you need.
    - Work as a Professional Data Analyst which can summarize data in well formatted html
    - Work like a Project Manager and Scrum Master, You are getting Task data with titles, description, dates etc - Write a proper summary and evaluation.
    - ${question}
    </Instructions>
    `;
    
    const postData = type === 'text' 
        ? { prompt: `${formattingPrompt} ${JSON.stringify(data)}` }
        : { 
            rawData: JSON.stringify(data), 
            instruction: `
            <Instructions>${question}</Instructions> 
            <StrictInstructions>Provide Statistics on attached Data Only, Do not hallucinate or create false statistics</StrictInstructions>
            <FinalOutput>
            - Generate a small HTML report with only two charts in same vertical line. 
            - And below it nice one table of statistics. Apply proper: shadow, border, margin, colors etc
            - Do consider 4000 Max token output limit and try to print complete html within that output limit.
            </FinalOutput>` };

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
        
        if (response.ok) {
            const result = await response.json();
            return result.response;
        } else {
            return handleApiError({ response });
        }
    } catch (error) {
        return handleApiError(error);
    }
};