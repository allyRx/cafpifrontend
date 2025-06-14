import { Request, Response, NextFunction } from 'express';

// Define a custom property 'user' on the Request object
interface AuthenticatedRequest extends Request {
  user?: {
    id: string; // Or your User model interface
  };
}

// Placeholder User ID - replace with a valid ObjectId string if testing against a real DB
// For example, if you have a user in your DB with _id: ObjectId("60f7e2b5c1e2a3001f8e4d5c")
// You can generate one using: import mongoose from 'mongoose'; new mongoose.Types.ObjectId().toHexString();
const MOCK_USER_ID = '60f7e2b5c1e2a3001f8e4d5c'; // Example ObjectId

const protect = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  // In a real application, you would verify a token (e.g., JWT)
  // and then fetch the user from the database.
  // For this placeholder, we're just attaching a mock user ID.
  req.user = { id: MOCK_USER_ID };
  console.log(`Mock user ${req.user.id} attached by placeholder middleware.`);
  next();
};

export { protect, AuthenticatedRequest };
