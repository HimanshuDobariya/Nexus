import User from "../models/user.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/generateOTP.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";
import { generateToken } from "../utils/generateJwtToken.js";

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
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      verificationCode: otp,
      verificationCodeExpireAt: new Date(Date.now() + 15 * 60 * 1000), // OTP expires in 15 minutes
    });

    // Save the user in the database
    await newUser.save();

    // Send the OTP to the user's email
    await sendVerificationEmail(name, email, otp);

    return res.status(201).json({ message: "User registered successfully." });
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
      return res
        .status(400)
        .json({ message: "Verification code is expired. Send it again." });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpireAt = undefined;

    await user.save();

    // generate token
    generateToken(res, user._id);

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export { signup, verifyEmail };
