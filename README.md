# Production-Ready Fullstack Docker Environment

This project provides a production-ready Docker environment for a fullstack application with a Node.js backend, a React.js frontend, and a MongoDB database.

## Project Structure

- `backend/`: Node.js (Express) application
- `frontend/`: React.js (Vite) application
- `database/`: MongoDB data (volume)
- `nginx.conf`: Nginx configuration for the frontend
- `docker-compose.yml`: Production Docker Compose configuration
- `docker-compose.dev.yml`: Development Docker Compose configuration
- `Jenkinsfile`: CI/CD pipeline configuration

## Prerequisites

- Docker
- Docker Compose
- Jenkins (for CI/CD)

## Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Start the development environment:**
   ```bash
   docker-compose -f docker-compose.dev.yml up --build
   ```

   - Backend will be available at `http://localhost:5000`
   - Frontend will be available at `http://localhost:8080`
   - Database will be available at `mongodb://localhost:27017`

## Production Setup

1. **Configure environment variables:**
   - Update the `.env.production` and `.env.frontend.production` files with your production settings.
   - Update the `Jenkinsfile` with your Docker registry credentials.

2. **Start the production environment:**
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

   - The application will be available at `http://localhost`

## CI/CD Pipeline (Jenkins)

The `Jenkinsfile` defines a CI/CD pipeline with the following stages:

- **Checkout:** Checks out the code from the repository.
- **Build Backend:** Builds the backend Docker image.
- **Build Frontend:** Builds the frontend Docker image.
- **Test:** Runs tests (you need to add your test commands).
- **Push to Registry:** Pushes the Docker images to your Docker registry.
- **Deploy:** Deploys the application using `docker-compose`.

To use the pipeline, you need to configure a new pipeline job in Jenkins and point it to your repository.

## Security and Optimizations

- **Multi-stage Docker builds:** The Dockerfiles use multi-stage builds to create lean production images.
- **Non-root user:** The containers run with a non-root user to improve security.
- **Health checks:** Health checks are included for all services to ensure they are running correctly.
- **Security headers:** The Nginx configuration includes security headers to protect against common web vulnerabilities.
- **Volume mounting:** The development environment uses volume mounting to enable hot-reloading.
- **Network configuration:** The services are connected to a custom bridge network for better isolation.
- **Error handling and logging:** The Nginx configuration includes proper error handling and logging.
- **Environment variables:** The application uses environment variables for configuration, which is a best practice for security and portability.
