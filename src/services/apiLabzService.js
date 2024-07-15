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
        return { errorMessage: 'Error creating user. Please try again.' };
    }
};

export const generateReport = async (token, type, data) => {
    const endpoint = type === 'text' ? '/module/5001' : '/module/1025';
    try {
        const response = await fetch(`${API_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ data })
        });
        const result = await response.json();
        return result.fileURL;
    } catch (error) {
        console.error('Error generating report:', error);
        throw error;
    }
};