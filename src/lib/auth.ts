export const auth0Config = {
  domain: "dev-w0vuxd3zxhj28flo.uk.auth0.com",
  clientId: "OZKVYUdvGktgy5KAthZS8oBN97yC6zYW",
  authorizationParams: {
    redirect_uri: typeof window !== 'undefined' ? window.location.origin : '',
    audience: "https://vibe-api"
  },
}; 