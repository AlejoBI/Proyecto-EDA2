import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccesToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";
import { SECRET_ACCESS_TOKEN } from "../server/config.js";

export const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: "The email is already in use." });

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role || "Cliente",
    });

    const userSaved = await newUser.save();
    const token = await createAccesToken({ id: userSaved._id });

    res.cookie("token", token);
    res.status(201).json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: userSaved.role,
      timestamp: userSaved.Timestamp,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = await createAccesToken({ id: userFound._id });

    res.cookie("token", token);
    res.status(201).json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound)
      return res.status(400).json({ message: "Usuario no encontrado" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const verifyToken = async (req, res) => {
  const { token } = req.cookies;
  if (!token) return res.stattus(401).json({ message: "Access denied" });

  jwt.verify(token, SECRET_ACCESS_TOKEN, async (err, user) => {
    if (err) return res.status(401).json({ message: "Access denied" });

    const userFound = await User.findById(user.id);
    if (!userFound) return res.status(401).json({ message: "Access denied" });

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: userFound.role,
    });
  });
};
