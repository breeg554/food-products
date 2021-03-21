import express from "express";
import verifyToken from "../verify-token.js";
import { signUp, signIn,getUserDetails } from "../../controllers/user.js";
const router = express.Router();

router.post("/signup", signUp);
router.post("/signin", signIn);
router.get("/",verifyToken, getUserDetails);

export default router;
