// Define a custom property 'user' on the Request object (commented out)
// interface AuthenticatedRequest extends Request {
//   user?: {
//     id: string;
//   };
// }

// Placeholder User ID - replace with a valid ObjectId string if testing against a real DB
const MOCK_USER_ID = '60f7e2b5c1e2a3001f8e4d5c'; // Example ObjectId

const protect = (req, res, next) => {
  // In a real application, you would verify a token (e.g., JWT)
  // and then fetch the user from the database.
  // For this placeholder, we're just attaching a mock user ID.
  req.user = { id: MOCK_USER_ID };
  console.log(`Mock user ${req.user.id} attached by placeholder middleware.`);
  next();
};

// AuthenticatedRequest interface is not exported as it's a TypeScript feature.
module.exports = { protect };
