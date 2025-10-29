const express = require("express");
const upload = require("../middleware/uploadMiddleware.js");
const { protect } = require("../middleware/authMiddleware.js");
const {
  registerUser,
  loginUser,
  getUserInfo,
} = require("../controllers/authControllers");

const router = express.Router();

// ✅ Routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/getUser", protect, getUserInfo);

// ✅ Image upload route
router.post("/upload-image", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const imageUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.status(200).json({ imageUrl });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

module.exports = router;