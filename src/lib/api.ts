import { GetTokenSilentlyOptions } from "@auth0/auth0-react";

const API_BASE_URL = 'https://backend-bdv7.onrender.com/api';

async function fetchWithAuth(url: string, options: RequestInit, getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) {
    const token = await getAccessTokenSilently();
    const headers = new Headers(options.headers || {});
    headers.set('Authorization', `Bearer ${token}`);
    headers.set('Content-Type', 'application/json');

    const response = await fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('API Error:', response.status, errorBody);
        throw new Error(`API request failed with status ${response.status}`);
    }

    if (response.status === 204) { // No Content
        return null;
    }
    
    return response.json();
}

export const getMessages = (getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth('/chat/messages', { method: 'GET' }, getAccessTokenSilently);
};

export const sendMessage = (message: string, getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth('/chat', {
        method: 'POST',
        body: JSON.stringify({ message }),
    }, getAccessTokenSilently);
};

export const getProblems = (getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth('/problems', { method: 'GET' }, getAccessTokenSilently);
};

export const getProblemById = (id: string, getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth(`/problems/${id}`, { method: 'GET' }, getAccessTokenSilently);
}; 