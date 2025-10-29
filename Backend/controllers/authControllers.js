const User = require("../models/User.js");
const jwt = require("jsonwebtoken");


const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" }); // "1h" is correct format
};

exports.registerUser = async (req, res) => {
  const { fullName, email, password, profileImageUrl } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }



  try {
 
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email is already in use" });
    }

    // Create new user
    const user = await User.create({fullName,email,password,profileImageUrl,});

    
    res.status(201).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in registering user",
      error: err.message,
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res.status(400).json({ message: "Please fill all required fields" });
  }
  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePasswords(password))) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    res.status(200).json({
      id: user._id,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImageUrl: user.profileImageUrl,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      token: generateToken(user._id),
    });
  } catch (err) {
    res.status(500).json({
      message: "Error in logging in user",
      error: err.message,
    });
  }
};

// Get user info
exports.getUserInfo = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({
      message: "Error retrieving user info",
      error: err.message,
    });
  }
};
