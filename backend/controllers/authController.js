import User from "../models/User.js";
import bcrypt from "bcryptjs";
import generateToken from "../utils/generateToken.js";
import { sendOTPEmail } from "../utils/sendEmail.js";

// Validation helper functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  return password && password.length >= 6;
};

const validateName = (name) => {
  return name && name.trim().length >= 2 && name.trim().length <= 50;
};

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, isAdmin } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: "Please provide all required fields (name, email, password)" 
      });
    }

    if (!validateName(name)) {
      return res.status(400).json({ 
        message: "Name must be between 2 and 50 characters" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email: email.toLowerCase() });
    if (userExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash password and create user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: isAdmin || false,
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: "Registration successful"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({ 
        message: "Please provide both email and password" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Check password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      message: "Login successful"
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Login failed" });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({ message: "Please provide an email address" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Please provide a valid email address" });
    }

    // Find user
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate and save OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpire = Date.now() + 5 * 60 * 1000; // 5 minutes
    await user.save();

    // Send OTP email
    await sendOTPEmail(email, otp);
    
    res.json({ 
      message: "OTP sent to your email. Valid for 5 minutes.",
      email: email 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Failed to send OTP" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Validation
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ 
        message: "Please provide email, OTP, and new password" 
      });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ 
        message: "Please provide a valid email address" 
      });
    }

    if (!validatePassword(newPassword)) {
      return res.status(400).json({ 
        message: "Password must be at least 6 characters long" 
      });
    }

    // Find user and validate OTP
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpire < Date.now()) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }

    // Hash new password and update user
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpire = null;
    await user.save();

    res.json({ 
      message: "Password reset successful. You can now login with your new password." 
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Password reset failed" });
  }
};
    