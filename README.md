# Welcome to Remix Project 🚀

## 📖 Documentation
- [Remix Official Docs](https://remix.run/docs)

## 🛠️ Development Setup

### Prerequisites
- Docker
- Node.js
- npm or yarn

### Local Development
To start the development server:

```bash
# Build and start development containers
make development

# Or use npm directly
npm run dev
```

The app will be available at: http://localhost:3000

### Production Deployment
To build and run in production mode:

```bash
# Build and start production containers
make production

# Or manually
npm run build
npm start
```

## 🔧 Environment Configuration
Create a `.env.development` and `.env.production` file with the following configuration:

```
# Frontend Configuration
FRONTEND_PORT=3000
FRONTEND_URL=http://localhost:3000
HOST=localhost
REMIX_DEV_ORIGIN=http://localhost:3000
NODE_ENV=development

# Backend Configuration
BACKEND_PORT=4000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/your_database

# Email Configuration
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SERVICE=Gmail
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-app-password

# Security Configuration
BCRYPT_SALT_ROUNDS=10
SESSION_SECRET=your-long-random-secret
MASTER_USER_EMAIL=admin@example.com
MASTER_USER_PASSWORD=secure-admin-password
```

## 🐳 Docker Commands

### Build and Start
- Development: `make development`
- Production: `make production`

### Other Useful Commands
- Stop containers: `make stop`
- Remove containers and networks: `make prune`
- View logs: `make logs`
- Enter container shell:
  - Development: `make enter-dev`
  - Production: `make enter-prod`

## 😎 Styling
This project uses [Tailwind CSS](https://tailwindcss.com/) for styling. You can customize the configuration or replace it with your preferred CSS framework.

## 🚀 Deployment
- Build output is in `build/server` and `build/client`
- Compatible with various Node.js hosting platforms

## 📝 Notes
- Keep sensitive information in `.env` files
- Never commit `.env` files to version control
- Use strong, unique passwords and secrets
