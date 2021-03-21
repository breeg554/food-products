import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import ApiError from "../utils/ApiError.js";
import { SECRET } from "../config/jwt.js";

export const signUp = async (req, res, next) => {
  try {
    const { name, surname, email, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      surname,
      email,
      password: hashPassword,
    });

    const created = await newUser.save();
    res.status(201).json("Created succesful");
  } catch (err) {
    next(err);
  }
};
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) throw new ApiError("User not found", 404);

    const match = await bcrypt.compare(password, user.password);
    if (!match) throw new ApiError("Incorrect password", 400);

    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign({ data: payload }, SECRET, {
      expiresIn: "1h",
    });

    const resData = {
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        _id: user._id,
      },
      token,
    };

    res.status(200).json(resData);
  } catch (err) {
    next(err);
  }
};

export const getUserDetails = async (req, res, next) => {
  try {
    let { _id } = req.user;

    const userDetails = await User.findOne({ _id });
    if (!userDetails) throw new ApiError("User not found", 404);

    const { name, surname, email, role } = userDetails;

    res.status(200).json({ name, surname, role, email, _id });
  } catch (err) {
    next(err);
  }
};
