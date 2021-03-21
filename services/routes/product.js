import express from "express";
import { create } from "../../controllers/product.js";
import verifyToken from "../verify-token.js";
import autorizeAccess from "../autorizeAccess.js";
const router = express.Router();

router.post("/", verifyToken, autorizeAccess(["admin", "user"]), create);

export default router;
