import User from "../models/user.model.js";
import { hashPassword } from "../utils/hashPassword.js";
import { generateOTP } from "../utils/generateOTP.js";

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

    return res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error.", error: error.message });
  }
};

export { signup };
