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
            return { isValid: false, errorMessage: errorData.error || 'Unable to validate token' };
        }
    } catch (error) {
        return { isValid: false, errorMessage: 'Network error. Please check your connection and try again.' };
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
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'An error occurred while generating the report');
        }
        
        const result = await response.json();
        return result.response;
    } catch (error) {
        if (error.name === 'AbortError') {
            throw new Error('Request timed out. Please try again later.');
        }
        throw error;
    }
};