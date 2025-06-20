export const auth0Config = {
  domain: "dev-w0vuxd3zxhj28flo.uk.auth0.com",
  clientId: "OZKVYUdvGktgy5KAthZS8oBN97yC6zYW",
  authorizationParams: {
    redirect_uri: "https://frontend-k6tf.onrender.com",
    audience: "https://vibe-api"
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