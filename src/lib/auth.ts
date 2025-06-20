export const auth0Config = {
  domain: "dev-w0vuxd3zxhj28flo.uk.auth0.com",
  clientId: "OZKVYUdvGktgy5KAthZS8oBN97yC6zYW",
  authorizationParams: {
    redirect_uri: "https://frontend-k6tf.onrender.com",
    audience: "https://vibe-api"
  },
  cacheLocation: "localstorage" as const,
  useRefreshTokens: true
}; 