const { User } = require("../models");
const { generateToken } = require("../services/auth");

const register = async (req, res) => {
  try {
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const isUsernameTaken = await User.findOne({
      where: { username: req.body.username },
    });

    if (isUsernameTaken) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    const { username, password } = req.body;
    const user = await User.create({ username, password });
    const token = generateToken(user);
    res.status(201).json({ message: "User created successfully", token });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = await User.findOne({ where: { username } });
    if (!user || !(await user.isValidPassword(password))) {
      return res.status(401).json({ message: "Invalid username or password" });
    }
    const token = generateToken(user);
    res.json({ message: "Logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

module.exports = { register, login };
