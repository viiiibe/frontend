import { GetTokenSilentlyOptions } from "@auth0/auth0-react";

const getApiBaseUrl = () => {
  // This code runs only in the browser.
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return 'http://localhost:1337/api';
    }
  }
  // Default to production URL for server-side rendering or other environments
  return 'https://backend-bdv7.onrender.com/api';
};

const API_BASE_URL = getApiBaseUrl();

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
    console.log('getProblems API called');
    return fetchWithAuth('/problems', { method: 'GET' }, getAccessTokenSilently).then(data => {
        console.log('Problems API response received:', data);
        console.log('Problems API response type:', typeof data);
        console.log('Problems API response is array:', Array.isArray(data));
        return data;
    }).catch(error => {
        console.error('Problems API error:', error);
        throw error;
    });
};

export const getProblemById = (id: string, getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth(`/problems/${id}`, { method: 'GET' }, getAccessTokenSilently);
};

export const clearMessages = (getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth('/chat/messages', { 
        method: 'DELETE',
        body: JSON.stringify({ unreadOnly: false }),
    }, getAccessTokenSilently);
};

export const createSubmission = (
    problemId: string, 
    code: string, 
    language: string, 
    getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>
) => {
    return fetchWithAuth('/submissions', {
        method: 'POST',
        body: JSON.stringify({ problemId, code, language }),
    }, getAccessTokenSilently);
};

export const getMySubmissions = (getAccessTokenSilently: (options?: GetTokenSilentlyOptions | undefined) => Promise<string>) => {
    return fetchWithAuth('/submissions/my', { method: 'GET' }, getAccessTokenSilently);
}; 
