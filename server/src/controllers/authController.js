import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// Register User
export const registerUser = async (req, res) => {
  try {
    let { name, username, email, password } = req.body;

    // Basic presence check
    if (!name || !username || !email || !password) {
      return res.status(400).json({
        message: "Name, username, email and password are all required",
      });
    }

    name = name.trim();
    username = username.trim();
    // BUG FIX: normalize email/username casing + whitespace before
    // checking for duplicates and before saving. Previously
    // `findOne({ email })` was an exact-case match, so
    // "Test@example.com" and "test@example.com" were treated as two
    // different users - letting the same person create duplicate
    // accounts, and later causing login to fail to find an existing
    // account if they typed the email in different casing than they
    // registered with.
    email = email.trim().toLowerCase();
    username = username.trim().toLowerCase();

    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({
        message: "Please enter a valid email address",
      });
    }

    if (!USERNAME_REGEX.test(username)) {
      return res.status(400).json({
        message:
          "Username must be 3-20 characters and contain only letters, numbers, and underscores",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check existing user - and say which field conflicts, so the
    // frontend can show a helpful message instead of a generic one
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const conflictField =
        existingUser.email === email ? "email" : "username";

      return res.status(400).json({
        message:
          conflictField === "email"
            ? "An account with this email already exists"
            : "This username is already taken",
        field: conflictField,
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    // Mongoose's own unique-index error (race condition where two
    // requests slip past the findOne check at the same time)
    if (error.code === 11000) {
      return res.status(400).json({
        message: "An account with this email or username already exists",
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

// Login User
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    // Same normalization as registerUser, so a user can log in
    // regardless of the casing/whitespace they type
    email = email.trim().toLowerCase();

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials",
      });
    }

    res.status(200).json({
      message: "Login successful",
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};