# Deploying Bellefu Radio App to Render

## Quick Deploy with Render Dashboard

### Option 1: One-Click Deploy (Recommended)
1. Fork this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Blueprint"
4. Connect your GitHub repository
5. Select the repository containing this project
6. Render will automatically detect the `render.yaml` file and create all services
7. Click "Apply" to deploy

### Option 2: Manual Setup

#### Step 1: Create PostgreSQL Database
1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New" → "PostgreSQL"
3. Name: `bellefu-radio-db`
4. Database Name: `bellefu_radio`
5. User: `bellefu_radio_user`
6. Region: Choose your preferred region
7. Plan: Choose your plan (Free tier available)
8. Click "Create Database"

#### Step 2: Create Redis Instance
1. Click "New" → "Redis"
2. Name: `bellefu-radio-redis`
3. Region: Same as your database
4. Plan: Choose your plan (Free tier available)
5. Click "Create Redis"

#### Step 3: Create Web Service
1. Click "New" → "Web Service"
2. Connect your GitHub repository
3. Select the repository containing this project
4. **Configuration:**
   - **Name:** `bellefu-radio-app`
   - **Region:** Same as database and Redis
   - **Branch:** `main` (or your preferred branch)
   - **Root Directory:** Leave blank
   - **Runtime:** Python 3
   - **Build Command:** `./build.sh`
   - **Start Command:** `daphne radio_project.asgi:application -p $PORT -b 0.0.0.0`

#### Step 4: Environment Variables
Add these environment variables in the Render dashboard:

| Key | Value | Notes |
|-----|-------|-------|
| `SECRET_KEY` | Generate a secure key | Use Django's `get_random_secret_key()` |
| `DEBUG` | `False` | Always False in production |
| `ALLOWED_HOSTS` | `your-app-name.onrender.com,*.onrender.com` | Replace with your actual domain |
| `DATABASE_URL` | Link to PostgreSQL database | Select from dropdown |
| `REDIS_URL` | Link to Redis instance | Select from dropdown |

#### Step 5: Deploy
1. Click "Create Web Service"
2. Render will start building and deploying your app
3. Monitor the deployment logs for any issues
4. Once deployed, your app will be available at `https://your-app-name.onrender.com`

## Post-Deployment Setup

### Access Admin Panel
1. Go to `https://your-app-name.onrender.com/admin/`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **Important:** Change the admin password immediately after first login

### Test WebSocket Functionality
1. Visit your deployed app
2. Open browser developer tools (F12)
3. Check Console for WebSocket connection messages:
   - "Event WebSocket connected"
   - "Station WebSocket connected"
4. Test real-time features by playing stations and checking live events

### Verify Features
- ✅ Radio stations load and play
- ✅ User registration and login work
- ✅ Real-time listener counts update
- ✅ Live events show current status
- ✅ Admin panel is accessible
- ✅ Blog posts and events display correctly

## Troubleshooting

### Common Issues

**Build Fails:**
- Check that all files are committed to your repository
- Verify `build.sh` has execute permissions
- Check build logs for specific error messages

**Database Connection Issues:**
- Ensure `DATABASE_URL` environment variable is set correctly
- Check that PostgreSQL service is running
- Verify database credentials

**WebSocket Not Working:**
- Ensure `REDIS_URL` is set correctly
- Check that Redis service is running
- Verify WebSocket connections in browser console

**Static Files Not Loading:**
- Run `python manage.py collectstatic` manually if needed
- Check `STATIC_ROOT` and `STATIC_URL` settings
- Verify WhiteNoise is configured correctly

### Performance Optimization

**For Production:**
1. **Enable HTTPS redirects** (uncomment in settings.py):
   ```python
   SECURE_SSL_REDIRECT = True
   SESSION_COOKIE_SECURE = True
   CSRF_COOKIE_SECURE = True
   ```

2. **Configure custom domain** in Render dashboard

3. **Set up monitoring** using Render's built-in metrics

4. **Optimize database** by adding indexes for frequently queried fields

### Scaling Considerations

**Free Tier Limitations:**
- Services sleep after 15 minutes of inactivity
- 750 hours per month across all services
- Limited database storage and connections

**Upgrading:**
- Paid plans offer always-on services
- Better performance and more resources
- Priority support

## Environment Variables Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `SECRET_KEY` | Yes | - | Django secret key for cryptographic signing |
| `DEBUG` | No | `False` | Enable/disable debug mode |
| `ALLOWED_HOSTS` | Yes | - | Comma-separated list of allowed hostnames |
| `DATABASE_URL` | Yes | SQLite | PostgreSQL connection string |
| `REDIS_URL` | No | In-memory | Redis connection string for WebSockets |
| `DJANGO_LOG_LEVEL` | No | `INFO` | Logging level (DEBUG, INFO, WARNING, ERROR) |

## Support

If you encounter issues:
1. Check Render's deployment logs
2. Review Django error logs
3. Test locally with production settings
4. Check Render's [documentation](https://render.com/docs)

## Security Notes

- Change default admin credentials immediately
- Use strong, unique SECRET_KEY
- Keep DEBUG=False in production
- Regularly update dependencies
- Monitor for security vulnerabilities

---

🎵 **Your Bellefu Radio App is now live on Render!**

Access your app at: `https://your-app-name.onrender.com`