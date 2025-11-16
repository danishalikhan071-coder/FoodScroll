# Deployment Guide

## Issues Fixed

✅ Fixed server.js - removed duplicate CORS configuration
✅ Fixed port configuration to use `process.env.PORT`
✅ Created API URL configuration for frontend
✅ Updated all frontend API calls to use environment variables
✅ Fixed CORS to use environment variables

## Environment Variables Required

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
CLIENT_URL=https://your-frontend-url.com
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
PORT=3000 (or let hosting platform set it)
```

### Frontend (.env or .env.production)
```
VITE_API_URL=https://your-backend-url.com
```

## Important Notes

1. **Backend CORS**: Make sure `CLIENT_URL` in backend matches your frontend deployment URL
2. **Frontend API URL**: Set `VITE_API_URL` to your backend deployment URL
3. **Port**: Backend will use `process.env.PORT` if available, otherwise defaults to 3000
4. **Cookies**: Ensure your hosting platform supports cookies with credentials (sameSite, secure settings)

## Deployment Checklist

- [ ] Set all environment variables in your hosting platform
- [ ] Update `CLIENT_URL` to your frontend URL
- [ ] Update `VITE_API_URL` to your backend URL
- [ ] Ensure MongoDB connection string is correct
- [ ] Verify ImageKit credentials are set
- [ ] Test API endpoints are accessible
- [ ] Test authentication flow
- [ ] Test file uploads (videos)

