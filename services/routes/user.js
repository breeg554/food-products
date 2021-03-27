import express from "express";
import verifyToken from "../verify-token.js";
import { token, logout, signUp, signIn, getUserDetails } from "../../controllers/user.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/token", token);
router.post("/logout", logout);
router.get("/user", verifyToken, getUserDetails);

export default router;
