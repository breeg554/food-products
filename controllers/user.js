import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import Token from "../models/token.js";
import ApiError from "../utils/ApiError.js";
import { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../config/jwt.js";

const generateAccessToken = (payload) => {
  return jwt.sign({ data: payload }, ACCESS_TOKEN_SECRET, {
    expiresIn: "10sec",
  });
};
export const token = async (req, res, next) => {
  try {
    let refreshToken = req.body.token;
    if (!refreshToken) throw new ApiError("Access denied", 401);
    Token.findOne({ token: refreshToken }).exec((err, token) => {
      if (err || !token) return next(new ApiError("Access denied", 403));

      jwt.verify(token.token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return next(new ApiError("Access denied", 403));

        const accessToken = generateAccessToken(user.data);
        res.status(200).json({ accessToken });
      });
    });
  } catch (err) {
    next(err);
  }
};
export const logout = async (req, res, next) => {
  try {
    let refreshToken = req.body.token;
    if (!refreshToken) throw new ApiError("Bad request", 400);
    Token.deleteOne({ token: refreshToken }).exec((err, token) => {
      if (err) return next(new ApiError("Access denied", 403));
      res.status(204).json();
    });
  } catch (err) {
    next(err);
  }
};

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

    const accessToken = generateAccessToken(payload);
    const refreshToken = jwt.sign({ data: payload }, REFRESH_TOKEN_SECRET);

    const NewRefToken = new Token({ _userId: user._id, token: refreshToken });
    NewRefToken.save();

    const resData = {
      user: {
        email: user.email,
        name: user.name,
        surname: user.surname,
        role: user.role,
        _id: user._id,
      },
      accessToken,
      refreshToken,
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
