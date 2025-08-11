# Afrimeet Mobile (Expo)

This app mirrors the Afrimeet web app using React Native + Expo and GetStream Video.

## Setup

1. Create `.env` in `mobile/` with:

```
EXPO_PUBLIC_API_BASE_URL=https://your-web-origin
EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_xxx
EXPO_PUBLIC_STREAM_API_KEY=stream_key
EXPO_PUBLIC_BASE_URL=https://your-web-origin
```

2. Ensure the web app has the Stream token endpoint enabled at `/api/stream/token` and envs:
- `NEXT_PUBLIC_STREAM_API_KEY`
- `STREAM_SECRET_KEY`

3. Install deps and run:

```
npm install
npm run android # or ios or web
```

Sensitive secrets are never embedded in the mobile bundle. Tokens are fetched from the web API at runtime and stored via SecureStore.