# Backend for Document Flow Application

This directory contains the Node.js backend for the Document Flow application. It provides API endpoints for managing users, folders, file uploads, processing jobs, and results.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16.x or higher recommended)
- npm (usually comes with Node.js)
- MongoDB (ensure a MongoDB server instance is running)

## Setup Instructions

1.  **Navigate to the Backend Directory:**
    ```bash
    cd Backend
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```
    *(Note: Some packages like `jsonwebtoken`, `swagger-jsdoc`, and `swagger-ui-express` have previously failed to install automatically in some environments due to network/sandbox issues. If you encounter problems, you may need to ensure these are manually installed or try in a different environment if those features are to be re-enabled.)*

3.  **Create Environment File:**
    Create a `.env` file in this `Backend` directory. You can copy from the example below:
    ```env
    # Backend Environment Variables
    MONGODB_URI=mongodb://localhost:27017/docu_flow_db # Replace with your MongoDB connection string
    PORT=5000 # Port the server will run on
    JWT_SECRET=yourSuperSecretAndLongKey123! # Replace with a strong, unique secret for JWTs
    ```
    *   Replace `MONGODB_URI` with your actual MongoDB connection string if different.
    *   Replace `JWT_SECRET` with a strong, unique secret key.

## Running the Server

To start the backend development server:
```bash
npm run dev
```
This will start the server using `nodemon`, which will automatically restart on file changes.
The server will typically run on `http://localhost:5000` (or the port specified in your `.env` file).

## API Documentation

API endpoints are defined in the files within the `Backend/src/routes/` directory. These include:
- `auth.routes.js`: User registration and login.
- `folder.routes.js`: Folder management (CRUD).
- `upload.routes.js`: File uploads.
- `job.routes.js`: Processing job management.
- `result.routes.js`: Result file access and download.

*(Attempt to set up Swagger (OpenAPI) documentation using `swagger-jsdoc` and `swagger-ui-express` was made. However, installation of these packages failed due to environment constraints. If these packages are successfully installed in your environment, you could uncomment the Swagger setup code in `src/index.js` and add JSDoc annotations to the route files to enable interactive API documentation at an endpoint like `/api-docs`.)*

*(Note on JWT Authentication: The JWT generation and verification logic is currently commented out due to `jsonwebtoken` installation issues. The authentication middleware (`src/middleware/auth.middleware.js`) uses a mock user for protected routes. For true authentication, `jsonwebtoken` must be installed, and the relevant code sections uncommented and potentially reviewed.)*
