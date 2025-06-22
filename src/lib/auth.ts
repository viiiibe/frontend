const getAuthConfig = () => {
  // This code runs only in the browser.
  if (typeof window !== 'undefined') {
    if (window.location.hostname === 'localhost') {
      return {
        redirect_uri: "http://localhost:10000",
        audience: "http://localhost:1337"
      };
    }
  }
  // Default to production URLs for server-side rendering or other environments
  return {
    redirect_uri: "https://frontend-k6tf.onrender.com",
    audience: "https://backend-bdv7.onrender.com"
  };
};

const authConfig = getAuthConfig();

export const auth0Config = {
  domain: "dev-ojvj8n4zvqe8rmrm.us.auth0.com",
  clientId: "8q5IimCLt3gDPVfoiF8fPGKr1tcXh9H3",
  authorizationParams: {
    redirect_uri: authConfig.redirect_uri,
    audience: authConfig.audience,
    scope: "openid profile email"
  },
  cacheLocation: "localstorage" as const,
  useRefreshTokens: true,
  skipRedirectCallback: false,
  onRedirectCallback: () => {
    console.log('Auth0 redirect callback triggered');
    // Clear the URL parameters after successful authentication
    if (typeof window !== 'undefined') {
      window.history.replaceState(
        {},
        document.title,
        window.location.pathname
      );
    }
  }
}; 
