# OAuth Authentication Setup

This project now supports OAuth authentication with Google, Facebook, and Apple. The implementation uses a popup-based OAuth flow with JWT tokens.

## Architecture

### Flow
1. User clicks login button and selects a provider
2. Frontend opens a popup window with the OAuth provider's authorization page
3. User authorizes the application
4. OAuth provider redirects to backend callback endpoint
5. Backend exchanges authorization code for access token
6. Backend fetches user information from OAuth provider
7. Backend creates a JWT token and redirects to frontend callback page
8. Frontend callback page sends token to parent window via postMessage
9. Frontend stores token and updates authentication state

### Backend Endpoints

- `GET /api/v1/auth/initiate/{provider}` - Initiates OAuth flow, returns authorization URL
- `GET /api/v1/auth/callback/{provider}` - Handles OAuth callback, exchanges code for token

### Frontend Components

- `LoginButton` - Opens OAuth popup when provider is selected
- `AuthCallback` - Receives token from backend redirect and sends to parent window
- `useAuth` hook - Manages authentication state and token storage

## Setup Instructions

### 1. Backend Configuration

Add OAuth credentials to `backend/.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Facebook OAuth
FACEBOOK_CLIENT_ID=your-facebook-app-id
FACEBOOK_CLIENT_SECRET=your-facebook-app-secret

# Apple OAuth
APPLE_CLIENT_ID=your-apple-service-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# JWT Settings
SECRET_KEY=your-secret-key-change-in-production
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### 2. OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set authorized redirect URI: `http://localhost:8000/api/v1/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### Facebook OAuth
1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" product
4. Go to Settings → Basic, copy App ID and App Secret
5. Go to Settings → Basic → Add Platform → Website
6. Set Site URL: `http://localhost:3000`
7. Add Valid OAuth Redirect URI: `http://localhost:8000/api/v1/auth/callback/facebook`
8. Copy App ID and App Secret to `.env`

#### Apple OAuth
1. Go to [Apple Developer](https://developer.apple.com/)
2. Create a new App ID with "Sign in with Apple" capability
3. Create a Services ID
4. Configure redirect URLs: `http://localhost:8000/api/v1/auth/callback/apple`
5. Create a Key for "Sign in with Apple"
6. Copy Service ID and Key to `.env`

### 3. Install Dependencies

Backend dependencies are already in `requirements.txt`. Install them:

```bash
cd backend
python3.14 -m pip install -r requirements.txt
```

### 4. Testing

1. Start the backend server:
   ```bash
   cd backend
   python3.14 -m uvicorn app.main:app --reload
   ```

2. Start the frontend:
   ```bash
   cd frontend
   npm start
   ```

3. Click the "Login" button and select a provider
4. Complete the OAuth flow in the popup
5. You should be logged in with your OAuth account

## Security Notes

- **SECRET_KEY**: Change this to a long, random string in production
- **HTTPS**: OAuth providers require HTTPS in production
- **State Parameter**: Used to prevent CSRF attacks
- **JWT Tokens**: Tokens expire after 30 minutes (configurable)
- **Token Storage**: Tokens are stored in localStorage (consider httpOnly cookies for production)

## Troubleshooting

### "OAuth not configured" error
- Make sure OAuth credentials are set in `.env`
- Restart the backend server after changing `.env`

### Popup blocked
- Allow popups for `localhost:3000` in your browser settings

### "Invalid state" error
- This can happen if the OAuth flow takes too long
- Try logging in again

### CORS errors
- Make sure `BACKEND_CORS_ORIGINS` includes `http://localhost:3000` in `.env`
