# Operations Guide

This document provides instructions for setting up and running this application in both development and production environments.

## Prerequisites

- Docker
- Docker Compose
- Jenkins (for CI/CD)
- A DNS record for your production domain pointing to your server's IP address.

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

   The development environment uses hot-reloading, so any changes you make to the code will be automatically reflected in the running containers.

## Production Setup

1. **Configure environment variables:**
   - Update the `backend/.env.production` file with your production database URI and a strong secret key.
   - Update the `frontend/.env.frontend.production` file with your production API URL.
   - Update the `Jenkinsfile` with your Docker registry credentials.

2. **Configure DNS:**
   - Make sure the DNS record for `cafpiautomation.idetic-ss2l.eu` points to the IP address of your production server.

3. **Start the production environment:**
   ```bash
   docker-compose -f docker-compose.yml up --build -d
   ```

   The application will be available at `http://cafpiautomation.idetic-ss2l.eu`.

## CI/CD Pipeline (Jenkins)

The `Jenkinsfile` in the root of the repository defines a CI/CD pipeline for automating the build, test, and deployment process.

### Pipeline Stages

- **Checkout:** Checks out the latest code from the version control system.
- **Build Backend:** Builds the production Docker image for the backend service.
- **Build Frontend:** Builds the production Docker image for the frontend service.
- **Test:** This stage is a placeholder for you to add your automated tests.
- **Push to Registry:** Tags the new Docker images and pushes them to your container registry.
- **Deploy:** Pulls the latest images from the registry and restarts the services on the production server.

### How it Works

The pipeline is designed to be triggered automatically whenever new changes are pushed to the main branch of the repository. It uses the `docker-compose.yml` file to define the services and their configurations. The `Jenkinsfile` uses the Docker plugin to build and push the images, and then uses `ssh` to connect to the production server and run `docker-compose up -d` to deploy the new version of the application.

### Setup

1. Create a new "Pipeline" job in Jenkins.
2. In the "Pipeline" section, select "Pipeline script from SCM".
3. Select "Git" as the SCM.
4. Enter the URL of your repository.
5. The "Script Path" should be `Jenkinsfile`.
6. Save the job.

Now, whenever you push changes to your repository, Jenkins will automatically run the pipeline and deploy your application.
