# Deploying Bellefu Radio to Render

## Quick Deploy with Render Dashboard

### Option 1: One-Click Deploy (Recommended)
1. Fork this repository to your GitHub account
2. Go to [Render Dashboard](https://dashboard.render.com)
3. Click "New" → "Web Service"
4. Connect your GitHub repository
5. Select the repository containing this project
6. Configure the deployment settings (see below)
7. Click "Create Web Service" to deploy

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

### 1. Access Admin Panel
1. Go to `https://your-app-name.onrender.com/admin/`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. **Important:** Change the admin password immediately after first login

### 2. Configure Radiojar Stream
1. In the admin panel, edit the "Bellefu Radio" station
2. Update the `stream_url` field with your actual Radiojar stream URL
3. Get your Radiojar embed code from your Radiojar dashboard
4. Update the `templates/home.html` file to replace the placeholder with your actual embed code
5. Redeploy the application

### 3. Test WebSocket Functionality
1. Visit your deployed app
2. Open browser developer tools (F12)
3. Check Console for WebSocket connection messages:
   - "Event WebSocket connected"
   - "Station WebSocket connected"
4. Test real-time features by checking program updates

### 4. Verify Features
- ✅ Radio stream loads and plays (after Radiojar setup)
- ✅ User registration and login work (optional)
- ✅ Real-time listener counts update
- ✅ Live programs show current status
- ✅ Admin panel is accessible
- ✅ Programs and events display correctly

## Radiojar Integration

### Setting Up Your Stream
1. **Get Radiojar Account**: Sign up at [Radiojar.com](https://www.radiojar.com)
2. **Create Your Station**: Set up your Bellefu Radio station
3. **Get Stream URL**: Copy your stream URL from the dashboard
4. **Get Embed Code**: Copy the HTML embed code for your player
5. **Update Application**:
   - Update stream_url in admin panel
   - Replace placeholder in `templates/home.html` with embed code
   - Redeploy the application

### Example Radiojar Embed Code
Replace the placeholder in `templates/home.html` with something like:
```html
<iframe src="https://stream.radiojar.com/v994btp2gd0uv" 
        width="100%" 
        height="150" 
        frameborder="0" 
        scrolling="no">
</iframe>
```

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

**Radiojar Player Not Loading:**
- Verify you've replaced the placeholder with actual embed code
- Check that your Radiojar stream URL is correct
- Test the stream URL directly in a browser

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

## Security Notes

- Change default admin credentials immediately
- Use strong, unique SECRET_KEY
- Keep DEBUG=False in production
- Regularly update dependencies
- Monitor for security vulnerabilities
- Secure your Radiojar account with strong passwords

## Monitoring and Maintenance

### Regular Tasks
1. **Monitor listener counts** and server performance
2. **Update program schedules** regularly in admin panel
3. **Check WebSocket connections** are working properly
4. **Backup database** regularly (Render provides automated backups)
5. **Update dependencies** periodically for security

### Analytics
- Monitor listener engagement through admin dashboard
- Track popular programs and listening patterns
- Use Render's built-in metrics for server performance

## Support

If you encounter issues:
1. Check Render's deployment logs
2. Review Django error logs
3. Test locally with production settings
4. Check Render's [documentation](https://render.com/documentation)
5. Verify Radiojar stream is working independently

## Success Checklist

After deployment, verify:
- [ ] Application loads at your Render URL
- [ ] Admin panel is accessible and secure
- [ ] Radiojar player is embedded and working
- [ ] WebSocket connections are established
- [ ] Real-time features work (listener counts, program updates)
- [ ] Mobile responsiveness works correctly
- [ ] User registration/login works (if enabled)
- [ ] Program schedule displays correctly

---

## 🎵 Your Bellefu Radio is Now Live!

Access your app at: `https://your-app-name.onrender.com`

**Next Steps:**
1. Set up your Radiojar stream
2. Add your program schedule
3. Start broadcasting!

Your agricultural radio station is now ready to reach farmers and agricultural communities worldwide!