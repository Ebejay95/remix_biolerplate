# MERN Boilerplate

A modern boilerplate using MongoDB, Express.js, React (Remix), and Node.js with Docker support.

## Features

- 🚀 Remix React for the frontend
- 🛠 Express.js backend
- 🐳 Docker and Docker Compose setup
- 🔄 Development and Production environments
- 🎨 TailwindCSS support
- 📱 Responsive by default

## Prerequisites

- Docker and Docker Compose
- Node.js >= 20.0.0
- Make (for Makefile commands)

## Quick Start

1. Clone the repository:
   ```bash
   git clone [your-repo-url]
   cd mern-boilerplate
   ```

2. Start Development Environment:
   ```bash
   make development
   ```

3. Start Production Environment:
   ```bash
   make production
   ```

## Available Commands

```bash
# Start development environment
make development

# Start production environment
make production

# View logs
make logs

# Enter container shells
make enter-frontend-dev
make enter-backend-dev
make enter-frontend-prod
make enter-backend-prod

# Stop all containers
make stop

# Remove all containers and networks
make prune

# Restart containers
make restart
```

## Project Structure

```
.
├── backend/
│   ├── app.js
│   ├── package.json
│   └── Dockerfile
├── frontend/
│   ├── app/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── docker-compose.yml
├── docker-compose.prod.yml
└── Makefile
```

## Access Points

- Frontend Development: http://localhost:8080
- Backend Development: http://localhost:4000
- Frontend Production: http://localhost:3000
- Backend Production: http://localhost:4000

## Development vs Production

### Development
- Hot-reloading enabled
- Development dependencies included
- Source maps enabled
- Debugging tools available

### Production
- Optimized builds
- Minimal dependencies
- Docker secrets support
- Performance optimized

## Environment Variables

Create a `.env` file in the root directory:

```env
FRONTEND_PORT=3000
BACKEND_PORT=4000
NODE_ENV=development
```

## Docker Secrets

For production, create a `secrets/` directory with:

```bash
mkdir secrets
echo "3000" > secrets/frontend_port.txt
echo "4000" > secrets/backend_port.txt
echo "your_secret_key" > secrets/api_key.txt
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository.

## Environment

setup .env, .env.development and .env.production in the root of the project.

```
FRONTEND_PORT=
BACKEND_PORT=
NODE_ENV=
FRONTEND_URL=
HOST=
REMIX_DEV_ORIGIN=

# Database
MONGODB_URI=

# Email
EMAIL_HOST=
EMAIL_PORT=
EMAIL_SERVICE=
EMAIL_USER=
EMAIL_PASSWORD=

# Security
BCRYPT_SALT_ROUNDS=
```