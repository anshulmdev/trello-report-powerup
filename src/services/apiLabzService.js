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

export const generateReport = async (token, type, data, question) => {
    const url = type === 'text' ? `${API_URL}/module/5001` : `${API_URL}/module/1025`;
    const formattingPrompt = `
    - Think Very carefully, Take as long as you need.
    - Work as a Professional Data Analyst which can summarize data in well formatted html
    - Final output should completely in html format with Headings, Paragraphs, Bullet Points and Table
    - Final output should be in html only. Do not print extra lines like "Here is a simple summary in HTML format with headings, paragraphs, bullet points, and a table:"
    - Do not print records table. print only summary and analysis
    - Work like a Project Manager and Scrum Master, You are getting Task data with titles, description ,dates etc - Write a proper summary and evaluation
    `;
    
    const postData = type === 'text' 
        ? { prompt: `${formattingPrompt} ${question}` }
        : { rawData: JSON.stringify(data), instruction: `Generate a small HTML report, no need of Lot of charts. Need a short and simple Graphical Report. If data is too much then print only 2 charts. if data is less then 4 charts. Understand Claude 4096 tokens output limit and then print complete html${question}` };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(postData)
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`Error from API: ${JSON.stringify(errorData)}`);
        }
        
        const result = await response.json();
        if (type === 'text') {
            return result.response[0].text;
        } else {
            return {
                fileURL: result.response.fileURL,
                html: result.response.html // Assuming the API returns both fileURL and html for graphic reports
            };
        }
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};