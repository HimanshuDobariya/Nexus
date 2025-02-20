import User from "../models/user.model.js";
import Profile from "../models/profile.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/generateOTP.js";
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
} from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateJwtToken.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { config } from "../config/env.config.js";

//signup controller
const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use." });
    }

    // Hash the password before storing
    const hashedPassword = await hashPassword(password);

    // Generate OTP (6-digit number)
    const otp = generateOTP();

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode: otp,
      verificationCodeExpireAt: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
    });

    // Save the user in the database
    await user.save();

    // Send the OTP to the user's email
    await sendVerificationEmail(name, email, otp);

    return res.status(201).json({
      message: "User registered successfully.",
      user: { name: user.name, email: user.email },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

//login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentilas." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid Credentilas" });
    }

    generateToken(res, user._id);
    await user.save();

    res.status(200).json({
      message: "Login successful.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

//logout controller
const logout = async (req, res) => {
  try {
    // Clear the token cookie
    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User Not Found" });
    }

    if (code !== user.verificationCode) {
      return res.status(400).json({ message: "Invalid verification code" });
    }
    if (user.verificationCodeExpireAt < Date.now()) {
      return res.status(400).json({ message: "Verification code is expired." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpireAt = undefined;

    await user.save();

    // generate token
    generateToken(res, user._id);

    // Check if a profile already exists
    let profile = await Profile.findOne({ userId: user._id });

    if (!profile) {
      // Create profile with name and email
      profile = new Profile({
        userId: user._id,
        name: user.name, // Pre-fill name
        email: user.email, // Pre-fill email
      });

      await profile.save();
    }

    res.status(200).json({
      message: "Email verified successfully.",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

//forgot password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour expiry

    user.resetPasswordToken = resetToken;
    user.resetPasswordTokenExpireAt = resetTokenExpiresAt;

    await user.save();

    // Generate the password reset URL
    const resetUrl = `${config.client_url}/reset-password/${resetToken}`;

    await sendPasswordResetEmail(user.name, user.email, resetUrl);

    res.status(200).json({ message: "Password reset link sent to your email" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

//reset passsword
const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { newPassword, confirmPassword } = req.body;

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "Passwords do not match.",
      });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpireAt: { $gt: Date.now() },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Invalid or Expired Reset Token" });
    }

    // update the password
    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpireAt = undefined;

    await user.save();

    res.status(200).json({ message: "Password Reset Successfully", user });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

//check user authentication status
const checkAuth = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "User Not Found" });
    }

    res.status(200).json({
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export {
  signup,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  resetPassword,
  checkAuth,
};
