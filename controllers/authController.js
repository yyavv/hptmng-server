import * as User from "../models/User.js";
import { generateToken } from "../middleware/auth.js";

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

    // Check password with bcrypt
    const isPasswordValid = await User.comparePassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid username or password",
      });
    }

    // Update last login
    await User.updateLastLogin(user.id);

    // Generate JWT token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
    });

    // Return user data (exclude password) and token
    res.json({
      success: true,
      message: "Login successful",
      token,
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

    // Password strength validation
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
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

    // Create new user (password will be hashed in User.createUser)
    const newUser = await User.createUser({
      username,
      password,
      full_name,
      role,
    });

    // Generate JWT token for immediate login
    const token = generateToken({
      id: newUser.id,
      username: newUser.username,
      role: newUser.role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      token,
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
