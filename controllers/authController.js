import * as User from "../models/User.js";

// Login - Authenticate user
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Find user in database
    const user = await User.findUserByUsername(username);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Check password (simple comparison - in production use bcrypt!)
    if (user.password !== password) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Return user data (exclude password)
    res.json({
      success: true,
      message: "Login successful",
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

// Register - Create new user
export const register = async (req, res) => {
  try {
    const { username, password, full_name, role } = req.body;

    // Validate input
    if (!username || !password || !full_name) {
      return res.status(400).json({
        success: false,
        message: "Username, password, and full name are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findUserByUsername(username);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Username already exists",
      });
    }

    // Create new user
    // NOTE: In production, hash the password with bcrypt!
    const newUser = await User.createUser({
      username,
      password, // Should be hashed!
      full_name,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// Get all users - List all users (admin only in production)
export const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();

    res.json({
      success: true,
      users: users,
    });
  } catch (error) {
    console.error("Get users error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};
