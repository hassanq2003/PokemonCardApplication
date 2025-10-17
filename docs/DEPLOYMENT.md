# Deployment Guide

This guide covers deploying the PokéDex TCG application to various hosting platforms.

## Prerequisites

Before deploying, ensure you have:
- A Supabase project set up
- Environment variables configured
- Application tested locally
- Git repository (for most platforms)

## Environment Variables

All deployment platforms need these environment variables:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

## Vercel Deployment

### 1. Install Vercel CLI
```bash
npm install -g vercel
```

### 2. Login to Vercel
```bash
vercel login
```

### 3. Deploy
```bash
# From project root
vercel

# For production
vercel --prod
```

### 4. Set Environment Variables

Via Vercel Dashboard:
1. Go to Project Settings
2. Navigate to Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Redeploy

Via CLI:
```bash
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```

### 5. Configure vercel.json

Create `vercel.json` in project root:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### GitHub Integration

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Configure environment variables
4. Deploy automatically on push

**Vercel URL:** `https://your-project.vercel.app`

---

## Netlify Deployment

### 1. Install Netlify CLI
```bash
npm install -g netlify-cli
```

### 2. Login to Netlify
```bash
netlify login
```

### 3. Initialize Project
```bash
netlify init
```

### 4. Deploy
```bash
# Draft deploy
netlify deploy

# Production deploy
netlify deploy --prod
```

### 5. Configure netlify.toml

Create `netlify.toml` in project root:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "no-referrer"
```

### 6. Set Environment Variables

Via Netlify Dashboard:
1. Go to Site Settings
2. Navigate to Environment Variables
3. Add variables

Via CLI:
```bash
netlify env:set VITE_SUPABASE_URL "your-url"
netlify env:set VITE_SUPABASE_ANON_KEY "your-key"
```

### GitHub Integration

1. Connect GitHub repository
2. Configure build settings
3. Add environment variables
4. Deploy automatically on push

**Netlify URL:** `https://your-project.netlify.app`

---

## AWS Amplify

### 1. Install Amplify CLI
```bash
npm install -g @aws-amplify/cli
```

### 2. Configure AWS
```bash
amplify configure
```

### 3. Initialize Amplify
```bash
amplify init
```

### 4. Add Hosting
```bash
amplify add hosting
```

Select:
- Hosting with Amplify Console
- Manual deployment

### 5. Build and Deploy
```bash
amplify publish
```

### 6. Configure amplify.yml

Create `amplify.yml` in project root:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: dist
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
```

### 7. Set Environment Variables

In Amplify Console:
1. Go to App Settings
2. Navigate to Environment Variables
3. Add:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

### GitHub Integration

1. Connect repository in Amplify Console
2. Configure build settings
3. Add environment variables
4. Enable automatic deployments

**Amplify URL:** `https://branch-name.d111111abcdef8.amplifyapp.com`

---

## Docker Deployment

### 1. Create Dockerfile

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 2. Create nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript
               application/x-javascript application/xml+rss
               application/javascript application/json;

    # Cache static assets
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

### 3. Create .dockerignore

```
node_modules
dist
.git
.env
*.log
```

### 4. Build Image

```bash
docker build -t pokedex-tcg .
```

### 5. Run Container

```bash
docker run -d \
  -p 80:80 \
  -e VITE_SUPABASE_URL=your-url \
  -e VITE_SUPABASE_ANON_KEY=your-key \
  --name pokedex-tcg \
  pokedex-tcg
```

### 6. Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  web:
    build: .
    ports:
      - "80:80"
    environment:
      - VITE_SUPABASE_URL=${VITE_SUPABASE_URL}
      - VITE_SUPABASE_ANON_KEY=${VITE_SUPABASE_ANON_KEY}
    restart: unless-stopped
```

Run with:
```bash
docker-compose up -d
```

---

## Custom VPS/Server

### 1. Install Node.js

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Install Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 3. Clone and Build

```bash
cd /var/www
git clone your-repo-url pokedex-tcg
cd pokedex-tcg

# Install dependencies
npm install

# Create .env file
echo "VITE_SUPABASE_URL=your-url" > .env
echo "VITE_SUPABASE_ANON_KEY=your-key" >> .env

# Build
npm run build
```

### 4. Configure Nginx

Create `/etc/nginx/sites-available/pokedex-tcg`:

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/pokedex-tcg/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

Enable site:
```bash
sudo ln -s /etc/nginx/sites-available/pokedex-tcg /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 5. SSL with Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

### 6. PM2 for Process Management (Optional)

```bash
npm install -g pm2

# If using dev server
pm2 start "npm run dev" --name pokedex-tcg
pm2 save
pm2 startup
```

---

## GitHub Pages

### 1. Update vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/repository-name/', // Your repo name
});
```

### 2. Add Deploy Script to package.json

```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

### 3. Install gh-pages

```bash
npm install --save-dev gh-pages
```

### 4. Deploy

```bash
npm run deploy
```

### 5. Configure GitHub

1. Go to repository Settings
2. Navigate to Pages
3. Select `gh-pages` branch
4. Save

**GitHub Pages URL:** `https://username.github.io/repository-name/`

**Note:** Environment variables must be set during build time for GitHub Pages.

---

## Environment Variable Management

### Production Best Practices

1. **Never commit .env files**
2. **Use platform-specific secret management**
3. **Rotate keys regularly**
4. **Use different keys for different environments**

### Multiple Environments

Create separate env files:
- `.env.development`
- `.env.staging`
- `.env.production`

Load based on build:
```bash
# Development
npm run dev

# Staging
npm run build -- --mode staging

# Production
npm run build -- --mode production
```

---

## CI/CD Pipeline

### GitHub Actions Example

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        env:
          VITE_SUPABASE_URL: ${{ secrets.VITE_SUPABASE_URL }}
          VITE_SUPABASE_ANON_KEY: ${{ secrets.VITE_SUPABASE_ANON_KEY }}
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

---

## Performance Optimization

### Build Optimization

```bash
# Analyze bundle
npm run build -- --mode production

# Check bundle size
npx vite-bundle-visualizer
```

### Caching Strategy

1. **Static Assets**: Cache for 1 year
2. **HTML**: No cache or short cache
3. **API Responses**: Cache in localStorage/IndexedDB
4. **Images**: Use CDN with long cache

### CDN Configuration

Consider using a CDN for:
- Card images from Pokemon TCG API
- Static assets (JS, CSS)
- Font files

---

## Monitoring and Analytics

### Add Analytics

```typescript
// Google Analytics
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'GA_MEASUREMENT_ID');
```

### Error Tracking

Consider integrating:
- Sentry
- LogRocket
- Rollbar

---

## Troubleshooting

### Common Issues

**Build fails:**
```bash
# Clear cache
rm -rf node_modules dist
npm install
npm run build
```

**Environment variables not working:**
- Ensure they start with `VITE_`
- Restart dev server after changes
- Check platform-specific variable syntax

**404 on refresh:**
- Configure proper redirect rules
- Ensure SPA fallback to index.html

**CORS errors:**
- Check Supabase URL configuration
- Verify allowed origins in Supabase settings

---

## Post-Deployment Checklist

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Test search functionality
- [ ] Verify database operations
- [ ] Check mobile responsiveness
- [ ] Test in multiple browsers
- [ ] Verify SSL certificate
- [ ] Set up monitoring
- [ ] Configure backups
- [ ] Document deployment process
- [ ] Set up alerts for downtime

---

## Resources

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Supabase Documentation](https://supabase.com/docs)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
