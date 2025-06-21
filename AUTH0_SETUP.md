# Auth0 Setup Guide for Vibe Frontend

## Overview
This project has been migrated from `@auth0/auth0-react` to `@auth0/nextjs-auth0` to properly support Next.js 15 App Router.

## Environment Variables Required

Create a `.env.local` file in your project root with the following variables:

```env
AUTH0_SECRET='b95f53f2760ecdbed817ee8b51296fde5d1160a7d979a29aad028f0e22e3f9b7'
AUTH0_BASE_URL='https://frontend-k6tf.onrender.com'
AUTH0_ISSUER_BASE_URL='https://dev-ojvj8n4zvqe8rmrm.us.auth0.com'
AUTH0_CLIENT_ID='8q5IimCLt3gDPVfoiF8fPGKr1tcXh9H3'
AUTH0_CLIENT_SECRET='your-client-secret-from-auth0-dashboard'
AUTH0_AUDIENCE='https://backend-bdv7.onrender.com'
```

## Auth0 Dashboard Configuration

### 1. Application Settings
- **Allowed Callback URLs**: `https://frontend-k6tf.onrender.com/api/auth/callback`
- **Allowed Logout URLs**: `https://frontend-k6tf.onrender.com`
- **Allowed Web Origins**: `https://frontend-k6tf.onrender.com`

### 2. API Settings
- **Identifier**: `https://backend-bdv7.onrender.com`
- **Allowed Origins**: `https://frontend-k6tf.onrender.com`

## Key Changes Made

### 1. Dependencies
- Removed: `@auth0/auth0-react`, `@auth0/auth0-spa-js`
- Added: `@auth0/nextjs-auth0`

### 2. Configuration
- Updated `src/lib/auth.ts` to use Next.js Auth0 format
- Created `src/lib/auth0-config.ts` for proper initialization
- Added `src/middleware.ts` for route protection

### 3. Components Updated
- `src/app/layout.tsx`: Uses `UserProvider` instead of `Auth0Provider`
- `src/app/page.tsx`: Uses `useUser` hook instead of `useAuth0`
- `src/components/auth/LoginButton.tsx`: Uses `/api/auth/login` redirect
- `src/components/auth/LogoutButton.tsx`: Uses `/api/auth/logout` redirect
- `src/components/auth/UserProfile.tsx`: Uses `useUser` hook
- `src/app/(dashboard)/chat/page.tsx`: Uses `useUser` hook

### 4. API Routes
- Created `src/app/api/auth/[auth0]/route.ts` to handle Auth0 endpoints

## How It Works

1. **Login**: User clicks "Log In" → redirects to `/api/auth/login` → Auth0 login page → callback to `/api/auth/callback`
2. **Session Management**: Next.js Auth0 SDK handles session cookies automatically
3. **Route Protection**: Middleware protects dashboard routes (`/chat`, `/problems`, `/profile`)
4. **User State**: `useUser()` hook provides user information throughout the app

## Troubleshooting

### Common Issues

1. **"Unauthorized" Errors**: 
   - Check that all environment variables are set correctly
   - Verify Auth0 application settings match the URLs
   - Ensure the client secret is correct

2. **Redirect Loop**:
   - Verify callback URLs in Auth0 dashboard
   - Check that `AUTH0_BASE_URL` matches your deployment URL

3. **Session Not Persisting**:
   - Ensure `AUTH0_SECRET` is a strong, random string
   - Check that cookies are enabled in the browser

### Development vs Production

- **Development**: Use `http://localhost:3000` as `AUTH0_BASE_URL`
- **Production**: Use your actual domain as `AUTH0_BASE_URL`

## Security Notes

- Never commit `.env.local` to version control
- Use strong, random secrets for `AUTH0_SECRET`
- Regularly rotate client secrets in Auth0 dashboard
- Use HTTPS in production

## Next Steps

1. Get your actual client secret from Auth0 dashboard
2. Update the `.env.local` file with the real secret
3. Deploy to your hosting platform
4. Update Auth0 application settings with production URLs 